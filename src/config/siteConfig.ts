import { CategoryMeta, CategoryId } from '../types/site';

export const SITE_CONFIG = {
  name: 'KuraIndex',
  tagline: 'Curated directory of official anime, manga, novel, music, and community platforms.',
  domain: 'https://kuraindex.org',
  contactEmail: 'submissions@kuraindex.org',
  /** Optional Formspree endpoint (e.g., 'https://formspree.io/f/your-id'). Leave empty to use mailto + JSON export fallback. */
  formspreeEndpoint: '',
  /** Automatically badge entries added within this many days as NEW */
  newThresholdDays: 14,
  /** Slugs pinned to the top of their category with a clear "Sponsored" label */
  sponsoredSlugs: ['crunchyroll', 'bookwalker-global', 'anilist'] as string[],
  /** Analytics configuration (leave blank until ready to enable) */
  analytics: {
    cloudflareWebAnalyticsToken: '',
    plausibleDomain: '',
  },
} as const;

export const CATEGORY_META: Record<CategoryId, CategoryMeta> = {
  anime: {
    id: 'anime',
    label: 'Anime',
    description: 'Licensed anime streaming platforms, simulcasts, and official video catalogs.',
    subFilters: ['Soft-sub', 'Dub friendly', 'Simulcast', 'Free tier', 'Modern UI'],
  },
  donghua: {
    id: 'donghua',
    label: 'Donghua',
    description: 'Official Chinese animation streaming portals, studios, and multilingual channels.',
    subFilters: ['Soft-sub', 'Free tier', 'Simulcast', 'Modern UI', 'Mobile app'],
  },
  manga: {
    id: 'manga',
    label: 'Manga',
    description: 'Authorized digital manga readers, simulpub apps, and official publisher stores.',
    subFilters: ['Simulpub', 'Free tier', 'Modern UI', 'Mobile app', 'DRM-free'],
  },
  manhwa: {
    id: 'manhwa',
    label: 'Manhwa',
    description: 'Vertical-scroll webtoon platforms and official Korean comic publishers.',
    subFilters: ['Vertical scroll', 'Free tier', 'Mobile app', 'Modern UI', 'Simulpub'],
  },
  novel: {
    id: 'novel',
    label: 'Novel',
    description: 'Official light novel publishers, web novel portals, and digital book platforms.',
    subFilters: ['DRM-free', 'Pre-pubs', 'Mobile app', 'Free tier', 'Modern UI'],
  },
  drama: {
    id: 'drama',
    label: 'Drama',
    description: 'Licensed Asian live-action drama, film, and tokusatsu streaming services.',
    subFilters: ['Soft-sub', 'Free tier', 'Modern UI', 'Mobile app', 'Simulcast'],
  },
  games: {
    id: 'games',
    label: 'Games',
    description: 'Official visual novel storefronts, rhythm games, and anime game distributors.',
    subFilters: ['DRM-free', 'PC client', 'Localization', 'Free tier', 'Modern UI'],
  },
  apps: {
    id: 'apps',
    label: 'Apps',
    description: 'Dedicated iOS, Android, and desktop companion apps for tracking and reading.',
    subFilters: ['iOS & Android', 'Open source', 'Modern UI', 'Offline sync', 'Free tier'],
  },
  download: {
    id: 'download',
    label: 'Download',
    description: 'Legitimate DRM-free digital storefronts, artbook archives, and offline purchases.',
    subFilters: ['DRM-free', 'High-res', 'Direct download', 'Localization', 'Creator direct'],
  },
  music: {
    id: 'music',
    label: 'Music',
    description: 'Official anisong streaming catalogs, lossless soundtrack stores, and rhythm portals.',
    subFilters: ['Lossless', 'Official OST', 'Free tier', 'Mobile app', 'Modern UI'],
  },
  schedule: {
    id: 'schedule',
    label: 'Schedule',
    description: 'Airing calendars, seasonal countdowns, and simulcast broadcast trackers.',
    subFilters: ['Live countdown', 'Timezone sync', 'Modern UI', 'Free tier', 'No account'],
  },
  database: {
    id: 'database',
    label: 'Database',
    description: 'Comprehensive anime, manga, staff, seiyuu, and production credit encyclopedias.',
    subFilters: ['API available', 'Modern UI', 'List tracking', 'Staff credits', 'Free tier'],
  },
  tools: {
    id: 'tools',
    label: 'Tools',
    description: 'Browser extensions, list importers, recommendation engines, and lookup utilities.',
    subFilters: ['Open source', 'No account', 'Modern UI', 'API available', 'Free tier'],
  },
  quiz: {
    id: 'quiz',
    label: 'Quiz',
    description: 'Interactive anime music quizzes, character trivia, and opening/ending challenges.',
    subFilters: ['Multiplayer', 'Free tier', 'No account', 'Audio quiz', 'Modern UI'],
  },
  trends: {
    id: 'trends',
    label: 'Trends',
    description: 'Seasonal popularity charts, episode rankings, and community poll aggregators.',
    subFilters: ['Weekly charts', 'Free tier', 'Modern UI', 'No account', 'Editorial'],
  },
  guides: {
    id: 'guides',
    label: 'Guides',
    description: 'Watch order guides, beginner roadmaps, translation notes, and industry explainers.',
    subFilters: ['Watch orders', 'Editorial', 'Free tier', 'No account', 'Beginner friendly'],
  },
  vtuber: {
    id: 'vtuber',
    label: 'VTuber',
    description: 'Official virtual talent agencies, stream schedules, clip archives, and fan wikis.',
    subFilters: ['Live schedule', 'Multi-stream', 'Modern UI', 'Free tier', 'No account'],
  },
  gacha: {
    id: 'gacha',
    label: 'Gacha',
    description: 'Official gacha game portals, banner planners, tier lists, and drop rate databases.',
    subFilters: ['Banner planner', 'Wiki & DB', 'Free tier', 'Modern UI', 'No account'],
  },
  cosplay: {
    id: 'cosplay',
    label: 'Cosplay',
    description: 'Official costume makers, wig suppliers, prop pattern libraries, and convention hubs.',
    subFilters: ['Pattern library', 'Global shipping', 'Tutorials', 'Creator direct', 'Free tier'],
  },
  amv: {
    id: 'amv',
    label: 'AMV',
    description: 'Curated anime music video showcases, contest archives, and editor communities.',
    subFilters: ['Contest archive', 'Curated picks', 'Free tier', 'Creator profiles', 'Editorial'],
  },
  forums: {
    id: 'forums',
    label: 'Forums',
    description: 'Active episode discussion boards, manga clubs, and enthusiast communities.',
    subFilters: ['Episode threads', 'Moderated', 'Free tier', 'Modern UI', 'Mobile app'],
  },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORY_META);
