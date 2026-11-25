import { ArrowRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from '../lib/router';
import { CategoryMeta, EnrichedSiteEntry } from '../types/site';
import { SiteAvatar } from './SiteAvatar';
import { TagBadge } from './TagBadge';

interface CategoryCardProps {
  meta: CategoryMeta;
  sites: EnrichedSiteEntry[];
}

export function CategoryCard({ meta, sites }: CategoryCardProps) {
  const [selectedFeature, setSelectedFeature] = useState<string>('All');

  const availableFilters = useMemo(() => {
    const present = new Set<string>();
    for (const s of sites) {
      for (const f of s.features) {
        present.add(f);
      }
    }
    return meta.subFilters.filter((f) => present.has(f)).slice(0, 4);
  }, [meta.subFilters, sites]);

  const filteredSites = useMemo(() => {
    if (selectedFeature === 'All') return sites.slice(0, 20);
    return sites.filter((s) => s.features.includes(selectedFeature)).slice(0, 20);
  }, [sites, selectedFeature]);

  return (
    <section
      aria-labelledby={`cat-heading-${meta.id}`}
      className="rounded-xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#171717] flex flex-col justify-between overflow-hidden transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
    >
      <div>
        {/* Card header */}
        <div className="px-4 pt-4 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-2 min-w-0">
              <h2
                id={`cat-heading-${meta.id}`}
                className="text-base font-display font-bold text-zinc-900 dark:text-zinc-100 truncate"
              >
                <Link
                  to={`/section/${meta.id}`}
                  className="hover:text-[#e5484d] transition-colors"
                >
                  {meta.label}
                </Link>
              </h2>
              <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400 shrink-0">
                {sites.length}
              </span>
            </div>

            <Link
              to={`/section/${meta.id}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-[#e5484d] dark:hover:text-[#e5484d] transition-colors whitespace-nowrap shrink-0"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>

          {/* Per-card sub-filter chips */}
          {availableFilters.length > 0 && (
            <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              <button
                type="button"
                onClick={() => setSelectedFeature('All')}
                className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e5484d] ${
                  selectedFeature === 'All'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800/70 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
              >
                All
              </button>
              {availableFilters.map((feature) => (
                <button
                  key={feature}
                  type="button"
                  onClick={() =>
                    setSelectedFeature((prev) => (prev === feature ? 'All' : feature))
                  }
                  className={`px-2 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e5484d] ${
                    selectedFeature === feature
                      ? 'bg-[#e5484d] text-white'
                      : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800/70 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {feature}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Compact ranked rows */}
        <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
          {filteredSites.length === 0 ? (
            <li className="px-4 py-6 text-center">
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No entries match "{selectedFeature}".
              </p>
              <button
                type="button"
                onClick={() => setSelectedFeature('All')}
                className="mt-2 text-xs font-medium text-[#e5484d] hover:underline"
              >
                Reset filter
              </button>
            </li>
          ) : (
            filteredSites.map((site, idx) => {
              const displayTags = site.isSponsored
                ? ['SPONSORED']
                : site.tags.slice(0, 2);

              return (
                <li key={site.slug}>
                  <Link
                    to={`/s/${site.slug}`}
                    className="group px-4 py-2.5 flex items-center justify-between gap-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/45 transition-colors focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#e5484d]"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-5 text-[11px] font-mono tabular-nums text-zinc-400 dark:text-zinc-500 shrink-0">
                        {site.isSponsored ? '★' : String(idx + 1).padStart(2, '0')}
                      </span>
                      <SiteAvatar
                        name={site.name}
                        icon={site.icon}
                        category={site.category}
                        size="sm"
                      />
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 group-hover:text-[#e5484d] transition-colors truncate">
                        {site.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {displayTags.map((tag) => (
                        <TagBadge key={tag} tag={tag} />
                      ))}
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </section>
  );
}
