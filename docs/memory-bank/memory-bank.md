# Banco de Memoria: Backoffice para Blog Personal

## Contexto del Proyecto
Este proyecto consiste en la creación de un backoffice para gestionar artículos y libros de un blog personal. La aplicación debe proporcionar una interfaz intuitiva para la gestión completa (CRUD) de ambas entidades, consumiendo una API REST existente.

## Requisitos Funcionales Clave
1. **Autenticación y Seguridad**:
   - Login con email y contraseña
   - Registro de nuevos usuarios
   - Gestión de tokens JWT
   - Protección de rutas
2. **Dashboard** con estadísticas generales
3. **Gestión de Artículos**:
   - Listado paginado con búsqueda
   - Creación con UUID generado en cliente
   - Edición con editor de markdown
   - Eliminación con confirmación
   - Relación con libros
4. **Gestión de Libros**:
   - Listado paginado con búsqueda
   - Creación con validación de ISBN
   - Edición y eliminación
   - Visualización de artículos relacionados
5. **Características Globales**:
   - Tema claro/oscuro
   - Diseño responsive
   - Sistema de notificaciones
   - Manejo de errores

## Stack Tecnológico
- **Frontend**: Vue 3 (Composition API)
- **Tipado**: TypeScript
- **Estilos**: Tailwind CSS
- **Estado Global**: Pinia
- **Peticiones API**: Vue Query
- **Validación**: Vee-Validate + Zod
- **Utilidades**: VueUse

## Endpoints API Principales
1. **Autenticación**:
   - POST `/backoffice/auth/login`: Iniciar sesión
   - POST `/backoffice/auth/register`: Registrar usuario
   - POST `/backoffice/auth/refresh-token`: Renovar token
2. **Artículos**:
   - GET `/backoffice/articles`: Listar con paginación
   - POST `/backoffice/articles`: Crear nuevo
   - GET `/backoffice/articles/{id}`: Obtener uno
   - PUT `/backoffice/articles/{id}`: Actualizar
   - DELETE `/backoffice/articles/{id}`: Eliminar
3. **Libros**:
   - GET `/backoffice/books`: Listar con paginación
   - POST `/backoffice/books`: Crear nuevo
   - GET `/backoffice/books/{id}`: Obtener uno
   - PUT `/backoffice/books/{id}`: Actualizar
   - DELETE `/backoffice/books/{id}`: Eliminar

## Decisiones Arquitectónicas Relevantes
1. **Arquitectura Hexagonal** adaptada al frontend:
   - Separación clara entre presentación, aplicación y dominio
   - Adaptadores para API y almacenamiento
2. **Diseño orientado al dominio**:
   - Entidades y objetos de valor bien definidos
   - Reglas de negocio encapsuladas
3. **Gestión de estado**: 
   - Estado servidor: Vue Query
   - Estado cliente: Pinia
4. **Autenticación**:
   - JWT para gestión de sesiones
   - Refresh token para renovación automática
   - Interceptor HTTP para tokens
5. **Testing**: 
   - Tests unitarios para lógica de negocio
   - Tests de integración para componentes clave
   - Tests E2E para flujos críticos

## Principios de Diseño de UI/UX
1. **Consistencia**: Mismo patrón de interacción en toda la aplicación
2. **Feedback**: Notificaciones claras para todas las acciones
3. **Prevención de errores**: Validación proactiva
4. **Eficiencia**: Atajos y operaciones en lote
5. **Ayuda contextual**: Tooltips y mensajes de ayuda

## Consideraciones de Performance
1. **Lazy loading** de rutas y componentes pesados
2. **Caching** optimizado con Vue Query
3. **Paginación y filtrado** en servidor
4. **Optimización de imágenes** (para futura feature)
5. **Métricas objetivo**: Lighthouse score > 90

## Roadmap de implementación
1. **Fase 1**: Setup inicial y autenticación
   - Configuración de proyecto
   - Implementación de login/registro
   - Protección de rutas
   - Tests de autenticación
2. **Fase 2**: Core features y componentes base
3. **Fase 3**: CRUD de artículos completo
4. **Fase 4**: CRUD de libros completo
5. **Fase 5**: Refinamiento UI/UX y optimizaciones

## Estado Actual
1. **Completado**:
   - Setup inicial del proyecto
   - Configuración de herramientas
   - Documentación de arquitectura (ADR)
   - Documentación de reglas de negocio (OBR)
   - Especificación de tests E2E y de integración
2. **En Progreso**:
   - Implementación de autenticación
   - Setup de tests E2E con Cypress
3. **Siguiente Sprint**:
   - Implementación de LoginView y RegisterView
   - Configuración de httpClient con interceptores
   - Implementación de authStore
   - Implementación de protección de rutas
   - Ejecución de tests E2E

## Potenciales desafíos y soluciones
1. **Seguridad de tokens**: Almacenamiento seguro y renovación
2. **Editor Markdown**: Implementar vista previa en tiempo real
3. **Validación de ISBN**: Algoritmo de validación robusto
4. **Relaciones entre entidades**: Gestión eficiente de relaciones muchos a muchos
5. **Manejo de errores API**: Retroalimentación clara y recuperación inteligente
6. **Optimización de formularios grandes**: División en pasos o tabs

## Referencias
- [ADR 006: Arquitectura de Autenticación](../adr/006-autenticacion.md)
- [OBR 003: Reglas de Autenticación](../obr/003-autenticacion.md)
- [API Spec](../api/openapi.json)
