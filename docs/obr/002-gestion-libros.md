# OBR-002: Gestión de Libros

## Descripción
Este documento define las reglas de negocio operacionales para la gestión de libros en el backoffice.

## Casos de Uso

### 1. Listar Libros
**Descripción**: El usuario visualiza una lista paginada de libros con opciones de filtrado y ordenación.

**Flujo Principal**:
1. Usuario navega a la sección "Libros"
2. Sistema muestra lista paginada de libros (10 por página por defecto)
3. Usuario puede cambiar la página, límite por página, o aplicar filtros
4. Sistema actualiza la lista según los parámetros

**Reglas de Negocio**:
- Ordenación predeterminada: título ascendente
- Paginación: 10, 25, 50 elementos por página
- Filtrado disponible por: título, autor, ISBN, año de publicación

**Casos Límite**:
- Sin libros: Mostrar mensaje "No hay libros disponibles"
- Error de API: Mostrar error y opción para reintentar
- Tiempo de carga excesivo: Mostrar skeleton loader después de 300ms

### 2. Crear Libro
**Descripción**: El usuario crea un nuevo libro en el sistema.

**Flujo Principal**:
1. Usuario selecciona "Nuevo Libro"
2. Sistema genera UUID v4 para el libro
3. Usuario completa formulario con: título, autor, ISBN, año, descripción, portada (opcional)
4. Usuario guarda cambios
5. Sistema valida datos, incluyendo formato ISBN
6. Sistema envía petición a API
7. Sistema muestra confirmación y redirige al listado o detalles

**Reglas de Negocio**:
- ID: UUID v4 generado en cliente
- Título: Entre 1-200 caracteres, obligatorio
- Autor: Entre 1-100 caracteres, obligatorio
- ISBN: Validación de formato ISBN-10 o ISBN-13, obligatorio y único
- Año: Entre 1000-año actual, obligatorio
- Descripción: Opcional, máximo 2000 caracteres
- Portada: Opcional (para futura implementación)

**Casos Límite**:
- Conflicto de ID: Regenerar UUID y reintentar
- ISBN duplicado: Notificar al usuario y solicitar corrección
- ISBN inválido: Validar en tiempo real y mostrar error específico
- Error en API: Mostrar mensaje y permitir reintentar

### 3. Editar Libro
**Descripción**: El usuario modifica un libro existente.

**Flujo Principal**:
1. Usuario selecciona editar en un libro
2. Sistema carga datos del libro
3. Usuario modifica campos
4. Usuario guarda cambios
5. Sistema valida datos
6. Sistema envía petición a API
7. Sistema muestra confirmación

**Reglas de Negocio**:
- No se puede modificar el ID
- Mismas validaciones que en creación
- ISBN puede modificarse pero debe seguir siendo único
- Timestamp de actualización se genera automáticamente

**Casos Límite**:
- Libro eliminado concurrentemente: Mostrar error y redirigir al listado
- Conflicto de edición: Implementar estrategia optimistic locking
- Error en API durante guardado: Ofrecer guardar localmente para retry

### 4. Eliminar Libro
**Descripción**: El usuario elimina un libro existente.

**Flujo Principal**:
1. Usuario selecciona eliminar libro
2. Sistema muestra confirmación con advertencia sobre artículos relacionados
3. Usuario confirma acción
4. Sistema envía petición a API
5. Sistema notifica éxito y actualiza listado

**Reglas de Negocio**:
- Confirmación explícita obligatoria
- Advertir sobre artículos relacionados antes de eliminar
- Validar que no haya operaciones pendientes antes de eliminar

**Casos Límite**:
- Error en API durante eliminación: Mostrar error y opción para reintentar
- Elemento ya eliminado: Refrescar lista y mostrar notificación
- Eliminación de múltiples elementos: Procesar en serie y reportar resultados

### 5. Ver Detalles de Libro
**Descripción**: El usuario visualiza todos los detalles de un libro específico.

**Flujo Principal**:
1. Usuario selecciona un libro del listado
2. Sistema muestra vista detallada con todos los campos
3. Sistema muestra lista de artículos relacionados

**Reglas de Negocio**:
- Mostrar metadata completa (fechas, ISBN formateado)
- Mostrar artículos relacionados con links a sus detalles
- Portada del libro (placeholder si no existe)

**Casos Límite**:
- Libro no encontrado: Mostrar 404 y opción para volver al listado
- Muchos artículos relacionados: Mostrar paginado o scroll infinito

## Escenarios de Prueba

### Tests Unitarios
1. Validación de esquema de libro (Zod)
2. Validación de ISBN-10 e ISBN-13
3. Generación y validación de UUID
4. Transformación de datos para API y desde API

### Tests de Integración
1. Formulario de creación/edición con validaciones
2. Interacción entre listado y filtros
3. Selección de artículos relacionados
4. Validación de ISBN en tiempo real
5. Notificaciones de acciones CRUD

### Tests E2E
1. Flujo completo de creación de libro con ISBN válido
2. Flujo de edición y guardado
3. Intentar crear libro con ISBN duplicado
4. Eliminación con confirmación
5. Navegación entre listado y detalles
