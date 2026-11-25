import fs from 'node:fs';
import path from 'node:path';
import { CATEGORIES, SiteEntry } from '../src/types/site';

const SITES_DIR = path.resolve(process.cwd(), 'src/data/sites');

function validate() {
  if (!fs.existsSync(SITES_DIR)) {
    console.error(`Error: Data directory not found at ${SITES_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SITES_DIR).filter((f) => f.endsWith('.json'));
  if (files.length === 0) {
    console.error('Error: No .json files found in src/data/sites/');
    process.exit(1);
  }

  const seenSlugs = new Set<string>();
  const validCategories = new Set<string>(CATEGORIES);
  const errors: string[] = [];
  const categoryCounts: Record<string, number> = {};

  for (const file of files) {
    const filePath = path.join(SITES_DIR, file);
    let data: Partial<SiteEntry>;

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      data = JSON.parse(raw);
    } catch (err) {
      errors.push(`${file}: Invalid JSON (${(err as Error).message})`);
      continue;
    }

    const requiredStrings: (keyof SiteEntry)[] = [
      'name',
      'slug',
      'url',
      'category',
      'description',
      'dateAdded',
      'status',
    ];

    for (const field of requiredStrings) {
      if (typeof data[field] !== 'string' || data[field]!.trim() === '') {
        errors.push(`${file}: Missing or empty required string field "${field}"`);
      }
    }

    if (typeof data.rank !== 'number' || !Number.isFinite(data.rank) || data.rank < 1) {
      errors.push(`${file}: "rank" must be a positive number`);
    }

    if (!Array.isArray(data.tags)) {
      errors.push(`${file}: "tags" must be an array of strings`);
    }

    if (!Array.isArray(data.features)) {
      errors.push(`${file}: "features" must be an array of strings`);
    }

    if (typeof data.isLegal !== 'boolean') {
      errors.push(`${file}: "isLegal" must be a boolean`);
    }

    if (typeof data.isNsfw !== 'boolean') {
      errors.push(`${file}: "isNsfw" must be a boolean`);
    }

    if (typeof data.icon !== 'string') {
      errors.push(`${file}: "icon" must be a string (use "" for auto avatar fallback)`);
    }

    if (data.slug) {
      if (!/^[a-z0-9-]+$/.test(data.slug)) {
        errors.push(`${file}: "slug" (${data.slug}) must contain only lowercase letters, numbers, and hyphens`);
      }
      if (seenSlugs.has(data.slug)) {
        errors.push(`${file}: Duplicate slug "${data.slug}"`);
      }
      seenSlugs.add(data.slug);

      const expectedFilename = `${data.slug}.json`;
      if (file !== expectedFilename) {
        errors.push(`${file}: Filename should match slug (${expectedFilename})`);
      }
    }

    if (data.url) {
      try {
        const parsed = new URL(data.url);
        if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
          errors.push(`${file}: "url" must start with http:// or https://`);
        }
      } catch {
        errors.push(`${file}: Invalid URL "${data.url}"`);
      }
    }

    if (data.category && !validCategories.has(data.category)) {
      errors.push(`${file}: Invalid category "${data.category}". Allowed: ${CATEGORIES.join(', ')}`);
    }

    if (data.status && data.status !== 'active' && data.status !== 'dead') {
      errors.push(`${file}: "status" must be "active" or "dead"`);
    }

    if (data.dateAdded && !/^\d{4}-\d{2}-\d{2}$/.test(data.dateAdded)) {
      errors.push(`${file}: "dateAdded" (${data.dateAdded}) must be YYYY-MM-DD`);
    }

    if (data.dateUpdated && !/^\d{4}-\d{2}-\d{2}$/.test(data.dateUpdated)) {
      errors.push(`${file}: "dateUpdated" (${data.dateUpdated}) must be YYYY-MM-DD`);
    }

    if (data.status === 'active' && data.category) {
      categoryCounts[data.category] = (categoryCounts[data.category] || 0) + 1;
    }
  }

  if (errors.length > 0) {
    console.error(`\nValidation failed with ${errors.length} error(s):\n`);
    for (const err of errors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${files.length} site files across ${Object.keys(categoryCounts).length} active categories with 0 errors.`);
}

validate();
