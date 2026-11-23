# Content Map

Quick lookup: "I want to change X — where do I go?"

For *how* to write frontmatter, deploy, or tweak styling, see
[GUIDE.md](./GUIDE.md). For *why* things are built this way, see
[CONTEXT.md](./CONTEXT.md).

> Keep this file current. Any time the site's structure changes — a new
> section, a renamed route, a moved folder — update the tables below in the
> same change.

---

## 1. Portfolio work (photography, digital media, e-learning, physical)

Every piece of work is **one Markdown file**. Add one = create a file.
Delete one = delete the file. Nothing else to update.

| Category | Add/edit/delete the `.md` here | Put its images here | Appears at |
| --- | --- | --- | --- |
| Photography | `src/content/digital-work/photography/` | `src/assets/digital-work/photography/` | `/digital-work/photography/<filename>/` |
| Digital Media | `src/content/digital-work/digital-media/` | `src/assets/digital-work/digital-media/` | `/digital-work/digital-media/<filename>/` |
| E-Learning | `src/content/elearning/` ⚠️ | `src/assets/elearning/` | `/digital-work/elearning/<filename>/` |
| Physical Work | `src/content/physical-work/` | `src/assets/physical-work/` | `/physical-work/<filename>/` |

### Multiple images on one entry

Beyond the required `cover` thumbnail, add a `gallery` list for as many
extra images as you want. They render as a horizontally scrollable strip
below the cover, and clicking one opens it full-size in a lightbox.

```yaml
cover: "../../../assets/digital-work/photography/my-cover.jpg"
coverAlt: "Describe the cover for screen readers"
gallery:
  - src: "../../../assets/digital-work/photography/shot-01.jpg"
    alt: "Describe this one"
  - src: "../../../assets/digital-work/photography/shot-02.jpg"
    alt: "And this one"
```

Omit `gallery` entirely for a single-image entry. There's no limit on how
many you list. (An entry using a `video` shows the video instead of the
cover; the gallery still appears below it.)

⚠️ E-Learning is the one mismatch: its folder is `src/content/elearning/`
(not under `digital-work/`) even though its page sits under
`/digital-work/elearning/`. Historical — the folder never moved when the
page did.

**Image paths inside those `.md` files** are relative to the Markdown file:
- Photography / Digital Media → `../../../assets/digital-work/<category>/<file>`
- E-Learning / Physical Work → `../../assets/<category>/<file>`
- Blog posts → `../../assets/posts/<file>`

(Copy the path from a neighbouring entry in the same folder and you can't
get the `../` count wrong.)

Every new entry automatically appears on **All Works** (`/portfolio/all-works/`),
sorted by `date`. No separate step.

---

## 2. Blog

| What | Where |
| --- | --- |
| Add/edit/delete a post | `src/content/posts/` ⚠️ (one `.md` per post) |
| Post images | `src/assets/posts/` (reference as `../../assets/posts/<file>`) |
| Page heading / intro text | `src/pages/blog/index.astro` |

⚠️ The folder is `posts/` but the public URL is `/blog/<filename>/`. Renaming
the section didn't require moving content files.

---

## 3. Homepage

| What | Where |
| --- | --- |
| Your name, tagline, bio paragraph | `src/data/site.ts` → `site` |
| Profile photo | `src/data/site.ts` → `site.profileImage` (filename only; file goes in `src/assets/`) |
| Video reel | `src/data/site.ts` → `site.reelYoutubeId` (YouTube ID only; `''` hides it) |
| "See the work" button, section headings | `src/pages/index.astro` |
| The three cards (All Works / Digital Work / Physical Work) | see §5 below |

---

## 4. Standalone pages (plain prose — edit the file directly)

| Page | File |
| --- | --- |
| About | `src/pages/about.astro` |
| Contact | `src/pages/contact.astro` (email + socials pull from `site.ts`) |
| How this site was made | `src/pages/how-its-made.astro` |
| Portfolio landing | `src/pages/portfolio/index.astro` |
| All Works feed | `src/pages/portfolio/all-works/index.astro` |

---

## 5. Section cards, titles, descriptions & thumbnails

**All of this lives in one file: `src/data/site.ts`.** Edit once, it updates
everywhere that card appears.

| What | Where in `site.ts` |
| --- | --- |
| "All Works" card title/description | `allWorksCard` |
| "Digital Work" / "Physical Work" card title, description, thumbnail | `sections[]` → `title` / `description` / `image` |
| "Photography" / "Digital Media" / "E-Learning" card title, description, thumbnail | `sections[].subsections[]` → `title` / `description` / `image` |
| Email address + social links (footer + Contact page) | `site.email`, `site.socials` |

**Card thumbnails**: put the image in that category's asset folder, then set
`image:` to its path *relative to `src/assets/`*, including the subfolder:

| Card | Image lives in | `image:` value looks like |
| --- | --- | --- |
| Digital Work | `src/assets/digital-work/` | `'digital-work/owl.png'` |
| Physical Work | `src/assets/physical-work/` | `'physical-work/green-guy.jpg'` |
| E-Learning | `src/assets/elearning/` | `'elearning/timeline.jpg'` |
| Photography / Digital Media | their own folders | `'digital-work/photography/x.jpg'` |
| Profile photo | `src/assets/site/` | `'site/jharvey2.jpeg'` |

Omit `image` for a plain white card. If a thumbnail silently disappears,
the path is wrong — `resolveAsset()` fails quietly rather than erroring.

---

## 6. Where images live

Every image goes in a folder matching the thing it belongs to. Nothing
should sit loose in `src/assets/` root.

```
src/assets/
├── site/                      ← profile photo, any site-wide chrome image
├── digital-work/
│   ├── <Digital Work card thumbnail>
│   ├── photography/           ← photography entry covers + galleries
│   └── digital-media/         ← digital media entry covers + galleries
├── elearning/                 ← E-Learning card thumbnail + entry images
├── physical-work/             ← Physical Work card thumbnail + entry images
└── posts/                     ← blog post images
```

Astro optimizes everything here automatically at build time (resizes,
converts to WebP) — drop in full-size originals, no need to pre-compress.

---

## 7. Site-wide chrome

| What | Where |
| --- | --- |
| Nav links (Home / Portfolio / Blog / About / Contact) | `src/components/Header.astro` |
| Footer (copyright, socials, "How this site was made" link) | `src/components/Footer.astro` |
| Favicon | `public/favicon.svg` + `public/favicon.ico` (keep both in sync) |
| Domain | `public/CNAME` |
| Colors, fonts, background gradient, card styling | `src/styles/global.css` |

---

## Publishing

Nothing is live until you push:

```sh
git add -A
git commit -m "Add new entry"
git push
```

GitHub Actions rebuilds and redeploys automatically (~1–2 min).
