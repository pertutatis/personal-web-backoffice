# API Series

## Modelo Serie
```json
{
  "id": "string (uuid)",
  "title": "string (max 100)",
  "description": "string (max 500)"
}
```

## Endpoints
- GET    /backoffice/series
- POST   /backoffice/series
- GET    /backoffice/series/{id}
- PUT    /backoffice/series/{id}
- DELETE /backoffice/series/{id}

## Artículo
- Campo opcional: `seriesId` (uuid | null)
- Se puede asociar/desasociar al crear/editar artículo
