# Frontend implementation — 16 November 2026
Visual system: cream background, burgundy actions, gold accents, editorial serif headings and system sans-serif body. Original landscape SVG and decorative book covers. Responsive layouts at 900px and 600px; visible keyboard focus, skip link, accessible control names and reduced-motion support.

Routes:
- / — discovery and four divisions
- /explore — title/theme/keyword search
- /story/:slug — details, availability, save
- /library — locally saved reading list
- /read/if-only-i-had-known — selected passages from pages 20–21
- /audio and /animation — explicitly unavailable future editions
- /learning — sample family discussion activity

Reader supports previous/next, arrow-key navigation when not editing/focusing a control, two font sizes and browser-local position. Library saves are distinct from purchases. No sign-in, payments or playback exist.

API integration uses /api/v1/stories with a timeout and sample fallback; no fabricated live success. Backend unavailable message is in the collection status. Development proxy keeps browser requests same-origin.

PWA manifest/service-worker config exists for standard production builds. The tested portable AOT preview does not register a worker; offline reading is not claimed. The browser preview was inspected at a narrow mobile width. Wider layouts remain defined by CSS but require additional visual QA.

