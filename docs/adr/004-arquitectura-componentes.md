# ADR 004: Arquitectura de Componentes y Sistema de Diseño

## Estado
Aceptado

## Fecha
2025-04-12

## Contexto
Para crear una interfaz de usuario coherente, mantenible y escalable en el backoffice, necesitamos definir una arquitectura de componentes clara y un sistema de diseño que facilite el desarrollo y garantice la consistencia visual.

## Decisión
Implementaremos un sistema de componentes jerárquico con tres niveles principales:

1. **Componentes Base (Atómicos)**:
   - Componentes UI fundamentales (Button, Input, Select, etc.)
   - Estilizados con Tailwind CSS
   - API consistente y documentada
   - Accesibles y conformes con WAI-ARIA
   - Adaptables a tema claro/oscuro

2. **Componentes Compuestos (Moleculares)**:
   - Combinación de componentes base (FormField, DataTable, Modal, etc.)
   - Encapsulan patrones de interacción comunes
   - Reutilizables en diferentes contextos

3. **Componentes de Página (Organismos)**:
   - Específicos para cada funcionalidad (ArticleList, BookForm, etc.)
   - Compuestos por componentes base y compuestos
   - Conectados con la lógica de negocio a través de composables

## Sistema de Diseño
- **Tokens de Diseño**: Variables CSS para colores, espaciado, tipografía
- **Tema Dual**: Claro/oscuro con transiciones suaves
- **Consistencia**: Mismo patrón de interacción para operaciones similares
- **Responsive**: Mobile-first con breakpoints definidos
- **Escalas tipográficas**: Sistema coherente de tamaños de texto

## Implementación con Tailwind CSS

```typescript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          // ... otros tonos
          900: 'var(--color-primary-900)',
        },
        // ... otros grupos de colores
      },
      // ... otras extensiones
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
```

## Consecuencias

### Positivas
- **Coherencia visual**: Interfaz consistente en toda la aplicación
- **Reutilización**: Componentes compartidos reducen duplicación
- **Mantenibilidad**: Cambios de estilo centralizados
- **Productividad**: Desarrollo más rápido con componentes predefinidos
- **Accesibilidad**: Integrada desde el nivel más bajo

### Negativas
- **Overhead inicial**: Tiempo dedicado a crear el sistema de componentes
- **Cumplimiento**: Necesidad de adherirse a los patrones definidos
- **Documentación**: Requiere mantener documentación actualizada

## Alternativas Consideradas

### 1. Componentes ad-hoc sin sistema formal
Rechazada por problemas de mantenibilidad y consistencia a largo plazo.

### 2. Biblioteca UI externa (Vuetify, PrimeVue, etc.)
Rechazada porque limita la personalización y aumenta el tamaño del bundle.

### 3. CSS puro o preprocesadores (SCSS) sin utilidades
Rechazada por menor productividad y mayor probabilidad de inconsistencias.
