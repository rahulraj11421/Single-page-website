import { ArrowUpRight, Moon, Search, ShieldAlert, Sun, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdSlot } from '../components/AdSlot';
import { CategoryCard } from '../components/CategoryCard';
import { SeoHead } from '../components/SeoHead';
import { SiteAvatar } from '../components/SiteAvatar';
import { TagBadge } from '../components/TagBadge';
import { CATEGORY_LIST, CATEGORY_META, SITE_CONFIG } from '../config/siteConfig';
import { Link } from '../lib/router';
import {
  createSiteSearchIndex,
  getActiveSites,
  getActiveSitesByCategory,
  sortRankedSites,
} from '../lib/sites';
import { CategoryId } from '../types/site';

interface HomePageProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  showNsfw: boolean;
  onRequestToggleNsfw: () => void;
}

export function HomePage({
  theme,
  onToggleTheme,
  showNsfw,
  onRequestToggleNsfw,
}: HomePageProps) {
  const [selectedCategory, setSelectedCategory] = useState<'any' | CategoryId>('any');
  const [searchQuery, setSearchQuery] = useState('');

  const allActive = useMemo(() => sortRankedSites(getActiveSites(showNsfw)), [showNsfw]);
  const fuse = useMemo(() => createSiteSearchIndex(allActive), [allActive]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];
    const hits = fuse.search(q).map((r) => r.item);
    if (selectedCategory === 'any') return hits;
    return hits.filter((s) => s.category === selectedCategory);
  }, [searchQuery, fuse, selectedCategory]);

  const visibleCategories = useMemo(() => {
    if (selectedCategory === 'any') return CATEGORY_LIST;
    return [CATEGORY_META[selectedCategory]];
  }, [selectedCategory]);

  const jsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_CONFIG.name,
      description: SITE_CONFIG.tagline,
      url: SITE_CONFIG.domain,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_CONFIG.domain}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
    []
  );

  return (
    <main className="max-w-[1380px] mx-auto px-4 sm:px-6 pt-6 pb-8 space-y-6">
      <SeoHead
        title={`${SITE_CONFIG.name} – Curated Anime, Manga & Otaku Tools Directory`}
        description="Explore KuraIndex, a fast curated index of the best legal anime, manga, manhwa, light novel, music, schedule, and database platforms."
        path="/"
        jsonLd={jsonLd}
      />

      {/* Directory Command Strip */}
      <section aria-label="Directory controls" className="space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-100 [text-wrap:balance]">
              Curated Anime, Manga &amp; Otaku Directory
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-mono tabular-nums text-zinc-900 dark:text-zinc-200 font-medium">
                {allActive.length}
              </span>{' '}
              verified official platforms and open tools ranked across{' '}
              <span className="font-mono tabular-nums text-zinc-900 dark:text-zinc-200 font-medium">
                {CATEGORY_LIST.length}
              </span>{' '}
              categories.
            </p>
          </div>

          {/* Search input + Workspace toggles */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-72 md:w-80">
              <Search
                className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by site, tag, or feature..."
                aria-label="Filter directory sites"
                className="w-full h-10 pl-9 pr-8 text-sm rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#171717] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#e5484d]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear filter"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onRequestToggleNsfw}
              aria-pressed={showNsfw}
              className={`h-10 inline-flex items-center gap-1.5 px-3 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e5484d] ${
                showNsfw
                  ? 'border-red-500/40 bg-red-500/12 text-red-600 dark:text-red-400'
                  : 'border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#171717] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
              <span>18+ {showNsfw ? 'On' : 'Off'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="h-10 w-10 inline-flex items-center justify-center rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#171717] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0 focus-visible:outline-2 focus-visible:outline-[#e5484d]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Category Chips Bar */}
        <div
          role="tablist"
          aria-label="Filter by category"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedCategory === 'any'}
            onClick={() => setSelectedCategory('any')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e5484d] ${
              selectedCategory === 'any'
                ? 'bg-[#e5484d] text-white'
                : 'bg-white dark:bg-[#171717] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            Any
          </button>
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e5484d] ${
                selectedCategory === cat.id
                  ? 'bg-[#e5484d] text-white'
                  : 'bg-white dark:bg-[#171717] border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      <AdSlot slot="headerBanner" />

      {/* Search Results View OR Category Cards Grid */}
      {searchQuery.trim() ? (
        <section aria-label="Search results" className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              <span className="font-mono tabular-nums font-semibold text-zinc-900 dark:text-zinc-100">
                {searchResults.length}
              </span>{' '}
              {searchResults.length === 1 ? 'result' : 'results'} for "{searchQuery.trim()}"
            </h2>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-medium text-[#e5484d] hover:underline"
            >
              Clear search
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-10 text-center space-y-2">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                No platforms found
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Try another keyword, or switch category from "Any" to search the entire index.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((site) => (
                <div
                  key={site.slug}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-4 flex flex-col justify-between gap-3 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        to={`/s/${site.slug}`}
                        className="flex items-center gap-2.5 min-w-0 group"
                      >
                        <SiteAvatar
                          name={site.name}
                          icon={site.icon}
                          category={site.category}
                          size="md"
                        />
                        <div className="min-w-0">
                          <h3 className="text-sm font-display font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#e5484d] truncate">
                            {site.name}
                          </h3>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            {CATEGORY_META[site.category].label} · Rank #{site.rank}
                          </p>
                        </div>
                      </Link>
                      <a
                        href={site.outboundUrl}
                        target="_blank"
                        rel={
                          site.isSponsored || site.hasAffiliate
                            ? 'nofollow noopener sponsored'
                            : 'noopener noreferrer'
                        }
                        aria-label={`Visit ${site.name}`}
                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 shrink-0"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                      {site.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {site.isSponsored && <TagBadge tag="SPONSORED" />}
                    {site.tags.slice(0, 3).map((tag) => (
                      <TagBadge key={tag} tag={tag} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ) : (
        <div
          className={`grid gap-4 items-start ${
            visibleCategories.length === 1
              ? 'grid-cols-1 max-w-2xl'
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
          }`}
        >
          {visibleCategories.map((meta, index) => {
            const catSites = getActiveSitesByCategory(meta.id, showNsfw);
            return (
              <div key={meta.id} className="contents">
                <CategoryCard meta={meta} sites={catSites} />
                {selectedCategory === 'any' && index === 5 && <AdSlot slot="inGrid" />}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
