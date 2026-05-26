# 📸 GUIA VISUAL: Deploy na Hostinger

## 🎯 Passo a Passo com Imagens de Referência

### ✅ PASSO 1: Acessar Terminal

**Na tela que você mostrou:**

1. Clique em **"Terminal"** (canto superior direito)
2. Uma nova janela abrirá com o terminal SSH

**OU**

Use SSH do seu computador:
```bash
ssh root@76.13.236.168
```

---

### ✅ PASSO 2: Upload dos Arquivos

**Método A: Gerenciador de Arquivos**

1. No painel Hostinger → **"Arquivos"** ou **"File Manager"**
2. Navegue até `/root` ou clique em **"Home"**
3. Clique em **"Upload"**
4. Selecione o arquivo `vps-guardian-hostinger.tar.gz`
5. Aguarde upload completar

**Método B: Via Terminal**

No terminal que abriu:
```bash
cd ~
pwd  # Confirma que está em /root
```

Depois faça upload via SCP do seu computador:
```bash
scp vps-guardian-hostinger.tar.gz root@76.13.236.168:/root/
```

---

### ✅ PASSO 3: Extrair Arquivo

No terminal da Hostinger:
```bash
cd ~
ls -la  # Ver se o arquivo está lá

tar -xzf vps-guardian-hostinger.tar.gz
cd vps-guardian-hostinger
ls -la  # Ver arquivos extraídos
```

**Você deve ver:**
- backend/
- frontend/
- docker-compose.yml
- install-hostinger.sh
- fix-admin-user.sh
- diagnostico.sh

---

### ✅ PASSO 4: Executar Instalação

```bash
# Dar permissões
chmod +x *.sh

# Executar instalador
./install-hostinger.sh
```

**O que vai acontecer:**
1. Script verifica Docker ✅
2. Cria diretórios
3. Baixa imagens Docker
4. Inicia 3 containers
5. Mostra mensagem de sucesso

**Aguarde 2-3 minutos** até ver:
```
✅ INSTALAÇÃO CONCLUÍDA!
```

---

### ✅ PASSO 5: Verificar Status

```bash
docker-compose ps
```

**Resultado esperado:**
```
NAME                      STATUS
vps-guardian-backend      Up 2 minutes
vps-guardian-frontend     Up 2 minutes  
vps-guardian-db           Up 2 minutes
```

**Se algum estiver "Exit" ou "Restarting":**
```bash
docker-compose logs
```

---

### ✅ PASSO 6: Criar Usuário Admin

```bash
./fix-admin-user.sh
```

**Mensagem esperada:**
```
✅ Conectado ao MongoDB
✅ Usuário admin CRIADO com sucesso!

Credenciais:
  Usuário: admin
  Senha: admin
```

---

### ✅ PASSO 7: Liberar Porta no Firewall

**Na interface da Hostinger:**

1. Volte para o painel principal
2. Clique no seu VPS
3. Procure por:
   - **"Firewall"** OU
   - **"Configurações"** → **"Firewall"** OU
   - **"Segurança"**

4. Clique em **"Adicionar Regra"** ou **"Add Rule"**

5. Preencha:
   - **Protocolo:** TCP
   - **Porta:** 8080
   - **Origem/Source:** 0.0.0.0/0 (ou "Anywhere")
   - **Ação:** ACCEPT/Allow

6. Clique em **"Salvar"** ou **"Apply"**

**Se não encontrar interface de firewall:**

Via terminal:
```bash
sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables-save
```

---

### ✅ PASSO 8: Testar Acesso

**No terminal:**
```bash
# Testar localmente
curl http://localhost:8080

# Deve retornar HTML da página
```

**No navegador:**
```
http://76.13.236.168:8080
```

**Você deve ver:**
- 🛡️ Logo do VPS Guardian
- Campos de usuário e senha
- Botão "Entrar"

---

### ✅ PASSO 9: Fazer Login

1. Usuário: `admin`
2. Senha: `admin`
3. Clique em **"Entrar"**

**Se entrar:**
✅ Sucesso! Vá para o Passo 10

**Se não entrar (erro 401):**
```bash
cd ~/vps-guardian-hostinger
./fix-admin-user.sh
docker-compose restart backend
```

Aguarde 10 segundos e tente novamente.

---

### ✅ PASSO 10: Trocar Senha

**No dashboard:**

1. Clique na aba **"Configurações"**
2. Clique no botão **"Trocar Senha"**
3. Preencha:
   - Senha atual: `admin`
   - Nova senha: (sua escolha - mínimo 3 caracteres)
4. Clique em **"Salvar"**

✅ Senha alterada com sucesso!

---

## 🔍 VERIFICANDO NO GERENCIADOR DOCKER

**Na tela que você mostrou:**

Vá em **"Gerenciador Docker"**

Agora você deve ver:
- **Projeto:** vps-guardian-hostinger
- **Containers:** 3 containers
- **Status:** Em execução (verde)

**Clique no projeto** para ver detalhes:
- vps-guardian-backend (porta 3000)
- vps-guardian-frontend (porta 8080)
- vps-guardian-db (porta 27017)

---

## 🐛 SE ALGO DER ERRADO

### No Gerenciador Docker mostra 0 containers

**Causa:** Docker Compose não iniciou

**Solução via Terminal:**
```bash
cd ~/vps-guardian-hostinger
docker-compose down
docker-compose up -d
docker-compose ps
```

### Projeto aparece mas containers não sobem

**Ver logs:**
```bash
docker-compose logs
```

**Causas comuns:**
- Porta já em uso
- Memória insuficiente
- Erro no docker-compose.yml

### Container vps-guardian-backend em "Restarting"

```bash
docker-compose logs backend
```

**Geralmente é:**
- MongoDB não está pronto
- Erro de conexão

**Solução:**
```bash
docker-compose restart mongodb
sleep 15
docker-compose restart backend
```

### Porta 8080 não responde

**Verificar se container está rodando:**
```bash
docker-compose ps
```

**Verificar se porta está aberta:**
```bash
netstat -tlnp | grep 8080
```

**Verificar firewall:**
```bash
sudo iptables -L -n | grep 8080
```

Se não aparecer, adicione a regra:
```bash
sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
```

---

## 📊 COMANDOS DE MONITORAMENTO

```bash
# Status em tempo real
watch -n 2 'docker-compose ps'

# Logs em tempo real
docker-compose logs -f

# Uso de recursos
docker stats

# Processos
htop
```

---

## ✅ CHECKLIST FINAL

- [ ] Terminal acessado
- [ ] Arquivo extraído
- [ ] Instalador executado (./install-hostinger.sh)
- [ ] 3 containers rodando (docker-compose ps)
- [ ] fix-admin-user.sh executado
- [ ] Porta 8080 liberada no firewall
- [ ] Página abre em http://IP:8080
- [ ] Login funciona (admin/admin)
- [ ] Senha trocada

---

**🎉 Se completou todos os passos, seu VPS Guardian está 100% funcional!**
