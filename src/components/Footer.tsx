import { Moon, ShieldAlert, Sun } from 'lucide-react';
import { Link } from '../lib/router';

interface FooterProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  showNsfw: boolean;
  onRequestToggleNsfw: () => void;
}

export function Footer({
  theme,
  onToggleTheme,
  showNsfw,
  onRequestToggleNsfw,
}: FooterProps) {
  return (
    <footer className="mt-16 border-t border-zinc-200 dark:border-zinc-800/90 bg-white/60 dark:bg-[#121212]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-md">
            <Link
              to="/"
              className="text-base font-display font-bold text-zinc-900 dark:text-zinc-100"
            >
              KuraIndex
            </Link>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Curated index of official anime, manga, manhwa, light novel, music, schedule, and community platforms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <Link to="/activity" className="hover:text-zinc-900 dark:hover:text-zinc-100 whitespace-nowrap">
              Activity
            </Link>
            <Link to="/graveyard" className="hover:text-zinc-900 dark:hover:text-zinc-100 whitespace-nowrap">
              Graveyard
            </Link>
            <Link to="/submit" className="hover:text-zinc-900 dark:hover:text-zinc-100 whitespace-nowrap">
              Submit a Site
            </Link>
            <Link to="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100 whitespace-nowrap">
              About
            </Link>
            <Link to="/disclaimer" className="hover:text-zinc-900 dark:hover:text-zinc-100 whitespace-nowrap">
              Disclaimer
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-zinc-500 dark:text-zinc-500">
            © {new Date().getFullYear()} KuraIndex. All trademarks belong to their respective owners.
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onRequestToggleNsfw}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#e5484d] ${
                showNsfw
                  ? 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400'
                  : 'border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" aria-hidden="true" />
              <span>18+ Listings: {showNsfw ? 'On' : 'Off'}</span>
            </button>

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#e5484d]"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
