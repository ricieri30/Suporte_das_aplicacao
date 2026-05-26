# 🚀 VPS Guardian para Hostinger

## 🎯 Deploy Simplificado na Hostinger

Este guia é específico para VPS da **Hostinger** com Docker Manager.

---

## ⚡ INSTALAÇÃO RÁPIDA (3 Minutos)

### 1️⃣ Acesse o Terminal

Na Hostinger:
- Clique em **Terminal** (canto superior direito)
- Ou conecte via SSH

### 2️⃣ Faça Upload do Projeto

**Via Gerenciador de Arquivos da Hostinger:**
1. Vá em **Arquivos**
2. Navegue até `/root` ou `~`
3. Faça upload do arquivo `vps-guardian-hostinger.tar.gz`

**Ou via Terminal:**
```bash
cd ~
# Cole ou faça upload do arquivo aqui
```

### 3️⃣ Extraia e Instale

```bash
# Extrair
tar -xzf vps-guardian-hostinger.tar.gz
cd vps-guardian-hostinger

# Dar permissões
chmod +x *.sh

# Instalar
./install-hostinger.sh
```

### 4️⃣ Criar Usuário Admin

```bash
./fix-admin-user.sh
```

### 5️⃣ Liberar Porta 8080

Na Hostinger:
1. **Configurações** → **Firewall**
2. Adicionar regra:
   - Porta: `8080`
   - Protocolo: `TCP`
   - Permitir de: `Anywhere`

### 6️⃣ Acessar Dashboard

Abra o navegador:
```
http://SEU_IP_VPS:8080
```

**Login:**
- Usuário: `admin`
- Senha: `admin`

**⚠️ Troque a senha imediatamente!**

---

## 🔧 USANDO O DOCKER MANAGER DA HOSTINGER

Se preferir a interface gráfica:

### Via Painel Hostinger

1. **Gerenciador Docker** → **Novo Projeto**
2. Nome: `vps-guardian`
3. **Upload** do `docker-compose.yml`
4. Configurar volumes (mapear diretórios)
5. **Deploy**

---

## 📊 VERIFICAR STATUS

### Via Terminal
```bash
cd ~/vps-guardian-hostinger
docker-compose ps
```

**Resultado esperado:**
```
NAME                      STATUS    PORTS
vps-guardian-backend      Up        0.0.0.0:3000->3000/tcp
vps-guardian-frontend     Up        0.0.0.0:8080->80/tcp
vps-guardian-db           Up        27017/tcp
```

### Via Painel Hostinger
- **Gerenciador Docker** → Ver projeto
- Status deve mostrar **3 containers ativos**

---

## 🐛 TROUBLESHOOTING HOSTINGER

### ❌ Containers não sobem (0 containers)

**Causa:** Docker não iniciou ou arquivo de configuração incorreto

**Solução:**
```bash
cd ~/vps-guardian-hostinger

# Ver logs
docker-compose logs

# Reconstruir
docker-compose down
docker-compose up -d --build

# Aguardar 30 segundos
sleep 30

# Verificar
docker-compose ps
```

### ❌ "Port 8080 already in use"

**Causa:** Porta já está sendo usada

**Solução 1 - Trocar porta:**
Edite `docker-compose.yml`:
```yaml
frontend:
  ports:
    - "8081:80"  # Troque para 8081 ou outra porta
```

**Solução 2 - Matar processo:**
```bash
# Ver o que está usando a porta
lsof -i :8080

# Parar container conflitante
docker stop <container_id>
```

### ❌ "Cannot connect to MongoDB"

**Solução:**
```bash
# Verificar se MongoDB está rodando
docker-compose ps mongodb

# Ver logs do MongoDB
docker-compose logs mongodb

# Reiniciar
docker-compose restart mongodb
sleep 15
docker-compose restart backend
```

### ❌ Login não funciona (admin/admin)

**Solução:**
```bash
cd ~/vps-guardian-hostinger

# Executar fix
./fix-admin-user.sh

# Ver logs do backend
docker-compose logs -f backend

# Procurar por:
# ✅ Conectado ao MongoDB
# ✅ Usuário admin criado
```

### ❌ Firewall bloqueando porta 8080

**Solução na Hostinger:**
1. Painel Hostinger → **VPS** → **Configurações**
2. **Firewall** ou **Regras de Porta**
3. Adicionar:
   - Protocolo: TCP
   - Porta: 8080
   - Origem: 0.0.0.0/0

**Ou via Terminal (iptables):**
```bash
sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables-save
```

### ❌ "Permission denied" - Docker socket

**Solução:**
```bash
sudo chmod 666 /var/run/docker.sock
```

### ❌ Pouco espaço em disco

**Verificar espaço:**
```bash
df -h
```

**Limpar Docker:**
```bash
# Remover containers parados
docker container prune -f

# Remover imagens não usadas
docker image prune -a -f

# Remover volumes órfãos
docker volume prune -f
```

---

## 📁 ESTRUTURA DE ARQUIVOS NA HOSTINGER

```
/root/vps-guardian-hostinger/
├── backend/              # Código backend
├── frontend/             # Código frontend
├── docker-compose.yml    # Configuração Docker
├── install-hostinger.sh  # Instalador
├── fix-admin-user.sh     # Fix usuário admin
├── diagnostico.sh        # Script de diagnóstico
├── backups/              # Backups criados
├── logs/                 # Logs do sistema
└── data/                 # Dados persistentes
```

---

## 🔐 SEGURANÇA NA HOSTINGER

### Trocar Senha Admin
1. Faça login no dashboard
2. **Configurações** → **Trocar Senha**
3. Digite:
   - Senha atual: `admin`
   - Nova senha: (sua escolha)

### Firewall
- Sempre use o firewall da Hostinger
- Libere apenas as portas necessárias
- Considere usar VPN ou IPs específicos

### SSL/HTTPS (Opcional)
Se você tem domínio:
1. Configure DNS A record para o IP do VPS
2. Use Let's Encrypt para SSL
3. Configure nginx como reverse proxy

---

## 📊 RECURSOS DO VPS HOSTINGER

**Verificar recursos:**
```bash
# CPU e RAM
htop

# Espaço em disco
df -h

# Containers
docker stats
```

**Planos recomendados:**
- Mínimo: 1 CPU, 1GB RAM, 20GB disco
- Ideal: 2 CPU, 2GB RAM, 40GB disco

---

## 🆘 COMANDOS ESSENCIAIS

```bash
# Navegar para o projeto
cd ~/vps-guardian-hostinger

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço
docker-compose logs -f backend

# Reiniciar tudo
docker-compose restart

# Parar tudo
docker-compose stop

# Iniciar tudo
docker-compose start

# Status dos containers
docker-compose ps

# Executar diagnóstico
./diagnostico.sh
```

---

## 📞 SUPORTE

### Hostinger
- Chat 24/7 em português
- Verificar: Status do VPS, Docker instalado

### VPS Guardian
- Execute `./diagnostico.sh`
- Envie os logs: `docker-compose logs > logs.txt`

---

## 💡 DICAS PARA HOSTINGER

1. **Use o Terminal integrado** - Mais fácil que SSH
2. **Gerenciador de Arquivos** - Upload fácil de arquivos
3. **Docker Manager** - Interface gráfica alternativa
4. **Backups da Hostinger** - Configure backups automáticos do VPS
5. **Snapshots** - Tire snapshot antes de mudanças grandes

---

**🚀 Deploy otimizado para Hostinger! Qualquer dúvida, execute ./diagnostico.sh**
