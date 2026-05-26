require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const cron = require('node-cron');

// Importar rotas e middlewares
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const monitoringService = require('./services/monitoringService');
const backupService = require('./services/backupService');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(compression());
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log de requisições (debug)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Conectar ao MongoDB
const connectDB = async () => {
  let retries = 5;
  
  while (retries > 0) {
    try {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://vpsguardian:guardian2024@mongodb:27017/vpsguardian?authSource=admin', {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      
      console.log('✅ Conectado ao MongoDB');
      
      // Criar usuário admin padrão se não existir
      try {
        const adminExists = await User.findOne({ username: 'admin' });
        
        if (!adminExists) {
          const admin = new User({
            username: process.env.DEFAULT_ADMIN_USER || 'admin',
            password: process.env.DEFAULT_ADMIN_PASS || 'admin',
            email: 'admin@vpsguardian.local',
            role: 'admin'
          });
          await admin.save();
          console.log('✅ Usuário admin criado com sucesso!');
          console.log('   Login: admin / admin');
        } else {
          console.log('✅ Usuário admin já existe');
        }
      } catch (error) {
        console.error('❌ Erro ao criar usuário admin:', error.message);
      }
      
      return;
    } catch (err) {
      retries--;
      console.log(`⏳ Tentando conectar ao MongoDB... (${5 - retries}/5)`);
      
      if (retries === 0) {
        console.error('❌ Erro ao conectar ao MongoDB após 5 tentativas:', err.message);
        process.exit(1);
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000)); // Aguardar 5 segundos
    }
  }
};

connectDB();

// ============= ROTAS PÚBLICAS =============

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date(),
    service: 'VPS Guardian API'
  });
});

// Rotas de autenticação (públicas)
app.use('/api/auth', authRoutes);

// ============= ROTAS PROTEGIDAS =============

// Containers
app.get('/api/containers', authMiddleware, async (req, res) => {
  try {
    const containers = await monitoringService.listContainers();
    res.json({ success: true, data: containers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/containers/:id/start', authMiddleware, async (req, res) => {
  try {
    const result = await monitoringService.startContainer(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/containers/:id/stop', authMiddleware, async (req, res) => {
  try {
    const result = await monitoringService.stopContainer(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/containers/:id/restart', authMiddleware, async (req, res) => {
  try {
    const result = await monitoringService.restartContainer(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/containers/:id/logs', authMiddleware, async (req, res) => {
  try {
    const tail = parseInt(req.query.tail) || 100;
    const logs = await monitoringService.getContainerLogs(req.params.id, tail);
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Métricas do sistema
app.get('/api/metrics/system', authMiddleware, async (req, res) => {
  try {
    const metrics = await monitoringService.getSystemMetrics();
    res.json({ success: true, data: metrics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Backups
app.get('/api/backups', authMiddleware, async (req, res) => {
  try {
    const backups = await backupService.listBackups();
    res.json({ success: true, data: backups });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/backups', authMiddleware, async (req, res) => {
  try {
    const backup = await backupService.createBackup();
    res.json({ success: true, data: backup });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/backups/:name', authMiddleware, async (req, res) => {
  try {
    const result = await backupService.deleteBackup(req.params.name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/backups/:name/restore', authMiddleware, async (req, res) => {
  try {
    const result = await backupService.restoreBackup(req.params.name);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Dashboard (dados agregados)
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    const [containers, systemMetrics, backups] = await Promise.all([
      monitoringService.listContainers(),
      monitoringService.getSystemMetrics(),
      backupService.listBackups()
    ]);

    const runningContainers = containers.filter(c => c.state === 'running').length;
    const stoppedContainers = containers.filter(c => c.state !== 'running').length;

    res.json({
      success: true,
      data: {
        containers: {
          total: containers.length,
          running: runningContainers,
          stopped: stoppedContainers,
          list: containers
        },
        system: systemMetrics,
        backups: {
          total: backups.length,
          latest: backups[0] || null,
          list: backups.slice(0, 5)
        },
        timestamp: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Limpeza de recursos
app.post('/api/cleanup', authMiddleware, async (req, res) => {
  try {
    const result = await monitoringService.cleanupResources();
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============= AGENDAMENTOS =============

// Auto restart de containers (a cada 5 minutos)
cron.schedule('*/5 * * * *', async () => {
  console.log('⏰ Executando auto restart de containers...');
  try {
    await monitoringService.autoRestartContainers();
  } catch (error) {
    console.error('Erro no auto restart:', error);
  }
});

// Backup automático (diariamente às 01:00)
const backupSchedule = process.env.BACKUP_SCHEDULE || '0 1 * * *';
cron.schedule(backupSchedule, async () => {
  console.log('⏰ Executando backup automático...');
  try {
    const backup = await backupService.createBackup();
    console.log('✅ Backup criado:', backup.name);
  } catch (error) {
    console.error('❌ Erro no backup automático:', error);
  }
});

// Limpeza semanal (domingo às 03:00)
cron.schedule('0 3 * * 0', async () => {
  console.log('⏰ Executando limpeza semanal...');
  try {
    await monitoringService.cleanupResources();
    console.log('✅ Limpeza concluída');
  } catch (error) {
    console.error('❌ Erro na limpeza:', error);
  }
});

// ============= INICIAR SERVIDOR =============

app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║           🛡️  VPS GUARDIAN - API SERVER 🛡️             ║
║                                                          ║
║  Servidor rodando em: http://0.0.0.0:${PORT}              ║
║  Ambiente: ${process.env.NODE_ENV || 'development'}                     ║
║                                                          ║
║  📊 Dashboard: http://seu-servidor:8080                  ║
║  🔐 Login inicial: admin / admin                         ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
  `);
});

// Tratamento de erros não capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

module.exports = app;
