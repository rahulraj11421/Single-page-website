export const CATEGORIES = [
  'anime',
  'donghua',
  'manga',
  'manhwa',
  'novel',
  'drama',
  'games',
  'apps',
  'download',
  'music',
  'schedule',
  'database',
  'tools',
  'quiz',
  'trends',
  'guides',
  'vtuber',
  'gacha',
  'cosplay',
  'amv',
  'forums',
] as const;

export type CategoryId = (typeof CATEGORIES)[number];

export type SiteStatus = 'active' | 'dead';

export interface SiteEntry {
  name: string;
  slug: string;
  url: string;
  category: CategoryId;
  description: string;
  rank: number;
  tags: string[];
  features: string[];
  isLegal: boolean;
  isNsfw: boolean;
  icon: string;
  dateAdded: string;
  dateUpdated?: string;
  status: SiteStatus;
  closedNote?: string;
}

export interface EnrichedSiteEntry extends SiteEntry {
  isNew: boolean;
  isSponsored: boolean;
  outboundUrl: string;
  hasAffiliate: boolean;
}

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  description: string;
  subFilters: string[];
}
