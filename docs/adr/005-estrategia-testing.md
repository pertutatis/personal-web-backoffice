# ADR 005: Estrategia de Testing y Garantía de Calidad

## Estado
Aceptado

## Fecha
2025-04-12

## Contexto
Para garantizar la calidad del backoffice y minimizar regresiones durante el desarrollo, necesitamos una estrategia de testing completa que cubra diferentes niveles de la aplicación, desde unidades individuales hasta flujos completos de usuario.

## Decisión
Implementaremos una estrategia de testing en pirámide con tres niveles principales:

1. **Tests Unitarios** (Vitest + Vue Test Utils):
   - Cobertura de lógica de negocio (composables, stores, utilidades)
   - Tests de componentes aislados
   - Validación de esquemas y reglas de negocio
   - Mocking de dependencias externas

2. **Tests de Integración** (Vitest + Vue Test Utils + MSW):
   - Interacción entre componentes
   - Flujos de formularios completos
   - Integración con API (usando mocks)
   - Validación de estado global

3. **Tests End-to-End** (Cypress):
   - Flujos críticos de usuario completos
   - Navegación entre páginas
   - Simulación de errores de red
   - Tests de accessibilidad

## Métricas y Objetivos
- **Cobertura mínima**: 80% en código de producción
- **Tests por tipo**: 70% unitarios, 20% integración, 10% E2E
- **Rendimiento**: Suite completa < 5 minutos en CI

## Implementación en CI/CD
- **Pre-commit**: Linting + tests unitarios afectados
- **CI completo**: Toda la suite de tests
- **Entorno de staging**: Tests E2E adicionales

## Consecuencias

### Positivas
- **Confianza en cambios**: Reducción de regresiones
- **Documentación viva**: Tests como documentación de comportamiento
- **Refactorización segura**: Red de seguridad para cambios
- **Detección temprana**: Problemas identificados en fases iniciales
- **Buenas prácticas**: Tests fomentan diseño modular y desacoplado

### Negativas
- **Tiempo de desarrollo**: Overhead inicial por escritura de tests
- **Mantenimiento**: Los tests también requieren mantenimiento
- **Falsos positivos**: Tests frágiles pueden generar ruido

## Alternativas Consideradas

### 1. Testing manual exclusivamente
Rechazada por ser no escalable y propensa a errores con el crecimiento del proyecto.

### 2. Solo tests E2E
Rechazada por ser lentos, frágiles y no identificar problemas específicos con facilidad.

### 3. Testing basado en snapshots
Considerado como complemento, no como estrategia principal, debido a su tendencia a generar falsos positivos.
