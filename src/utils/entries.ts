// Shared date handling for content entries.
//
// `date` is optional, so both of these must cope with it being absent —
// which is why they live here rather than being copy-pasted into the six
// listing pages and three layouts that need them.

/**
 * Newest first. Entries with no `date` sort to the end, keeping their
 * relative order — they can't claim recency, but shouldn't disappear.
 */
export function byNewestFirst(a?: Date, b?: Date): number {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;
  return b.valueOf() - a.valueOf();
}

/**
 * Formats a date for display, or returns undefined if there isn't one.
 *
 * Always pinned to UTC: frontmatter dates parse as UTC midnight, so
 * formatting in local time shows the previous day for anyone west of
 * Greenwich. Don't remove the timeZone option.
 */
export function formatDate(
  date: Date | undefined,
  options: Intl.DateTimeFormatOptions,
): string | undefined {
  return date?.toLocaleDateString('en-US', { ...options, timeZone: 'UTC' });
}
