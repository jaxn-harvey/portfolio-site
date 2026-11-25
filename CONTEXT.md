# Project Context

This file is a living log of what this site is, why it's built the way it
is, and what's changed. It gets updated whenever a change is made — new
entries added, and older entries corrected if a later change makes them
inaccurate (this is a current-state log, not just an append-only history).

**Companion docs that must also be kept current:**
- `CONTENT-MAP.md` — the "which file do I edit for X" lookup. **Any change
  to site structure (new section, renamed route, moved folder, new card
  thumbnail location) must update it in the same change.**
- `GUIDE.md` — long-form how-to (frontmatter, deployment, DNS, styling).

## Goals

- Personal portfolio site, hosted for (mostly) free.
- Static site on **GitHub Pages**, served from a custom domain (`jiharvey.com`,
  purchased via Wix — only the DNS is pointed at GitHub Pages; hosting itself
  doesn't use Wix).
- Portfolio sections, all under a **Portfolio** nav item: **Digital Work**
  (with **Photography**, **Digital Media**, and **E-Learning** subsections)
  and **Physical Work**, plus a computed **All Works** feed combining every
  entry from all four. Each entry is an "entry module" supporting a video or
  image, a gallery, and a description.
- Later added: **Blog** (lightweight updates, was called "Posts" — renamed;
  deliberately *not* under Portfolio/All Works, a separate top-level
  section), **About**, **Contact**, and a **"How this site was made"** page
  linked from the footer.
- Fully responsive, with real hover/interaction polish (card lift, nav
  underline, mobile full-screen menu, image lightbox).
- Easy ongoing maintenance: adding a new piece of work should mean adding one
  Markdown file, not editing HTML/CSS.

## Tech stack & key decisions

- **Astro**, static output (`astro build` → plain HTML/CSS/JS, no server).
  Chosen over hand-written HTML for the content-collection system (new
  entries = new Markdown files, not copy-pasted pages) while still shipping
  zero JS by default.
- **Content collections** (`src/content.config.ts`) — one collection per
  section/subsection (`digital-photography`, `digital-media`, `physical-work`,
  `elearning`, `posts`). Portfolio entries require a cover image; posts are a
  lighter schema (no mandatory image). Collection names are internal — they
  don't have to (and in two cases don't) match the public URL: `elearning`
  routes to `/digital-work/elearning/`, and `posts` routes to `/blog/`.
- **Images**: content-collection entries use Astro's `image()` schema helper
  (auto-optimized, colocated with the Markdown file). Singleton images
  referenced from the plain data file `src/data/site.ts` (profile photo,
  section/subsection card photos) can't use that helper, so instead:
  `src/utils/images.ts` exports `resolveAsset()`, built on
  `import.meta.glob('/src/assets/*.{...}', {eager:true})` to build a
  filename → asset map; `site.ts` just stores a bare filename. Convention:
  these singleton images must live directly in `src/assets/` (not a
  subfolder). Originally this glob lived inline in `index.astro`; extracted
  to a shared util once `portfolio/index.astro` and `digital-work/index.astro`
  needed the same lookup (see 2026-09-21 entry).
- **Videos**: YouTube only, embedded via `youtube-nocookie.com`, uploaded as
  **Unlisted** by the user. Never hosted in the repo (GitHub Pages isn't
  suited to large media, YouTube's free tier has no practical limits).
- **Fonts**: self-hosted via `@fontsource-variable/montserrat` rather than
  linking Google's CDN directly — avoids a third-party request on every page
  load. Registered font-family is `'Montserrat Variable'`.
- **Deployment**: `.github/workflows/deploy.yml` builds and deploys to GitHub
  Pages via `actions/upload-pages-artifact` + `actions/deploy-pages` on every
  push to `main`. Repo's GitHub Pages source must be set to "GitHub Actions"
  (one-time setup, documented in GUIDE.md).
- **Domain**: `public/CNAME` holds `jiharvey.com`. DNS is managed in Wix's
  domain dashboard (A/AAAA records pointed at GitHub Pages IPs) — full
  instructions in GUIDE.md.

## Current site structure

- `/` — hero (profile photo + name/tagline/about + optional video reel),
  directory cards: All Works, Digital Work, Physical Work.
- `/portfolio/` — same three cards as home, as a dedicated nav destination.
  - `/portfolio/all-works/` — every entry from all four portfolio
    collections below, merged and sorted by date. Not content-backed itself.
  - `/digital-work/` → `/digital-work/photography/`, `/digital-work/digital-media/`,
    `/digital-work/elearning/`
  - `/physical-work/`
- `/blog/` (list) → `/blog/<slug>/` (detail) — top-level, not under Portfolio.
- `/about/`
- `/contact/`
- `/how-its-made/` (linked from the footer, not the main nav)

Top nav is just Home / Portfolio / Blog / About / Contact — Digital Work,
Physical Work, and All Works are reached via the Portfolio overview page,
not listed individually in the nav (same pattern Digital Work's subsections
already used). `Header.astro`'s active-state logic treats any path under
`/portfolio/`, `/digital-work/`, or `/physical-work/` as "Portfolio active."

## Change log

### 2026-11-24 — Gallery: row grid → masonry
- The row-based grid left dead space under shorter images whenever one
  image in a row was taller (the near-square crop in ireland-uk-2025 made
  this obvious). Switched `.gallery` to CSS multi-column
  (`columns: 3 220px`), which flows each image into the shortest column —
  Pinterest-style packing, no gaps, still uncropped.
- Gotchas baked into the CSS: `column-gap` only spaces columns
  horizontally, so vertical spacing comes from `margin-bottom` on the
  items; and `break-inside: avoid` stops an image splitting across columns.
- **Trade-off accepted**: multi-column reads top-to-bottom down each column
  rather than left-to-right across rows. Fine for a photo set; worth
  revisiting if an entry ever needs strict sequential ordering. (CSS Grid's
  native `masonry` would preserve row order but isn't broadly supported.)
- Verified by grouping items into columns and measuring the vertical gap
  between consecutive items: every gap is exactly 16px at 1400/800/390px —
  a single distinct value, which is what proves the dead space is gone.

### 2026-11-24 — Gallery: horizontal scroll → uncropped grid
- Gallery on project pages is now a responsive grid
  (`repeat(auto-fill, minmax(220px, 1fr))`) instead of a horizontal scroll
  strip. 3-up at desktop width, 1-up on mobile.
- Images in it are no longer cropped. This needed fixes at **two** layers,
  which is the thing to remember: CSS alone wasn't enough because
  `ImageGallery.astro` rendered thumbs with `width={400} height={300}`, and
  specifying both dimensions makes Astro crop the *generated file* to that
  ratio. Changed to `width={600}` only, then dropped `aspect-ratio` from
  `.gallery__item` and `object-fit: cover` from its `img`.
  (Same root cause as the cover-cropping fix earlier the same day.)
- `.gallery` uses `align-items: start` so a tall image doesn't stretch its
  shorter row-mates; mixed portrait/landscape sit together cleanly.
- Verified by asserting every gallery image's *rendered* box aspect matches
  its *natural* aspect within 0.02 — zero mismatches at both 1400px and
  390px. Checking the screenshot alone wouldn't catch subtle squashing.

### 2026-11-24 — `date` optional too; date logic centralized
- `date` is now optional on both schemas (`dateLabel` already was). Only
  `title` + `cover` remain required for entries, `title` for posts.
- Undated entries **sort to the end** of listings rather than disappearing
  or throwing. Dated ones keep sorting newest-first.
- Six listing pages each had their own copy of the sort, and three places
  formatted dates independently — with `date` now nullable, that's six
  chances to miss a null guard. Extracted `byNewestFirst()` and
  `formatDate()` into `src/utils/entries.ts` and pointed everything at them.
  `formatDate` also keeps the `timeZone: 'UTC'` pin in one place; that pin
  fixes an off-by-one-day bug and must not be removed.
- Blog list falls back to a plain `<span>` when a post has `dateLabel` but
  no `date`, since `<time datetime>` requires a machine-readable value.
- Verified all four permutations (no date, date only, dateLabel only, both)
  with throwaway entries — checked rendered HTML for empty elements and
  confirmed sort placement — then removed them.

### 2026-11-24 — `summary` optional; bad dates now fail loudly
- `summary` on portfolio entries was required; now optional (posts already
  were). `EntryCard` and `EntryLayout` only render it when present, so
  omitting the line leaves no empty element or gap. Meta description falls
  back to the title.
- Replaced `z.coerce.date()` with a validating `sortableDate` field.
  `z.coerce.date()` silently turned `"Fall 2023"` into 1 Jan 2023 and an
  empty `date:` into 1 Jan 1970 — wrong but *valid* dates, so builds passed
  and entries just sorted/displayed incorrectly. It now rejects anything
  that isn't ISO-shaped, naming the file and pointing at `dateLabel`.
  This had bitten the user twice (termite-cards, cloth-chair-sketch), which
  is why it became a guard rather than another one-off fix.
- Fixed both affected entries: `cloth-chair-sketch` (`"Fall 2023"` →
  `date: 2023-09-01` + `dateLabel`), `termite-cards` (empty date →
  `2024-09-01`; it already had the dateLabel).
- Verified the no-summary path with a throwaway entry (built, inspected
  HTML for stray empty `<p>`, removed) rather than assuming.

### 2026-11-23 — Detail-page covers no longer cropped; Ireland/UK photos added
- Bug: `EntryLayout`/`PostLayout` rendered covers with `width={1200}
  height={675}`, which makes Astro crop to 16:9 regardless of the source.
  Verified concretely: a 2686x1940 source (aspect 1.385) was being emitted
  at 1200x675 (1.778) — roughly 22% of the frame cut off top and bottom.
- Fix: covers now specify `width={1600}` only, so Astro derives height from
  the source and preserves the native aspect. `.entry-cover` CSS switched to
  `max-width:100% / max-height:80vh / width:auto / height:auto` + centred —
  landscape fills the column, tall portraits scale down to fit the viewport
  instead of running the page length, neither gets cropped. Also means small
  sources are no longer upscaled (sharper, but they render narrower than the
  column — intentional).
- Thumbnails (grid cards, gallery strip) deliberately still crop — they need
  a consistent shape for layout. The lightbox was already uncropped.
- Added 32 photos to `src/assets/digital-work/photography/ireland-uk-2025/`,
  resized from originals in `~/Downloads/Photography` (374 MB -> 34 MB, 91%
  smaller). Long edge capped at 2400px (above the 1800px the lightbox
  requests), quality 85 mozjpeg with 4:4:4 chroma; files already <=2400px
  were copied byte-for-byte rather than re-encoded. No crops, no colour
  changes; originals untouched. None carried GPS.
- **Open question for the user**: ~10 of those 32 (`DSCF3657`–`DSCF3675`)
  are studio product shots of a ceramic dish, not Ireland/UK travel photos,
  and may belong under Physical Work instead. Two near-duplicate pairs also
  flagged (`DSCF2355`, `DSCF3657` each have an `_edited` variant).

### 2026-11-23 — Asset folders reorganized; gradient → navy
- Background gradient's second stop is now `#1A1B41` (deep navy), was
  `#2e282a` → `#96E6B3` → `#D1E3DD` over a few iterations this session.
- **Every image now lives in a folder matching what it belongs to**; nothing
  sits loose in `src/assets/` root anymore. Added `src/assets/site/`
  (profile photo) and `src/assets/posts/` (blog images); section card
  thumbnails moved into their category folders (`digital-work/`,
  `elearning/`, `physical-work/`). All moves done with `git mv` so history
  is preserved.
- `resolveAsset()`'s glob widened from `/src/assets/*` to `/src/assets/**`
  so it can see into subfolders. **Consequence**: `site.ts` image values are
  now paths relative to `src/assets/` including the subfolder
  (`'site/jharvey2.jpeg'`), not bare filenames.
- Rewrote every reference: 4 in `site.ts`, 1 blog post's `cover:`, plus the
  convention comments in `site.ts`, `GUIDE.md`, and `CONTENT-MAP.md`.
- Verified no broken links by loading every affected page in a browser and
  asserting each `<img>` actually decoded (`naturalWidth > 0`), not just
  that the build passed — `resolveAsset()` returns `undefined` silently on a
  bad path, so a green build proves nothing on its own. Note for future
  checks: Astro's **dev** image endpoint transforms on first request and can
  take 1–2s, so a naive immediate check reports false "broken" images; wait
  for them, and exclude the lightbox's intentional `src=""` placeholder.
- No change needed for multi-image entries — the `gallery` frontmatter field
  already supported unlimited extra images with a scroll strip + lightbox.
  Now documented properly in CONTENT-MAP.md §1.

### 2026-11-23 — Added CONTENT-MAP.md
- New `CONTENT-MAP.md`: a one-page lookup table mapping "content I want to
  change" → "file to edit," covering portfolio entries, blog, homepage,
  standalone pages, section cards/thumbnails, and site chrome. Linked from
  `README.md` and `GUIDE.md`.
- Written because the three-way split between content folders, page routes,
  and `site.ts` isn't guessable — especially the two deliberate mismatches
  (`src/content/elearning/` → `/digital-work/elearning/`, and
  `src/content/posts/` → `/blog/`), both called out explicitly in the map.
- **This file must be updated alongside any structural change.** Noted at
  the top of this doc as well.

### 2026-09-21 — Consolidated "All Works" card text
- Bug (from the IA restructuring below): the "All Works" card's title/
  description were hardcoded independently in three places
  (`index.astro`, `portfolio/index.astro`, `portfolio/all-works/index.astro`)
  since it's not a content-backed `Section` like the others. User edited one
  copy expecting it to update everywhere, and the other two silently didn't
  — by the time this was fixed the three copies had drifted to three
  different wordings.
- Fix: added `allWorksCard` (`{ title, description, href }`) to `site.ts`,
  same file as `sections`. All three pages now reference it instead of
  their own literal strings. One edit, updates everywhere — matches how
  `sections` already worked for every other card.

### 2026-09-21 — IA restructuring: Portfolio umbrella, All Works, Blog rename
- Introduced a **Portfolio** top-level nav item/page (`/portfolio/`) as an
  umbrella over what were three separate top-level sections. Under it:
  - **All Works** (`/portfolio/all-works/`) — new, a computed feed merging
    `digital-photography` + `digital-media` + `elearning` + `physical-work`,
    sorted by `date` descending. No content of its own.
  - **Digital Work** (unchanged URL `/digital-work/`) — gained a third
    subsection.
  - **Physical Work** (unchanged URL `/physical-work/`).
- **E-Learning demoted from a top-level section to a Digital Work
  subsection**, alongside Photography and Digital Media. Content folder
  (`src/content/elearning/`) and collection name (`elearning`) deliberately
  left unchanged — only the *pages* moved, from `src/pages/elearning/` to
  `src/pages/digital-work/elearning/`, changing the public URL from
  `/elearning/` to `/digital-work/elearning/`. Its existing `image` (the
  Instructional Media Timeline photo) was preserved by extending the
  `Subsection` type in `site.ts` to support `image?`, previously only a
  top-level `Section` feature — `/digital-work/index.astro` now passes
  subsection images through to their cards too.
- **"Posts" renamed to "Blog"** in nav label and page title, and the route
  moved from `/posts/` to `/blog/` (`src/pages/posts/` → `src/pages/blog/`).
  The content collection is still named/folder `posts` — only routing and
  display text changed, so no content files needed to move. Blog is
  deliberately *not* part of Portfolio/All Works (a separate top-level
  section) — a conscious choice, not an oversight, per the request.
- Nav (`Header.astro`) simplified from 7 items to 5 (Home / Portfolio /
  Blog / About / Contact) — Digital Work, Physical Work, and E-Learning are
  no longer listed individually in the top nav, reached via `/portfolio/`
  instead, mirroring how Digital Work's own subsections were already
  reached via `/digital-work/` rather than being in the nav directly.
  Active-nav-state logic now treats `/portfolio/`, `/digital-work/`, and
  `/physical-work/` paths as all meaning "Portfolio is active."
- Extracted the `import.meta.glob` image-resolver (previously inline in
  `index.astro`) into `src/utils/images.ts` (`resolveAsset()`), since it's
  now needed in three places (`index.astro`, `portfolio/index.astro`,
  `digital-work/index.astro`).
- No redirects were set up for the old `/elearning/` and `/posts/` URLs —
  the site is new enough that this wasn't judged worth the complexity, but
  worth knowing if either URL turns out to be linked/indexed somewhere.
- Verified via build (old routes gone from `dist/`, new ones present),
  and in-browser: nav, `/portfolio/`, `/portfolio/all-works/` (correct
  entries, correct sort order, correct per-item hrefs across all four
  collections), `/digital-work/` (3 subsections incl. E-Learning's photo),
  the moved E-Learning detail page, `/blog/` (list + detail, back-link
  text), and mobile nav.

### 2026-09-14 — Social link styling fix + Contact page redesign
- Bug: `.social-link` (icon + label) was `display: inline-flex` with no
  `vertical-align` set, sitting inside plain running text (footer, and the
  old "Or find me on X, Y." sentence on Contact). An inline-flex box's
  baseline alignment with surrounding text is ambiguous/inconsistent across
  browsers when its children aren't baseline-aligned internally — looked
  like the icon+label were "raised" relative to neighboring text. Fixed
  with explicit `vertical-align: middle` on `.social-link`, and removed the
  default underline in favor of an underline-on-hover only (an underlined
  flex container was rendering oddly around the icon too).
- Contact page (`src/pages/contact.astro`) no longer runs socials into a
  sentence — each one (plus email) is now its own full-width `.btn` in a
  stacked `.contact-links` column, matching the visual weight the email
  button already had. Footer's presentation is unchanged (icon + inline
  text, appropriate for a slim footer bar) — the "own line, more prominent"
  request was scoped to Contact specifically.

### 2026-09-14 — Self-hosted social icons
- Added `src/components/SocialIcon.astro` (inline SVG, one icon so far:
  `linkedin`) and an optional `icon` field on `site.socials` entries in
  `site.ts`, rendered in both `Footer.astro` and `contact.astro`.
- Deliberately not Font Awesome (or any icon-font CDN) — user pasted a
  Font Awesome `<i class="fa-brands ...">` snippet, but pulling in a whole
  icon library for one icon conflicts with this project's established
  self-hosted-only approach (see the Montserrat font decision above). Used
  a plain inline SVG instead, same visual result, zero extra requests.

### 2026-09-14 — README/GUIDE split; email change; verified Wix/DNS steps
- Renamed the old `README.md` (full maintenance instructions) to
  `GUIDE.md`. Wrote a new, short `README.md` that briefly describes the
  site and links to `GUIDE.md` (how-to) and this file (why). Anywhere
  future work references "the README" for setup/maintenance instructions,
  it means `GUIDE.md` now.
- Changed the site's contact email from `jxinkling@gmail.com` to
  `jacksonian.era23@gmail.com` in `src/data/site.ts` (the only place it was
  defined — Contact page and footer both pull from there).
- Verified the Wix/GitHub Pages DNS instructions in `GUIDE.md` against
  GitHub's current official docs: the four A-record IPs and four AAAA IPs
  are correct as documented, and the Settings → Pages → Build and
  deployment → Source → "GitHub Actions" navigation is still accurate.
  Strengthened the domain section with two things GitHub's docs surfaced
  that weren't previously called out: (1) *any* leftover record on `@`
  beyond the four A records (not just the obvious default one) blocks
  certificate issuance, and (2) a CAA record restricting certificate
  authorities (if one exists at all — most domains have none) must allow
  `letsencrypt.org` or GitHub can't provision HTTPS.

### 2026-09-12 — Sticky footer fix
- Bug: on any page shorter than the viewport (e.g. `/digital-work/`,
  `/about/`, `/contact/`), the footer sat right after the short content
  block instead of the bottom of the viewport, leaving a large slab of raw
  animated-gradient background exposed below it. Pre-existing since the
  gradient background was added, but only became obviously "broken"-looking
  once there was a colorful background to expose (a flat neutral background
  hid the same underlying layout gap).
- Fix: `body` is now `display: flex; flex-direction: column` (with its
  existing `min-height: 100vh`), and `main` has `flex: 1 0 auto` — standard
  sticky-footer pattern. Main grows to fill leftover viewport height on
  short pages (footer pinned to viewport bottom); on pages taller than the
  viewport, main just holds its natural content height and the page scrolls
  normally, unaffected. Verified header's `position: sticky` still works
  correctly as a flex child (unaffected).

### 2026-09-12 — Freeform date labels; scrollable gallery; entry spacing
- Added optional `dateLabel` to both content schemas (portfolio entries and
  posts). `date` still drives sort order on every listing page (kept as a
  real `z.coerce.date()` — approximate it, e.g. `2024-09-01` for "Fall
  2024", if you don't have an exact one); `dateLabel`, when set, is what
  actually gets displayed, overriding the formatted `date`. This was needed
  because a real entry (`termite-cards.md`) had jammed "Fall 2024" into the
  title as a workaround, and separately, YAML's unquoted `date: Fall 2024`
  was silently coerced by `z.coerce.date()` into a bogus valid date
  (displayed as "January 2024") rather than failing the build — worth
  remembering if a date ever displays unexpectedly.
- Converted the secondary-image gallery (`ImageGallery.astro`) from a CSS
  grid to a horizontally scrollable strip (flex row, `overflow-x: auto`,
  fixed-width items, scroll-snap). Click-to-zoom lightbox behavior is
  unchanged. Cover image (or video) stays as-is — this only affects the
  optional extra `gallery` array.
- Increased the gap between an entry's media (cover/video/gallery) and its
  Markdown description (`.entry-content`) — previously there was close to
  zero space when no gallery was present.

### 2026-09-12 — Frosted page-card (glass distortion tried, then reverted)
- Replaced `.page-card`'s flat opaque background with a frosted treatment: a
  translucent tint (`--glass-frost`) plus `backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation))`,
  plus inset-shadow highlights for a glass-edge sheen.
- First pass added a full SVG chromatic-dispersion distortion filter
  (`#glass-filter` in `BaseLayout.astro`, per-channel `feDisplacementMap` +
  `feGaussianBlur`) run through `backdrop-filter` for a true "liquid glass"
  warp effect. This introduced bugs (unspecified — reported as "bugs this
  introduced," reverted before root-causing them) and was removed at the
  user's request in favor of the plain blur/tint version above. **Don't
  reintroduce the SVG-filter approach without checking why it broke first.**
- Deliberately scoped to `.page-card` only (not `EntryCard`/`DirectoryCard`)
  — those sit on top of the already-opaque page-card, not directly against
  the animated gradient, so a frosted/glass effect would have nothing
  underneath to blur.
- `--glass-frost` (tint opacity) is set much higher than typical
  glassmorphism demos (0.72 light / 0.68 dark) — most such demos assume
  light text over a photo; ours needs to keep dark text legible against a
  busy animated gradient, so the tint does most of the contrast work, with
  blur layered on top rather than relied on alone.
- Verified in light mode, dark mode, and mobile — contrast holds up across
  the full animation cycle (checked at multiple points in the gradient pan).

### 2026-09-12 — Animated gradient background + page-card wrapper
- Every page's content now sits inside a `.page-card` (white/dark surface
  panel, rounded corners, shadow) wrapped around `<slot />` in
  `BaseLayout.astro`, floating over an animated gradient on `body`
  (`linear-gradient(185deg, #0075a2, #2e282a)`, panned via
  `background-position` keyframes, `prefers-reduced-motion` disables it).
  This was specifically to guarantee text always sits on a solid,
  high-contrast surface regardless of where the gradient currently is.
- `<main>` gained padding (`--space-4`/`--space-3`) so the gradient shows as
  a consistent gutter around the card on every screen size, not just wide
  desktop.
- Footer previously had no background of its own (relied on the page being a
  flat color) — now given an explicit opaque `--color-bg` background, since
  otherwise its text would sit directly on the moving gradient. Header
  needed no change — its existing frosted/blended background already
  provides enough opacity.
- Verified in both light and dark `prefers-color-scheme` and at mobile width.

### 2026-09-10 — Global font: Montserrat
- Added `@fontsource-variable/montserrat`, imported once in `BaseLayout.astro`.
- `global.css`: `--font-sans` now leads with `'Montserrat Variable'`.

### 2026-09-10 — Section card photos + name no-wrap
- Homepage "Portfolio" directory cards (Digital Work / Physical Work /
  E-Learning) can now show a background photo (`image` field per section in
  `site.ts`) with a dark gradient overlay for white-text legibility; kept
  optional so cards without an image (e.g. the Photography/Digital Media
  subsection cards) stay plain. Gradient was strengthened after the first
  pass didn't give enough contrast against a light source photo.
- Homepage name (`h1`) no longer wraps onto multiple lines at desktop/wide
  widths (≥860px) — scoped to that breakpoint only; tablet/mobile still wrap
  as before, per explicit instruction.
- User-provided placeholder photos currently in use: `Autumn_Morning_Owl (1).png`
  (Digital Work), `green-guy.jpg` (Physical Work), `Instructional Media
  History Timeline.jpg` (E-Learning) — all in `src/assets/`, meant to be
  swapped for real photos later.

### 2026-09-07 — Homepage profile photo, enlarged + repositioned
- Added real homepage profile photo support (`site.profileImage` in
  `site.ts`, resolved via the `import.meta.glob` pattern above, rendered
  with `astro:assets` `<Image>` for optimization).
- Fixed a bug where the photo was initially wired to a `src/assets/...` path
  used directly as an `<img src>` — doesn't work, since `src/` isn't
  web-servable; only `public/` or Astro-imported assets are.
- Enlarged the avatar and moved it beside the name (was stacked above), with
  a fluid `clamp()` size. Fixed a flexbox bug where a long name would wrap
  the *entire block* below the photo instead of just the heading text
  wrapping in place.
- Also fixed a timezone bug (unrelated, found while touching hero markup):
  content dates were rendering one day early in negative-UTC timezones
  because `toLocaleDateString` wasn't pinned to `timeZone: 'UTC'`. Fixed in
  `EntryLayout.astro`, `PostLayout.astro`, `posts/index.astro`.

### 2026-09-07 — Posts, About, Contact, "How this site was made"
- Added the `posts` content collection (lighter schema than portfolio
  entries — no mandatory cover image) plus `/posts/` list and detail pages.
- Added static `/about/` and `/contact/` pages (plain content, directly
  editable, no content-collection schema needed for one-off pages).
- Deliberately did **not** add a real contact form — kept the site 100%
  static/free (`mailto:` link only). README notes Formspree/Web3Forms as an
  option if a real form is wanted later.
- Added `/how-its-made/`, linked from the footer (not main nav) — a short,
  honest description of the actual stack.
- Updated the header nav to include the new top-level pages; verified it
  still fits at both ~1024px and mobile widths.

### 2026-09-06 — Initial build
- Scaffolded Astro project (`npm create astro@latest`, minimal template).
- Built the content-collection architecture, all layouts/components
  (`Header`, `Footer`, `VideoEmbed`, `EntryCard`, `DirectoryCard`,
  `ImageGallery` with click-to-zoom lightbox), and responsive CSS
  (mobile hamburger nav as a full-height overlay, card hover-lift, fluid
  type scale).
- Added GitHub Actions deploy workflow, `CNAME`, `.nojekyll`.
- Wrote full DNS/GitHub Pages setup instructions into `README.md` for the
  `jiharvey.com` domain (purchased via Wix).
- Sample placeholder content (SVG covers, one entry per collection) added so
  the site builds and demonstrates the pattern before real content exists.

## Known placeholders still to replace

- Section card photos (Digital Work / Physical Work / E-Learning) — see
  above, currently stand-in images.
- Sample Markdown entries in each content collection (`example-*.md`) —
  meant to be deleted/replaced with real work.
- `src/data/site.ts`: `socials` array is still empty (commented-out examples
  only).
