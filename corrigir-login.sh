#!/bin/bash

echo "🔧 VPS Guardian - Correção Definitiva de Login"
echo "=============================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# 1. Parar tudo
echo "1️⃣ Parando containers..."
docker-compose down
echo -e "${GREEN}✅ Parado${NC}"

# 2. Limpar volumes antigos (opcional, perguntar)
echo ""
echo "2️⃣ Deseja limpar dados antigos? (isso apaga tudo)"
read -p "   Digite 'sim' para confirmar ou Enter para pular: " CONFIRM

if [ "$CONFIRM" = "sim" ]; then
    echo "   Limpando volumes..."
    docker-compose down -v
    echo -e "${GREEN}✅ Dados limpos${NC}"
else
    echo "   Mantendo dados existentes"
fi

# 3. Iniciar novamente
echo ""
echo "3️⃣ Iniciando containers..."
docker-compose up -d --build

echo "   Aguardando MongoDB (20s)..."
sleep 20

echo "   Aguardando Backend (10s)..."
sleep 10

# 4. Verificar se subiu
echo ""
echo "4️⃣ Verificando containers..."
docker-compose ps

# 5. Criar/resetar usuário admin
echo ""
echo "5️⃣ Criando usuário admin..."
./fix-admin-user.sh

# 6. Reiniciar backend para garantir
echo ""
echo "6️⃣ Reiniciando backend..."
docker-compose restart backend
sleep 5

# 7. Testar login
echo ""
echo "7️⃣ Testando login..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}')

if echo "$RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✅ LOGIN FUNCIONANDO!${NC}"
    
    # Obter IP
    SERVER_IP=$(hostname -I | awk '{print $1}')
    
    echo ""
    echo "=============================================="
    echo -e "${GREEN}✅ CORREÇÃO CONCLUÍDA COM SUCESSO!${NC}"
    echo "=============================================="
    echo ""
    echo "📊 Acesse: http://${SERVER_IP}:8080"
    echo "🔐 Login: admin / admin"
    echo ""
else
    echo -e "${RED}❌ Login ainda não funciona${NC}"
    echo ""
    echo "Resposta da API:"
    echo "$RESPONSE"
    echo ""
    echo "Ver logs:"
    echo "  docker-compose logs backend | tail -50"
fi
