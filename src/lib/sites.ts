import Fuse from 'fuse.js';
import { SITE_CONFIG } from '../config/siteConfig';
import { resolveOutboundLink } from '../config/affiliates';
import { CategoryId, EnrichedSiteEntry, SiteEntry } from '../types/site';

const rawModules = import.meta.glob<{ default: SiteEntry }>('../data/sites/*.json', {
  eager: true,
});

function isWithinDays(dateStr: string, days: number): boolean {
  const addedTime = new Date(`${dateStr}T00:00:00Z`).getTime();
  if (Number.isNaN(addedTime)) return false;
  const now = Date.now();
  const diffDays = (now - addedTime) / (1000 * 60 * 60 * 24);
  return diffDays >= -1 && diffDays <= days;
}

const sponsoredSet = new Set(SITE_CONFIG.sponsoredSlugs);

export const ALL_SITES: EnrichedSiteEntry[] = Object.values(rawModules).map((mod) => {
  const entry = mod.default;
  const { url: outboundUrl, hasAffiliate } = resolveOutboundLink(entry.slug, entry.url);
  const isNew = isWithinDays(entry.dateAdded, SITE_CONFIG.newThresholdDays);
  const isSponsored = sponsoredSet.has(entry.slug);
  const tags = isNew && !entry.tags.includes('NEW') ? ['NEW', ...entry.tags] : entry.tags;

  return {
    ...entry,
    tags,
    isNew,
    isSponsored,
    outboundUrl,
    hasAffiliate,
  };
});

export function sortRankedSites(sites: EnrichedSiteEntry[]): EnrichedSiteEntry[] {
  return [...sites].sort((a, b) => {
    if (a.isSponsored !== b.isSponsored) return a.isSponsored ? -1 : 1;
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.name.localeCompare(b.name);
  });
}

export function getActiveSites(showNsfw: boolean): EnrichedSiteEntry[] {
  return ALL_SITES.filter((site) => site.status === 'active' && (showNsfw || !site.isNsfw));
}

export function getActiveSitesByCategory(
  category: CategoryId,
  showNsfw: boolean
): EnrichedSiteEntry[] {
  return sortRankedSites(
    getActiveSites(showNsfw).filter((site) => site.category === category)
  );
}

export function getDeadSites(showNsfw: boolean): EnrichedSiteEntry[] {
  return ALL_SITES.filter(
    (site) => site.status === 'dead' && (showNsfw || !site.isNsfw)
  ).sort((a, b) => a.name.localeCompare(b.name));
}

export function getSiteBySlug(slug: string): EnrichedSiteEntry | undefined {
  return ALL_SITES.find((site) => site.slug === slug);
}

export function getRelatedSites(
  site: EnrichedSiteEntry,
  showNsfw: boolean,
  limit = 6
): EnrichedSiteEntry[] {
  return getActiveSitesByCategory(site.category, showNsfw)
    .filter((item) => item.slug !== site.slug)
    .slice(0, limit);
}

export function getActivityFeed(showNsfw: boolean): EnrichedSiteEntry[] {
  return ALL_SITES.filter((site) => showNsfw || !site.isNsfw).sort((a, b) => {
    const dateA = a.dateUpdated || a.dateAdded;
    const dateB = b.dateUpdated || b.dateAdded;
    if (dateA !== dateB) return dateB.localeCompare(dateA);
    return a.name.localeCompare(b.name);
  });
}

export function createSiteSearchIndex(sites: EnrichedSiteEntry[]) {
  return new Fuse(sites, {
    keys: [
      { name: 'name', weight: 0.45 },
      { name: 'category', weight: 0.2 },
      { name: 'tags', weight: 0.15 },
      { name: 'features', weight: 0.1 },
      { name: 'description', weight: 0.1 },
    ],
    threshold: 0.35,
    ignoreLocation: true,
  });
}
