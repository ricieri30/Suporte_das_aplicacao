# 🚀 DEPLOY VPS GUARDIAN NA HOSTINGER

## ⚠️ PROBLEMA IDENTIFICADO

Vejo que o projeto `suporte_das_aplicacao` está com **0 containers** e não iniciou.

---

## ✅ SOLUÇÃO: Deploy Passo a Passo

### 📋 **PASSO 1: Acessar SSH/Terminal**

Na Hostinger:
1. Vá em **Terminal** (botão no canto superior direito)
2. Ou acesse via SSH do seu VPS

---

### 📋 **PASSO 2: Fazer Upload dos Arquivos**

**Opção A: Via Terminal Hostinger**
```bash
# Criar diretório
mkdir -p ~/vps-guardian
cd ~/vps-guardian

# Fazer upload do arquivo vps-guardian-complete-v2.tar.gz
# Use o gerenciador de arquivos da Hostinger para fazer upload
```

**Opção B: Via SCP (do seu computador)**
```bash
scp vps-guardian-complete-v2.tar.gz usuario@seu-vps:/root/vps-guardian/
```

---

### 📋 **PASSO 3: Extrair e Preparar**

No terminal da Hostinger:
```bash
cd ~/vps-guardian
tar -xzf vps-guardian-complete-v2.tar.gz
cd vps-guardian-complete
```

---

### 📋 **PASSO 4: Iniciar com Docker Compose**

```bash
# Dar permissões
chmod +x install.sh fix-admin-user.sh diagnostico.sh

# Iniciar containers
docker-compose up -d
```

**Aguarde 30-60 segundos** para tudo inicializar.

---

### 📋 **PASSO 5: Verificar se Subiu**

```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f
```

**Resultado esperado:**
```
vps-guardian-backend    running    0.0.0.0:3000->3000/tcp
vps-guardian-frontend   running    0.0.0.0:8080->80/tcp
vps-guardian-db         running    27017/tcp
```

Pressione `Ctrl+C` para sair dos logs.

---

### 📋 **PASSO 6: Criar Usuário Admin**

```bash
./fix-admin-user.sh
```

---

### 📋 **PASSO 7: Configurar Firewall/Portas**

Na Hostinger, você precisa **liberar a porta 8080**:

1. Vá em **Configurações do VPS**
2. **Firewall** ou **Regras de Porta**
3. Adicione regra:
   - Porta: `8080`
   - Protocolo: `TCP`
   - Origem: `0.0.0.0/0` (qualquer IP)

---

### 📋 **PASSO 8: Acessar o Dashboard**

Acesse no navegador:
```
http://SEU_IP_VPS:8080
```

**Login:**
- Usuário: `admin`
- Senha: `admin`

---

## 🔧 **COMANDOS ÚTEIS NA HOSTINGER**

### Ver logs em tempo real
```bash
cd ~/vps-guardian/vps-guardian-complete
docker-compose logs -f backend
```

### Reiniciar tudo
```bash
docker-compose restart
```

### Parar tudo
```bash
docker-compose stop
```

### Ver status
```bash
docker-compose ps
```

### Remover e recriar (APAGA DADOS!)
```bash
docker-compose down -v
docker-compose up -d
```

---

## 🐛 **PROBLEMAS COMUNS NA HOSTINGER**

### ❌ **Problema 1: Porta 8080 não acessível**

**Solução:**
1. Verificar firewall da Hostinger
2. Verificar se container está rodando: `docker-compose ps`
3. Testar localmente: `curl http://localhost:8080`

### ❌ **Problema 2: Containers não sobem**

**Solução:**
```bash
# Ver logs detalhados
docker-compose logs

# Verificar recursos do VPS
free -h
df -h

# Reiniciar Docker
systemctl restart docker
docker-compose up -d
```

### ❌ **Problema 3: MongoDB não conecta**

**Solução:**
```bash
# Ver logs do MongoDB
docker-compose logs mongodb

# Reiniciar MongoDB
docker-compose restart mongodb
sleep 10
docker-compose restart backend
```

### ❌ **Problema 4: "Permission denied" no docker.sock**

**Solução:**
```bash
# Dar permissões ao socket Docker
sudo chmod 666 /var/run/docker.sock

# Ou adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
```

---

## 📊 **GERENCIADOR DOCKER DA HOSTINGER**

Se preferir usar a interface gráfica da Hostinger:

### 1. Criar Projeto Novo
- Nome: `vps-guardian`
- Tipo: Docker Compose

### 2. Upload do docker-compose.yml
- Cole o conteúdo do arquivo `docker-compose.yml`

### 3. Upload dos arquivos
- Faça upload de toda a pasta `vps-guardian-complete`
- Path no servidor: `/root/vps-guardian/vps-guardian-complete`

### 4. Deploy
- Clique em **Deploy** ou **Iniciar**
- Aguarde containers subirem

---

## 🎯 **CHECKLIST DE DEPLOY**

- [ ] VPS Hostinger ativo
- [ ] Docker instalado (geralmente já vem)
- [ ] Arquivos extraídos em `~/vps-guardian/vps-guardian-complete`
- [ ] Executou `docker-compose up -d`
- [ ] Esperou 30-60 segundos
- [ ] Verificou status: `docker-compose ps` (todos "Up")
- [ ] Executou `./fix-admin-user.sh`
- [ ] Porta 8080 liberada no firewall
- [ ] Acesso funcionando: `http://SEU_IP:8080`

---

## 🆘 **SE NADA FUNCIONAR**

### Execute o diagnóstico completo:
```bash
cd ~/vps-guardian/vps-guardian-complete
./diagnostico.sh > diagnostico.txt
cat diagnostico.txt
```

E me envie o conteúdo de `diagnostico.txt`!

---

## 📞 **SUPORTE HOSTINGER**

Se tiver problemas específicos da Hostinger:
- Chat ao vivo: disponível 24/7
- Verificar: Status do VPS, Docker instalado, Recursos disponíveis

---

## 💡 **DICA: Usar Domain**

Se você tem um domínio na Hostinger:

1. Configure DNS A record:
   - Nome: `vps` ou `@`
   - Tipo: `A`
   - Valor: `IP_DO_SEU_VPS`
   - TTL: `3600`

2. Acesse: `http://vps.seudominio.com:8080`

3. Para remover a porta `:8080`, configure reverse proxy (nginx)

---

**🚀 Com estes passos, o VPS Guardian deve funcionar na Hostinger em 5-10 minutos!**
