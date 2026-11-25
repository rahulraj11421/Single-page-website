import { ArrowUpRight } from 'lucide-react';
import { ADS_CONFIG } from '../config/ads';
import { Link } from '../lib/router';

interface AdSlotProps {
  slot: 'headerBanner' | 'inGrid' | 'sidebar';
}

export function AdSlot({ slot }: AdSlotProps) {
  if (!ADS_CONFIG.enabled) return null;
  const config = ADS_CONFIG.slots[slot];
  if (!config || !config.enabled) return null;

  if (slot === 'headerBanner') {
    return (
      <aside
        aria-label="Advertisement"
        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-[#171717] px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded w-fit shrink-0">
            {config.label}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
              {config.headline}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
              {config.description}
            </p>
          </div>
        </div>
        <Link
          to={config.ctaUrl}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap shrink-0 w-fit"
        >
          <span>{config.ctaLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </aside>
    );
  }

  if (slot === 'inGrid') {
    return (
      <aside
        aria-label="Sponsored placement"
        className="rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-100/60 dark:bg-[#141414] p-5 flex flex-col justify-between gap-4"
      >
        <div>
          <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-800 px-1.5 py-0.5 rounded mb-3">
            {config.label}
          </span>
          <h3 className="text-base font-display font-semibold text-zinc-900 dark:text-zinc-100">
            {config.headline}
          </h3>
          <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {config.description}
          </p>
        </div>
        <Link
          to={config.ctaUrl}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-[#e5484d] hover:underline w-fit"
        >
          <span>{config.ctaLabel}</span>
          <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Sidebar partner slot"
      className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-4 flex flex-col gap-3"
    >
      <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 px-1.5 py-0.5 rounded w-fit">
        {config.label}
      </span>
      <h3 className="text-sm font-display font-semibold text-zinc-900 dark:text-zinc-100">
        {config.headline}
      </h3>
      <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        {config.description}
      </p>
      <Link
        to={config.ctaUrl}
        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        <span>{config.ctaLabel}</span>
        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>
    </aside>
  );
}
