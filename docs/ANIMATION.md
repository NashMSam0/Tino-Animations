# Animation module
Updated 16 November 2026.

## Implemented
Dedicated Angular Animation component at /animation.
75-second motion storyboard for If Only I Had Known, derived from selected events in supplied pages 20 and 21.
Six scenes, timeline seek, scene selection, play/pause/restart, speed, captions, optional browser speech, fullscreen where supported, watchlist and local resume.
Complete narration transcript, downloadable production brief and WebVTT captions.
Browser-only MP4/WebM preview (under 500 MB), file type/size validation, codec-error feedback and object URL cleanup.

## Scope
The storyboard is symbolic SVG/CSS animation, not an MP4 or finished character animation. No original page artwork is animated. No audio recording/music, cloud hosting, purchase entitlement or new SQL/API endpoint is claimed.
Browser narration is opt-in and varies by installed voices. It starts at the current scene's beginning on seek/resume; it is not word-synchronised. Caption text remains available if speech fails.
Watchlist/progress live only on this browser and are separate from the book reading list.
Background tab switches pause playback. Reduced-motion preferences suppress decorative movement.

## Files
- frontend/src/animation.ts: playback, browser speech, progress, local video.
- frontend/src/animation-data.ts: authoritative scenes and timeline helpers.
- frontend/src/animation.html and animation.css: responsive player/page.
- frontend/tests/animation.test.mjs: six automated cases.
- frontend/public/animation: downloadable brief and captions.
- docs/ANIMATION_PRODUCTION.md: script, scene plan, assets and production gates.

## Validation
npm run build:preview: passed Angular AOT compilation.
npm run check: passed strict TypeScript checks.
node --test frontend/tests/animation.test.mjs: 6 passed.
Browser verified scene selection, advancing playback, pause, caption toggle, watchlist, reload restoring progress, seek to end and restart.
HTTP 200 checked for animation route and caption file.
Desktop layout screenshot inspected.
Synthetic voice audio, local video codec compatibility, fullscreen and mobile animation layout still need broader device QA; no claim of those checks passing.
Standard Angular CLI/PWA production build remains subject to the prior environment limitation.

## Next
Approve character designs and visual style, then record narration and render scenes. Integrate completed videos through protected media endpoints and server-side entitlements after Identity/SQL are ready.


## 17 November 2026 - Timeline-driven staging
Camera zoom/pan, letter movement, character spacing and reconciliation gestures now derive from scene progress. Seeking and speed changes therefore use the same clock as the visuals; pausing freezes that motion. Added homecoming and closing silhouettes, scene lighting, reduced-motion overrides, and a guard against duplicate playback loops.
Validation: Angular AOT build passed; seven timeline tests passed, including scene midpoint, cut, end and invalid timestamp cases. Browser opened the updated page and verified reconciliation scene selection at 0:36; desktop screenshot inspected. Full motion playback and mobile layout need further visual QA. This remains a symbolic animatic, not finished character animation.

## Audio adaptation
Added a dedicated Audio page for the complete four-chapter adaptation. It narrates the 19 passages in sequence using browser speech synthesis, with chapter and passage navigation, voice and speed selection, visible narration text, and saved listening position. The audio player is available at /audio. The narration uses condensed adaptation text; it is browser-generated, not a recorded studio performance.
