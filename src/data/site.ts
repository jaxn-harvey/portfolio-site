// Single place to edit your name, bio, reel video, and social links.
export const site = {
  name: 'Jackson Harvey',
  tagline: 'Tech + Design',
  about: `I'm a creator working in the intersection between technology, traditional
  craft, and instructional design. This site showcases my work as a learner and a professional.`,
  // YouTube video ID for the homepage reel, e.g. "dQw4w9WgXcQ" from
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ. Leave empty to hide the reel.
  reelYoutubeId: 'QP88qt2hum8',
  // Homepage profile photo. Just the filename — the file must live directly
  // in src/assets/ (not a subfolder). Astro optimizes it automatically at
  // build time. Set to '' to hide it.
  profileImage: 'jharvey2.jpeg',
  email: 'jxinkling@gmail.com',
  socials: [
    // { label: 'Instagram', url: 'https://instagram.com/yourhandle' },
    // { label: 'LinkedIn', url: 'https://linkedin.com/in/yourhandle' },
  ],
};

export type Section = {
  slug: string;
  title: string;
  description: string;
  href: string;
  // Background photo for the homepage directory card. Filename only — the
  // file must live directly in src/assets/ (not a subfolder), same as
  // profileImage above. Omit to fall back to a plain card.
  image?: string;
  subsections?: { slug: string; title: string; description: string; href: string }[];
};

export const sections: Section[] = [
  {
    slug: 'digital-work',
    title: 'Digital Work',
    description: 'Browse a category.',
    href: '/digital-work/',
    image: 'Autumn_Morning_Owl (1).png',
    subsections: [
      {
        slug: 'photography',
        title: 'Photography',
        description: 'Various photographic works.',
        href: '/digital-work/photography/',
      },
      {
        slug: 'digital-media',
        title: 'Digital Media',
        description: 'Animation, 3D, illustration, and more.',
        href: '/digital-work/digital-media/',
      },
    ],
  },
  {
    slug: 'physical-work',
    title: 'Physical Work',
    description: 'Traditional and material-based projects.',
    href: '/physical-work/',
    image: 'green-guy.jpg',
  },
  {
    slug: 'elearning',
    title: 'E-Learning',
    description: 'Instructional design and educational technology.',
    href: '/elearning/',
    image: 'Instructional Media History Timeline.jpg',
  },
];
