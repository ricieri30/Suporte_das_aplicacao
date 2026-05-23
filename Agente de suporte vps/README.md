# 🛡️ VPS Guardian

<div align="center">

**Sistema Profissional de Monitoramento e Manutenção para VPS**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/node-18+-green.svg)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/docker-ready-blue.svg)](https://www.docker.com/)
[![React](https://img.shields.io/badge/react-18.2-blue.svg)](https://reactjs.org/)

[Instalação](#-instalação-rápida) • [Features](#-features) • [Documentação](#-documentação) • [Contribuir](#-contribuindo)

</div>

---

## 🎯 Visão Geral

VPS Guardian é um sistema completo e profissional para monitoramento, backup automático e manutenção de containers Docker em servidores VPS. Com uma interface premium e funcionalidades avançadas, ele mantém seus containers sempre saudáveis e seus dados sempre protegidos.

### ✨ Por que VPS Guardian?

- 🔄 **Restart Automático** - Detecta e reinicia containers que caem (até 3 tentativas)
- 💾 **Backups Inteligentes** - Backup automático diário às 01:00 com retenção de 6 backups
- 📊 **Dashboard Premium** - Interface moderna com gráficos em tempo real
- 🔔 **Alertas Proativos** - Notificações via Slack, Discord ou Telegram
- 🏥 **Health Checks** - Monitoramento HTTP/TCP/Command customizável
- 🧹 **Limpeza Automática** - Remove containers órfãos e imagens não utilizadas
- 📱 **Totalmente Responsivo** - Funciona perfeitamente em mobile, tablet e desktop

## 🚀 Features

### 1. Monitoramento em Tempo Real
- Status de todos os containers Docker
- Métricas de CPU, RAM, disco e rede
- Health checks automáticos (HTTP/TCP/Custom)
- Detecção de containers em estado crítico
- Dashboard com atualização a cada 30 segundos

### 2. Manutenção Automática
- Restart automático de containers crashados (até 3 tentativas)
- Limpeza semanal de containers órfãos
- Remoção automática de imagens não utilizadas
- Otimização de logs do Docker
- Liberação automática de espaço em disco

### 3. Sistema de Backup Inteligente
- Backup automático diário (1h da manhã)
- Backup incremental de volumes Docker
- Backup de configurações (docker-compose, env)
- Backup de bancos de dados (MongoDB, PostgreSQL, MySQL)
- Retenção configurável (padrão: 6 backups)
- Compressão automática

### 4. Sistema de Restauração
- Restauração seletiva de containers
- Rollback de versões
- Restauração completa do sistema
- Validação de integridade

### 5. Dashboard Web Premium
- Interface profissional e moderna
- Design premium com dark theme
- Gráficos interativos em tempo real (Recharts)
- Logs centralizados com syntax highlighting
- Controle manual de containers (start/stop/restart)
- Gerenciamento completo de backups
- Totalmente responsivo (mobile-friendly)

### 6. Alertas e Notificações
- Webhooks para Slack, Discord ou Telegram
- 3 níveis de severidade (Info, Warning, Critical)
- Alertas de containers down
- Alertas de recursos altos (CPU/RAM/Disco)
- Alertas de health checks falhados
- Regras customizadas

## 🛠️ Tecnologias

### Backend
- **Node.js 18** - Runtime JavaScript
- **Express** - Framework web
- **Dockerode** - API do Docker para Node.js
- **node-cron** - Agendamento de tarefas
- **Winston** - Sistema de logs profissional
- **Systeminformation** - Métricas do sistema

### Frontend
- **React 18** - Framework UI moderno
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first
- **Recharts** - Biblioteca de gráficos
- **Lucide React** - Ícones modernos
- **React Hot Toast** - Notificações elegantes

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Servidor web e proxy reverso

## 📋 Requisitos

- **Sistema Operacional**: Ubuntu 20.04+ ou Debian 11+
- **Docker**: versão 20.10+
- **Docker Compose**: versão 2.0+
- **Recursos Mínimos**:
  - CPU: 1 core
  - RAM: 512MB
  - Disco: 2GB livre

## 🚀 Instalação Rápida

### Método 1: Instalador Automático (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/vps-guardian.git
cd vps-guardian

# Execute o instalador
chmod +x install.sh
./install.sh

# Aguarde a instalação (≈3-5 minutos)
```

Acesse: **http://seu-servidor:8080**

### Método 2: Docker Compose

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/vps-guardian.git
cd vps-guardian

# Configure variáveis de ambiente
cp .env.example .env
nano .env

# Inicie com Docker Compose
docker-compose up -d

# Verifique os logs
docker-compose logs -f
```

## ⚙️ Configuração

### Webhooks (Alertas)

Edite o arquivo `.env`:

```env
# Slack
WEBHOOK_ENABLED=true
WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
WEBHOOK_TYPE=slack

# Discord
WEBHOOK_URL=https://discord.com/api/webhooks/YOUR/WEBHOOK/URL
WEBHOOK_TYPE=discord

# Telegram
WEBHOOK_URL=https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>
WEBHOOK_TYPE=telegram
```

### Backups

```env
MAX_BACKUPS=6              # Número máximo de backups
BACKUP_SCHEDULE=0 1 * * *  # Diariamente às 01:00
```

### Monitoramento

```env
CPU_THRESHOLD=90           # Alerta se CPU > 90%
MEMORY_THRESHOLD=90        # Alerta se RAM > 90%
DISK_THRESHOLD=85          # Alerta se Disco > 85%
```

## 📖 Documentação

- **[Guia de Instalação Completo](INSTALL.md)** - Instruções detalhadas
- **[Guia de Uso](USAGE.md)** - Melhores práticas e casos de uso
- **[Guia de Testes](TESTING_GUIDE.md)** - Como testar todas as funcionalidades
- **[Melhorias Premium](PREMIUM_IMPROVEMENTS.md)** - Detalhes da interface
- **[Estrutura do Projeto](PROJECT_STRUCTURE.md)** - Arquitetura completa

## 🎯 Uso Básico

### Dashboard
Acesse `http://seu-servidor:8080` para ver:
- Status de todos os containers
- Gráficos de CPU e RAM (24h)
- Backups recentes
- Alertas ativos

### API Endpoints

```bash
# Listar containers
curl http://localhost:3000/api/containers

# Criar backup
curl -X POST http://localhost:3000/api/backups

# Ver métricas do sistema
curl http://localhost:3000/api/metrics/system

# Dashboard data
curl http://localhost:3000/api/dashboard
```

### Comandos Docker

```bash
# Ver logs
docker-compose logs -f

# Reiniciar serviços
docker-compose restart

# Parar serviços
docker-compose stop

# Atualizar
docker-compose pull
docker-compose up -d
```

## 📊 Estrutura do Projeto

```
vps-guardian/
├── backend/                    # API Node.js
│   ├── server.js              # Servidor principal
│   ├── services/              # Serviços modulares
│   │   ├── monitoringService.js
│   │   ├── backupService.js
│   │   ├── alertService.js
│   │   ├── healthCheckService.js
│   │   └── metricsService.js
│   └── package.json
├── frontend/                   # Dashboard React
│   ├── src/
│   │   ├── App.jsx
│   │   └── pages/
│   │       ├── Dashboard.jsx
│   │       ├── Containers.jsx
│   │       ├── Backups.jsx
│   │       └── Settings.jsx
│   └── package.json
├── docker-compose.yml         # Orquestração
├── .env.example               # Configurações de exemplo
├── install.sh                 # Instalador automático
└── README.md
```

## 📈 Recursos do Sistema

**Overhead do VPS Guardian:**
- CPU: ~2-5% adicional
- RAM: ~150-200MB
- Disco: ~500MB (aplicação) + backups

## 🤝 Contribuindo

Contribuições são bem-vindas! Siga os passos:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📝 Changelog

### v1.0.0 (2026-05-20)
- ✨ Interface premium completa
- 💾 Sistema de backup inteligente (6 backups, 01:00)
- 📊 Dashboard com gráficos em tempo real
- 🔔 Alertas via Slack/Discord/Telegram
- 🏥 Health checks configuráveis
- 🐳 Suporte a múltiplos containers
- 📱 Design totalmente responsivo

## 🐛 Problemas Conhecidos

Nenhum problema crítico conhecido no momento.

Reporte bugs em: [Issues](https://github.com/seu-usuario/vps-guardian/issues)

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🙏 Agradecimentos

- [Docker](https://www.docker.com/) - Containerização
- [React](https://reactjs.org/) - Framework UI
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Recharts](https://recharts.org/) - Biblioteca de gráficos

## 📞 Suporte

- 📧 Email: support@vps-guardian.com
- 💬 Discord: [Servidor VPS Guardian](https://discord.gg/vps-guardian)
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/vps-guardian/issues)
- 📚 Docs: [Documentação Completa](https://docs.vps-guardian.com)

---

<div align="center">

**Desenvolvido com ❤️ para a comunidade DevOps**

⭐ Se este projeto foi útil, deixe uma estrela no GitHub!

</div>
