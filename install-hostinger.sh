#!/bin/bash

echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║     🛡️  VPS GUARDIAN - INSTALADOR HOSTINGER 🛡️         ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verificar se está rodando como root ou com sudo
if [ "$EUID" -ne 0 ]; then 
   echo -e "${YELLOW}⚠️  Recomendado rodar com sudo${NC}"
   echo "Tentando continuar..."
fi

# Verificar se Docker está instalado
echo "🔍 Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não encontrado!${NC}"
    echo "Na Hostinger, Docker já vem instalado."
    echo "Verifique se você está no VPS correto."
    exit 1
else
    echo -e "${GREEN}✅ Docker encontrado${NC}"
    docker --version
fi

# Verificar se Docker Compose está disponível
echo ""
echo "🔍 Verificando Docker Compose..."
if docker compose version &> /dev/null; then
    COMPOSE_CMD="docker compose"
    echo -e "${GREEN}✅ Docker Compose encontrado (v2)${NC}"
elif command -v docker-compose &> /dev/null; then
    COMPOSE_CMD="docker-compose"
    echo -e "${GREEN}✅ Docker Compose encontrado (v1)${NC}"
else
    echo -e "${RED}❌ Docker Compose não encontrado!${NC}"
    exit 1
fi

# Verificar permissões do Docker socket
echo ""
echo "🔍 Verificando permissões do Docker..."
if [ -S /var/run/docker.sock ]; then
    if docker ps &> /dev/null; then
        echo -e "${GREEN}✅ Permissões OK${NC}"
    else
        echo -e "${YELLOW}⚠️  Sem permissão para usar Docker${NC}"
        echo "Tentando corrigir..."
        sudo chmod 666 /var/run/docker.sock 2>/dev/null
        if docker ps &> /dev/null; then
            echo -e "${GREEN}✅ Permissões corrigidas${NC}"
        else
            echo -e "${RED}❌ Execute: sudo chmod 666 /var/run/docker.sock${NC}"
            exit 1
        fi
    fi
else
    echo -e "${RED}❌ Docker socket não encontrado${NC}"
    exit 1
fi

# Criar diretórios necessários
echo ""
echo "📁 Criando diretórios..."
mkdir -p backups logs data
echo -e "${GREEN}✅ Diretórios criados${NC}"

# Parar containers antigos se existirem
echo ""
echo "🛑 Parando containers antigos (se existirem)..."
$COMPOSE_CMD down 2>/dev/null
echo -e "${GREEN}✅ Limpeza concluída${NC}"

# Construir e iniciar containers
echo ""
echo "🚀 Construindo e iniciando containers..."
echo "   Isso pode levar 2-3 minutos..."
$COMPOSE_CMD up -d --build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Erro ao iniciar containers${NC}"
    echo ""
    echo "Ver logs:"
    echo "  $COMPOSE_CMD logs"
    exit 1
fi

echo -e "${GREEN}✅ Containers iniciados${NC}"

# Aguardar inicialização
echo ""
echo "⏳ Aguardando inicialização dos serviços..."
echo "   MongoDB: aguardando 15 segundos..."
sleep 15

echo "   Backend: aguardando 10 segundos..."
sleep 10

# Verificar status
echo ""
echo "📊 Status dos containers:"
$COMPOSE_CMD ps

# Verificar logs do backend
echo ""
echo "📋 Verificando logs do backend..."
$COMPOSE_CMD logs --tail=10 backend

# Obter IP do servidor
SERVER_IP=$(hostname -I | awk '{print $1}')
if [ -z "$SERVER_IP" ]; then
    SERVER_IP="SEU_IP"
fi

# Mensagem final
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║                                                          ║"
echo "║           ✅ INSTALAÇÃO CONCLUÍDA!                      ║"
echo "║                                                          ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}📊 Dashboard:${NC} http://${SERVER_IP}:8080"
echo -e "${GREEN}🔐 Login:${NC} admin / admin"
echo ""
echo "⚠️  IMPORTANTE:"
echo "   1. Libere a porta 8080 no firewall da Hostinger"
echo "   2. Execute: ./fix-admin-user.sh"
echo "   3. Troque a senha após o primeiro login!"
echo ""
echo "🛠️  Comandos úteis:"
echo "   Ver logs:      $COMPOSE_CMD logs -f"
echo "   Reiniciar:     $COMPOSE_CMD restart"
echo "   Parar:         $COMPOSE_CMD stop"
echo "   Status:        $COMPOSE_CMD ps"
echo ""
echo "🔧 Próximo passo:"
echo "   ./fix-admin-user.sh"
echo ""
