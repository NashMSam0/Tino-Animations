# Architecture
## Accepted user choices
ASP.NET Core API, Swagger documentation/testing, SQL Server, SSMS and Angular frontend/PWA.

## D001 — Modular monolith (proposed baseline, implemented skeleton)
One API with separate Domain, Application and Infrastructure projects. Domain owns story rules. Application declares catalogue contracts. Infrastructure implements them using EF Core SQL Server. API composes services and exposes controllers. Avoid separate services for the four business divisions.

## D002 — Swagger UI
Swashbuckle.AspNetCore 10.3.1 is pinned and supports net10.0. Swagger and the root redirect exist only in Development. XML controller comments feed OpenAPI. Production docs are not exposed. References:
- https://learn.microsoft.com/en-us/aspnet/core/tutorials/web-api-help-pages-using-swagger
- https://www.nuget.org/packages/Swashbuckle.AspNetCore/10.3.1

## D003 — Versions and environment
SDK 10.0.401, EF Core 10.0.14, Swashbuckle 10.3.1. Local cache used because network restore was blocked. These are pinned working versions, not a claim that every dependency is the latest. Infrastructure and tests reference the ASP.NET shared framework, which supplies Microsoft.Extensions assemblies available with the installed runtime. Domain/Application remain independent.

## D004 — Operational behaviour
Console logging avoids requiring Windows Event Log write permission. Liveness does not depend on SQL; readiness checks connectivity and catalogue table. Database migrations are explicit deployment steps, never automatic startup changes. Unexpected failures return ProblemDetails without exposing connection details.

## Planned security and media
Identity with secure HttpOnly cookies for same-origin Angular, CSRF protection and server-side authorisation; admin MFA before launch. Private object storage holds media; SQL holds metadata. Protected delivery issues short-lived access after checking ownership. Background jobs process large media. Never add public upload/write endpoints before authentication and role checks.

No cloud hosting, payment, email, authentication, storage or frontend integration is implemented yet.

