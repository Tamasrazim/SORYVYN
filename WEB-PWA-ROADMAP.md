# SORYVYN Web PWA — Seven-Chunk Delivery Plan

The web PWA is being built first. A separate native application is a later project; the PWA should remain useful on its own and must not depend on a native runtime.

## Chunk 01 — PWA shell and interaction system
**Status: Implemented; validation runs through GitHub Actions.**

Deliverables:
- Responsive monochrome SORYVYN app shell and design tokens.
- Discover screen with eight original fictional sample titles.
- Manga / Manhwa / Manhua category filtering, search, sort, genre and status filters.
- Browser-like source sandbox inside the app. It is intentionally not a general-purpose browser and never navigates to arbitrary websites.
- Four clearly labelled illustrative source profiles, enable/disable controls, language filter, and internal Discover / Trending / Recently Added views.
- Title detail modal; local reader preview with page, webtoon, and right-to-left demo modes.
- Local demo library, favorites, reading history and progress stored in browser storage.
- Immersive 3D open-book reader preview showing two facing pages, a visible spine and page-stack edges.
- Drag a page with mouse/touch to fold it across the spine, use mouse-wheel scrolling, keyboard arrows, edge controls or Previous/Next spread buttons.
- Page-turn animation shows the current page's reverse side before revealing the next spread, with reduced-motion fallback.
- Light/dark theme, keyboard shortcuts, responsive navigation and reduced-motion support.
- Installable PWA manifest, local SVG icon, service worker and cached application shell.
- UI labels make the demo state clear: no real source has been connected in this chunk.

Acceptance criteria:
1. PWA resources are local and cached by the service worker.
2. No online discovery path shows categories outside Manga, Manhwa, and Manhua.
3. No arbitrary URL entry or unrestricted website navigation is offered.
4. Search and filters work with the original sample catalogue.
5. Saved titles, favorites, history, reader position, source toggles, theme, and notice dismissal persist locally where browser storage permits.
6. The UI remains usable on mobile and desktop.
7. The source catalogue never pretends placeholder sources are live connectors.

## Chunk 02 — Source engine and catalogue
Build a real source adapter interface and registry. Define per-source metadata, allowed content categories, locales, capabilities, health, enabled state, bounded timeouts, cancellation, error reporting and rate-limit handling. Add automated category-policy tests at the source/result boundary. Do not add source-count claims until a tested registry provides the number.

## Chunk 03 — Unified search and title details
Implement progressive multi-source search, results grouped by source, normalization, cautious duplicate handling, metadata, filters supported by each source, title details and chapter lists. Keep results from healthy sources visible when another fails. Apply the allowlist and suitability policy at every entry point.

## Chunk 04 — Real reader and local import
Replace the Chunk 01 illustrated reader preview with a real image-page reader. Add native file picker / drag-and-drop import, archive-safe CBZ/ZIP and image-folder handling, right-to-left and left-to-right page reading, double-page layout, webtoon scrolling, zoom, bookmarks and persisted progress. Add EPUB/PDF only if separately implemented and tested; they are not online source categories.

## Chunk 05 — Offline chapter downloads
Add a persistent download queue, progress, cancel/pause/resume/retry, rate limiting, per-source concurrency, safe page cache, interrupted-task recovery and verified offline chapter status. Respect source permissions and access controls. Do not add arbitrary file or executable downloads to the source browser.

## Chunk 06 — Library, history and backup
Complete collections, status, advanced history, bookmarks, local metadata overrides, duplicate handling, backup/restore, export validation and reading statistics. Add conflict-safe schema migrations. Sync and third-party tracking stay opt-in and are not required for the first web release.

## Chunk 07 — Hardening and release
Run functional, accessibility, responsive, browser-storage, offline, PWA installation and performance checks. Verify category restrictions in discover, search, recommendations, updates, related results, caches and source fallback paths. Document host requirements and deploy the web PWA. Add release notes, user-facing limitations and a privacy statement.

## Current boundary

Chunk 01 is a functional front-end prototype with local sample data, not a live manga source aggregator. The source-browser panel resembles an embedded browser, but its navigation remains inside SORYVYN's own source catalogue. Chunks 02–07 are not implemented yet. No claims of real source availability, live chapter updates, or actual chapter downloads should be made before those components exist.
