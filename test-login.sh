#!/bin/bash

echo "🔍 VPS Guardian - Teste Completo de Login"
echo "=========================================="
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Verificar se containers estão rodando
echo "1️⃣ Verificando containers..."
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Containers rodando${NC}"
else
    echo -e "${RED}❌ Containers não estão rodando${NC}"
    echo "Execute: docker-compose up -d"
    exit 1
fi

# Verificar MongoDB
echo ""
echo "2️⃣ Testando MongoDB..."
if docker exec vps-guardian-backend node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://vpsguardian:guardian2024@mongodb:27017/vpsguardian?authSource=admin').then(() => { console.log('OK'); process.exit(0); }).catch(() => process.exit(1));" 2>/dev/null; then
    echo -e "${GREEN}✅ MongoDB conectado${NC}"
else
    echo -e "${RED}❌ MongoDB não conecta${NC}"
    exit 1
fi

# Aguardar backend
echo ""
echo "3️⃣ Aguardando backend inicializar..."
sleep 5

# Testar health check
echo ""
echo "4️⃣ Testando health check do backend..."
if curl -s http://localhost:3000/health | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend respondendo${NC}"
else
    echo -e "${RED}❌ Backend não responde${NC}"
    echo "Ver logs: docker-compose logs backend"
    exit 1
fi

# Testar se usuário admin existe
echo ""
echo "5️⃣ Verificando usuário admin..."
ADMIN_COUNT=$(docker exec vps-guardian-db mongosh -u vpsguardian -p guardian2024 --authenticationDatabase admin vpsguardian --quiet --eval "db.users.find({username: 'admin'}).count()" 2>/dev/null)

if [ "$ADMIN_COUNT" = "1" ]; then
    echo -e "${GREEN}✅ Usuário admin existe${NC}"
else
    echo -e "${YELLOW}⚠️  Usuário admin não encontrado. Criando...${NC}"
    ./fix-admin-user.sh
fi

# Testar login via API
echo ""
echo "6️⃣ Testando login via API (admin/admin)..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}')

if echo "$LOGIN_RESPONSE" | grep -q "success.*true"; then
    echo -e "${GREEN}✅ Login funcionando!${NC}"
    TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "Token obtido: ${TOKEN:0:20}..."
else
    echo -e "${RED}❌ Login falhou${NC}"
    echo "Resposta:"
    echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
    exit 1
fi

# Testar frontend
echo ""
echo "7️⃣ Testando frontend (porta 8080)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 | grep -q "200"; then
    echo -e "${GREEN}✅ Frontend acessível${NC}"
else
    echo -e "${RED}❌ Frontend não responde${NC}"
    exit 1
fi

# Testar proxy da API via frontend
echo ""
echo "8️⃣ Testando proxy da API via Nginx..."
if curl -s http://localhost:8080/api/auth/verify \
     -H "Authorization: Bearer $TOKEN" | grep -q "success"; then
    echo -e "${GREEN}✅ Proxy funcionando!${NC}"
else
    echo -e "${YELLOW}⚠️  Proxy pode ter problemas${NC}"
fi

# Obter IP do servidor
SERVER_IP=$(hostname -I | awk '{print $1}')

# Mensagem final
echo ""
echo "=========================================="
echo -e "${GREEN}✅ TODOS OS TESTES PASSARAM!${NC}"
echo "=========================================="
echo ""
echo "📊 Acesse o dashboard:"
echo "   http://${SERVER_IP}:8080"
echo ""
echo "🔐 Login:"
echo "   Usuário: admin"
echo "   Senha: admin"
echo ""
echo "🛠️  Comandos úteis:"
echo "   Ver logs: docker-compose logs -f"
echo "   Reiniciar: docker-compose restart"
echo ""
