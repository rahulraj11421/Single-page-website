import { ArrowUpRight, Clock } from 'lucide-react';
import { useMemo } from 'react';
import { SeoHead } from '../components/SeoHead';
import { SiteAvatar } from '../components/SiteAvatar';
import { TagBadge } from '../components/TagBadge';
import { CATEGORY_META } from '../config/siteConfig';
import { Link } from '../lib/router';
import { getActivityFeed } from '../lib/sites';

interface ActivityPageProps {
  showNsfw: boolean;
}

export function ActivityPage({ showNsfw }: ActivityPageProps) {
  const feed = useMemo(() => getActivityFeed(showNsfw).slice(0, 40), [showNsfw]);

  return (
    <main className="max-w-[1000px] mx-auto px-4 sm:px-6 pt-8 pb-12 space-y-6">
      <SeoHead
        title="Recent Activity"
        description="Chronological log of recently added and updated platforms in the KuraIndex directory."
        path="/activity"
      />

      <div className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5 text-[#e5484d]" aria-hidden="true" />
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100">
            Recent Activity
          </h1>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Auto-generated feed sorted by latest addition and verification dates. Entries added within the last 14 days receive the NEW badge automatically.
        </p>
      </div>

      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] divide-y divide-zinc-100 dark:divide-zinc-800/80 overflow-hidden">
        {feed.map((site) => {
          const eventDate = site.dateUpdated || site.dateAdded;
          const eventType = site.dateUpdated ? 'Updated' : 'Added';

          return (
            <div
              key={site.slug}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/35 transition-colors"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span className="w-24 text-xs font-mono tabular-nums text-zinc-500 dark:text-zinc-400 shrink-0">
                  {eventDate}
                </span>
                <SiteAvatar
                  name={site.name}
                  icon={site.icon}
                  category={site.category}
                  size="md"
                />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to={`/s/${site.slug}`}
                      className="text-sm font-display font-bold text-zinc-900 dark:text-zinc-100 hover:text-[#e5484d] transition-colors truncate"
                    >
                      {site.name}
                    </Link>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      {eventType} in {CATEGORY_META[site.category].label}
                    </span>
                    {site.isNew && <TagBadge tag="NEW" />}
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-xl mt-0.5">
                    {site.description}
                  </p>
                </div>
              </div>

              <a
                href={site.outboundUrl}
                target="_blank"
                rel={
                  site.isSponsored || site.hasAffiliate
                    ? 'nofollow noopener sponsored'
                    : 'noopener noreferrer'
                }
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 whitespace-nowrap shrink-0 w-fit"
              >
                <span>Visit</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          );
        })}
      </div>
    </main>
  );
}
