import { Archive, ArrowUpRight } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { SiteAvatar } from '../components/SiteAvatar';
import { TagBadge } from '../components/TagBadge';
import { CATEGORY_META } from '../config/siteConfig';
import { Link } from '../lib/router';
import { getDeadSites } from '../lib/sites';

interface GraveyardPageProps {
  showNsfw: boolean;
}

export function GraveyardPage({ showNsfw }: GraveyardPageProps) {
  const deadSites = getDeadSites(showNsfw);

  return (
    <main className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-12 space-y-6">
      <SeoHead
        title="Platform Graveyard"
        description="Archive of retired, consolidated, or discontinued official anime and manga platforms."
        path="/graveyard"
      />

      <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2.5">
          <Archive className="w-5 h-5 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100">
            Platform Graveyard
          </h1>
          <span className="text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400">
            {deadSites.length} archived
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
          A historical record of official streaming platforms, storefronts, and services that have shut down or consolidated into newer catalogs.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] divide-y divide-zinc-100 dark:divide-zinc-800/80 overflow-hidden">
        {deadSites.map((site) => (
          <div
            key={site.slug}
            className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3.5 min-w-0">
              <div className="opacity-70 grayscale">
                <SiteAvatar
                  name={site.name}
                  icon={site.icon}
                  category={site.category}
                  size="md"
                />
              </div>
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    to={`/s/${site.slug}`}
                    className="text-base font-display font-bold text-zinc-900 dark:text-zinc-100 hover:text-[#e5484d] transition-colors"
                  >
                    {site.name}
                  </Link>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    {CATEGORY_META[site.category].label}
                  </span>
                  <TagBadge tag="CLOSED" />
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
                  {site.description}
                </p>
                {site.closedNote && (
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {site.closedNote}
                  </p>
                )}
              </div>
            </div>

            <Link
              to={`/s/${site.slug}`}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Record</span>
              <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
