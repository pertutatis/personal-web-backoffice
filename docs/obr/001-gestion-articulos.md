# OBR-001: Gestión de Artículos

## Descripción
Este documento define las reglas de negocio operacionales para la gestión de artículos en el backoffice.

## Casos de Uso

### 1. Listar Artículos
**Descripción**: El usuario visualiza una lista paginada de artículos con opciones de filtrado y ordenación.

**Flujo Principal**:
1. Usuario navega a la sección "Artículos"
2. Sistema muestra lista paginada de artículos (10 por página por defecto)
3. Usuario puede cambiar la página, límite por página, o aplicar filtros
4. Sistema actualiza la lista según los parámetros

**Reglas de Negocio**:
- Ordenación predeterminada: fecha de creación descendente
- Paginación: 10, 25, 50 elementos por página
- Filtrado disponible por: título, estado de publicación, fechas

**Casos Límite**:
- Sin artículos: Mostrar mensaje "No hay artículos disponibles"
- Error de API: Mostrar error y opción para reintentar
- Tiempo de carga excesivo: Mostrar skeleton loader después de 300ms

### 2. Crear Artículo
**Descripción**: El usuario crea un nuevo artículo en el sistema.

**Flujo Principal**:
1. Usuario selecciona "Nuevo Artículo"
2. Sistema genera UUID v4 para el artículo
3. Usuario completa formulario con: título, contenido, estado, libros relacionados
4. Usuario guarda cambios
5. Sistema valida datos
6. Sistema envía petición a API
7. Sistema muestra confirmación y redirige al listado o detalles

**Reglas de Negocio**:
- ID: UUID v4 generado en cliente
- Título: Entre 3-100 caracteres, obligatorio
- Contenido: Mínimo 10 caracteres, formato Markdown
- Estado publicación: Borrador o Publicado
- Libros relacionados: Opcional, múltiple selección

**Casos Límite**:
- Conflicto de ID: Regenerar UUID y reintentar
- Error en validación: Mostrar errores inline
- Error en API: Mostrar mensaje y permitir reintentar
- Navegación durante edición: Pedir confirmación antes de salir

### 3. Editar Artículo
**Descripción**: El usuario modifica un artículo existente.

**Flujo Principal**:
1. Usuario selecciona editar en un artículo
2. Sistema carga datos del artículo
3. Usuario modifica campos
4. Usuario guarda cambios
5. Sistema valida datos
6. Sistema envía petición a API
7. Sistema muestra confirmación

**Reglas de Negocio**:
- No se puede modificar el ID
- Mismas validaciones que en creación
- Timestamp de actualización se genera automáticamente

**Casos Límite**:
- Artículo eliminado concurrentemente: Mostrar error y redirigir al listado
- Conflicto de edición: Implementar estrategia optimistic locking
- Error en API durante guardado: Ofrecer guardar localmente para retry

### 4. Eliminar Artículo
**Descripción**: El usuario elimina un artículo existente.

**Flujo Principal**:
1. Usuario selecciona eliminar artículo
2. Sistema muestra confirmación
3. Usuario confirma acción
4. Sistema envía petición a API
5. Sistema notifica éxito y actualiza listado

**Reglas de Negocio**:
- Confirmación explícita obligatoria
- Validar que no haya operaciones pendientes antes de eliminar

**Casos Límite**:
- Error en API durante eliminación: Mostrar error y opción para reintentar
- Elemento ya eliminado: Refrescar lista y mostrar notificación
- Eliminación de múltiples elementos: Procesar en serie y reportar resultados

### 5. Ver Detalles de Artículo
**Descripción**: El usuario visualiza todos los detalles de un artículo específico.

**Flujo Principal**:
1. Usuario selecciona un artículo del listado
2. Sistema muestra vista detallada con todos los campos
3. Sistema muestra lista de libros relacionados

**Reglas de Negocio**:
- Renderizado de Markdown en vista previa
- Mostrar metadata completa (fechas, estado)
- Mostrar libros relacionados con links a sus detalles

**Casos Límite**:
- Artículo no encontrado: Mostrar 404 y opción para volver al listado
- Contenido muy extenso: Implementar renderizado virtual/paginado

## Escenarios de Prueba

### Tests Unitarios
1. Validación de esquema de artículo (Zod)
2. Generación y validación de UUID
3. Transformación de datos para API y desde API
4. Funciones helpers de formato y validación

### Tests de Integración
1. Formulario de creación/edición con validaciones
2. Interacción entre listado y filtros
3. Editor de Markdown con preview
4. Selector de libros relacionados
5. Notificaciones de acciones CRUD

### Tests E2E
1. Flujo completo de creación de artículo
2. Flujo de edición y guardado
3. Eliminación con confirmación
4. Navegación entre listado y detalles
5. Paginación y filtrado en listado
