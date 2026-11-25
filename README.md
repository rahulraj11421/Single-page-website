# KuraIndex — Curated Anime, Manga & Culture Directory

KuraIndex is a static-first, SEO-ready directory indexing verified official streaming services, manga/manhwa publishers, light novel storefronts, music catalogs, schedules, databases, and open-source community tools across 21 categories.

## Key Features

- **File-Based JSON Collection (`src/data/sites/*.json`)**: Each directory entry lives in its own validated JSON file—no database required.
- **Instant Client-Side Search**: Powered by `fuse.js` with global keyboard shortcuts (`/` or `⌘K`).
- **Per-Card Sub-Filters & Category Pages**: Filter directly inside any category card without page reloads, or open `/section/[category]` for full sorting and filtering.
- **Automatic `NEW` Badges & Activity Feed**: Entries added within the last 14 days automatically receive a `NEW` badge and appear at the top of `/activity`.
- **18+ NSFW Toggle**: Off by default, stored in `localStorage`, gated behind an accessible 18+ confirmation modal.
- **Dark / Light Theme**: Defaults to `#0f0f0f` dark mode with instant persistence.
- **Monetization & Analytics Ready**:
  - Toggleable ad slots (`headerBanner`, `inGrid`, `sidebar`) in `src/config/ads.ts`.
  - Pinned `Sponsored` listings via `SITE_CONFIG.sponsoredSlugs` in `src/config/siteConfig.ts`.
  - Affiliate link overrides (`slug -> affiliateUrl`) in `src/config/affiliates.ts` with automatic `rel="nofollow noopener sponsored"`.
  - Built-in hooks for Cloudflare Web Analytics and Plausible in `src/config/siteConfig.ts`.
- **SEO & Static Output**: Build pipeline validates all JSON files and generates `public/sitemap.xml`, `public/robots.txt`, and `public/_redirects` for Cloudflare Pages.

## Project Structure

```text
├── public/
│   ├── _redirects           # Auto-generated Cloudflare Pages SPA fallback
│   ├── robots.txt           # Auto-generated robots file
│   └── sitemap.xml          # Auto-generated XML sitemap
├── scripts/
│   ├── generate-seo.ts      # Generates sitemap.xml, robots.txt, and _redirects
│   └── validate-data.ts     # Validates all site JSON files
├── src/
│   ├── components/          # Header, Footer, CategoryCard, SearchModal, AdSlot, etc.
│   ├── config/
│   │   ├── ads.ts           # Single config to toggle ad slots on/off
│   │   ├── affiliates.ts    # Slug -> affiliate URL mapping
│   │   └── siteConfig.ts    # Site metadata, sponsored slugs, analytics, category presets
│   ├── data/sites/          # One JSON file per directory entry (<slug>.json)
│   ├── lib/                 # Static glob loader, Fuse.js search, History API router
│   ├── pages/               # Home, Section, Detail, Graveyard, Activity, Submit, About, Disclaimer, 404
│   └── types/site.ts        # TypeScript schema & 21 category definitions
└── package.json
```

## How to Add a New Site

Adding a site requires creating **one JSON file** in `src/data/sites/<slug>.json`:

1. Create `src/data/sites/my-platform.json` (filename must match `slug`):

```json
{
  "name": "Example Platform",
  "slug": "example-platform",
  "url": "https://example.com/",
  "category": "anime",
  "description": "Concise 1-2 sentence overview of what the official platform or tool provides.",
  "rank": 6,
  "tags": ["OFFICIAL", "MODERN-UI", "SOFT-SUB"],
  "features": ["Soft-sub", "Free tier", "Modern UI"],
  "isLegal": true,
  "isNsfw": false,
  "icon": "",
  "dateAdded": "2026-11-24",
  "status": "active"
}
```

2. Run the validation script to verify schema integrity and ensure no duplicate slugs:

```bash
npm run validate
```

Tip: You can also use the `/submit` page in the running app to fill out the fields and copy a formatted JSON file.

## Running Locally

```bash
# Install dependencies
npm install

# Validate all site JSON files
npm run validate

# Start local development server on port 3000
npm run dev

# Run full production build (validates data -> generates SEO files -> builds static dist/)
npm run build
```

## Deploying to Cloudflare Pages via GitHub

1. Push this repository to GitHub.
2. Log in to the **Cloudflare Dashboard** and navigate to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select your GitHub repository.
4. Configure the build settings:
   - **Framework preset**: `None` (or `Vite`)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

Cloudflare Pages will automatically run `npm run validate`, regenerate `sitemap.xml` / `robots.txt` / `_redirects`, compile the static bundle into `dist/`, and serve clean URLs (`/section/anime`, `/s/crunchyroll`, `/graveyard`, `/activity`) at the edge.
