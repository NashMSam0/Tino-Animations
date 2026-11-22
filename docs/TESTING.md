# Validation — 16 November 2026
## Commands
dotnet build Tino.sln --no-restore
dotnet test Tino.sln --no-restore
Start API, then run scripts/Test-Smoke.ps1.

## Verified
- Solution builds with zero warnings/errors.
- Nine automated tests pass: draft defaults/normalisation, four invalid slug cases, publication/archive behaviour, missing catalogue 404, SQL model uniqueness/length constraints, pagination bounds.
- Swagger UI responds 200; OpenAPI includes all four implemented paths.
- Liveness succeeds; invalid pagination returns 400.

Tests inspect the SQL model without connecting. They are not SQL-backed integration tests. scripts/Test-Smoke.ps1 explicitly warns when readiness returns 503.

## Blocked / pending
Applying migration and SQL-backed catalogue integration require a working SQL connection. Failed in this execution environment on encryption support.
Network NuGet audit was unavailable; offline restore used NuGetAudit=false only for that invocation. Normal connected restore/audit remains required before release.
Angular/PWA, identity, payments, media and accessibility tests are pending because these features do not exist yet.

Future tests: draft exclusion against real SQL, unique slug enforcement, migrations on fresh database; account isolation; signed/idempotent payment webhooks; offline restart/eviction/account switching; captions and keyboard; backup restore.

