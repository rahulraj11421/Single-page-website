import { Menu, Search, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useRouter } from '../lib/router';

interface HeaderProps {
  onOpenSearch: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  showNsfw: boolean;
  onRequestToggleNsfw: () => void;
}

const NAV_ITEMS = [
  { label: 'Directory', to: '/' },
  { label: 'Activity', to: '/activity' },
  { label: 'Graveyard', to: '/graveyard' },
  { label: 'Submit', to: '/submit' },
  { label: 'About', to: '/about' },
];

export function Header({
  onOpenSearch,
  theme,
  onToggleTheme,
  showNsfw,
  onRequestToggleNsfw,
}: HeaderProps) {
  const { pathname } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-zinc-200 dark:border-zinc-800/90 bg-[#f7f7f5]/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md">
      <div className="max-w-[1380px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line brand mark */}
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 text-base font-display font-bold tracking-tight text-zinc-900 dark:text-zinc-100 whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e5484d] rounded"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect
              x="2"
              y="2"
              width="20"
              height="20"
              rx="5"
              className="fill-[#e5484d]"
            />
            <path
              d="M7.5 7V17M16.5 7L10.5 12L16.5 17"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>KuraIndex</span>
        </Link>

        {/* Zone 2: Clean single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.to === '/'
                ? pathname === '/' || pathname.startsWith('/section/')
                : pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`text-sm font-medium whitespace-nowrap shrink-0 transition-colors hover:underline underline-offset-4 decoration-[#e5484d] focus-visible:outline-2 focus-visible:outline-[#e5484d] rounded ${
                  isActive
                    ? 'text-zinc-900 dark:text-zinc-100 underline'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Primary Search action + Mobile menu button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#171717] text-zinc-700 dark:text-zinc-300 hover:border-zinc-400 dark:hover:border-zinc-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#e5484d]"
          >
            <Search className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
            <span>Search index</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              /
            </kbd>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="md:hidden p-2 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-[#171717] text-zinc-700 dark:text-zinc-300 focus-visible:outline-2 focus-visible:outline-[#e5484d]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-[#f7f7f5] dark:bg-[#0f0f0f] px-4 py-3 space-y-3 shadow-lg">
          <nav aria-label="Mobile navigation" className="flex flex-wrap gap-x-5 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-zinc-800 dark:text-zinc-200 hover:text-[#e5484d] whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleTheme}
              className="px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
            >
              {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            </button>
            <button
              type="button"
              onClick={onRequestToggleNsfw}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${
                showNsfw
                  ? 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              18+ Mode: {showNsfw ? 'On' : 'Off'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
