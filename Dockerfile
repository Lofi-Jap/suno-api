# 1. Image officielle Playwright avec navigateurs et dépendances préinstallés
FROM mcr.microsoft.com/playwright:v1.53.1-jammy

# 2. Créer un dossier pour ton app
WORKDIR /app

# 3. Copier package.json et installer dépendances
COPY package*.json ./
RUN npm install

# 4. Copier le reste de l'app
COPY . .

# 5. Exposer le port utilisé par Express
EXPOSE 3000

# 6. Lancer le serveur Node.js
CMD ["node", "index.js"]
