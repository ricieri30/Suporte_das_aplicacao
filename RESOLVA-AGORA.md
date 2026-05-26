# ⚡ RESOLVER PROBLEMA DE LOGIN AGORA!

## 🎯 Execute estes comandos na ordem:

### 1. Entre no diretório
```bash
cd vps-guardian-complete
```

### 2. Pare tudo
```bash
docker-compose down
```

### 3. Inicie novamente
```bash
docker-compose up -d
```

### 4. Aguarde 30 segundos
```bash
sleep 30
```

### 5. Execute o fix
```bash
./fix-admin-user.sh
```

### 6. Veja os logs (Ctrl+C para sair)
```bash
docker-compose logs -f backend
```

**Procure por:**
- ✅ "Conectado ao MongoDB"
- ✅ "Usuário admin criado" ou "Usuário admin já existe"

---

## ✅ AGORA TENTE FAZER LOGIN

1. Abra: `http://76.13.236.168:8080`
2. Usuário: `admin`
3. Senha: `admin`
4. Clique **Entrar**

---

## ❌ AINDA NÃO FUNCIONA?

Execute o diagnóstico:
```bash
./diagnostico.sh
```

E me envie o resultado!

---

## 🆘 ÚLTIMA OPÇÃO (Resetar tudo)

```bash
docker-compose down -v
docker-compose up -d
sleep 30
./fix-admin-user.sh
```

**ATENÇÃO:** Isso apaga todos os dados!
