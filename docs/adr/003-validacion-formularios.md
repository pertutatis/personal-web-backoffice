# ADR 003: Sistema de Validación y Formularios con Vee-Validate y Zod

## Estado
Aceptado

## Fecha
2025-04-12

## Contexto
El backoffice requiere múltiples formularios para la creación y edición de artículos y libros. Estos formularios necesitan validación robusta, manejo de errores eficiente y una buena experiencia de usuario. Además, necesitamos garantizar que los datos enviados a la API cumplan con los esquemas esperados.

## Decisión
Implementaremos un sistema de validación basado en la combinación de:

1. **Vee-Validate** para la gestión de formularios:
   - Manejo de estado de formularios
   - Validación en tiempo real
   - Integración con componentes Vue
   - Manejo de errores a nivel de campo

2. **Zod** para la definición de esquemas y validación:
   - Definición de esquemas tipados
   - Validación estructural de datos
   - Inferencia de tipos TypeScript
   - Serialización/deserialización de datos
   - Validaciones personalizadas (ej. ISBN)

3. **Integración entre ambos**:
   - Schemas Zod como fuente única de verdad
   - Vee-Validate para manejo UI de la validación
   - Tipado end-to-end desde formulario hasta API

## Patrón de Implementación

```typescript
// 1. Definir esquema con Zod
const articleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(3).max(100),
  content: z.string().min(10),
  publishedAt: z.date().optional(),
  relatedBookIds: z.array(z.string().uuid()).optional()
});

// 2. Derivar tipo TypeScript
type Article = z.infer<typeof articleSchema>;

// 3. Usar en formulario con Vee-Validate
const { handleSubmit } = useForm({
  validationSchema: toTypedSchema(articleSchema)
});
```

## Consecuencias

### Positivas
- **Type Safety**: Tipado fuerte desde UI hasta API
- **DRY**: Definición única de esquemas y tipos
- **UX mejorada**: Validación en tiempo real con feedback inmediato
- **Prevención de errores**: Validación tanto en cliente como previa al envío
- **Escalabilidad**: Fácil extensión para nuevos tipos de validación

### Negativas
- **Bundle size**: Dos librerías añaden peso al bundle 
- **Complejidad**: La integración entre librerías añade complejidad
- **Curva de aprendizaje**: El equipo debe familiarizarse con ambas APIs

## Alternativas Consideradas

### 1. Solo Vee-Validate
Rechazada porque no proporciona inferencia de tipos TypeScript tan robusta como Zod.

### 2. Validación manual
Rechazada por la alta probabilidad de errores y la cantidad de código boilerplate necesario.

### 3. FormKit
Considerada, pero rechazada por ser menos flexible en proyectos de escala empresarial y tener menor integración con TypeScript.
