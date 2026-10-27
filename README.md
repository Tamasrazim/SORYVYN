# SORYVYN

A cross-platform reading application for ebooks, manga, comics, and web-discovered reading material.

> **Project status:** Planning / initial specification. The repository is currently an empty starting point; this document defines the first implementation target.

SORYVYN should combine a polished local library and reader with a powerful **in-app source browser**. Its capabilities should be comparable in scope to the source-discovery and built-in browsing workflow found in Kotatsu, while using an original SORYVYN interface, implementation, and architecture.

## Product principles

- **Reader first:** opening a book or chapter should be fast, stable, and comfortable.
- **Local by default:** library metadata, reading progress, bookmarks, and downloaded files remain on the device unless the user explicitly enables a sync feature.
- **Sources are modules:** web sources must not be tightly coupled to the interface or reading engine.
- **Honest compatibility:** a source may break when its website changes; show clear health and error states rather than pretending it works.
- **Respect source rules:** don't bypass DRM, paywalls, logins, age gates, or access controls. Users must have the necessary rights to download or retain material.
- **No copied branding:** SORYVYN must have its own visual design, icons, copy, and user experience.

## In-app browser and source discovery

The browser is a first-class part of SORYVYN, not just an external-link button.

### Browser chrome and navigation

- Address/search field that accepts URLs or searches the configured search provider.
- Back, forward, reload, stop, home, and copy-link actions.
- Tabbed browsing with create, close, duplicate, and restore-last-session actions.
- Loading progress, page title, favicon, and clear HTTPS/security indicators.
- Downloads list with progress, destination, retry, cancel, and open-file actions.
- Open a supported book, comic, or chapter from a webpage directly in the SORYVYN reader.
- Context actions for links, images, and selected text where the embedded engine permits them.
- Keyboard navigation and shortcuts, plus mouse, touch, and trackpad support.
- Session restore is optional and can be disabled for private browsing.

### Web compatibility and site sessions

- Use a maintained operating-system webview or another supported embedded browser engine; isolate browser-engine code behind an interface so it can be replaced later.
- JavaScript and cookies must work for normal site compatibility.
- Keep cookies, local storage, and authentication state scoped to the relevant site/profile.
- Allow users to clear site data, browser cache, downloads, or all browsing history.
- Offer per-site permissions for features such as pop-ups, notifications, and external links.
- Support ordinary redirects, pagination, lazy-loaded images, and common chapter-page layouts when the site allows them.
- Display understandable messages for unsupported sites, certificate errors, blocked requests, rate limits, CAPTCHA, or login requirements.
- Do not silently defeat CAPTCHA, DRM, site access restrictions, or anti-abuse controls.
- Make it clear that compatibility can differ by OS and embedded browser engine.

### Privacy and protection controls

- Optional private session that does not persist browser history, cookies, or site storage after it closes.
- Per-site cookies/storage removal and global browser-data clearing.
- Configurable pop-up blocking and optional content-filter lists for ads/trackers.
- Content filtering must be transparent and user-configurable; do not inject unknown scripts or install extensions without consent.
- Optional use of the system proxy and manually configured proxy settings, with connection errors surfaced clearly.
- Safe download handling: show the source domain, filename, file type, and destination; warn for unexpected executable files.
- No background collection of visited URLs, search terms, reading history, or downloaded content.

## Source catalogue and connector system

SORYVYN must support multiple online catalogues through a source-adapter API rather than hard-coding one website.

### Catalogue interface

- Browse a directory of available sources.
- Search/filter sources by name, language, content type, availability, and user-enabled status.
- Show source language, website domain, connector version, last health check, and the date it was last updated.
- Enable, disable, pin, reorder, or remove a source.
- Show source-specific settings and explain when a source needs a browser login.
- Provide a manual refresh and a visible update state for the source registry.
- Keep user-added connectors distinguishable from built-in or verified connectors.
- Never claim a fixed number of supported sources unless that count is measured and current.

### Unified discovery

- Search across all enabled compatible sources.
- Search by title and, when supported, author, artist, genre, tags, status, and description.
- Normalize duplicate results across sources while preserving the source links.
- Sort and filter results by relevance, title, update time, source, language, and supported metadata.
- Provide useful empty, loading, partial-result, timeout, and source-failure states.
- Use cancellation and bounded concurrency so a slow source cannot freeze the entire search.
- Keep individual source errors visible, while allowing healthy sources to return results.

### Source adapters

Define a documented, versioned interface for operations such as:

- Fetch source metadata and capabilities.
- Search a query with optional filters.
- Retrieve a title's details and chapter/volume listing.
- Retrieve page/image URLs for a chapter when allowed by the source.
- Resolve next/previous chapter relationships when available.
- Report authentication requirements and source-specific failures.
- Normalize titles, authors, genres, status, cover images, chapters, and page metadata.

Adapters must have timeouts, cancellation, bounded retries, rate-limit awareness, and structured errors. They must not have unrestricted access to local files or secrets. Do not execute downloaded source scripts as privileged application code. If a community connector system is later added, it needs versioning, permission boundaries, compatibility tests, and a disable switch.

### Source resilience

- Health-check enabled sources without hammering their servers.
- Remember recent source failures for the current session and apply a cooldown.
- Offer alternate sources when the same title is available elsewhere.
- Never switch to an unrelated title without asking.
- Retain the original source URL and source identifier with imported metadata.
- Give users a way to report a broken connector and export diagnostic details without including cookies, tokens, or personal browsing history.

## Reading workflow

- Local library with cover grid/list views, sorting, filters, collections, and recently opened items.
- Import files and folders using the file picker and drag-and-drop.
- Prioritize EPUB, PDF, CBZ, CBR, and image-folder reading; add other formats only when tested and documented.
- Manga modes: left-to-right, right-to-left, vertical/webtoon, and single-page or double-page layouts where appropriate.
- Reader settings for zoom, fit width/height, background, margins/gaps, page transition, and image scaling.
- Keyboard, mouse, touch, and trackpad navigation.
- Progress, last-read location, bookmarks, and resume reading.
- Save supported remote chapters for offline reading, with a download queue, pause/resume, retry, and clear status.
- Download settings for destination, maximum concurrency, and sensible rate limiting.
- Package chapters into CBZ or a documented folder format where permitted and technically supported.
- Clearly distinguish local files, cached pages, and downloaded chapters.
- Never imply that a file is backed up or synced unless the operation actually succeeded.

## Library and personal organization

- Favorites and user-created collections.
- Reading history and continue-reading shelf.
- Bookmarks with chapter/page position and optional notes.
- Reading status such as unread, reading, completed, and paused.
- Duplicate detection based on available metadata and file hashes.
- Local metadata editing for title, author, cover, tags, and description.
- Import/export of library metadata and reading progress using a documented backup format.
- Optional incognito reading that does not add the session to normal history.
- App lock may be added later, using platform security APIs rather than storing a plain-text password.

## Updates and tracking integrations

- Chapter-update feed for sources that expose reliable update metadata.
- Optional notifications, disabled by default until configured.
- Recommendations based on user-selected genres or reading history only when the user enables them.
- Tracking integrations may be added through separate opt-in modules; never upload library contents or reading history without explicit consent.
- Sync is a later, optional feature. It must have clear account, encryption, conflict-resolution, export, and deletion behavior.

## Interface direction

SORYVYN should feel like polished desktop software, not a website placed inside a window.

- Original monochrome-first visual system with carefully restrained accent states.
- Subtle glass-like surfaces, clear contrast, smooth but brief transitions, and consistent spacing.
- No emoji used as application icons; use a consistent vector icon set.
- No text overlaps, overprinted labels, clipped controls, or buttons with unclear actions.
- Responsive layout for narrow and wide windows; browser tabs and reader controls remain usable when resized.
- Full keyboard accessibility, visible focus states, reduced-motion support, scalable text, and readable error messages.
- Dark and light themes, with system-theme support.
- Empty states should be useful and explain how to import a local file or enable a source.

## Suggested architecture

Start with a modular desktop application targeting Windows first, while keeping cross-platform support in mind.

- **UI:** TypeScript + a component-based UI framework.
- **Desktop host:** Tauri 2 with Rust commands and explicit capability permissions.
- **Persistence:** SQLite for metadata, history, bookmarks, settings, and task state.
- **Files:** local filesystem for source files, downloads, covers, and cache; store references and metadata in SQLite.
- **Browser:** isolated browser module using the platform webview behind a navigation/session API.
- **Source engine:** a separate adapter runtime with timeouts, rate limits, cancellation, logging redaction, and schema validation.
- **Reader engine:** format-specific readers behind a common page/navigation interface.
- **Background work:** bounded task queue for source searches, metadata refreshes, and downloads.
- **Tests:** unit tests for adapters and storage; fixtures for parsing; end-to-end tests for import, search, reading progress, download cancellation, and offline reading.

Keep these layers independent: UI, browser, source connectors, reader, library, downloads, settings, and backup. The UI must not scrape websites directly.

## Implementation order

### Phase 1 — usable local reader
1. Build the application shell, navigation, theme system, settings, and error/empty states.
2. Implement local library import and EPUB/PDF/CBZ viewing.
3. Persist progress, bookmarks, and collections locally.
4. Add automated tests for import, navigation, and progress restoration.

### Phase 2 — browser foundation
1. Add tabs, navigation controls, address/search field, downloads, and site-data controls.
2. Add per-site session storage, private browsing, and clear history/cache actions.
3. Add direct URL import into the reader for supported file types.
4. Verify browser behavior on each supported operating system.

### Phase 3 — source catalogue
1. Define and document the source-adapter contract.
2. Add a source directory and source settings UI.
3. Implement unified search, normalized results, timeouts, and per-source failure handling.
4. Add chapter/page loading and offline downloads for compatible sources.
5. Add alternate-source suggestions and source health reporting.

### Phase 4 — refinement
1. Add update feeds and opt-in notifications.
2. Add backup and restore, duplicate management, accessibility review, and performance profiling.
3. Evaluate tracking and optional sync integrations.
4. Build signed release packages and publish reproducible build instructions.

## Engineering requirements

- No fake controls: every visible control must work or be explicitly marked as not yet available.
- Never swallow errors silently; display recoverable errors and write redacted diagnostic logs.
- Use cancellation for browser navigation, search, refresh, and downloads.
- Avoid unbounded parallel requests to source websites.
- Don't store credentials or session tokens in logs or exports.
- Use content security policies and restrictive native command permissions.
- Validate URLs and paths; prevent path traversal during archive extraction.
- Treat all downloaded pages, covers, metadata, and archives as untrusted input.
- Keep the app responsive while parsing large books or downloading multiple chapters.
- Include tests, setup instructions, supported-format notes, and known limitations with each release.
- Do not claim source compatibility until a connector has passing tests and a documented maintenance status.

## Licensing and attribution

Kotatsu and its parser library are published under GPL-3.0, and the original Kotatsu repository is archived. This specification is for **feature parity, not a request to copy its branding or source files**. If any GPL-licensed code or parser library is reused, review the license obligations before distributing SORYVYN and provide the required license notices and corresponding source code. Prefer a clean, independently implemented adapter contract unless the project deliberately adopts compatible licensing.

Online-source availability and download permission vary by site and jurisdiction. SORYVYN should remain a reading and browsing tool, respect source terms and access controls, and provide a way to remove a source or local download.

## Definition of done for the browser

The browser milestone is not complete until these scenarios work:

1. User enters a URL, navigates, returns, reloads, opens a second tab, and closes/restores a session.
2. User downloads a supported file and can inspect, cancel, retry, or open it.
3. User opens supported remote content in the appropriate SORYVYN reader.
4. User can clear a single site's data and all persisted browser data.
5. A failed source times out cleanly without blocking healthy sources.
6. Unified search shows partial results while marking failed sources clearly.
7. A private session leaves no persisted history or site data after it closes.
8. A source connector cannot access secrets or arbitrary local files through the normal adapter API.
9. Download tasks can be paused/cancelled and recovered safely after application restart.
10. The interface remains usable at small window sizes, with keyboard navigation and reduced motion enabled.
