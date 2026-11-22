# Tino - African Stories
ASP.NET Core 10 backend for an Angular PWA covering books, audio, animation and learning.

## Status
Implemented: Angular PWA experience, audio narration, animated story pages, ASP.NET Core API foundation, Swagger/OpenAPI (development only), liveness/readiness, published catalogue endpoints, SQL Server EF model and initial migration. Authentication, purchasing and a production media pipeline are still planned.
See [deployment setup](docs/DEPLOYMENT.md). Cloud resources have not been created yet.

## Quick start (PowerShell from this folder)
Prerequisites: .NET SDK 10.0.401 (or compatible patch), SQL Server and optional SSMS.
```powershell
dotnet restore Tino.sln --locked-mode
dotnet tool restore
dotnet build Tino.sln --no-restore
dotnet test Tino.sln --no-restore
dotnet run --project backend/src/Tino.Api --no-build --launch-profile http
```
Open http://localhost:5199/swagger. The development HTTP profile is loopback-only and currently serves public catalogue metadata. Use HTTPS when authentication is added.

## SQL Server
Development configuration targets localhost / Tino_Development with Windows authentication. Override without committing secrets:
```powershell
$env:ConnectionStrings__Tino = 'Server=YOUR_INSTANCE;Database=Tino_Development;Integrated Security=True;Encrypt=True;TrustServerCertificate=True;Connect Timeout=5'
.\scripts\Invoke-Ef.ps1 database update
```
TrustServerCertificate=True is local-development-only; production requires a trusted certificate. Do not disable server encryption to work around the current execution-environment issue. Connect through SSMS under your normal Windows account to confirm the intended instance, then run the migration in a normal terminal. No existing unrelated database should be used.

The application does not automatically migrate or seed at startup. The SQL script at docs/database/InitialCatalogue.sql is idempotent and can be reviewed in SSMS against the intended, separately created database. Do not apply both approaches to different target databases accidentally.

## Restricted/offline restore used during this session
```powershell
dotnet restore Tino.sln --source "$env:USERPROFILE\.nuget\packages" -p:NuGetAudit=false
dotnet build Tino.sln --no-restore
```
This requires the same cached packages and is not a replacement for normal restore. NuGet network access was blocked. Vulnerability auditing was not performed; re-run normal restore/audit when network access is available. Package lock files are committed inputs for reproducibility.

## Documentation
- [Product plan](docs/PROJECT_PLAN.md)
- [Architecture and decisions](docs/ARCHITECTURE.md)
- [Database](docs/DATABASE.md)
- [API](docs/API.md)
- [Testing](docs/TESTING.md)
- [Progress](docs/PROGRESS.md)
- [Changelog](docs/CHANGELOG.md)

## Working agreement
Each meaningful code change updates relevant docs and progress. Record actual test results, separate implemented features from planned features, and document unresolved blockers. Next milestone: resolve SQL connectivity, then Identity and protected editorial operations.


## Angular frontend (added)
The frontend is now implemented in frontend/. See frontend/README.md and docs/UI_UX.md.
From frontend, run npm ci then npm start normally. In this restricted environment, npm run build:preview then npm run preview runs the Angular AOT preview at http://127.0.0.1:4200.
The earlier backend-only status describes the initial milestone; frontend progress is now tracked in docs/PROGRESS.md. Authentication, purchases and media remain pending.

## Animation milestone
The /animation page now has a playable motion storyboard and local video preview. See docs/ANIMATION.md and docs/ANIMATION_PRODUCTION.md.
For an optimised production build, run `npm ci` and `npm run build` in `frontend/`. The output is `frontend/dist/tino/browser`.

