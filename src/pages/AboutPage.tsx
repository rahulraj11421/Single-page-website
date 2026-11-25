import { SeoHead } from '../components/SeoHead';
import { CATEGORY_LIST, SITE_CONFIG } from '../config/siteConfig';
import { Link } from '../lib/router';
import { ALL_SITES } from '../lib/sites';

export function AboutPage() {
  const activeCount = ALL_SITES.filter((s) => s.status === 'active').length;

  return (
    <main className="max-w-[820px] mx-auto px-4 sm:px-6 pt-8 pb-12 space-y-8">
      <SeoHead
        title="About"
        description="Learn how KuraIndex curates, ranks, and verifies official anime, manga, novel, music, and community platforms."
        path="/about"
      />

      <header className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100">
          About {SITE_CONFIG.name}
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          An open, static-first index of verified official streaming platforms, publishers, databases, and community tools.
        </p>
      </header>

      <section className="space-y-4 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-100">
          Curation Principles
        </h2>
        <p>
          {SITE_CONFIG.name} indexes{' '}
          <span className="font-mono tabular-nums font-medium">{activeCount}</span> active resources organized across{' '}
          <span className="font-mono tabular-nums font-medium">{CATEGORY_LIST.length}</span> specialized categories. Every entry is stored as a validated JSON record and reviewed against three standards:
        </p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Official &amp; Legal Priority:</strong> Streaming, manga, manhwa, light novel, and music listings prioritize licensed publishers, official studios, and legitimate creator storefronts.
          </li>
          <li>
            <strong>Open Community Utilities:</strong> Tools, databases, schedules, and guides highlight transparent, well-maintained community projects and open-source software.
          </li>
          <li>
            <strong>Transparent Rankings &amp; Disclosures:</strong> Items are ranked by utility, catalog breadth, and interface clarity. Any sponsored pins or affiliate links are clearly labeled and tagged with{' '}
            <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800">
              rel="nofollow noopener sponsored"
            </code>.
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-display font-bold text-zinc-900 dark:text-zinc-100">
            Missing an official service or open tool?
          </h2>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
            Suggest an addition or generate a ready-to-commit JSON entry.
          </p>
        </div>
        <Link
          to="/submit"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#e5484d] text-white hover:bg-[#d13b40] transition-colors whitespace-nowrap w-fit"
        >
          Submit a Site
        </Link>
      </section>
    </main>
  );
}
