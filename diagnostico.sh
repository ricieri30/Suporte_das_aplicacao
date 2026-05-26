#!/bin/bash

echo "🔍 VPS Guardian - Diagnóstico Completo"
echo "========================================"
echo ""

# 1. Verificar containers
echo "📦 1. Status dos Containers:"
echo "----------------------------"
docker-compose ps
echo ""

# 2. Verificar logs do backend
echo "📋 2. Últimas 20 linhas do Backend:"
echo "-----------------------------------"
docker-compose logs --tail=20 backend
echo ""

# 3. Verificar logs do frontend
echo "📋 3. Últimas 20 linhas do Frontend:"
echo "------------------------------------"
docker-compose logs --tail=20 frontend
echo ""

# 4. Verificar MongoDB
echo "🗄️  4. Status do MongoDB:"
echo "------------------------"
docker-compose logs --tail=10 mongodb
echo ""

# 5. Testar conectividade
echo "🌐 5. Testando Conectividade:"
echo "-----------------------------"
echo "Backend (porta 3000):"
curl -s http://localhost:3000/health | jq . 2>/dev/null || echo "❌ Backend não respondendo"
echo ""
echo "Frontend (porta 8080):"
curl -s -o /dev/null -w "Status: %{http_code}\n" http://localhost:8080
echo ""

# 6. Verificar se usuário admin existe
echo "👤 6. Verificando Usuário Admin no MongoDB:"
echo "-------------------------------------------"
docker exec vps-guardian-db mongosh -u vpsguardian -p guardian2024 --authenticationDatabase admin vpsguardian --quiet --eval "db.users.find({username: 'admin'}).count()" 2>/dev/null || echo "Erro ao conectar no MongoDB"
echo ""

echo "========================================"
echo "✅ Diagnóstico concluído!"
echo ""
echo "Se backend não está respondendo, execute:"
echo "  docker-compose restart backend"
echo ""
echo "Para resetar usuário admin:"
echo "  ./fix-admin-user.sh"
echo ""
