import { ArrowLeft, Search } from 'lucide-react';
import { SeoHead } from '../components/SeoHead';
import { Link } from '../lib/router';

interface NotFoundPageProps {
  onOpenSearch: () => void;
}

export function NotFoundPage({ onOpenSearch }: NotFoundPageProps) {
  return (
    <main className="max-w-[720px] mx-auto px-4 sm:px-6 py-24 text-center space-y-5">
      <SeoHead
        title="404 Page Not Found"
        description="The requested page could not be found on KuraIndex."
        path="/404"
      />
      <p className="text-xs font-mono uppercase tracking-widest text-[#e5484d]">
        Error 404
      </p>
      <h1 className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100">
        Page not found
      </h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
        The directory route you requested does not exist or may have moved.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-[#e5484d] text-white hover:bg-[#d13b40] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Back to Directory</span>
        </Link>
        <button
          type="button"
          onClick={onOpenSearch}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Search className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Search Index</span>
        </button>
      </div>
    </main>
  );
}
