# ADR 008: Gestión de Series en el Backoffice

## Contexto
El backend ha añadido la entidad "Serie" y los artículos pueden asociarse a una serie. Es necesario gestionar series desde el backoffice.

## Decisión
- Se implementará la gestión CRUD de series (crear, editar, eliminar, listar, ver detalle).
- Los artículos podrán asociarse a una única serie (opcional).
- La gestión de series seguirá la arquitectura y patrones usados en la gestión de libros (books).

## Consecuencias
- Se añaden vistas, API y lógica de negocio para series.
- Se actualizan formularios de artículos para permitir asociar una serie.
- Se añaden tests unitarios y e2e para la nueva funcionalidad.

---
