# 🔧 SOLUÇÃO: Não Consigo Fazer Login

## ❌ Problema
Ao tentar fazer login com `admin` / `admin`, não entra no sistema.

---

## ✅ SOLUÇÃO RÁPIDA (Execute neste ordem)

### 1️⃣ Verificar se tudo está rodando

```bash
cd vps-guardian-complete
docker-compose ps
```

**Resultado esperado:** 3 containers em "Up"
- vps-guardian-backend
- vps-guardian-frontend  
- vps-guardian-db

Se algum estiver "Exit" ou não aparecer:

```bash
docker-compose down
docker-compose up -d
```

---

### 2️⃣ Executar Diagnóstico

```bash
./diagnostico.sh
```

Isso mostrará onde está o problema.

---

### 3️⃣ Resetar Usuário Admin

```bash
./fix-admin-user.sh
```

Isso vai:
- Conectar no MongoDB
- Criar/resetar o usuário admin
- Configurar senha: admin

---

### 4️⃣ Reiniciar Backend

```bash
docker-compose restart backend
```

Aguarde 10 segundos e tente fazer login novamente.

---

## 🔍 DIAGNÓSTICO MANUAL

### Verificar logs do backend em tempo real:

```bash
docker-compose logs -f backend
```

**O que procurar:**
- ✅ `Conectado ao MongoDB`
- ✅ `Usuário admin criado`
- ✅ `Servidor rodando em: http://0.0.0.0:3000`

Se ver erros de conexão MongoDB:

```bash
docker-compose restart mongodb
sleep 10
docker-compose restart backend
```

---

### Verificar se MongoDB está respondendo:

```bash
docker exec vps-guardian-db mongosh --eval "db.version()"
```

Se der erro, reinicie o MongoDB:

```bash
docker-compose restart mongodb
```

---

### Testar API diretamente:

```bash
# Testar health check
curl http://localhost:3000/health

# Tentar login via API
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin"}'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "token": "..."
}
```

Se receber erro 401 ou "Credenciais inválidas", execute `./fix-admin-user.sh`

---

## 🆘 RESETAR TUDO (Última opção)

Se nada funcionar, resetar completamente:

```bash
# ATENÇÃO: Isso apaga TODOS os dados!
docker-compose down -v

# Recriar tudo
docker-compose up -d

# Aguardar 20 segundos
sleep 20

# Verificar logs
docker-compose logs -f backend
```

Aguarde ver a mensagem: `Usuário admin criado (admin/admin)`

Depois execute:

```bash
./fix-admin-user.sh
```

---

## 📝 PROBLEMAS COMUNS

### 1. "Cannot connect to MongoDB"
**Solução:**
```bash
docker-compose restart mongodb
sleep 10
docker-compose restart backend
```

### 2. "Port 8080 already in use"
Edite `docker-compose.yml`, linha com `8080:80`, troque para outra porta:
```yaml
ports:
  - "8081:80"  # Use 8081 ou outra porta livre
```

Depois:
```bash
docker-compose down
docker-compose up -d
```

### 3. "502 Bad Gateway" no frontend
O backend não está respondendo:
```bash
docker-compose restart backend
```

### 4. Login retorna erro 401
Usuário não existe ou senha incorreta:
```bash
./fix-admin-user.sh
```

---

## 🎯 TESTAR SE FUNCIONOU

1. Abra o navegador
2. Acesse: `http://SEU_IP:8080`
3. Digite:
   - Usuário: `admin`
   - Senha: `admin`
4. Clique em **Entrar**

✅ Se entrar: Sucesso! Vá em Configurações → Trocar Senha

❌ Se não entrar: Execute o diagnóstico novamente e envie os logs

---

## 📞 PEDIR AJUDA

Se ainda não funcionar, execute:

```bash
./diagnostico.sh > diagnostico.txt
docker-compose logs > logs-completos.txt
```

E envie os arquivos:
- diagnostico.txt
- logs-completos.txt

---

## ⚡ ATALHOS ÚTEIS

```bash
# Ver logs em tempo real
docker-compose logs -f

# Ver só backend
docker-compose logs -f backend

# Reiniciar tudo
docker-compose restart

# Parar tudo
docker-compose stop

# Iniciar tudo
docker-compose start

# Ver status
docker-compose ps
```

---

**Desenvolvido para funcionar! 🚀**
