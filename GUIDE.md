# Portfolio Site

Static portfolio built with [Astro](https://astro.build). Deployed for free
on GitHub Pages, served from your own domain (`jiharvey.com`).

## Site structure

- **Home** (`/`) — about blurb, optional video reel, links to each section.
- **Digital Work** (`/digital-work/`) — directory page linking to two subsections:
  - **Photography** (`/digital-work/photography/`)
  - **Digital Media** (`/digital-work/digital-media/`)
- **Physical Work** (`/physical-work/`)
- **E-Learning** (`/elearning/`)
- **Posts** (`/posts/`) — simple blog-style updates/news, listed newest first.
- **About** (`/about/`) — a short static bio page.
- **Contact** (`/contact/`) — email + social links, no form (keeps the site
  100% static/free — see "Adding a contact form" below if you want one later).

Each portfolio section/subsection lists "entry modules" as cards; clicking
one opens a full detail page with a video or cover image, an optional image
gallery (with a click-to-zoom lightbox), and a full Markdown description.
Posts use a lighter version of the same pattern — no mandatory image, just a
title, date, and Markdown body.

## Adding a new entry

Every entry is one Markdown file. Pick the right folder:

| Section              | Folder                                    |
| --------------------- | ------------------------------------------ |
| Digital → Photography | `src/content/digital-work/photography/`   |
| Digital → Digital Media | `src/content/digital-work/digital-media/` |
| Physical Work         | `src/content/physical-work/`              |
| E-Learning             | `src/content/elearning/`                  |

Copy an existing `.md` file in that folder (e.g. `example-series.md`) as a
starting point, rename it, and edit the frontmatter:

```md
---
title: "My New Piece"
summary: "One or two sentences shown on the card."
date: 2026-05-01
# Optional — shows this text instead of the formatted date above (`date`
# still controls sort order — approximate it if you don't have an exact one):
# dateLabel: "Fall 2024"
cover: "../../../assets/digital-work/photography/my-cover.jpg"
coverAlt: "Describe the image for screen readers"
tags: ["tag-one", "tag-two"]
gallery:
  - src: "../../../assets/digital-work/photography/extra-1.jpg"
    alt: "..."
# Optional — replaces the cover image with a video on the detail page:
# video:
#   youtubeId: "dQw4w9WgXcQ"
#   caption: "Optional caption"
---

Full description goes here, in Markdown. Headings, lists, links, bold/italic
all work.
```

Then drop the actual image file(s) next to the other assets for that
section under `src/assets/...` (paths above are relative from the content
file to `src/assets/`). The filename becomes the page URL, e.g.
`my-new-piece.md` → `/digital-work/photography/my-new-piece/`.

Delete an entry by deleting its `.md` file — nothing else needs updating.

### Adding a post

Same idea, lighter frontmatter. Add a `.md` file to `src/content/posts/`:

```md
---
title: "Short update title"
date: 2026-05-01
# dateLabel: "Fall 2024"   (optional — see note in "Adding a new entry" above)
summary: "Optional one-line summary shown in the list."
tags: ["news"]
# cover: "../../assets/posts/optional-image.jpg"   (optional)
# coverAlt: "..."
---

The body of the update, in Markdown.
```

`cover` is optional — omit it entirely for a plain text update. Posts are
sorted newest-first automatically on `/posts/`.

### Editing About / Contact

- `src/pages/about.astro` — edit the text directly in the file.
- `src/pages/contact.astro` — pulls your email and social links from
  `src/data/site.ts` automatically; add socials there rather than editing
  this page.

### Adding a contact form (optional)

The Contact page is intentionally just a `mailto:` link so the whole site
stays static and free — a real form needs somewhere to send submissions,
which means a small backend. If you want one later without giving up free
hosting, a form-backend service like [Formspree](https://formspree.io) or
[Web3Forms](https://web3forms.com) works with a static site: you just point
a plain HTML `<form>` at their endpoint and they email you submissions,
free tier included.

### Adding videos

Videos are embedded from **YouTube** (not hosted in the repo — GitHub isn't
built for serving large media files, and YouTube's free tier has no
practical limits). Upload your video as **Unlisted** so it doesn't show in
search or on your channel, then copy the video ID from the URL:

```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
                              ^^^^^^^^^^^ this part
```

Use that ID in an entry's `video.youtubeId` field, or as `site.reelYoutubeId`
in `src/data/site.ts` for the homepage reel.

### Editing site-wide info

Open `src/data/site.ts` to change your name, tagline, about text, homepage
reel video, homepage profile photo, email, and social links.
Section/subsection titles and descriptions also live there.

### Homepage profile photo

Drop your photo directly in `src/assets/` (any format — `.jpg`, `.png`,
`.webp` — not a subfolder), then set `site.profileImage` in
`src/data/site.ts` to just the filename, e.g. `'me.jpg'`. Astro
auto-optimizes it at build time. Set `profileImage: ''` to hide it
entirely. It's shown large, to the left of your name on the homepage.

### Homepage section card photos

The three "Portfolio" cards on the homepage (Digital Work, Physical Work,
E-Learning) can show a background photo instead of a plain white card.
Same convention as the profile photo: drop the file directly in
`src/assets/`, then set `image: 'filename.jpg'` on that section in the
`sections` array in `src/data/site.ts`. Omit `image` to keep a plain card.
Title/description text is white with a dark gradient behind it for
legibility — pick photos where the *bottom* portion isn't already very
busy/light, since that's where the gradient is strongest.

### Background gradient & frosted page card

The animated background (`body` in `global.css`) and the frosted
`.page-card` every page's content sits inside are both tweakable:

- **Gradient colors**: `background: linear-gradient(185deg, #0075a2, #2e282a)`
  on `body`. Speed/easing: the `animation: bg-pan 18s ease infinite;` line
  and the `@keyframes bg-pan` positions right below it.
- **Frost opacity**: `--glass-frost` in `:root` (higher = more opaque/more
  legible, lower = more see-through). There's a separate, usually-lower
  value inside the `prefers-color-scheme: dark` block.
- **Blur amount**: `--glass-blur` in `:root`.
- **Saturation**: `--glass-saturation` in `:root`.

### Footer link / "How this site was made"

`src/pages/how-its-made.astro` is a plain content page, edited directly the
same way as About — linked from the footer on every page. Rename or delete
it (and update the link in `src/components/Footer.astro`) if you don't want
it.

## Local development

```sh
npm install
npm run dev       # http://localhost:4321, live-reloads on save
npm run build     # outputs static site to ./dist/
npm run preview   # serve the production build locally
```

## Deploying (GitHub Pages)

This repo includes `.github/workflows/deploy.yml`, which builds the site
and publishes it to GitHub Pages automatically on every push to `main`.

**One-time setup, after this repo is pushed to GitHub:**

1. On GitHub, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**
   (not "Deploy from a branch").
3. Push to `main` (or re-run the workflow from the **Actions** tab). The
   first successful run publishes the site to
   `https://<username>.github.io/<repo>/`.
4. Still on **Settings → Pages**, under **Custom domain**, enter
   `jiharvey.com` and save. GitHub reads the committed `public/CNAME` file
   too, but entering it here is what triggers GitHub to issue the HTTPS
   certificate.
5. Once DNS (below) is pointed correctly and has propagated, come back and
   check **Enforce HTTPS**. This can take anywhere from a few minutes to
   ~24 hours to become available after DNS is correct.

After this one-time setup, publishing an update is just:

```sh
git add -A
git commit -m "Add new entry"
git push
```

GitHub Actions rebuilds and redeploys automatically — no manual build step,
no FTP, nothing else to run.

## Connecting your domain (purchased via Wix)

Wix lets you manage DNS for a domain you bought through them even if the
site itself is hosted elsewhere. In your Wix account:

1. Go to **Domains** → select `jiharvey.com` → **DNS Records**
   (sometimes under "Advanced" or "Manage DNS").
2. **Remove every existing A, AAAA, ALIAS, or ANAME record** Wix added for
   host `@` (root/apex) — not just the obvious "parking page" one. GitHub
   will refuse to issue an HTTPS certificate if any extra/unrecognized
   record is left on `@` alongside its own.
3. **Add these four A records** for host `@` (root domain), one IP each,
   pointing at GitHub Pages:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

4. *(Optional but recommended)* Add the matching **AAAA** records for
   IPv6, also on host `@`:

   ```
   2606:50c0:8000::153
   2606:50c0:8001::153
   2606:50c0:8002::153
   2606:50c0:8003::153
   ```

5. *(Optional)* If you also want `www.jiharvey.com` to work, add a
   **CNAME** record: host `www` → value `jaxn-harvey.github.io.`
   (replace with your actual GitHub username if different — verify in your
   GitHub profile URL). Then in GitHub's Pages settings you can set the
   custom domain to either the apex or `www` as primary; GitHub will offer
   to redirect one to the other.

6. DNS propagation is usually fast (minutes) but can take up to 24-48
   hours. You can check propagation with a tool like
   [whatsmydns.net](https://www.whatsmydns.net) (search `jiharvey.com`,
   record type `A`).

Once DNS resolves and GitHub Pages shows the custom domain as verified with
a green checkmark, an HTTPS certificate is issued automatically (can take up
to an hour). The **Enforce HTTPS** checkbox in Pages settings only appears
once that certificate is ready — turn it on then.

**If HTTPS never becomes available**: the most common cause is a leftover
DNS record on `@`/`www` besides the ones above (see step 2). Less common:
if Wix's DNS panel shows any **CAA** records for the domain, at least one
must explicitly allow `letsencrypt.org` as an issuer, or GitHub can't
generate the certificate. If there are no CAA records at all, this doesn't
apply — CAA absence means any CA is allowed by default.

## Notes on the free-hosting setup

- **GitHub Pages**: free for public repos (and free for private repos on
  GitHub Pro/Team/Enterprise); serves static files directly, no server to
  maintain, no bandwidth bill under normal personal-portfolio traffic.
- **Domain**: you're already paying Wix annually for the domain itself —
  that doesn't change. Only the *hosting* moves to GitHub Pages, which is
  free.
- **Videos**: hosted free on YouTube (unlisted), embedded via iframe — no
  video files ever touch the Git repository.
- **Images**: stored in the repo under `src/assets/`; Astro automatically
  compresses and resizes them at build time, so keep source images
  reasonably sized (a few MB each is fine) rather than worrying about
  manual optimization.
