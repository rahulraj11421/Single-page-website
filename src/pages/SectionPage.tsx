import { ArrowLeft, ArrowUpRight, Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdSlot } from '../components/AdSlot';
import { SeoHead } from '../components/SeoHead';
import { SiteAvatar } from '../components/SiteAvatar';
import { TagBadge } from '../components/TagBadge';
import { CATEGORY_LIST, CATEGORY_META, SITE_CONFIG } from '../config/siteConfig';
import { Link } from '../lib/router';
import { getActiveSitesByCategory } from '../lib/sites';
import { CategoryId } from '../types/site';

interface SectionPageProps {
  category: string;
  showNsfw: boolean;
}

type SortMode = 'rank' | 'name' | 'newest';

export function SectionPage({ category, showNsfw }: SectionPageProps) {
  const isValid = category in CATEGORY_META;
  const catId = (isValid ? category : 'anime') as CategoryId;
  const meta = CATEGORY_META[catId];

  const [query, setQuery] = useState('');
  const [selectedFeature, setSelectedFeature] = useState<string>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [sortMode, setSortMode] = useState<SortMode>('rank');

  const allCategorySites = useMemo(
    () => (isValid ? getActiveSitesByCategory(catId, showNsfw) : []),
    [isValid, catId, showNsfw]
  );

  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    for (const s of allCategorySites) {
      for (const t of s.tags) tags.add(t);
    }
    return Array.from(tags);
  }, [allCategorySites]);

  const availableFeatures = useMemo(() => {
    const feats = new Set<string>();
    for (const s of allCategorySites) {
      for (const f of s.features) feats.add(f);
    }
    return Array.from(feats);
  }, [allCategorySites]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = allCategorySites.filter((site) => {
      if (selectedFeature !== 'All' && !site.features.includes(selectedFeature)) {
        return false;
      }
      if (selectedTag !== 'All' && !site.tags.includes(selectedTag)) {
        return false;
      }
      if (q) {
        return (
          site.name.toLowerCase().includes(q) ||
          site.description.toLowerCase().includes(q) ||
          site.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortMode === 'rank') {
        if (a.isSponsored !== b.isSponsored) return a.isSponsored ? -1 : 1;
        return a.rank - b.rank;
      }
      if (sortMode === 'name') {
        return a.name.localeCompare(b.name);
      }
      return b.dateAdded.localeCompare(a.dateAdded);
    });
  }, [allCategorySites, query, selectedFeature, selectedTag, sortMode]);

  if (!isValid) {
    return (
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <SeoHead
          title="Category Not Found"
          description="The requested category does not exist in KuraIndex."
          path={`/section/${category}`}
        />
        <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100">
          Category not found
        </h1>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#e5484d] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Directory</span>
        </Link>
      </main>
    );
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${meta.label} Directory – ${SITE_CONFIG.name}`,
    description: meta.description,
    url: `${SITE_CONFIG.domain}/section/${meta.id}`,
  };

  return (
    <main className="max-w-[1380px] mx-auto px-4 sm:px-6 pt-6 pb-10 space-y-6">
      <SeoHead
        title={`${meta.label} Sites & Tools`}
        description={meta.description}
        path={`/section/${meta.id}`}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
          Directory
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-900 dark:text-zinc-100 font-medium">{meta.label}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100">
              {meta.label}
            </h1>
            <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
              {filtered.length} of {allCategorySites.length} listed
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">{meta.description}</p>
        </div>

        {/* Sort & in-category search */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${meta.label.toLowerCase()}...`}
              aria-label={`Search within ${meta.label}`}
              className="w-full h-9 pl-8 pr-7 text-xs rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#171717] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-[#e5484d]"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <label className="sr-only" htmlFor="section-sort">
            Sort sites
          </label>
          <select
            id="section-sort"
            value={sortMode}
            onChange={(e) => setSortMode(e.target.value as SortMode)}
            className="h-9 px-3 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#171717] text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-[#e5484d]"
          >
            <option value="rank">Sort: Ranked</option>
            <option value="name">Sort: Name (A–Z)</option>
            <option value="newest">Sort: Newest</option>
          </select>
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2.5">
        {availableFeatures.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-1">Features:</span>
            <button
              type="button"
              onClick={() => setSelectedFeature('All')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedFeature === 'All'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              All
            </button>
            {availableFeatures.map((feat) => (
              <button
                key={feat}
                type="button"
                onClick={() =>
                  setSelectedFeature((prev) => (prev === feat ? 'All' : feat))
                }
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedFeature === feat
                    ? 'bg-[#e5484d] text-white'
                    : 'bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {feat}
              </button>
            ))}
          </div>
        )}

        {availableTags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-zinc-500 dark:text-zinc-400 mr-1">Tags:</span>
            <button
              type="button"
              onClick={() => setSelectedTag('All')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                selectedTag === 'All'
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                  : 'bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              All
            </button>
            {availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag((prev) => (prev === tag ? 'All' : tag))}
                className={`px-2.5 py-1 text-xs font-mono font-medium rounded-md transition-colors ${
                  selectedTag === tag
                    ? 'bg-[#e5484d] text-white'
                    : 'bg-zinc-200/70 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] divide-y divide-zinc-100 dark:divide-zinc-800/80 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="p-10 text-center space-y-2">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                No sites match your filters
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setSelectedFeature('All');
                  setSelectedTag('All');
                }}
                className="text-xs font-medium text-[#e5484d] hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filtered.map((site, idx) => (
              <div
                key={site.slug}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/35 transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="w-6 pt-1 text-xs font-mono tabular-nums text-zinc-400 dark:text-zinc-500 shrink-0">
                    {site.isSponsored ? '★' : String(idx + 1).padStart(2, '0')}
                  </span>
                  <SiteAvatar
                    name={site.name}
                    icon={site.icon}
                    category={site.category}
                    size="md"
                  />
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        to={`/s/${site.slug}`}
                        className="text-base font-display font-bold text-zinc-900 dark:text-zinc-100 hover:text-[#e5484d] transition-colors"
                      >
                        {site.name}
                      </Link>
                      {site.isSponsored && <TagBadge tag="SPONSORED" />}
                      {site.tags.map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                      {site.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 dark:text-zinc-500 pt-0.5">
                      <span>{site.features.join(' · ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-9 sm:pl-0">
                  <Link
                    to={`/s/${site.slug}`}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap"
                  >
                    Details
                  </Link>
                  <a
                    href={site.outboundUrl}
                    target="_blank"
                    rel={
                      site.isSponsored || site.hasAffiliate
                        ? 'nofollow noopener sponsored'
                        : 'noopener noreferrer'
                    }
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-[#e5484d] text-white hover:bg-[#d13b40] transition-colors whitespace-nowrap"
                  >
                    <span>Visit</span>
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <AdSlot slot="sidebar" />

          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-4 space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Browse Categories
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_LIST.map((c) => (
                <Link
                  key={c.id}
                  to={`/section/${c.id}`}
                  className={`px-2 py-1 text-xs rounded-md transition-colors ${
                    c.id === catId
                      ? 'bg-[#e5484d] text-white font-medium'
                      : 'bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
