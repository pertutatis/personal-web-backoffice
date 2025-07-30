# ADR 007: Gestión de Estados de Artículos

## Estado
Aceptado

## Fecha
2025-01-27

## Contexto
El backend ha implementado un sistema de estados para los artículos que permite gestionar el ciclo de vida de publicación. Los artículos pueden estar en estado `draft` (borrador) o `published` (publicado), con reglas específicas de transición entre estados.

## Problema
Necesitamos implementar en el frontend la gestión de estados de artículos que permita:
- Guardar artículos en estado borrador múltiples veces
- Publicar artículos desde estado borrador
- Prevenir la reversión de artículos publicados a borrador
- Mostrar el estado actual de cada artículo en el listado
- Proporcionar interfaz para publicar artículos

## Decisión
Implementaremos un sistema de gestión de estados de artículos que:

1. **Estados Soportados**:
   - `DRAFT`: Artículo en borrador, puede ser modificado
   - `PUBLISHED`: Artículo publicado, no puede volver a borrador

2. **Reglas de Transición**:
   - Nuevos artículos se crean en estado `DRAFT` por defecto
   - Se puede guardar en `DRAFT` ilimitadas veces
   - `DRAFT` → `PUBLISHED`: Permitido mediante endpoint específico
   - `PUBLISHED` → `DRAFT`: No permitido (irreversible)

3. **Interfaz de Usuario**:
   - Indicador visual de estado en ArticleTable
   - Botón "Publicar" en ArticleForm cuando el artículo está en `DRAFT`
   - Deshabilitación del botón de publicar para artículos ya publicados

4. **API Integration**:
   - Nuevo endpoint: `POST /backoffice/articles/{id}/publish`
   - Actualización de tipos TypeScript para incluir estados
   - Manejo de errores específicos para transiciones inválidas

## Implementación Técnica

### Tipos TypeScript
```typescript
export enum ArticleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export interface Article extends BaseModel {
  // ... existing fields
  status: ArticleStatus
}
```

### API Service
```typescript
export const articlesApi = {
  // ... existing methods
  publishArticle(id: string): Promise<Article> {
    return httpClient.post<Article>(`${ARTICLES_ENDPOINT}/${id}/publish`);
  }
}
```

### Componentes UI
- ArticleTable: Badge para mostrar estado
- ArticleForm: Botón condicional de publicación
- ArticleDetailView: Información de estado

## Testing
- Tests unitarios para reglas de negocio de estados
- Tests de integración para API de publicación
- Tests E2E para flujo completo de publicación

## Consecuencias

### Positivas
- **Control de publicación**: Flujo claro para publicar contenido
- **Prevención de errores**: No se puede despublicar accidentalmente
- **Feedback visual**: Estado claro en la interfaz
- **Flexibilidad**: Múltiples borradores antes de publicar

### Negativas
- **Complejidad adicional**: Más lógica de estado a mantener
- **Irreversibilidad**: No se puede despublicar (por diseño)
- **Testing adicional**: Más casos de prueba requeridos

## Alternativas Consideradas

### 1. Estados adicionales (archived, scheduled)
Rechazada por complejidad innecesaria para MVP.

### 2. Permitir despublicar artículos
Rechazada por requerimientos específicos del backend.

### 3. Implementación solo en frontend
Rechazada porque el backend ya maneja la lógica de estados.

## Referencias
- OBR 004: Reglas de Negocio para Estados de Artículos
- Documentación API: /backoffice/articles/{id}/publish
- ADR 001: Arquitectura Frontend 