# 🛡️ VPS Guardian

<div align="center">

![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue.svg)
![Node](https://img.shields.io/badge/node-18+-green.svg)
![React](https://img.shields.io/badge/react-18-61dafb.svg)
![MongoDB](https://img.shields.io/badge/mongodb-6.0-green.svg)

**Sistema Profissional de Monitoramento, Backup e Manutenção para VPS**

[Instalação](#-instalação-rápida) • [Características](#-características) • [Documentação](#-documentação) • [Contribuir](#-contribuindo)

</div>

---

## 📖 Sobre

VPS Guardian é um sistema completo de monitoramento e manutenção para servidores VPS que utilizam Docker. Com interface moderna, autenticação segura e recursos avançados de automação, facilita o gerenciamento de containers, backups e alertas.

## ✨ Características

### 🔐 Autenticação Segura
- Login/Logout com JWT
- Senha padrão: `admin/admin` (alterável pela interface)
- Criptografia bcrypt
- Sessões com timeout configurável
- MongoDB para persistência

### 📊 Dashboard Moderno
- Interface dark theme premium
- Monitoramento em tempo real (atualização a cada 30s)
- Métricas visuais de CPU, RAM e Disco
- Cards interativos com hover effects
- 100% responsivo (mobile, tablet, desktop)

### 🐳 Gerenciamento de Containers
- Lista e monitora todos os containers Docker
- Controles individuais: Start, Stop, Restart
- Status visual em tempo real
- Auto-restart de containers caídos (até 3 tentativas)
- Visualização de logs
- Métricas de uso por container

### 💾 Sistema de Backup
- Backups automáticos diários (configurável)
- Retenção de backups (padrão: 6)
- Backup de volumes Docker
- Compressão automática (.tar.gz)
- Criação manual via interface
- Restauração seletiva
- Limpeza automática de backups antigos

### 📈 Monitoramento de Recursos
- CPU em tempo real
- Uso de memória RAM
- Espaço em disco
- Estatísticas de rede
- Thresholds configuráveis para alertas
- Histórico de métricas

### 🧹 Manutenção Automática
- Limpeza semanal de recursos órfãos
- Remoção de imagens não utilizadas
- Otimização de logs
- Liberação de espaço em disco

---

## 🚀 Instalação Rápida

### Pré-requisitos
- Docker 20.10+
- Docker Compose 2.0+
- VPS/Servidor com Ubuntu 20.04+ ou Debian 11+
- Mínimo: 1 CPU, 512MB RAM, 2GB disco

### Instalação Automatizada

```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/vps-guardian.git
cd vps-guardian

# 2. Execute o instalador
chmod +x install.sh
./install.sh

# 3. Aguarde a inicialização (2-3 minutos)
```

### Acesso

```
http://SEU_IP:8080
```

**Credenciais padrão:**
- Usuário: `admin`
- Senha: `admin`

⚠️ **Importante**: Altere a senha após o primeiro acesso em Configurações → Trocar Senha

## 📱 Como Usar

### 1. Fazer Login
1. Acesse `http://SEU_IP:8080`
2. Digite: `admin` / `admin`
3. Clique em **Entrar**

### 2. Trocar Senha (Recomendado)
1. Clique na aba **Configurações**
2. Clique em **Trocar Senha**
3. Digite a senha atual: `admin`
4. Digite a nova senha (mínimo 3 caracteres)
5. Clique em **Salvar**

### 3. Monitorar Containers
1. Aba **Containers** mostra todos os containers Docker
2. **Ponto verde** = Container rodando
3. **Ponto vermelho** = Container parado
4. Use os botões para:
   - ▶️ Iniciar container
   - ⏸️ Parar container
   - 🔄 Reiniciar container

### 4. Criar Backups
1. Vá para a aba **Backups**
2. Clique em **Criar Backup**
3. Aguarde a conclusão
4. Backups são salvos em `/backups`

### 5. Ver Métricas
- CPU e Memória são exibidas na aba **Configurações**
- Dashboard atualiza automaticamente a cada 30 segundos

## 🛠️ Estrutura do Projeto

```
vps-guardian-complete/
├── backend/                 # API Node.js
│   ├── models/             # Modelos MongoDB
│   ├── routes/             # Rotas da API
│   ├── services/           # Serviços (monitoramento, backup)
│   ├── middleware/         # Auth middleware
│   ├── server.js           # Servidor principal
│   └── Dockerfile
├── frontend/                # Dashboard React
│   ├── src/
│   │   ├── pages/         # Login e Dashboard
│   │   ├── services/      # Cliente API
│   │   └── main.jsx
│   ├── Dockerfile
│   └── nginx.conf
├── backups/                 # Backups criados
├── logs/                    # Logs do sistema
├── data/                    # Dados persistentes
├── docker-compose.yml       # Orquestração
├── install.sh               # Instalador automático
└── README.md
```

## 📊 Funcionalidades Detalhadas

### Monitoramento de Containers
- ✅ Lista todos os containers Docker
- ✅ Status em tempo real (running/stopped)
- ✅ Controle manual (start/stop/restart)
- ✅ Auto restart de containers caídos (até 3 tentativas)
- ✅ Atualização automática a cada 30 segundos

### Sistema de Backup
- ✅ Backup automático diário às 01:00
- ✅ Backup de volumes Docker
- ✅ Compressão automática (.tar.gz)
- ✅ Retenção de 6 backups (configurável)
- ✅ Limpeza automática de backups antigos
- ✅ Criação manual de backups via interface

### Autenticação e Segurança
- ✅ Login com JWT (token válido por 24h)
- ✅ Senha criptografada com bcrypt
- ✅ Middleware de autenticação em todas as rotas
- ✅ Trocar senha de forma visual e simples
- ✅ Logout seguro

### Métricas do Sistema
- ✅ Uso de CPU em tempo real
- ✅ Uso de memória RAM
- ✅ Espaço em disco
- ✅ Alertas de alto uso (configurável)

## ⚙️ Configuração Avançada

### Trocar Porta do Dashboard

Edite `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8080:80"  # Troque 8080 para a porta desejada
```

### Configurar Backups

Edite `.env`:
```env
MAX_BACKUPS=6              # Número máximo de backups
BACKUP_SCHEDULE=0 1 * * *  # Cron (padrão: 01:00 diariamente)
```

### Webhooks (Alertas)

Edite `.env`:
```env
WEBHOOK_ENABLED=true
WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK
WEBHOOK_TYPE=slack  # ou discord, telegram
```

## 🔧 Comandos Úteis

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend

# Reiniciar todos os serviços
docker-compose restart

# Parar todos os serviços
docker-compose stop

# Remover tudo (incluindo volumes)
docker-compose down -v

# Atualizar e reconstruir
docker-compose down
docker-compose up -d --build

# Ver status dos serviços
docker-compose ps
```

## 🐛 Solução de Problemas

### Não consigo acessar o dashboard
1. Verifique se os containers estão rodando: `docker-compose ps`
2. Verifique os logs: `docker-compose logs -f`
3. Teste a porta: `curl http://localhost:8080`

### Erro ao fazer login
1. Verifique se o MongoDB está rodando: `docker-compose ps mongodb`
2. Verifique logs do backend: `docker-compose logs -f backend`
3. Tente resetar a senha (veja abaixo)

### Resetar senha admin

```bash
# Entre no container do backend
docker exec -it vps-guardian-backend sh

# Execute o Node.js
node

# Cole este código:
const mongoose = require('mongoose');
mongoose.connect('mongodb://vpsguardian:guardian2024@mongodb:27017/vpsguardian?authSource=admin');
const bcrypt = require('bcryptjs');
mongoose.connection.once('open', async () => {
  const User = mongoose.model('User', new mongoose.Schema({username: String, password: String}));
  const hash = await bcrypt.hash('admin', 10);
  await User.updateOne({username: 'admin'}, {password: hash});
  console.log('Senha resetada para: admin');
  process.exit();
});

# Ctrl+C para sair
# Ctrl+D para sair do container
```

## 📝 API Endpoints

```bash
# Autenticação
POST /api/auth/login              # Login
GET  /api/auth/verify             # Verificar token
POST /api/auth/change-password    # Trocar senha

# Containers
GET  /api/containers              # Listar containers
POST /api/containers/:id/start    # Iniciar
POST /api/containers/:id/stop     # Parar
POST /api/containers/:id/restart  # Reiniciar

# Backups
GET  /api/backups                 # Listar backups
POST /api/backups                 # Criar backup
DELETE /api/backups/:name         # Deletar backup

# Sistema
GET /api/dashboard                # Dados do dashboard
GET /api/metrics/system           # Métricas do sistema
```

## 📄 Licença

MIT License - Use livremente!

## 🙏 Suporte

- 📧 Issues: Abra uma issue no GitHub
- 💬 Documentação: Este README
- 🐛 Bugs: Relate com logs (`docker-compose logs`)

---

**Desenvolvido para facilitar o gerenciamento de VPS com Docker! 🚀**

⭐ Se foi útil, deixe uma estrela!

---

## 📱 Interface

### Páginas Principais

#### 🏠 Dashboard
- Visão geral do sistema
- Total de containers (rodando/parados)
- Métricas de CPU, RAM e Disco
- Últimos backups

#### 🐳 Containers
- Grid de todos os containers
- Status visual (verde = rodando, vermelho = parado)
- Controles individuais por container
- Visualização de logs

#### 💾 Backups
- Lista de todos os backups
- Criar backup manual
- Restaurar backups
- Deletar backups antigos
- Informações de tamanho e data

#### ⚙️ Configurações
- **Trocar senha** (interface visual e simples)
- Ver métricas do sistema
- Configurar thresholds de alerta

---

## ⚙️ Configuração

### Arquivo .env

Copie `.env.example` para `.env` e ajuste as configurações:

```env
# Autenticação
JWT_SECRET=sua-chave-secreta-aqui
DEFAULT_ADMIN_USER=admin
DEFAULT_ADMIN_PASS=admin

# Backups
MAX_BACKUPS=6
BACKUP_SCHEDULE=0 1 * * *

# Thresholds
CPU_THRESHOLD=90
MEMORY_THRESHOLD=90
DISK_THRESHOLD=85
```

### Configurações Principais

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `JWT_SECRET` | Chave secreta para JWT | vps-guardian-secret-key |
| `DEFAULT_ADMIN_USER` | Usuário admin inicial | admin |
| `DEFAULT_ADMIN_PASS` | Senha admin inicial | admin |
| `MAX_BACKUPS` | Backups a manter | 6 |
| `BACKUP_SCHEDULE` | Horário de backup (cron) | 0 1 * * * (01:00) |
| `CPU_THRESHOLD` | % CPU para alertas | 90 |
| `MEMORY_THRESHOLD` | % RAM para alertas | 90 |
| `DISK_THRESHOLD` | % Disco para alertas | 85 |

---

## 🛠️ Comandos Úteis

### Gerenciamento Básico

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver logs do backend
docker-compose logs -f backend

# Reiniciar todos os serviços
docker-compose restart

# Parar todos os serviços
docker-compose stop

# Iniciar serviços
docker-compose start

# Ver status dos containers
docker-compose ps

# Remover tudo (⚠️ apaga dados)
docker-compose down -v
```

### Manutenção

```bash
# Resetar senha do admin
./fix-admin-user.sh

# Testar se login funciona
./test-login.sh

# Diagnóstico completo
./diagnostico.sh

# Corrigir problemas de login
./corrigir-login.sh
```

---

## 🏗️ Arquitetura

### Estrutura do Projeto

```
vps-guardian/
├── backend/
│   ├── models/              # Modelos MongoDB
│   │   └── User.js         # Modelo de usuário
│   ├── routes/              # Rotas da API
│   │   └── auth.js         # Rotas de autenticação
│   ├── services/            # Lógica de negócio
│   │   ├── monitoringService.js  # Monitoramento
│   │   └── backupService.js      # Backups
│   ├── middleware/          # Middlewares
│   │   └── auth.js         # Autenticação JWT
│   ├── server.js           # Servidor principal
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/          # Páginas React
│   │   │   ├── Login.jsx   # Página de login
│   │   │   └── Dashboard.jsx  # Dashboard principal
│   │   ├── services/       # Clientes API
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── nginx.conf          # Configuração Nginx
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml      # Orquestração
├── .env.example           # Exemplo de configuração
├── .gitignore
├── install.sh             # Instalador
├── fix-admin-user.sh      # Reset senha
├── test-login.sh          # Testes
└── README.md
```

### Tecnologias

#### Backend
- **Node.js 18** - Runtime JavaScript
- **Express** - Framework web
- **MongoDB 6.0** - Banco de dados
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticação
- **bcryptjs** - Criptografia de senhas
- **Dockerode** - API Docker
- **node-cron** - Tarefas agendadas
- **Systeminformation** - Métricas do sistema

#### Frontend
- **React 18** - UI Library
- **Vite** - Build tool
- **Tailwind CSS** - Framework CSS
- **Lucide Icons** - Ícones
- **React Hot Toast** - Notificações
- **date-fns** - Manipulação de datas
- **Axios** - Cliente HTTP

#### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Nginx** - Servidor web/proxy

---

## 🔒 Segurança

### Práticas Implementadas

- ✅ Senhas criptografadas com bcrypt (10 rounds)
- ✅ Tokens JWT com expiração (24h)
- ✅ Middleware de autenticação em todas rotas protegidas
- ✅ Validação de inputs no backend
- ✅ Headers de segurança com Helmet
- ✅ CORS configurado corretamente
- ✅ MongoDB com autenticação

### Recomendações

1. **Altere o JWT_SECRET** no `.env` em produção
2. **Troque a senha padrão** após primeiro acesso
3. **Use HTTPS** em produção (Let's Encrypt)
4. **Configure firewall** para liberar apenas porta 8080
5. **Backups regulares** do volume MongoDB

---

## 🐛 Troubleshooting

### Login não funciona

```bash
# Resetar usuário admin
./fix-admin-user.sh

# Reiniciar backend
docker-compose restart backend

# Aguardar 10s e tentar novamente
```

### Containers não iniciam

```bash
# Ver logs
docker-compose logs

# Reiniciar tudo
docker-compose down
docker-compose up -d

# Aguardar 30s
sleep 30

# Verificar status
docker-compose ps
```

### Porta 8080 já em uso

Edite `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8081:80"  # Troque para porta disponível
```

### MongoDB não conecta

```bash
# Reiniciar MongoDB
docker-compose restart mongodb

# Aguardar 15s
sleep 15

# Reiniciar backend
docker-compose restart backend
```

### Diagnóstico Completo

```bash
./diagnostico.sh
```

Isso mostra:
- Status dos containers
- Logs recentes
- Conectividade
- Usuário admin
- Saúde do sistema

---

## 📊 Recursos do Sistema

### Overhead Esperado

- **CPU**: ~2-5% (idle)
- **RAM**: ~150-200MB
- **Disco**: ~500MB + backups

### Portas Utilizadas

- **8080** - Frontend (Nginx)
- **3000** - Backend (interno)
- **27017** - MongoDB (interno)

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Diretrizes

- Mantenha o código limpo e documentado
- Adicione testes quando possível
- Atualize o README se necessário
- Siga os padrões de código existentes

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Suporte

- 🐛 **Issues**: [GitHub Issues](https://github.com/ricieri30/vps-guardian/issues)
- 📧 **Email**: [Seu email]
- 💬 **Discussões**: [GitHub Discussions](https://github.com/ricieri30/vps-guardian/discussions)

---

## 🎉 Agradecimentos

- Equipe Docker
- Comunidade React
- Contribuidores open source

---

<div align="center">

**⭐ Se este projeto foi útil, deixe uma estrela!**

Feito com ❤️ para facilitar o gerenciamento de servidores VPS

</div>
