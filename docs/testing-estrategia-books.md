# Estrategia de Testing para la Sección de Libros

Este documento describe la estrategia de testing para la sección de libros en el backoffice, abarcando todos sus componentes, vistas y funcionalidades.

## Índice
1. [Visión general](#visión-general)
2. [Componentes a testear](#componentes-a-testear)
3. [Estrategia por niveles](#estrategia-por-niveles)
4. [Tests unitarios](#tests-unitarios)
5. [Tests de integración](#tests-de-integración)
6. [Tests E2E](#tests-e2e)
7. [Plan de implementación](#plan-de-implementación)
8. [Cobertura objetivo](#cobertura-objetivo)

## Visión general

La sección de libros es una parte fundamental del backoffice, permitiendo la gestión completa (CRUD) de los libros del blog. Incluye las siguientes funcionalidades principales:

- Listado paginado y con búsqueda de libros
- Vista detallada de un libro individual
- Formulario de creación de nuevos libros
- Formulario de edición de libros existentes
- Eliminación de libros con confirmación

El enfoque de testing debe asegurar que cada una de estas funcionalidades opere correctamente de manera individual (tests unitarios) y en conjunto (tests de integración), así como validar los flujos completos de usuario (tests E2E).

## Componentes a testear

### Componentes de presentación
- `BookTable.vue`: Tabla que muestra la lista de libros
- `BookForm.vue`: Formulario para crear/editar libros

### Vistas
- `BooksListView.vue`: Vista del listado principal de libros
- `BookDetailView.vue`: Vista de detalles de un libro
- `BookFormView.vue`: Vista que contiene el formulario (creación/edición)

### Lógica de negocio
- `useBooks.ts`: Composable para la gestión de libros
- `booksApi.ts`: Servicios de API para libros

## Estrategia por niveles

### Nivel 1: Tests unitarios
Tests enfocados en componentes individuales y funciones específicas:
- Renderizado correcto de componentes
- Validaciones de formularios
- Formateo de datos (ISBN, fechas)
- Manejo de errores

### Nivel 2: Tests de integración
Tests que verifican la interacción entre componentes:
- Flujo de datos entre componentes padre e hijo
- Comunicación con la API
- Navegación entre vistas

### Nivel 3: Tests E2E
Tests que simulan el comportamiento del usuario final:
- Flujos completos de creación, edición, visualización y eliminación
- Búsqueda y paginación

## Tests unitarios

### BookTable.spec.ts

#### Casos de test existentes:
- Renderiza correctamente la tabla con datos
- Muestra mensaje cuando no hay libros
- Emite evento page-change al cambiar de página

#### Casos de test adicionales a implementar:
```javascript
// Funcionamiento de la paginación
it('deshabilita botones de paginación según la página actual', () => {
  // Test con primera y última página
})

// Formateo de ISBN
it('formatea correctamente ISBN-10 e ISBN-13', () => {
  // Verificar distintos formatos
})

// Modal de confirmación para eliminar
it('muestra modal de confirmación al hacer clic en eliminar', () => {
  // Verificar estado del modal y datos del libro
})

it('emite evento delete al confirmar eliminación', () => {
  // Simular confirmación y verificar emisión
})
```

### BookForm.spec.ts

#### Casos de test existentes:
- Renderiza formulario en modo creación
- Renderiza formulario en modo edición
- Muestra campos necesarios para datos del libro

#### Casos de test adicionales a implementar:
```javascript
// Validación de campos
it('valida el formato ISBN-10 correctamente', () => {
  // Test con ISBNs válidos e inválidos
})

it('valida el formato ISBN-13 correctamente', () => {
  // Test con ISBNs válidos e inválidos
})

it('muestra errores de validación cuando corresponde', () => {
  // Verificar mensajes de error
})

// Generación de UUID
it('genera un UUID al inicializar en modo creación', () => {
  // Verificar que se genera un ID válido
})

// Comportamiento de guardar
it('emite evento save con datos correctos al enviar formulario', async () => {
  // Completar formulario y enviar
})
```

## Tests de integración

### Flujo de creación de libros
```javascript
describe('Flujo de creación de libro', () => {
  it('permite crear un libro con datos válidos', async () => {
    // Montar vista completa
    // Completar formulario
    // Simular envío
    // Verificar redirección y notificación
  })
  
  it('muestra errores de validación con datos inválidos', async () => {
    // Montar vista completa
    // Enviar datos inválidos
    // Verificar mensajes de error
  })
})
```

### Flujo de listado y filtrado
```javascript
describe('Listado de libros con filtros', () => {
  it('muestra resultados filtrados al usar búsqueda', async () => {
    // Setup mock API
    // Montar vista
    // Realizar búsqueda
    // Verificar resultados filtrados
  })
  
  it('maneja correctamente la paginación', async () => {
    // Setup con múltiples páginas
    // Verificar cambio de página y actualización de datos
  })
})
```

### Flujo de edición y visualización
```javascript
describe('Visualización y edición de libro', () => {
  it('carga y muestra datos del libro correctamente', async () => {
    // Mock API con datos de libro
    // Verificar renderizado en detalle
  })
  
  it('permite editar y guardar cambios', async () => {
    // Mock API con libro existente
    // Modificar campos
    // Guardar cambios
    // Verificar petición API y notificación
  })
})
```

## Tests E2E

Los tests E2E deben cubrir los siguientes flujos completos:

### Flujo principal CRUD
```javascript
describe('Flujo completo CRUD de libros', () => {
  it('permite crear, ver, editar y eliminar un libro', async () => {
    // Crear libro nuevo
    // Verificar aparece en listado
    // Ver detalles
    // Editar libro
    // Verificar cambios
    // Eliminar libro
    // Verificar eliminación
  })
})
```

### Casos límite y manejo de errores
```javascript
describe('Manejo de errores en libros', () => {
  it('muestra mensaje adecuado cuando falla la carga', async () => {
    // Simular error de API
    // Verificar mensaje de error
  })
  
  it('maneja error de ISBN duplicado', async () => {
    // Intentar crear libro con ISBN existente
    // Verificar mensaje específico
  })
})
```

## Consideraciones específicas

### Tests de validación de ISBN
La funcionalidad de validación de ISBN es crítica y debe tener pruebas exhaustivas:

```javascript
describe('Validación de ISBN', () => {
  it.each([
    // Array de casos de prueba
    ['1234567890', true],   // ISBN-10 válido
    ['123456789X', true],   // ISBN-10 válido con X
    ['1234567899', false],  // ISBN-10 inválido
    ['9781234567897', true],   // ISBN-13 válido
    ['9781234567896', false],  // ISBN-13 inválido
  ])('valida correctamente ISBN %s como %s', (isbn, expected) => {
    // Validar con la función correspondiente
  })
})
```

### Tests de formateo de ISBN
```javascript
describe('Formateo de ISBN', () => {
  it('formatea correctamente ISBN-10', () => {
    const result = formatIsbn('1234567890');
    expect(result).toEqual('1-23-456789-0');
  })
  
  it('formatea correctamente ISBN-13', () => {
    const result = formatIsbn('9781234567897');
    expect(result).toEqual('978-1-23-456789-7');
  })
})
```

### Tests de integración con artículos relacionados
```javascript
describe('Relación entre libros y artículos', () => {
  it('muestra artículos relacionados en vista de detalle', async () => {
    // Setup mock con relaciones
    // Verificar visualización
  })
})
```

## Plan de implementación

### Fase 1: Completar tests unitarios (Prioridad Alta)
- Asegurar cobertura >80% en componentes principales
- Priorizar validación de ISBN y lógica de negocio

### Fase 2: Implementar tests de integración (Prioridad Media)
- Testear flujos principales entre componentes
- Validar comunicación con API

### Fase 3: Configurar tests E2E (Prioridad Baja)
- Simular flujos completos de usuario
- Validar integración con sistema completo

## Cobertura objetivo

| Componente | Cobertura objetivo |
|------------|-------------------|
| BookTable | 85% |
| BookForm | 90% |
| BookFormView | 80% |
| BookDetailView | 75% |
| BooksListView | 75% |
| useBooks | 90% |
| booksApi | 85% |
| Validación ISBN | 100% |

## Mejores prácticas

1. **Aislamiento adecuado**: Utilizar mocks para API y componentes externos.
2. **Tests deterministas**: Evitar dependencias del tiempo o estado global.
3. **Fixtures reutilizables**: Crear datos de prueba consistentes.
4. **Organización clara**: Seguir patrón AAA (Arrange, Act, Assert).
5. **Mantener actualizado**: Actualizar tests al cambiar código.

## Infraestructura de testing

- **Vitest**: Para tests unitarios y de integración
- **Testing Library**: Para simular interacciones de usuario
- **MSW (Mock Service Worker)**: Para mockear peticiones API
- **Cypress**: Para tests E2E (futura implementación)

## Conclusión

Esta estrategia de testing proporciona un enfoque completo para asegurar la calidad de la sección de libros, cubriendo desde pruebas unitarias hasta flujos completos de usuario. La implementación gradual por fases permite priorizar aspectos críticos mientras se mantiene una cobertura adecuada en todos los componentes.
