const Docker = require('dockerode');
const si = require('systeminformation');

const docker = new Docker({ socketPath: '/var/run/docker.sock' });

class MonitoringService {
  constructor() {
    this.restartAttempts = new Map(); // container_id -> attempt_count
  }

  // Listar todos os containers
  async listContainers() {
    try {
      const containers = await docker.listContainers({ all: true });
      
      const containersWithStats = await Promise.all(
        containers.map(async (container) => {
          try {
            const stats = await this.getContainerStats(container.Id);
            return {
              id: container.Id,
              name: container.Names[0].replace('/', ''),
              image: container.Image,
              state: container.State,
              status: container.Status,
              created: new Date(container.Created * 1000),
              ports: container.Ports,
              stats: stats || null
            };
          } catch (error) {
            return {
              id: container.Id,
              name: container.Names[0].replace('/', ''),
              image: container.Image,
              state: container.State,
              status: container.Status,
              created: new Date(container.Created * 1000),
              ports: container.Ports,
              stats: null
            };
          }
        })
      );

      return containersWithStats;
    } catch (error) {
      console.error('Erro ao listar containers:', error);
      throw error;
    }
  }

  // Obter estatísticas de um container
  async getContainerStats(containerId) {
    try {
      const container = docker.getContainer(containerId);
      const stats = await container.stats({ stream: false });

      // Calcular uso de CPU
      const cpuDelta = stats.cpu_stats.cpu_usage.total_usage - stats.precpu_stats.cpu_usage.total_usage;
      const systemDelta = stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage;
      const cpuPercent = (cpuDelta / systemDelta) * stats.cpu_stats.online_cpus * 100;

      // Calcular uso de memória
      const memUsage = stats.memory_stats.usage || 0;
      const memLimit = stats.memory_stats.limit || 1;
      const memPercent = (memUsage / memLimit) * 100;

      return {
        cpu: isNaN(cpuPercent) ? 0 : cpuPercent.toFixed(2),
        memory: {
          usage: memUsage,
          limit: memLimit,
          percent: isNaN(memPercent) ? 0 : memPercent.toFixed(2)
        },
        network: stats.networks || {},
        blockIO: stats.blkio_stats || {}
      };
    } catch (error) {
      return null;
    }
  }

  // Iniciar container
  async startContainer(containerId) {
    try {
      const container = docker.getContainer(containerId);
      await container.start();
      return { success: true, message: 'Container iniciado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao iniciar container: ${error.message}`);
    }
  }

  // Parar container
  async stopContainer(containerId) {
    try {
      const container = docker.getContainer(containerId);
      await container.stop();
      return { success: true, message: 'Container parado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao parar container: ${error.message}`);
    }
  }

  // Reiniciar container
  async restartContainer(containerId) {
    try {
      const container = docker.getContainer(containerId);
      await container.restart();
      return { success: true, message: 'Container reiniciado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao reiniciar container: ${error.message}`);
    }
  }

  // Restart automático de containers crashados
  async autoRestartContainers() {
    try {
      const containers = await this.listContainers();
      const crashedContainers = containers.filter(c => 
        c.state === 'exited' || c.state === 'dead'
      );

      for (const container of crashedContainers) {
        const attempts = this.restartAttempts.get(container.id) || 0;
        
        if (attempts < 3) {
          console.log(`Tentando reiniciar container ${container.name} (tentativa ${attempts + 1}/3)`);
          
          try {
            await this.restartContainer(container.id);
            this.restartAttempts.set(container.id, attempts + 1);
          } catch (error) {
            console.error(`Falha ao reiniciar ${container.name}:`, error.message);
          }
        } else {
          console.log(`Container ${container.name} falhou 3 vezes. Aguardando intervenção manual.`);
        }
      }

      // Limpar tentativas de containers que estão rodando
      const runningContainerIds = containers
        .filter(c => c.state === 'running')
        .map(c => c.id);
      
      for (const id of runningContainerIds) {
        this.restartAttempts.delete(id);
      }

    } catch (error) {
      console.error('Erro no auto restart:', error);
    }
  }

  // Obter logs do container
  async getContainerLogs(containerId, tail = 100) {
    try {
      const container = docker.getContainer(containerId);
      const logs = await container.logs({
        stdout: true,
        stderr: true,
        tail: tail,
        timestamps: true
      });

      // Converter buffer para string
      const logString = logs.toString('utf8');
      const logLines = logString.split('\n').filter(line => line.trim());

      return logLines;
    } catch (error) {
      throw new Error(`Erro ao obter logs: ${error.message}`);
    }
  }

  // Obter métricas do sistema
  async getSystemMetrics() {
    try {
      const [cpu, mem, disk, network] = await Promise.all([
        si.currentLoad(),
        si.mem(),
        si.fsSize(),
        si.networkStats()
      ]);

      return {
        cpu: {
          usage: cpu.currentLoad.toFixed(2),
          cores: cpu.cpus.length,
          details: cpu.cpus.map(core => ({
            load: core.load.toFixed(2)
          }))
        },
        memory: {
          total: mem.total,
          used: mem.used,
          free: mem.free,
          percent: ((mem.used / mem.total) * 100).toFixed(2)
        },
        disk: disk.map(d => ({
          fs: d.fs,
          type: d.type,
          size: d.size,
          used: d.used,
          available: d.available,
          percent: d.use.toFixed(2),
          mount: d.mount
        })),
        network: network.map(n => ({
          iface: n.iface,
          rx_sec: n.rx_sec,
          tx_sec: n.tx_sec
        }))
      };
    } catch (error) {
      console.error('Erro ao obter métricas do sistema:', error);
      throw error;
    }
  }

  // Limpar recursos não utilizados
  async cleanupResources() {
    try {
      const results = {
        containers: 0,
        images: 0,
        volumes: 0,
        networks: 0
      };

      // Remover containers parados
      const containers = await docker.listContainers({ all: true });
      const stoppedContainers = containers.filter(c => c.State === 'exited');
      
      for (const container of stoppedContainers) {
        try {
          const containerObj = docker.getContainer(container.Id);
          await containerObj.remove();
          results.containers++;
        } catch (error) {
          console.error(`Erro ao remover container ${container.Names[0]}:`, error.message);
        }
      }

      // Remover imagens não utilizadas
      await docker.pruneImages({ filters: { dangling: { true: true } } });

      return results;
    } catch (error) {
      console.error('Erro na limpeza de recursos:', error);
      throw error;
    }
  }
}

module.exports = new MonitoringService();
