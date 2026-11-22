# Project plan — version 0.1
16 November 2026. Tino is the project name; African Stories is a working brand.

## Vision
A shared storytelling platform preserving African stories and creating commercial opportunities for authors, illustrators, narrators, animators and educators.

| Division | Offering |
|---|---|
| Publishing | Illustrated books and independent authors |
| Audio | Audiobooks and narrated stories |
| Animation | Animated films and episodes |
| Learning | Story-based resources for families and schools |

One account, catalogue, checkout and library across all divisions. A story can have one or several editions; only available formats should appear. A purchase grants explicit editions, not all future adaptations automatically.

## Stack and product boundaries
ASP.NET Core Web API, Swagger UI/OpenAPI, SQL Server managed through SSMS, Angular PWA. Begin with curated individual purchases. Schools, subscriptions and creator self-service come later. Animation/narration production is a separate workflow from hosting the finished media.

## Screen layout
| Screen | Content |
|---|---|
| Home | Featured stories, continue reading/listening, new releases, four divisions |
| Explore | Search, language, genre, format and age filters |
| Story details | Synopsis, credits, preview, formats, prices, bundle contents |
| Checkout | Chosen product, currency, total and payment status |
| My Library | Owned editions, progress and downloads |
| Reader | Page/text mode, contents, zoom, bookmarks and download |
| Audio | Chapters, seek, speed and resume |
| Animation | Episodes, captions, quality and resume |
| Learning | Activities, age guidance and learning goals |
| Account | Profile, orders, preferences and help |
| Administration | Stories, editions, media, rights, products, users, orders and reports |

Mobile navigation: Home, Explore, My Library, Account. Desktop adds Books, Audio, Animation and Learning.

Journey: discover → preview → choose format or bundle → verified payment → library → read/listen/watch as entitled. Pending payment must not unlock content.

## Visual direction
Use the supplied illustrated pages as references: cream, deep red, gold and expressive artwork, with restrained ornamental borders. Preserve the authored page composition with fit-to-width and zoom. Add a separate approved accessible text view with adjustable fonts and image descriptions. Store explicit page numbers; the supplied pages are 20 and 21 and should not be sequenced by upload order. Images are references, not evidence of complete content or distribution rights.

## Release one
Catalogue, account access, previews, purchases, library, book reader, bookmarks/progress, audio/video streaming, offline books, administrator publishing and basic story-linked learning resources.

## Roadmap
| Phase | Deliverables | Exit gate |
|---|---|---|
| Foundation | Backend structure, Swagger, SQL model/migrations, health | Build/tests and working SQL connection |
| Accounts/editorial | Identity, roles, secure admin publishing | Reader cannot modify content; editor permissions tested |
| Reading slice | Angular catalogue and reader | One published book works on phone/desktop and keyboard |
| Commerce | Products, payments, entitlements | Verified payment grants exactly purchased editions once |
| Multimedia/offline | Audio/video, progress sync, book downloads | Resume works; complete downloaded book opens offline |
| Launch | Accessibility, security, recovery and monitoring | Pilot purchase/read/listen/watch and restore checks pass |
| Expansion | Creators, royalties, schools, families, subscriptions | Separate acceptance criteria for each |

These are phases, not promised calendar dates. Estimate after team capacity, catalogue size and integrations are established.

## Offline approach
Cache the app shell and explicitly downloaded purchased books. Initial download needs internet and verified entitlement. Verify all required files before marking complete. Handle quota, eviction, interrupted downloads, retries, deletion and account switching. Queue progress with operation IDs and conflict rules. Audio/video stay online in release one. Browser storage is not permanent; offline access cannot be instantly revoked on disconnected devices or guaranteed copy-proof.

## Commerce and creators
Story → Edition (language/format/version) → Product (single or bundle) → Entitlement. Snapshot bundle editions at purchase. Verify signed payment webhooks, amount, currency and order; process idempotently in a transaction. Handle refunds, chargebacks, reconciliation and pending payments. Do not grant content on a browser redirect. Record creator credits and rights agreements; royalty rates/allocations require agreed commercial rules.

## Decisions outstanding
Public brand, launch countries/currencies, languages, pricing, payment provider/merchant eligibility, rights and creator terms, hosting budget, initial catalogue, school launch requirements. These do not prevent backend foundation. Start with adult purchasers; child/school data needs a dedicated access and privacy design.

## Documentation policy
Maintain README, project plan, architecture/decisions, database/migrations, API/OpenAPI, testing, progress and changelog. Add UI/UX and deployment guides as those components are implemented. A task is done when code, appropriate checks and documentation agree.

