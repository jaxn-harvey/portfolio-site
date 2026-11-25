import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// A real calendar date, used for sort order on every listing page.
//
// Deliberately NOT z.coerce.date(): that quietly turns "Fall 2023" into
// 1 Jan 2023 and an empty value into 1 Jan 1970 — wrong but *valid* dates,
// so the build passes and the entry just sorts/displays incorrectly. This
// fails the build instead, and says what to do about it.
const sortableDate = z.unknown().transform((value, ctx) => {
  const fail = (message: string) => {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message });
    return z.NEVER;
  };

  // YAML parses an unquoted 2026-05-01 straight into a Date.
  if (value instanceof Date) {
    return Number.isNaN(value.valueOf()) ? fail('`date` is not a valid date.') : value;
  }

  if (value === null || value === undefined || value === '') {
    return fail('`date` is required — e.g. `date: 2023-09-01`. It drives sort order.');
  }

  if (typeof value !== 'string') {
    return fail('`date` must be a calendar date like 2023-09-01.');
  }

  const trimmed = value.trim();
  if (!/^\d{4}(-\d{2}){0,2}$/.test(trimmed)) {
    return fail(
      `"${trimmed}" is not a calendar date, so it can't be sorted. ` +
        'Put a real date in `date` and the wording in `dateLabel` — e.g. ' +
        '`date: 2023-09-01` plus `dateLabel: "Fall 2023"`. Only dateLabel is displayed.',
    );
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.valueOf()) ? fail(`"${trimmed}" is not a valid date.`) : parsed;
});

// Shared shape for every "entry module" across every section/subsection.
// Each entry is a single Markdown file: frontmatter for structured fields,
// the Markdown body is the long-form description.
// `image()` gives us Astro's built-in image optimization (auto width/height,
// responsive output) for cover + gallery images referenced relative to the
// Markdown file itself, e.g. cover: "./cover.jpg" next to a same-folder image.
const entrySchema = ({ image }: { image: () => z.ZodType<any> }) =>
  z.object({
    title: z.string(),
    // Short blurb shown on the grid card and under the title on the detail
    // page. Optional — omit the line entirely and both simply don't render.
    summary: z.string().max(200).optional(),
    // Both date fields are optional. If you set `date`, it drives sort order
    // on listing pages (newest first; undated entries sort to the end). If
    // you set `dateLabel`, that's what's displayed instead of the formatted
    // date. Set neither and no date shows at all.
    date: sortableDate.optional(),
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
    // Set `draft: true` to hide an entry: it's excluded from every listing
    // and its detail page isn't generated at all, so it's unreachable even
    // by direct URL. Omit it (or set false) and the entry is live.
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
    date: sortableDate.optional(),
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
