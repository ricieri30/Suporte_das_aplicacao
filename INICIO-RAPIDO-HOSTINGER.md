# ⚡ INÍCIO RÁPIDO - VPS GUARDIAN NA HOSTINGER

## 🎯 5 Minutos para Funcionar!

Você está vendo **0 containers** no projeto. Vamos corrigir!

---

## 📋 COPIE E COLE ESTES COMANDOS

### 1️⃣ Acesse o Terminal da Hostinger
- Na tela do Docker Manager, clique em **"Terminal"** (canto superior direito)

### 2️⃣ Execute estes comandos (cole tudo de uma vez)

```bash
cd ~
tar -xzf vps-guardian-hostinger.tar.gz
cd vps-guardian-hostinger
chmod +x *.sh
./install-hostinger.sh
```

**Aguarde 2-3 minutos...**

### 3️⃣ Criar usuário admin

```bash
./fix-admin-user.sh
```

### 4️⃣ Liberar porta (escolha UMA opção)

**Opção A - Via interface Hostinger:**
- Painel → Firewall → Adicionar Regra
- Porta: 8080, TCP, Origem: 0.0.0.0/0

**Opção B - Via terminal:**
```bash
sudo iptables -I INPUT -p tcp --dport 8080 -j ACCEPT
sudo iptables-save
```

### 5️⃣ Acessar

Abra no navegador:
```
http://76.13.236.168:8080
```

Login: `admin` / `admin`

---

## ❌ NÃO FUNCIONOU?

### Ver o que aconteceu:
```bash
cd ~/vps-guardian-hostinger
docker-compose ps
docker-compose logs
```

### Resetar tudo:
```bash
docker-compose down -v
docker-compose up -d
sleep 30
./fix-admin-user.sh
```

---

## ✅ FUNCIONOU!

Agora:
1. Faça login
2. Vá em **Configurações**
3. Clique **Trocar Senha**
4. Troque de `admin` para sua senha

---

**🚀 Simples assim! Execute os comandos e funciona!**
