// Single place to edit your name, bio, reel video, and social links.
export const site = {
  name: 'Jackson Harvey',
  tagline: 'Tech + Design',
  about: `I'm a creator in the intersection between technology, traditional artforms, and instructional design. This site showcases my work as a learner and a professional.`,
  // YouTube video ID for the homepage reel, e.g. "dQw4w9WgXcQ" from
  // https://www.youtube.com/watch?v=dQw4w9WgXcQ. Leave empty to hide the reel.
  reelYoutubeId: 'QP88qt2hum8',
  // Homepage/About profile photo. Path relative to src/assets/ (include the
  // subfolder). Astro optimizes it automatically at build time. Set to '' to
  // hide it. See CONTENT-MAP.md for which folder images belong in.
  profileImage: 'site/jharvey2.jpeg',
  email: 'jacksonian.era23@gmail.com',
  // `icon` is optional — matches a key in src/components/SocialIcon.astro.
  // Omit it to show just the text label, no icon.
  socials: [
    // { label: 'Instagram', url: 'https://instagram.com/yourhandle' },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jackson-harvey-19157027b/', icon: 'linkedin' },
  ],
};

type Subsection = {
  slug: string;
  title: string;
  description: string;
  href: string;
  // Background photo for this subsection's card on the parent section's
  // overview page. Same filename convention as the top-level `image` below.
  image?: string;
};

export type Section = {
  slug: string;
  title: string;
  description: string;
  href: string;
  // Background photo for the homepage/Portfolio directory card. Path
  // relative to src/assets/, including the subfolder (e.g.
  // 'physical-work/green-guy.jpg'). Omit to fall back to a plain card.
  image?: string;
  subsections?: Subsection[];
};

// "Digital Work" and "Physical Work" sit under the Portfolio nav item
// (see src/pages/portfolio/), alongside the computed "All Works" feed
// described here — it isn't listed in `sections` since it's not its own
// content collection (see src/pages/portfolio/all-works/index.astro for
// where the entries actually come from).
export const allWorksCard = {
  title: 'All Works',
  description: 'Every project in one place.',
  href: '/portfolio/all-works/',
};

export const sections: Section[] = [
  {
    slug: 'digital-work',
    title: 'Digital Work',
    description: 'Browse a category.',
    href: '/digital-work/',
    image: 'digital-work/Autumn_Morning_Owl (1).png',
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
      {
        slug: 'elearning',
        title: 'E-Learning',
        description: 'Instructional design and educational technology.',
        href: '/digital-work/elearning/',
        image: 'elearning/Instructional Media History Timeline.jpg',
      },
    ],
  },
  {
    slug: 'physical-work',
    title: 'Physical Work',
    description: 'Traditional and material-based projects.',
    href: '/physical-work/',
    image: 'physical-work/green-guy.jpg',
  },
];
