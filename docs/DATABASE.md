# Database
## Implemented
EF Core context: Tino.Infrastructure.TinoDbContext.
Initial migration: InitialCatalogue, with matching model snapshot.
Target development database: Tino_Development on localhost (configurable).

catalogue.Stories:
- Id: uniqueidentifier, primary key.
- Title: nvarchar(200), required.
- Slug: nvarchar(200), required, unique.
- Synopsis: nvarchar(4000), required.
- IsPublished: bit; new domain stories are drafts.
- CreatedAt: datetimeoffset, UTC.
- Composite lookup index: IsPublished, Title, Id.
EF maintains its migration history table.

Published catalogue queries exclude drafts and archived records. No seed data is included; the supplied images were not imported as a complete licensed story.

## Commands
Build before invoking scripts/Invoke-Ef.ps1. It uses the cached EF Tools 10.0.14 runner if available, otherwise the pinned local dotnet-ef tool.
- migrations add NAME --output-dir Persistence/Migrations
- migrations script --idempotent --output docs/database/InitialCatalogue.sql
- database update
- migrations has-pending-model-changes

## Current limitation
Migration and idempotent SQL script generated. Applying migration failed before a successful connection: SQL client reports the server requires encryption that this execution environment cannot support. No successful database creation/application claimed. Do not weaken server encryption; verify the intended instance through normal SSMS/terminal access.

## Future entities
Identity users/roles; StoryContributor/Creator; RightsAgreement; Edition; Chapter; BookPage; AudioTrack; VideoEpisode; MediaAsset; Product/ProductEdition/ProductPrice; Order/OrderItem/OrderItemEdition; Payment/PaymentEvent; Entitlement; ReadingProgress/PlaybackProgress; Bookmark; LearningResource; AuditLog.

A story is the work, an edition is a language/format/version, a product defines sale contents and an entitlement grants access. Snapshot order prices/currencies and included editions. Enforce unique provider event IDs, foreign keys, bounded strings, decimal money, UTC times and optimistic concurrency. Store files outside SQL. Preserve financial and rights history.

