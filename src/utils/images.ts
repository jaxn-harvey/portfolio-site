// Resolves a plain filename (site.profileImage, section.image, etc.) to an
// optimizable Astro asset. Astro can't import a variable path directly, so
// import.meta.glob loads every image in src/assets/ up front and this looks
// up the one needed by filename. Convention: these singleton images must
// live directly in src/assets/ (not a subfolder).
const assetImages = import.meta.glob<{ default: import('astro').ImageMetadata }>(
  '/src/assets/*.{jpeg,jpg,png,webp,avif,gif,svg}',
  { eager: true },
);

export const resolveAsset = (filename?: string) =>
  filename ? assetImages[`/src/assets/${filename}`]?.default : undefined;
