const express = require('express');
const cors = require('cors');
const si = require('systeminformation');
const Docker = require('dockerode');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/dashboard', async (req, res) => {
  try {
    const [cpu, mem, fs, containers] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.fsSize(),
      docker.listContainers({ all: true }).catch(() => [])
    ]);

    const disk = fs[0] || { use: 0 };

    res.json({
      containers: containers.map(c => ({
        id: c.Id,
        name: c.Names[0].replace('/', ''),
        status: c.State,
        image: c.Image
      })),
      metrics: {
        cpu: Math.round(cpu.currentLoad),
        ram: Math.round((mem.active / mem.total) * 100),
        disk: Math.round(disk.use)
      },
      system: {
        platform: process.platform,
        uptime: si.time().uptime
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

app.listen(port, () => {
  console.log(`VPS Guardian Backend running on port ${port}`);
});
