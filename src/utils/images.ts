// Resolves an asset path (site.profileImage, section.image, etc.) to an
// optimizable Astro asset. Astro can't import a variable path directly, so
// import.meta.glob loads every image under src/assets/ up front and this
// looks up the one needed.
//
// Paths are written relative to src/assets/, including the subfolder —
// e.g. 'site/me.jpg' or 'physical-work/green-guy.jpg'. See CONTENT-MAP.md
// for which folder each kind of image belongs in.
const assetImages = import.meta.glob<{ default: import('astro').ImageMetadata }>(
  '/src/assets/**/*.{jpeg,jpg,png,webp,avif,gif,svg}',
  { eager: true },
);

const available = Object.keys(assetImages).map((k) => k.replace('/src/assets/', ''));

export const resolveAsset = (path?: string) => {
  // Omitting the field entirely is legitimate — that means "no image".
  if (!path) return undefined;

  const found = assetImages[`/src/assets/${path}`]?.default;
  if (found) return found;

  // A path that was given but doesn't resolve is a typo, and silently
  // rendering a blank card just hides it. Fail the build and say what's
  // wrong. Most mistakes are a missing/incorrect subfolder rather than a
  // misspelt filename, so lead with same-named files elsewhere.
  const basename = path.split('/').pop();
  const sameName = available.filter((p) => p.split('/').pop() === basename);
  const suggestion = sameName.length
    ? `\n  Did you mean:\n${sameName.map((p) => `    ${p}`).join('\n')}`
    : `\n  Available images:\n${available.map((p) => `    ${p}`).join('\n')}`;

  throw new Error(
    `Image not found: "${path}" (looked for src/assets/${path}).\n` +
      `  Paths are relative to src/assets/ and must include the subfolder.${suggestion}`,
  );
};
