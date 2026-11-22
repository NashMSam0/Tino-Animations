# Tino Angular frontend
Angular 22.2.2, TypeScript 6.0.3, Node 24.21.0.

## Normal development
From frontend:
npm ci
npm start
Open http://127.0.0.1:4200.
The CLI proxies /api requests to the ASP.NET Core service on port 5199.
npm run build generates the production app, manifest and Angular service worker.

## Portable development preview
npm run build:preview
npm run preview
This uses Angular's AOT compiler directly and serves browser ES modules with an import map. It avoids the native esbuild directory traversal that is blocked in this execution environment. It is a genuine Angular app, not a static mockup. Its service worker is disabled; do not treat it as a production-optimised or offline-ready build. Start the backend separately.

## Implemented
Responsive home, catalogue search, story details, saved reading list, two-page text excerpt, font-size controls, persisted reading position, learning discussion prompt, and honest audio/animation availability screens.
Save state and reading position use localStorage on this browser. This is not authentication, purchase ownership or server-synchronised storage.
Live catalogue GET is integrated with a six-second timeout and explicitly labelled sample fallback. Published entries appear with samples when SQL is available.

## Content
If Only I Had Known uses selected passages from the user-supplied pages 20 and 21. It is not a full transcription or full book. The original page images are not bundled. Other titles are labelled collection concepts, not published works.
Landscape and decorative covers are original SVG/CSS interface illustrations, not representations of uploaded book artwork. No external fonts or image hosts are required.

## Validation
Angular AOT compilation passed. Browser checked: home/detail/reader routes, story save reflected in count and persisted across navigation, search filtered to Moon, reader advanced from page 20 to 21. Narrow mobile layout visually inspected.
Normal ng build failed on parent-directory access restrictions; production optimisations and service-worker/offline behaviour remain unverified.
Dependencies installed from locally cached registry packages; lockfile URLs normalised to the public npm registry. Network vulnerability audit not available.

## Pending
SQL connection, Identity, rights/editions/page API, purchase entitlements, media streaming, genuine illustrated reader and entitled offline book downloads. Unknown story handling should be hardened once catalogue routing is backed by detail endpoints. No checkout or media playback is simulated.


## Animation milestone
/animation now includes a playable 75-second motion storyboard with captions, optional browser narration and saved progress. See docs/ANIMATION.md and docs/ANIMATION_PRODUCTION.md. Run npm run test:animation for the six timeline tests. This supersedes the earlier animation-placeholder description; the full film and cloud media service remain pending.
