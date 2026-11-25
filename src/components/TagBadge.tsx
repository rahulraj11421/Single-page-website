interface TagBadgeProps {
  tag: string;
}

const TAG_STYLES: Record<string, string> = {
  NEW: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
  SPONSORED: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/35',
  OFFICIAL: 'bg-sky-500/12 text-sky-700 dark:text-sky-300 border-sky-500/25',
  HUB: 'bg-indigo-500/12 text-indigo-700 dark:text-indigo-300 border-indigo-500/25',
  'MODERN-UI': 'bg-teal-500/12 text-teal-700 dark:text-teal-300 border-teal-500/25',
  DUB: 'bg-orange-500/12 text-orange-700 dark:text-orange-300 border-orange-500/25',
  'SOFT-SUB': 'bg-cyan-500/12 text-cyan-700 dark:text-cyan-300 border-cyan-500/25',
  'HARD-SUB': 'bg-violet-500/12 text-violet-700 dark:text-violet-300 border-violet-500/25',
  FREE: 'bg-lime-500/12 text-lime-700 dark:text-lime-300 border-lime-500/25',
  'OPEN-SOURCE': 'bg-fuchsia-500/12 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/25',
  SIMULCAST: 'bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25',
  SIMULPUB: 'bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/25',
  'DRM-FREE': 'bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/25',
  '18+': 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/35',
};

const DEFAULT_TAG_STYLE =
  'bg-zinc-200/70 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700';

export function TagBadge({ tag }: TagBadgeProps) {
  const normalized = tag.toUpperCase();
  const style = TAG_STYLES[normalized] || DEFAULT_TAG_STYLE;

  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium leading-none rounded border whitespace-nowrap shrink-0 ${style}`}
    >
      {normalized}
    </span>
  );
}
