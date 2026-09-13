# Project Context

This file is a living log of what this site is, why it's built the way it
is, and what's changed. It gets updated whenever a change is made — new
entries added, and older entries corrected if a later change makes them
inaccurate (this is a current-state log, not just an append-only history).

## Goals

- Personal portfolio site, hosted for (mostly) free.
- Static site on **GitHub Pages**, served from a custom domain (`jiharvey.com`,
  purchased via Wix — only the DNS is pointed at GitHub Pages; hosting itself
  doesn't use Wix).
- Sections: **Digital Work** (with **Photography** and **Digital Media**
  subsections), **Physical Work**, **E-Learning** — each holding "entry
  modules" that support a video or image, a gallery, and a description.
- Later added: **Posts** (lightweight blog-style updates), **About**,
  **Contact**, and a **"How this site was made"** page linked from the footer.
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
  lighter schema (no mandatory image).
- **Images**: content-collection entries use Astro's `image()` schema helper
  (auto-optimized, colocated with the Markdown file). Singleton images
  referenced from the plain data file `src/data/site.ts` (profile photo,
  homepage section-card photos) can't use that helper, so instead:
  `src/pages/index.astro` uses `import.meta.glob('/src/assets/*.{...}', {eager:true})`
  to build a filename → asset map, and `site.ts` just stores a bare filename.
  Convention: these singleton images must live directly in `src/assets/`
  (not a subfolder).
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
  directory cards linking to the three portfolio sections.
- `/digital-work/` → `/digital-work/photography/`, `/digital-work/digital-media/`
- `/physical-work/`
- `/elearning/`
- `/posts/` (list) → `/posts/<slug>/` (detail)
- `/about/`
- `/contact/`
- `/how-its-made/` (linked from the footer, not the main nav)

## Change log

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
