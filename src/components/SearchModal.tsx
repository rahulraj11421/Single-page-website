import { ArrowRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CATEGORY_META } from '../config/siteConfig';
import { useRouter } from '../lib/router';
import { createSiteSearchIndex, getActiveSites, sortRankedSites } from '../lib/sites';
import { SiteAvatar } from './SiteAvatar';
import { TagBadge } from './TagBadge';

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  showNsfw: boolean;
}

export function SearchModal({ open, onClose, showNsfw }: SearchModalProps) {
  const { navigate } = useRouter();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSites = useMemo(() => sortRankedSites(getActiveSites(showNsfw)), [showNsfw]);
  const fuse = useMemo(() => createSiteSearchIndex(activeSites), [activeSites]);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return activeSites.slice(0, 12);
    return fuse.search(trimmed, { limit: 16 }).map((r) => r.item);
  }, [query, activeSites, fuse]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (results.length ? (prev + 1) % results.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          results.length ? (prev - 1 + results.length) % results.length : 0
        );
      } else if (e.key === 'Enter' && results[activeIndex]) {
        e.preventDefault();
        navigate(`/s/${results[activeIndex].slug}`);
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, results, activeIndex, navigate, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search KuraIndex"
      className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] px-4 bg-black/70 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-200 dark:border-zinc-800">
          <Search className="w-4 h-4 text-zinc-400 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anime, manga, databases, tools, tags..."
            className="w-full bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto divide-y divide-zinc-100 dark:divide-zinc-800/70">
          {results.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                No platforms matched "{query}".
              </p>
            </div>
          ) : (
            results.map((site, index) => (
              <button
                key={site.slug}
                type="button"
                onClick={() => {
                  navigate(`/s/${site.slug}`);
                  onClose();
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between gap-3 transition-colors ${
                  index === activeIndex
                    ? 'bg-zinc-100 dark:bg-zinc-800/80'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <SiteAvatar name={site.name} icon={site.icon} category={site.category} size="md" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
                        {site.name}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {CATEGORY_META[site.category].label}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">
                      {site.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {site.isSponsored ? (
                    <TagBadge tag="SPONSORED" />
                  ) : (
                    site.tags.slice(0, 2).map((tag) => <TagBadge key={tag} tag={tag} />)
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-zinc-400" aria-hidden="true" />
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#121212] flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>Use ↑ ↓ to navigate, Enter to open</span>
          <span className="font-mono tabular-nums">{results.length} shown</span>
        </div>
      </div>
    </div>
  );
}
