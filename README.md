# Personal Web Backoffice

Aplicación de backoffice para la gestión de artículos y libros de un blog personal.

## Tecnologías

- Vue 3 con Composition API
- TypeScript
- Tailwind CSS
- VueUse
- Pinia
- Vee-Validate con Zod
- Vue Query
- Vite

## Requisitos

- Node.js >= 16.x
- npm >= 8.x

## Instalación

```bash
# Instalar dependencias
npm install
```

## Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:3000`.

## Construcción para producción

```bash
# Construir la aplicación para producción
npm run build

# Previsualizar la build
npm run preview
```

## Tests

```bash
# Ejecutar tests unitarios
npm run test:unit

# Ejecutar tests unitarios con cobertura
npm run test:unit:coverage

# Ejecutar tests de integración
npm run test:integration

# Ejecutar todos los tests
npm run test
```

## Docker

```bash
# Construir imagen Docker
docker build -t personal-web-backoffice .

# Ejecutar contenedor
docker run -p 8080:80 personal-web-backoffice
```

También puedes utilizar docker-compose:

```bash
# Iniciar servicios
docker-compose up -d

# Detener servicios
docker-compose down
```

## Estructura del proyecto

```
├── src/
│   ├── assets/            # Estáticos (imágenes, etc)
│   ├── components/        # Componentes reutilizables
│   │   ├── ui/            # Componentes base (Button, Input, etc)
│   │   ├── articles/      # Componentes específicos de artículos
│   │   └── books/         # Componentes específicos de libros
│   ├── composables/       # Composables reutilizables
│   │   ├── api/           # Composables de API
│   │   └── ui/            # Composables de UI
│   ├── router/            # Configuración de rutas
│   ├── stores/            # Stores Pinia
│   ├── types/             # Tipos TypeScript
│   ├── utils/             # Utilidades
│   ├── views/             # Componentes de página
│   │   ├── dashboard/
│   │   ├── articles/
│   │   └── books/
│   ├── App.vue            # Componente raíz
│   └── main.ts            # Punto de entrada
├── tests/
│   ├── unit/             # Tests unitarios
│   └── integration/      # Tests de integración
└── docs/                 # Documentación
    ├── adr/              # Decisiones de arquitectura
    ├── api/              # Documentación de API
    └── implementation-plans/ # Planes de implementación
```

## Licencia

MIT
