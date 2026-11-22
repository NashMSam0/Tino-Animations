# API — implemented endpoints
Base: http://localhost:5199 (Development HTTP profile).
Swagger: /swagger
OpenAPI JSON: /swagger/v1/swagger.json

| Method | Route | Behaviour |
|---|---|---|
| GET | /api/v1/health/live | 200 Healthy while API responds; no SQL dependency |
| GET | /api/v1/health/ready | 200 if SQL catalogue schema accessible; 503 otherwise |
| GET | /api/v1/stories?page=1&pageSize=20 | Published stories, page/pageSize/totalCount |
| GET | /api/v1/stories/{slug} | Published story or 404; drafts not disclosed |

page: 1–10000; pageSize: 1–100. Invalid pagination returns 400 ValidationProblemDetails before a SQL query. Lists use Title then Id for stable ordering. Unexpected query failures return 500 ProblemDetails; readiness explicitly returns 503.

StorySummary fields: id, title, slug, synopsis.
StoryPage fields: items, page, pageSize, totalCount.
No mutation, authentication, checkout or media endpoints exist yet. Public catalogue metadata is intentional; do not add private content to these DTOs.

Planned contracts: /auth, /me/library, /orders, verified payment webhooks, edition manifests, authorised asset access, progress and protected /admin routes. Document and test each before marking it implemented.

