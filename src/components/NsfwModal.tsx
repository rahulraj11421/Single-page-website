import { useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';

interface NsfwModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function NsfwModal({ open, onConfirm, onCancel }: NsfwModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="nsfw-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
    >
      <div className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/15 text-red-600 dark:text-red-400">
              <ShieldAlert className="w-5 h-5" aria-hidden="true" />
            </span>
            <div>
              <h2
                id="nsfw-modal-title"
                className="text-base font-display font-bold text-zinc-900 dark:text-zinc-100"
              >
                Age Confirmation (18+)
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Adult-rated storefronts filter
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors focus-visible:outline-2 focus-visible:outline-[#e5484d]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Enabling 18+ listings displays official adult-rated visual novel and digital creator storefronts (such as DLsite, JAST USA, and MangaGamer). You confirm that you are at least 18 years old or the age of majority in your jurisdiction.
        </p>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-[#e5484d]"
          >
            Keep Hidden
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-medium rounded-lg bg-[#e5484d] text-white hover:bg-[#d13b40] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e5484d]"
          >
            Confirm 18+ &amp; Show
          </button>
        </div>
      </div>
    </div>
  );
}
