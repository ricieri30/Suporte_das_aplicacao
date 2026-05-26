const Docker = require('dockerode');
const fs = require('fs').promises;
const path = require('path');
const archiver = require('archiver');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

class BackupService {
  constructor() {
    this.backupDir = '/app/backups';
    this.maxBackups = parseInt(process.env.MAX_BACKUPS) || 6;
  }

  // Criar backup completo
  async createBackup() {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupName = `backup-${timestamp}`;
      const backupPath = path.join(this.backupDir, backupName);

      // Criar diretório de backup
      await fs.mkdir(backupPath, { recursive: true });

      // Backup de containers e volumes
      const containers = await docker.listContainers({ all: true });
      const backupData = {
        timestamp: new Date(),
        containers: [],
        volumes: []
      };

      // Backup de cada container
      for (const containerInfo of containers) {
        try {
          const container = docker.getContainer(containerInfo.Id);
          const inspect = await container.inspect();
          
          const containerData = {
            name: inspect.Name.replace('/', ''),
            image: inspect.Config.Image,
            env: inspect.Config.Env,
            volumes: inspect.Mounts,
            ports: inspect.HostConfig.PortBindings,
            networks: inspect.NetworkSettings.Networks,
            created: inspect.Created,
            state: inspect.State
          };

          backupData.containers.push(containerData);

          // Backup dos volumes
          for (const mount of inspect.Mounts) {
            if (mount.Type === 'volume') {
              try {
                const volumeName = mount.Name;
                const volumeBackupPath = path.join(backupPath, 'volumes', volumeName);
                await fs.mkdir(volumeBackupPath, { recursive: true });

                // Copiar dados do volume
                await execPromise(
                  `docker run --rm -v ${volumeName}:/source -v ${volumeBackupPath}:/backup alpine tar czf /backup/data.tar.gz -C /source .`
                );

                backupData.volumes.push({
                  name: volumeName,
                  container: containerData.name,
                  mountPoint: mount.Destination
                });
              } catch (error) {
                console.error(`Erro ao fazer backup do volume ${mount.Name}:`, error);
              }
            }
          }
        } catch (error) {
          console.error(`Erro ao fazer backup do container ${containerInfo.Names[0]}:`, error);
        }
      }

      // Salvar metadados
      await fs.writeFile(
        path.join(backupPath, 'metadata.json'),
        JSON.stringify(backupData, null, 2)
      );

      // Comprimir backup
      await this.compressBackup(backupPath);

      // Limpar backups antigos
      await this.cleanOldBackups();

      return {
        success: true,
        name: backupName,
        path: backupPath,
        timestamp: new Date(),
        containersCount: backupData.containers.length,
        volumesCount: backupData.volumes.length
      };
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      throw error;
    }
  }

  // Comprimir backup
  async compressBackup(backupPath) {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(`${backupPath}.tar.gz`);
      const archive = archiver('tar', {
        gzip: true,
        gzipOptions: { level: 9 }
      });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);
      archive.directory(backupPath, false);
      archive.finalize();
    });
  }

  // Listar backups
  async listBackups() {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = [];

      for (const file of files) {
        if (file.startsWith('backup-') && (file.endsWith('.tar.gz') || !file.includes('.'))) {
          const backupPath = path.join(this.backupDir, file);
          const stats = await fs.stat(backupPath);
          
          let metadata = null;
          try {
            if (!file.endsWith('.tar.gz')) {
              const metadataPath = path.join(backupPath, 'metadata.json');
              const metadataContent = await fs.readFile(metadataPath, 'utf8');
              metadata = JSON.parse(metadataContent);
            }
          } catch (error) {
            // Metadata não disponível
          }

          backups.push({
            name: file,
            path: backupPath,
            size: stats.size,
            created: stats.mtime,
            compressed: file.endsWith('.tar.gz'),
            metadata
          });
        }
      }

      // Ordenar por data (mais recente primeiro)
      return backups.sort((a, b) => b.created - a.created);
    } catch (error) {
      console.error('Erro ao listar backups:', error);
      return [];
    }
  }

  // Limpar backups antigos
  async cleanOldBackups() {
    try {
      const backups = await this.listBackups();
      
      // Se temos mais backups que o máximo permitido
      if (backups.length > this.maxBackups) {
        const backupsToDelete = backups.slice(this.maxBackups);
        
        for (const backup of backupsToDelete) {
          try {
            await fs.rm(backup.path, { recursive: true, force: true });
            console.log(`Backup antigo removido: ${backup.name}`);
          } catch (error) {
            console.error(`Erro ao remover backup ${backup.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao limpar backups antigos:', error);
    }
  }

  // Deletar backup específico
  async deleteBackup(backupName) {
    try {
      const backupPath = path.join(this.backupDir, backupName);
      await fs.rm(backupPath, { recursive: true, force: true });
      return { success: true, message: `Backup ${backupName} deletado` };
    } catch (error) {
      throw new Error(`Erro ao deletar backup: ${error.message}`);
    }
  }

  // Restaurar backup
  async restoreBackup(backupName) {
    try {
      const backupPath = path.join(this.backupDir, backupName);
      
      // Verificar se backup existe
      try {
        await fs.access(backupPath);
      } catch {
        throw new Error('Backup não encontrado');
      }

      // Ler metadata
      let metadataPath = path.join(backupPath, 'metadata.json');
      
      // Se for arquivo comprimido, descomprimir primeiro
      if (backupName.endsWith('.tar.gz')) {
        const extractPath = backupPath.replace('.tar.gz', '');
        await execPromise(`tar -xzf ${backupPath} -C ${this.backupDir}`);
        metadataPath = path.join(extractPath, 'metadata.json');
      }

      const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));

      // Restaurar volumes
      for (const volume of metadata.volumes) {
        const volumeBackupPath = path.join(
          backupPath.replace('.tar.gz', ''),
          'volumes',
          volume.name
        );

        try {
          // Criar volume se não existir
          await docker.createVolume({ Name: volume.name });
          
          // Restaurar dados
          await execPromise(
            `docker run --rm -v ${volume.name}:/restore -v ${volumeBackupPath}:/backup alpine tar xzf /backup/data.tar.gz -C /restore`
          );
        } catch (error) {
          console.error(`Erro ao restaurar volume ${volume.name}:`, error);
        }
      }

      return {
        success: true,
        message: 'Backup restaurado com sucesso',
        containersRestored: metadata.containers.length,
        volumesRestored: metadata.volumes.length
      };
    } catch (error) {
      throw new Error(`Erro ao restaurar backup: ${error.message}`);
    }
  }
}

module.exports = new BackupService();
