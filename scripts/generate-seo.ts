import fs from 'node:fs';
import path from 'node:path';
import { CATEGORIES, SiteEntry } from '../src/types/site';
import { SITE_CONFIG } from '../src/config/siteConfig';

const SITES_DIR = path.resolve(process.cwd(), 'src/data/sites');
const PUBLIC_DIR = path.resolve(process.cwd(), 'public');

function generateSeoFiles() {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });

  const baseUrl = SITE_CONFIG.domain.replace(/\/$/, '');
  const today = new Date().toISOString().slice(0, 10);

  const staticRoutes = [
    { path: '/', priority: '1.0', changefreq: 'daily' },
    { path: '/activity', priority: '0.8', changefreq: 'daily' },
    { path: '/graveyard', priority: '0.5', changefreq: 'monthly' },
    { path: '/about', priority: '0.6', changefreq: 'monthly' },
    { path: '/disclaimer', priority: '0.4', changefreq: 'yearly' },
    { path: '/submit', priority: '0.6', changefreq: 'monthly' },
  ];

  const categoryRoutes = CATEGORIES.map((cat) => ({
    path: `/section/${cat}`,
    priority: '0.9',
    changefreq: 'weekly',
  }));

  const siteFiles = fs.existsSync(SITES_DIR)
    ? fs.readdirSync(SITES_DIR).filter((f) => f.endsWith('.json'))
    : [];

  const siteRoutes: { path: string; lastmod: string; priority: string; changefreq: string }[] = [];
  for (const file of siteFiles) {
    try {
      const entry = JSON.parse(fs.readFileSync(path.join(SITES_DIR, file), 'utf8')) as SiteEntry;
      siteRoutes.push({
        path: `/s/${entry.slug}`,
        lastmod: entry.dateUpdated || entry.dateAdded || today,
        priority: '0.7',
        changefreq: 'monthly',
      });
    } catch {
      // Ignored; validate-data.ts catches malformed JSON
    }
  }

  const urlsXml = [
    ...staticRoutes.map(
      (r) =>
        `  <url>\n    <loc>${baseUrl}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
    ),
    ...categoryRoutes.map(
      (r) =>
        `  <url>\n    <loc>${baseUrl}${r.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
    ),
    ...siteRoutes.map(
      (r) =>
        `  <url>\n    <loc>${baseUrl}${r.path}</loc>\n    <lastmod>${r.lastmod}</lastmod>\n    <changefreq>${r.changefreq}</changefreq>\n    <priority>${r.priority}</priority>\n  </url>`
    ),
  ].join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  // Cloudflare Pages SPA fallback routing rule
  const redirects = `/* /index.html 200
`;

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots, 'utf8');
  fs.writeFileSync(path.join(PUBLIC_DIR, '_redirects'), redirects, 'utf8');

  console.log(
    `Generated public/sitemap.xml (${staticRoutes.length + categoryRoutes.length + siteRoutes.length} URLs), public/robots.txt, and public/_redirects`
  );
}

generateSeoFiles();
