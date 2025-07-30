# OBR 004: Gestión de Estados de Artículos

## Estado
Activo

## Fecha
2025-01-27

## Descripción
Define las reglas de negocio para la gestión de estados de artículos en el sistema de backoffice, incluyendo transiciones válidas, restricciones y comportamientos esperados.

## Reglas de Negocio

### RN-EST-001: Estados Válidos
- Los artículos pueden tener únicamente dos estados: `DRAFT` y `PUBLISHED`
- Todo artículo nuevo se crea automáticamente en estado `DRAFT`
- No existen estados intermedios o adicionales

### RN-EST-002: Transiciones de Estado
- **DRAFT → PUBLISHED**: Permitido mediante acción específica de publicación
- **PUBLISHED → DRAFT**: Prohibido (transición irreversible)
- **DRAFT → DRAFT**: Permitido (guardar cambios en borrador)
- **PUBLISHED → PUBLISHED**: Sin efecto (artículo ya publicado)

### RN-EST-003: Modificaciones por Estado
- **DRAFT**: El artículo puede ser modificado ilimitadas veces
- **PUBLISHED**: El contenido no puede ser modificado (solo metadatos no críticos)

### RN-EST-004: Publicación
- La publicación es una acción irreversible
- Requiere confirmación del usuario antes de ejecutarse
- Solo disponible para artículos en estado `DRAFT`
- Debe validar que el artículo esté completo antes de publicar

## Casos de Uso

### CU-EST-001: Crear Artículo en Borrador
**Actor**: Editor de contenido  
**Descripción**: El usuario crea un nuevo artículo que se guarda automáticamente como borrador

**Flujo Principal**:
1. Usuario navega a formulario de nuevo artículo
2. Usuario completa información básica (título, contenido)
3. Usuario guarda el artículo
4. Sistema crea artículo con estado `DRAFT`
5. Sistema confirma creación exitosa

**Postcondiciones**:
- Artículo existe en sistema con estado `DRAFT`
- Artículo visible en listado con indicador de borrador

### CU-EST-002: Guardar Cambios en Borrador
**Actor**: Editor de contenido  
**Descripción**: El usuario modifica un artículo existente en estado borrador

**Flujo Principal**:
1. Usuario edita artículo en estado `DRAFT`
2. Usuario modifica contenido
3. Usuario guarda cambios
4. Sistema actualiza artículo manteniendo estado `DRAFT`
5. Sistema confirma actualización exitosa

**Postcondiciones**:
- Artículo mantiene estado `DRAFT`
- Cambios se reflejan en el contenido

### CU-EST-003: Publicar Artículo
**Actor**: Editor de contenido  
**Descripción**: El usuario publica un artículo desde estado borrador

**Precondiciones**:
- Artículo debe estar en estado `DRAFT`
- Artículo debe tener contenido mínimo requerido

**Flujo Principal**:
1. Usuario abre artículo en estado `DRAFT`
2. Usuario hace clic en botón "Publicar"
3. Sistema muestra confirmación de publicación
4. Usuario confirma acción
5. Sistema llama endpoint de publicación
6. Sistema actualiza estado a `PUBLISHED`
7. Sistema confirma publicación exitosa

**Postcondiciones**:
- Artículo cambia a estado `PUBLISHED`
- Botón de publicar ya no disponible
- Artículo visible con indicador de publicado

### CU-EST-004: Intentar Despublicar Artículo
**Actor**: Editor de contenido  
**Descripción**: El usuario intenta cambiar un artículo publicado a borrador

**Precondiciones**:
- Artículo debe estar en estado `PUBLISHED`

**Flujo Principal**:
1. Usuario intenta despublicar artículo
2. Sistema muestra error indicando que la acción no es permitida
3. Artículo mantiene estado `PUBLISHED`

**Postcondiciones**:
- Artículo permanece en estado `PUBLISHED`
- Usuario recibe mensaje de error explicativo

## Escenarios de Testing

### Escenarios Unitarios

#### TEST-EST-001: Validación de Estados
```typescript
describe('Article Status Validation', () => {
  it('should create article with DRAFT status by default', () => {
    // Test que nuevo artículo tiene status DRAFT
  });

  it('should allow DRAFT to PUBLISHED transition', () => {
    // Test transición válida DRAFT → PUBLISHED
  });

  it('should prevent PUBLISHED to DRAFT transition', () => {
    // Test que impide PUBLISHED → DRAFT
  });
});
```

#### TEST-EST-002: API de Publicación
```typescript
describe('Publish Article API', () => {
  it('should publish draft article successfully', () => {
    // Test publicación exitosa
  });

  it('should fail to publish already published article', () => {
    // Test error al intentar publicar artículo ya publicado
  });

  it('should return proper error for invalid transitions', () => {
    // Test manejo de errores de transiciones inválidas
  });
});
```

### Escenarios de Integración

#### TEST-EST-003: Flujo Completo de Edición
```typescript
describe('Article Editing Flow', () => {
  it('should allow multiple saves in draft state', () => {
    // Test múltiples guardados en DRAFT
  });

  it('should show publish button for draft articles', () => {
    // Test visibilidad de botón publicar
  });

  it('should hide publish button for published articles', () => {
    // Test ocultamiento de botón para publicados
  });
});
```

### Escenarios E2E

#### TEST-EST-004: Flujo Usuario Completo
```typescript
describe('Article Publication Flow E2E', () => {
  it('should complete full article lifecycle', () => {
    // 1. Crear artículo (DRAFT)
    // 2. Editar múltiples veces
    // 3. Publicar artículo
    // 4. Verificar que no se puede despublicar
  });

  it('should show correct status indicators', () => {
    // Test indicadores visuales de estado
  });

  it('should handle publication confirmation dialog', () => {
    // Test diálogo de confirmación de publicación
  });
});
```

## Validaciones

### VAL-EST-001: Validación de Datos
- Artículo debe tener título no vacío antes de publicar
- Artículo debe tener contenido mínimo antes de publicar
- Estado debe ser uno de los valores enum válidos

### VAL-EST-002: Validación de Permisos
- Usuario debe tener permisos de edición para modificar artículos
- Usuario debe tener permisos de publicación para publicar artículos

## Manejo de Errores

### ERR-EST-001: Errores de Transición
- **Error 400**: Transición de estado inválida
- **Error 403**: Permisos insuficientes para la acción
- **Error 404**: Artículo no encontrado
- **Error 422**: Validación de contenido falló

### ERR-EST-002: Mensajes de Usuario
- "No se puede despublicar un artículo ya publicado"
- "El artículo debe tener título y contenido para publicarse"
- "No tienes permisos para publicar artículos"

## Métricas y Monitoreo

### MET-EST-001: Métricas de Negocio
- Número de artículos en cada estado
- Tiempo promedio en estado `DRAFT` antes de publicar
- Tasa de artículos publicados vs. borradores abandonados

### MET-EST-002: Métricas Técnicas
- Tiempo de respuesta del endpoint de publicación
- Rate de errores en transiciones de estado
- Uso de la funcionalidad de publicación

## Referencias
- ADR 007: Gestión de Estados de Artículos
- API Documentation: POST /backoffice/articles/{id}/publish
- Testing Strategy: ADR 005 