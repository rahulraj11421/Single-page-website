import { ArrowLeft, ArrowUpRight, Check, Copy, Globe, ShieldCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AdSlot } from '../components/AdSlot';
import { SeoHead } from '../components/SeoHead';
import { SiteAvatar } from '../components/SiteAvatar';
import { TagBadge } from '../components/TagBadge';
import { CATEGORY_META, SITE_CONFIG } from '../config/siteConfig';
import { Link } from '../lib/router';
import { getRelatedSites, getSiteBySlug } from '../lib/sites';

interface DetailPageProps {
  slug: string;
  showNsfw: boolean;
}

export function DetailPage({ slug, showNsfw }: DetailPageProps) {
  const site = useMemo(() => getSiteBySlug(slug), [slug]);
  const [copied, setCopied] = useState(false);

  const related = useMemo(() => {
    if (!site) return [];
    return getRelatedSites(site, showNsfw, 5);
  }, [site, showNsfw]);

  if (!site) {
    return (
      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-16 text-center space-y-4">
        <SeoHead
          title="Site Not Found"
          description="The requested directory entry could not be found."
          path={`/s/${slug}`}
        />
        <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100">
          Listing not found
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          No entry with slug "{slug}" exists in our directory.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[#e5484d] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Directory</span>
        </Link>
      </main>
    );
  }

  const categoryMeta = CATEGORY_META[site.category];
  let hostname = site.url;
  try {
    hostname = new URL(site.url).hostname.replace(/^www\./, '');
  } catch {
    // Keep original url
  }

  const isSponsoredOrAffiliate = site.isSponsored || site.hasAffiliate;
  const relAttr = isSponsoredOrAffiliate
    ? 'nofollow noopener sponsored'
    : 'noopener noreferrer';

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(site.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked in non-HTTPS contexts
    }
  };

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: site.name,
      applicationCategory: `${categoryMeta.label}Platform`,
      operatingSystem: 'Web',
      url: site.url,
      description: site.description,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Directory',
          item: SITE_CONFIG.domain,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: categoryMeta.label,
          item: `${SITE_CONFIG.domain}/section/${site.category}`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: site.name,
          item: `${SITE_CONFIG.domain}/s/${site.slug}`,
        },
      ],
    },
  ];

  return (
    <main className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-6 pb-12 space-y-6">
      <SeoHead
        title={`${site.name} (${categoryMeta.label})`}
        description={site.description}
        path={`/s/${site.slug}`}
        jsonLd={jsonLd}
      />

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
        <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
          Directory
        </Link>
        <span aria-hidden="true">/</span>
        <Link
          to={`/section/${site.category}`}
          className="hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          {categoryMeta.label}
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-zinc-900 dark:text-zinc-100 font-medium">{site.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        {/* Main profile card */}
        <article className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <SiteAvatar
                name={site.name}
                icon={site.icon}
                category={site.category}
                size="lg"
              />
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-display font-bold text-zinc-900 dark:text-zinc-100">
                    {site.name}
                  </h1>
                  {site.isSponsored && <TagBadge tag="SPONSORED" />}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="font-mono">{hostname}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {site.status === 'active' ? 'Active Platform' : 'Archived / Closed'}
                  </span>
                  {site.isLegal && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Official / Legal</span>
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleCopyUrl}
                aria-label="Copy official URL"
                className="h-10 px-3 inline-flex items-center gap-1.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy link</span>
                  </>
                )}
              </button>

              <a
                href={site.outboundUrl}
                target="_blank"
                rel={relAttr}
                className="h-10 px-4 inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg bg-[#e5484d] text-white hover:bg-[#d13b40] transition-colors whitespace-nowrap"
              >
                <span>Visit site</span>
                <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {site.status === 'dead' && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/8 p-4 text-xs text-red-700 dark:text-red-300 space-y-1">
              <p className="font-semibold">This service is no longer operating</p>
              <p>{site.closedNote || 'Archived in the KuraIndex Graveyard for historical reference.'}</p>
            </div>
          )}

          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Overview
            </h2>
            <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {site.description}
            </p>
          </div>

          {/* Tags & Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Tags
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {site.tags.map((tag) => (
                  <TagBadge key={tag} tag={tag} />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Key Features
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {site.features.map((feature) => (
                  <span
                    key={feature}
                    className="px-2 py-1 text-xs rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Structured accession metadata */}
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80 text-xs">
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Category</dt>
              <dd className="mt-0.5 font-medium text-zinc-900 dark:text-zinc-100">
                <Link to={`/section/${site.category}`} className="hover:text-[#e5484d]">
                  {categoryMeta.label}
                </Link>
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Category Rank</dt>
              <dd className="mt-0.5 font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-100">
                {site.status === 'dead' ? 'Archived' : `#${site.rank}`}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Date Added</dt>
              <dd className="mt-0.5 font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-100">
                {site.dateAdded}
              </dd>
            </div>
            <div>
              <dt className="text-zinc-500 dark:text-zinc-400">Last Updated</dt>
              <dd className="mt-0.5 font-mono tabular-nums font-medium text-zinc-900 dark:text-zinc-100">
                {site.dateUpdated || site.dateAdded}
              </dd>
            </div>
          </dl>

          {isSponsoredOrAffiliate && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-500 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
              Disclosure: Outbound links for this entry use{' '}
              <code className="font-mono">rel="nofollow noopener sponsored"</code>.
            </p>
          )}
        </article>

        {/* Related & Sidebar */}
        <aside className="space-y-4">
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between">
              <h2 className="text-sm font-display font-bold text-zinc-900 dark:text-zinc-100">
                Related in {categoryMeta.label}
              </h2>
              <Link
                to={`/section/${site.category}`}
                className="text-xs font-medium text-[#e5484d] hover:underline"
              >
                All
              </Link>
            </div>
            <ul className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
              {related.map((rel) => (
                <li key={rel.slug}>
                  <Link
                    to={`/s/${rel.slug}`}
                    className="px-4 py-3 flex items-center justify-between gap-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <SiteAvatar
                        name={rel.name}
                        icon={rel.icon}
                        category={rel.category}
                        size="sm"
                      />
                      <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
                        {rel.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono tabular-nums text-zinc-400">
                      #{rel.rank}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <AdSlot slot="sidebar" />
        </aside>
      </div>
    </main>
  );
}
