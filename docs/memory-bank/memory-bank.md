# Banco de Memoria: Backoffice para Blog Personal

## Contexto del Proyecto
Este proyecto consiste en la creación de un backoffice para gestionar artículos y libros de un blog personal. La aplicación debe proporcionar una interfaz intuitiva para la gestión completa (CRUD) de ambas entidades, consumiendo una API REST existente.

## Requisitos Funcionales Clave
1. **Dashboard** con estadísticas generales
2. **Gestión de Artículos**:
   - Listado paginado con búsqueda
   - Creación con UUID generado en cliente
   - Edición con editor de markdown
   - Eliminación con confirmación
   - Relación con libros
3. **Gestión de Libros**:
   - Listado paginado con búsqueda
   - Creación con validación de ISBN
   - Edición y eliminación
   - Visualización de artículos relacionados
4. **Características Globales**:
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
1. **Artículos**:
   - GET `/backoffice/articles`: Listar con paginación
   - POST `/backoffice/articles`: Crear nuevo
   - GET `/backoffice/articles/{id}`: Obtener uno
   - PUT `/backoffice/articles/{id}`: Actualizar
   - DELETE `/backoffice/articles/{id}`: Eliminar
2. **Libros**:
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
4. **Testing**: 
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
1. **Fase 1**: Setup inicial, configuración de proyecto
2. **Fase 2**: Implementación de core features y componentes base
3. **Fase 3**: CRUD de artículos completo
4. **Fase 4**: CRUD de libros completo
5. **Fase 5**: Refinamiento UI/UX y optimizaciones

## Potenciales desafíos y soluciones
1. **Editor Markdown**: Implementar vista previa en tiempo real
2. **Validación de ISBN**: Algoritmo de validación robusto
3. **Relaciones entre entidades**: Gestión eficiente de relaciones muchos a muchos
4. **Manejo de errores API**: Retroalimentación clara y recuperación inteligente
5. **Optimización de formularios grandes**: División en pasos o tabs
