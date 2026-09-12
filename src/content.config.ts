import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Shared shape for every "entry module" across every section/subsection.
// Each entry is a single Markdown file: frontmatter for structured fields,
// the Markdown body is the long-form description.
// `image()` gives us Astro's built-in image optimization (auto width/height,
// responsive output) for cover + gallery images referenced relative to the
// Markdown file itself, e.g. cover: "./cover.jpg" next to a same-folder image.
const entrySchema = ({ image }: { image: () => z.ZodType<any> }) =>
  z.object({
    title: z.string(),
    summary: z.string().max(200), // short blurb shown on grid/card view
    date: z.coerce.date(),
    // Optional freeform text shown instead of the formatted `date` above,
    // e.g. "Fall 2024" or "Summer 2023". `date` still drives sort order on
    // listing pages, so keep it set to a real (approximate is fine) date —
    // dateLabel only changes what's displayed.
    dateLabel: z.string().optional(),
    cover: image(),
    coverAlt: z.string().default(''),
    // Optional single featured video (YouTube video ID only, e.g. "dQw4w9WgXcQ").
    video: z
      .object({
        youtubeId: z.string(),
        caption: z.string().optional(),
      })
      .optional(),
    // Optional extra image gallery beyond the cover image.
    gallery: z
      .array(
        z.object({
          src: image(),
          alt: z.string().default(''),
        }),
      )
      .default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  });

const digitalPhotography = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/digital-work/photography' }),
  schema: entrySchema,
});

const digitalMedia = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/digital-work/digital-media' }),
  schema: entrySchema,
});

const physicalWork = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/physical-work' }),
  schema: entrySchema,
});

const elearning = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/elearning' }),
  schema: entrySchema,
});

// Posts are lighter-weight than portfolio entries: no mandatory cover image
// or gallery, just a title, date, and body text (an optional image is fine).
const postSchema = ({ image }: { image: () => z.ZodType<any> }) =>
  z.object({
    title: z.string(),
    date: z.coerce.date(),
    dateLabel: z.string().optional(),
    summary: z.string().max(300).optional(),
    cover: image().optional(),
    coverAlt: z.string().default(''),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  });

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: postSchema,
});

export const collections = {
  'digital-photography': digitalPhotography,
  'digital-media': digitalMedia,
  'physical-work': physicalWork,
  elearning,
  posts,
};
