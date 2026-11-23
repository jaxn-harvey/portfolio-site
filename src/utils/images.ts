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

export const resolveAsset = (path?: string) =>
  path ? assetImages[`/src/assets/${path}`]?.default : undefined;
