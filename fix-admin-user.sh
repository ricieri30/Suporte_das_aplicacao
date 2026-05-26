#!/bin/bash

echo "🔧 VPS Guardian - Criar/Resetar Usuário Admin"
echo ""

# Verificar se containers estão rodando
if ! docker ps | grep -q vps-guardian-backend; then
    echo "❌ Container backend não está rodando!"
    echo "Execute: docker-compose up -d"
    exit 1
fi

echo "✅ Backend está rodando"
echo ""

# Criar script para resetar admin
cat > /tmp/reset-admin.js << 'JSEOF'
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb://vpsguardian:guardian2024@mongodb:27017/vpsguardian?authSource=admin';

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  role: String,
  createdAt: Date,
  lastLogin: Date
});

const User = mongoose.model('User', userSchema);

async function resetAdmin() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Conectado ao MongoDB');
    
    // Hash da senha "admin"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);
    
    // Tentar atualizar usuário admin existente
    const result = await User.updateOne(
      { username: 'admin' },
      {
        $set: {
          username: 'admin',
          password: hashedPassword,
          email: 'admin@vpsguardian.local',
          role: 'admin',
          createdAt: new Date()
        }
      },
      { upsert: true }
    );
    
    if (result.upsertedCount > 0) {
      console.log('✅ Usuário admin CRIADO com sucesso!');
    } else {
      console.log('✅ Usuário admin RESETADO com sucesso!');
    }
    
    console.log('');
    console.log('Credenciais:');
    console.log('  Usuário: admin');
    console.log('  Senha: admin');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

resetAdmin();
JSEOF

# Executar script dentro do container
echo "🔄 Criando/Resetando usuário admin..."
docker cp /tmp/reset-admin.js vps-guardian-backend:/tmp/reset-admin.js
docker exec vps-guardian-backend node /tmp/reset-admin.js

echo ""
echo "✅ Processo concluído!"
echo ""
echo "Agora tente fazer login com:"
echo "  Usuário: admin"
echo "  Senha: admin"
echo ""
