import { Check, Copy, Send } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { SeoHead } from '../components/SeoHead';
import { CATEGORY_LIST, SITE_CONFIG } from '../config/siteConfig';
import { CategoryId } from '../types/site';

export function SubmitPage() {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<CategoryId>('anime');
  const [description, setDescription] = useState('');
  const [tagsText, setTagsText] = useState('OFFICIAL, MODERN-UI');
  const [featuresText, setFeaturesText] = useState('Free tier, Modern UI');
  const [isNsfw, setIsNsfw] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatedSlug = useMemo(() => {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') || 'example-site'
    );
  }, [name]);

  const jsonPreview = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const payload = {
      name: name.trim() || 'Example Platform',
      slug: generatedSlug,
      url: url.trim() || 'https://example.com/',
      category,
      description:
        description.trim() || 'Official platform description goes here.',
      rank: 6,
      tags: tagsText
        .split(',')
        .map((t) => t.trim().toUpperCase())
        .filter(Boolean),
      features: featuresText
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
      isLegal: true,
      isNsfw,
      icon: '',
      dateAdded: today,
      status: 'active',
    };
    return JSON.stringify(payload, null, 2);
  }, [name, generatedSlug, url, category, description, tagsText, featuresText, isNsfw]);

  const handleCopyJson = async () => {
    try {
      await navigator.clipboard.writeText(jsonPreview);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !description.trim()) {
      setError('Please enter both a platform name and a short description.');
      return;
    }

    try {
      const parsed = new URL(url.trim());
      if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
        setError('URL must start with https:// or http://.');
        return;
      }
    } catch {
      setError('Please enter a valid URL including https://.');
      return;
    }

    if (SITE_CONFIG.formspreeEndpoint) {
      setSubmitting(true);
      try {
        const res = await fetch(SITE_CONFIG.formspreeEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name,
            url,
            category,
            description,
            isNsfw,
            jsonEntry: jsonPreview,
          }),
        });
        if (!res.ok) {
          throw new Error('Submission endpoint returned an error.');
        }
        setSubmitted(true);
      } catch (err) {
        setError((err as Error).message || 'Could not submit form.');
      } finally {
        setSubmitting(false);
      }
      return;
    }

    // Mailto fallback when no Formspree endpoint is configured
    const subject = encodeURIComponent(`[KuraIndex Submission] ${name.trim()} (${category})`);
    const body = encodeURIComponent(
      `New directory suggestion for KuraIndex:\n\n${jsonPreview}`
    );
    window.location.href = `mailto:${SITE_CONFIG.contactEmail}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <main className="max-w-[1040px] mx-auto px-4 sm:px-6 pt-8 pb-12 space-y-8">
      <SeoHead
        title="Submit a Site"
        description="Suggest an official anime, manga, novel, music, or community tool for inclusion in KuraIndex."
        path="/submit"
      />

      <header className="space-y-2 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-zinc-900 dark:text-zinc-100">
          Suggest a Platform
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-2xl">
          Submit a legal, official service or open-source community tool. We review every suggestion and also generate the exact JSON schema below for pull requests.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start">
        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] p-6 space-y-4"
        >
          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/35 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-700 dark:text-red-300"
            >
              {error}
            </div>
          )}

          {submitted && (
            <div
              role="status"
              className="rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-700 dark:text-emerald-300"
            >
              Submission prepared! If your mail client did not open, copy the generated JSON on the right and open a pull request or email {SITE_CONFIG.contactEmail}.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="submit-name"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Platform Name *
              </label>
              <input
                id="submit-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. AniChart"
                className="w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111111] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#e5484d]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="submit-category"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Category *
              </label>
              <select
                id="submit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as CategoryId)}
                className="w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111111] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#e5484d]"
              >
                {CATEGORY_LIST.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="submit-url"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Official URL *
            </label>
            <input
              id="submit-url"
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/"
              className="w-full h-10 px-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111111] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#e5484d]"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="submit-description"
              className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
            >
              Short Description *
            </label>
            <textarea
              id="submit-description"
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what the platform offers in 1–2 concise sentences."
              className="w-full p-3 text-sm rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111111] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#e5484d]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="submit-tags"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Tags (comma-separated)
              </label>
              <input
                id="submit-tags"
                type="text"
                value={tagsText}
                onChange={(e) => setTagsText(e.target.value)}
                className="w-full h-10 px-3 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111111] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#e5484d]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="submit-features"
                className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
              >
                Filter Features (comma-separated)
              </label>
              <input
                id="submit-features"
                type="text"
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                className="w-full h-10 px-3 text-xs rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-[#111111] text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-[#e5484d]"
              />
            </div>
          </div>

          <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={isNsfw}
              onChange={(e) => setIsNsfw(e.target.checked)}
              className="rounded border-zinc-300 dark:border-zinc-700 accent-[#e5484d]"
            />
            <span>Contains 18+ / adult-rated digital content</span>
          </label>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-lg bg-[#e5484d] text-white hover:bg-[#d13b40] disabled:opacity-60 transition-colors"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>
                {submitting
                  ? 'Sending...'
                  : SITE_CONFIG.formspreeEndpoint
                  ? 'Submit Suggestion'
                  : 'Submit via Email'}
              </span>
            </button>
          </div>
        </form>

        {/* Live JSON generator for GitHub contributors */}
        <aside className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#171717] overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
            <span className="text-xs font-mono text-zinc-600 dark:text-zinc-400 truncate">
              src/data/sites/{generatedSlug}.json
            </span>
            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono text-zinc-800 dark:text-zinc-200 overflow-x-auto leading-relaxed bg-zinc-50 dark:bg-[#121212]">
            {jsonPreview}
          </pre>
        </aside>
      </div>
    </main>
  );
}
