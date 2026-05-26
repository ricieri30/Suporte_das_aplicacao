FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache \
    docker-cli \
    tar \
    gzip \
    wget \
    curl

# Criar diretório da aplicação
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install --production

# Copiar código fonte
COPY . .

# Criar diretórios necessários
RUN mkdir -p /app/backups /app/logs /app/data

# Expor porta
EXPOSE 3000

# Comando de inicialização
CMD ["node", "server.js"]
