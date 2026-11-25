import { SeoHead } from '../components/SeoHead';
import { SITE_CONFIG } from '../config/siteConfig';

export function DisclaimerPage() {
  return (
    <main className="max-w-[820px] mx-auto px-4 sm:px-6 pt-8 pb-12 space-y-8">
      <SeoHead
        title="Disclaimer"
        description="Legal disclaimer, external link policy, and sponsorship/affiliate disclosures for KuraIndex."
        path="/disclaimer"
      />

      <header className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100">
          Disclaimer &amp; Disclosures
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Important information regarding external links, trademarks, and sponsored placements.
        </p>
      </header>

      <div className="space-y-6 text-sm sm:text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-100">
            External Links &amp; Hosting
          </h2>
          <p>
            {SITE_CONFIG.name} is an informational index and directory. We do not host, stream, store, or distribute any anime, manga, video, audio, or software files on our servers. All outbound links point to third-party official websites, licensed publishers, or community-maintained tools.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-100">
            Affiliate &amp; Sponsorship Disclosure
          </h2>
          <p>
            Certain outbound links may use affiliate tracking parameters configured in{' '}
            <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800">
              src/config/affiliates.ts
            </code>
            , and select entries may appear as pinned sponsored listings. Every sponsored or affiliate link carries a visible label and uses{' '}
            <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-zinc-200/70 dark:bg-zinc-800">
              rel="nofollow noopener sponsored"
            </code>.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-display font-bold text-zinc-900 dark:text-zinc-100">
            Trademarks &amp; Corrections
          </h2>
          <p>
            All product names, logos, and brands listed in {SITE_CONFIG.name} are the property of their respective owners. To request an update, correction, or removal, contact{' '}
            <a
              href={`mailto:${SITE_CONFIG.contactEmail}`}
              className="text-[#e5484d] hover:underline"
            >
              {SITE_CONFIG.contactEmail}
            </a>.
          </p>
        </section>
      </div>
    </main>
  );
}
