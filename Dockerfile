# Étape 1 : Build de l'application Angular
FROM node:22 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production

# Étape 2 : Servir l'application avec Nginx
FROM nginx:latest
COPY --from=build /app/dist/studio/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 8083
EXPOSE 8083
CMD ["nginx", "-g", "daemon off;"]
