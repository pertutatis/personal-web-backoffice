# OBR 005: Reglas de negocio y casos de uso para Series

## Casos de uso
- Crear una serie
- Editar una serie
- Eliminar una serie
- Listar series
- Ver detalle de una serie
- Asociar/desasociar una serie a un artículo (al crear/editar)

## Edge cases
- No se puede crear una serie sin título
- El título no puede superar 100 caracteres
- La descripción es opcional, máximo 500 caracteres
- No se puede eliminar una serie si hay artículos asociados (opcional, depende de backend)
- Un artículo solo puede tener una serie
- La serie asociada puede ser nula

## Escenarios de test
- Crear serie válida
- Crear serie sin título (error)
- Editar serie cambiando título y descripción
- Eliminar serie sin artículos asociados
- Asociar serie a artículo al crear
- Cambiar serie de un artículo existente
- Desasociar serie de un artículo
