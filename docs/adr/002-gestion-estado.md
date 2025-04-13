# ADR 002: Gestión de Estado y Caché con Vue Query y Pinia

## Estado
Aceptado

## Fecha
2025-04-12

## Contexto
La aplicación backoffice necesita gestionar eficientemente el estado de los datos provenientes del servidor (artículos y libros) así como el estado global de la aplicación (tema, notificaciones, preferencias de usuario). Se requiere una solución que optimice las peticiones al servidor, implemente caché inteligente y proporcione una experiencia fluida al usuario.

## Decisión
Implementaremos una estrategia dual de gestión de estado:

1. **Vue Query para estado del servidor**:
   - Gestión de peticiones HTTP a la API
   - Caché automática con invalidación inteligente
   - Refetching y polling configurable
   - Gestión de estados de carga, error y éxito
   - Paginación y prefetching

2. **Pinia para estado global de la aplicación**:
   - Tema (claro/oscuro)
   - Estado de navegación (sidebar abierto/cerrado)
   - Sistema de notificaciones
   - Preferencias de usuario
   - Estado de autenticación (para futuras versiones)

## Estrategia de Caché
- TTL (Time-to-Live) configurable por tipo de recurso
- Invalidación automática en mutaciones (crear/editar/eliminar)
- Prefetching de recursos probables (siguiente página en listados)
- Actualización optimista para mejora de UX

## Consecuencias

### Positivas
- **Reducción de peticiones**: La caché evita peticiones innecesarias
- **UX mejorada**: Estados de carga gestionados transparentemente
- **Consistencia de datos**: Invalidación automática mantiene datos frescos
- **Separación de conceptos**: Clara división entre estado servidor vs. estado aplicación
- **Reusabilidad**: Queries reutilizables en diferentes componentes
- **DevTools**: Herramientas de desarrollo para ambas librerías

### Negativas
- **Complejidad adicional**: Dos sistemas de estado para mantener
- **Overhead de aprendizaje**: Equipo debe familiarizarse con ambas APIs
- **Sincronización ocasional**: En casos específicos puede requerirse sincronización manual

## Alternativas Consideradas

### 1. Solo Pinia para toda la gestión de estado
Rechazada porque no ofrece las capacidades avanzadas de caché y gestión de peticiones HTTP que proporciona Vue Query.

### 2. Usar Vuex en lugar de Pinia
Rechazada porque Pinia es más moderno, tiene mejor soporte para TypeScript y es la recomendación oficial para Vue 3.

### 3. Implementación personalizada de caché
Rechazada por la complejidad de desarrollo y mantenimiento, cuando Vue Query ya ofrece una solución robusta.
