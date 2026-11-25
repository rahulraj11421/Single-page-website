import { useState } from 'react';
import { CategoryId } from '../types/site';

interface SiteAvatarProps {
  name: string;
  icon?: string;
  category: CategoryId;
  size?: 'sm' | 'md' | 'lg';
}

const CATEGORY_PALETTES: Record<CategoryId, string> = {
  anime: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25',
  donghua: 'bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/25',
  manga: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25',
  manhwa: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-500/25',
  novel: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
  drama: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/25',
  games: 'bg-violet-500/15 text-violet-700 dark:text-violet-400 border-violet-500/25',
  apps: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/25',
  download: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/25',
  music: 'bg-pink-500/15 text-pink-700 dark:text-pink-400 border-pink-500/25',
  schedule: 'bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/25',
  database: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/25',
  tools: 'bg-lime-500/15 text-lime-700 dark:text-lime-400 border-lime-500/25',
  quiz: 'bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-400 border-fuchsia-500/25',
  trends: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/25',
  guides: 'bg-stone-500/15 text-stone-700 dark:text-stone-300 border-stone-500/25',
  vtuber: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/25',
  gacha: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/25',
  cosplay: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/25',
  amv: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/25',
  forums: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/25',
};

const SIZE_CLASSES = {
  sm: 'w-6 h-6 text-[11px] rounded-md',
  md: 'w-8 h-8 text-xs rounded-lg',
  lg: 'w-14 h-14 text-xl rounded-xl',
};

export function SiteAvatar({ name, icon, category, size = 'sm' }: SiteAvatarProps) {
  const [imgError, setImgError] = useState(false);
  const letter = (name.trim().charAt(0) || '?').toUpperCase();
  const palette = CATEGORY_PALETTES[category] || CATEGORY_PALETTES.anime;

  if (icon && !imgError) {
    return (
      <img
        src={icon}
        alt={`${name} icon`}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={`${SIZE_CLASSES[size]} object-cover shrink-0 border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${SIZE_CLASSES[size]} ${palette} inline-flex items-center justify-center font-display font-bold border shrink-0 select-none`}
    >
      {letter}
    </span>
  );
}
