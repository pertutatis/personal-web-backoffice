# Guía de Despliegue con Docker

Este documento detalla cómo desplegar la aplicación Personal Web Backoffice utilizando Docker.

## Requisitos previos

- Docker >= 20.10.x
- Docker Compose >= 2.x

## Estructura de despliegue

```
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── docker-compose.test.yml
└── .dockerignore
```

## Dockerfile

El Dockerfile utiliza un enfoque multi-etapa para optimizar el tamaño de la imagen y mejorar la seguridad:

```Dockerfile
# Etapa de construcción
FROM node:16-alpine as build

WORKDIR /app

# Copiar archivos de configuración y dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copiar configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos estáticos desde la etapa de construcción
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Docker Compose para desarrollo

El archivo `docker-compose.dev.yml` está configurado para desarrollo:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
```

## Docker Compose para producción

El archivo `docker-compose.yml` está configurado para producción:

```yaml
version: '3.8'

services:
  app:
    build: .
    restart: always
    ports:
      - "8080:80"
    environment:
      - NODE_ENV=production
```

## Docker Compose para testing

El archivo `docker-compose.test.yml` está configurado para ejecutar tests:

```yaml
version: '3.8'

services:
  test:
    build:
      context: .
      dockerfile: Dockerfile.test
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=test
    command: npm run test
```

## Ejecución en desarrollo

```bash
# Iniciar en modo desarrollo
docker-compose -f docker-compose.dev.yml up

# Detener
docker-compose -f docker-compose.dev.yml down
```

## Ejecución en producción

```bash
# Construir e iniciar en modo producción
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Detener
docker-compose down
```

## Ejecución de tests

```bash
# Ejecutar tests
docker-compose -f docker-compose.test.yml up --build

# Ejecutar tests en modo daemon
docker-compose -f docker-compose.test.yml up -d --build

# Ver logs de tests
docker-compose -f docker-compose.test.yml logs -f
```

## Configuración de Nginx

El archivo `nginx.conf` está configurado para servir una SPA (Single Page Application) y redirigir todas las rutas a `index.html`:

```nginx
server {
    listen 80;
    
    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    # Configuración para API proxy si es necesaria
    location /api/ {
        proxy_pass http://api-service:3000/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Variables de entorno

Puedes configurar variables de entorno en tus archivos docker-compose o directamente en el Dockerfile. Estas variables pueden ser utilizadas para configurar la aplicación en diferentes entornos:

```yaml
environment:
  - NODE_ENV=production
  - VUE_APP_API_URL=https://api.example.com
```

## Buenas prácticas

1. Usa `.dockerignore` para excluir archivos innecesarios del contexto de build
2. Utiliza etiquetas específicas para las imágenes base en lugar de `latest`
3. Minimiza el número de capas usando menos instrucciones RUN
4. Considera usar un proxy inverso como Nginx para servir los archivos estáticos
5. Implementa health checks para garantizar que los servicios estén funcionando correctamente
