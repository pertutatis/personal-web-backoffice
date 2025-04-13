# ADR 001: Arquitectura de Frontend para el Backoffice

## Estado
Aceptado

## Fecha
2025-04-12

## Contexto
Necesitamos definir una arquitectura frontend sólida para el backoffice de gestión de artículos y libros. La arquitectura debe facilitar el mantenimiento, la escalabilidad y la claridad del código, mientras permite una implementación eficiente de los requisitos funcionales.

## Decisión
Implementaremos una **arquitectura hexagonal adaptada a frontend** con las siguientes capas:

1. **Capa de UI (Presentación)**:
   - Componentes Vue 3 con Composition API
   - Separación clara entre presentadores (páginas) y componentes reutilizables
   - Manejo de estados locales de UI

2. **Capa de Aplicación**:
   - Composables que encapsulan la lógica de negocio
   - Servicios para operaciones cross-cutting
   - Adaptadores para servicios externos

3. **Capa de Dominio**:
   - Entidades y objetos de valor (DTO)
   - Reglas de negocio e invariantes
   - Interfaces para los repositorios

4. **Capa de Infraestructura**:
   - Cliente HTTP (abstracción sobre fetch/axios)
   - Adaptadores de almacenamiento (localStorage, sessionStorage)
   - Implementación de repositorios

## Gestión de Estado
- **Estado del servidor**: Vue Query para la gestión eficiente de datos remotos
- **Estado global de la aplicación**: Pinia para estado compartido entre componentes
- **Estado local**: refs y reactive para estado específico de componentes

## Consecuencias

### Positivas
- **Separación de responsabilidades**: Cada capa tiene una responsabilidad clara
- **Testabilidad**: Fácil de implementar tests para cada capa de forma aislada
- **Extensibilidad**: Nuevas funcionalidades pueden integrarse respetando los límites de cada capa
- **Mantenibilidad**: Código más predecible y organizado
- **Desarrollo en paralelo**: Equipos pueden trabajar en diferentes capas simultáneamente

### Negativas
- **Curva de aprendizaje**: Para desarrolladores no familiarizados con el patrón
- **Boilerplate inicial**: Requiere más código estructural al principio
- **Complejidad percibida**: Para proyectos muy pequeños puede parecer excesivo

## Alternativas Consideradas

### 1. Arquitectura MVC Tradicional
Rechazada porque no se adapta bien a las aplicaciones reactivas modernas y tiende a generar componentes demasiado acoplados.

### 2. Simple SPA sin arquitectura formal
Rechazada porque dificulta el mantenimiento y escalabilidad a largo plazo.

### 3. Arquitectura Flux/Redux
Considerada, pero Vue y Pinia ya proporcionan una solución más integrada y con menos boilerplate.
