# 🛡️ VPS Guardian

**Sistema Profissional de Monitoramento e Manutenção para VPS**

Este repositório contém a estrutura base e a análise técnica para o VPS Guardian.

## 🚀 Como Iniciar

1. **Configuração**:
   ```bash
   cp .env.example .env
   ```
2. **Instalação**:
   ```bash
   chmod +x install.sh
   ./install.sh
   ```
   *Ou manualmente:*
   ```bash
   docker-compose up -d
   ```

## 📊 Documentação e Análise

Para uma visão detalhada da arquitetura e sugestões de melhorias técnicas, consulte:
- [RELATORIO_VPS_GUARDIAN.md](./RELATORIO_VPS_GUARDIAN.md)

## 🛠️ Tecnologias

- **Backend**: Node.js, Express, Dockerode, Systeminformation.
- **Frontend**: React, Vite, Tailwind CSS, Lucide React.
- **Infraestrutura**: Docker, Docker Compose, Nginx.
