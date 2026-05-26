#!/bin/bash

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║           🛡️  VPS GUARDIAN - INSTALADOR 🛡️             ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não encontrado. Instalando..."
    curl -fsSL https://get.docker.com | sh
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não encontrado. Instalando..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

echo "✅ Dependências verificadas"
echo ""

# Criar diretórios necessários
mkdir -p backups logs data

# Construir e iniciar containers
echo "🚀 Construindo e iniciando containers..."
docker-compose up -d --build

echo ""
echo "⏳ Aguardando inicialização dos serviços..."
sleep 10

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║           ✅ INSTALAÇÃO CONCLUÍDA COM SUCESSO!          ║"
echo "║                                                          ║"
echo "║  📊 Dashboard: http://$(hostname -I | awk '{print $1}'):8080              ║"
echo "║  🔐 Login: admin / admin                                 ║"
echo "║                                                          ║"
echo "║  🛠️  Comandos úteis:                                     ║"
echo "║  - Ver logs: docker-compose logs -f                      ║"
echo "║  - Parar: docker-compose stop                            ║"
echo "║  - Reiniciar: docker-compose restart                     ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
