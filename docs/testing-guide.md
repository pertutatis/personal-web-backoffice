# Guía de Testing para Personal Web Backoffice

Esta guía describe la estrategia de testing implementada en el proyecto Personal Web Backoffice.

## Tipos de Tests

### 1. Tests Unitarios

Los tests unitarios están escritos con Vitest y Vue Test Utils. Estos tests verifican el funcionamiento correcto de componentes individuales, composables, stores y utilidades.

#### Estructura de Tests Unitarios

```
tests/
└── unit/
    ├── components/
    │   ├── ui/
    │   ├── articles/
    │   └── books/
    ├── composables/
    ├── stores/
    └── utils/
```

#### Ejecución de Tests Unitarios

```bash
# Ejecutar todos los tests unitarios
npm run test:unit

# Ejecutar tests con cobertura
npm run test:unit:coverage

# Ejecutar tests en modo watch
npm run test:unit:watch
```

### 2. Tests de Integración

Los tests de integración verifican la interacción entre diferentes partes del sistema, principalmente:

- Flujos de formularios completos
- Interacción con la API
- Gestión de estado global

#### Estructura de Tests de Integración

```
tests/
└── integration/
    ├── articles/
    ├── books/
    └── dashboard/
```

#### Ejecución de Tests de Integración

```bash
# Ejecutar todos los tests de integración
npm run test:integration
```

### 3. Tests E2E

Los tests E2E verifican los flujos completos de usuario de principio a fin, simulando interacciones reales en un navegador.

#### Estructura de Tests E2E

```
tests/
└── e2e/
    ├── articles.spec.ts
    ├── books.spec.ts
    └── dashboard.spec.ts
```

#### Ejecución de Tests E2E

```bash
# Ejecutar todos los tests E2E
npm run test:e2e
```

## Mocks y Stubs

### API Mocks

Utilizamos MSW (Mock Service Worker) para interceptar y simular respuestas de API durante los tests:

```typescript
// tests/mocks/handlers.ts
import { rest } from 'msw'

export const handlers = [
  rest.get('/api/blog/articles', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        data: [
          // Datos simulados de artículos
        ],
        pagination: {
          page: 1,
          limit: 10,
          total: 12
        }
      })
    )
  }),
  // Otros handlers...
]
```

## Convenciones de Naming

- Los archivos de test deben terminar en `.spec.ts` o `.test.ts`
- Cada test unitario debe probar una única funcionalidad
- Utilizar la convención BDD (describe, it) para organizar los tests

## Buenas Prácticas

1. **Independencia**: Los tests no deben depender unos de otros
2. **Determinismo**: Los tests siempre deben producir el mismo resultado bajo las mismas condiciones
3. **Aislamiento**: Usar mocks y stubs para aislar el código que se está probando
4. **Claridad**: Los nombres de los tests deben describir claramente lo que se está probando
5. **Cobertura**: Aspirar a una cobertura mínima del 80% en código crítico

## CI/CD

Los tests se ejecutan automáticamente en CI/CD utilizando GitHub Actions:

- Los tests unitarios y de integración se ejecutan en cada pull request
- Los tests E2E se ejecutan antes de cada despliegue a producción

## Troubleshooting

### Problemas comunes y soluciones

1. **Tests timeout**:
   - Incrementar el timeout en la configuración de Vitest
   - Revisar operaciones asíncronas sin resolver

2. **Errores de estado global**:
   - Asegurarse de resetear el estado entre tests
   - Usar `createPinia()` fresco para cada test

3. **Errores de componentes**:
   - Verificar que todos los providers necesarios estén disponibles en la configuración del test
