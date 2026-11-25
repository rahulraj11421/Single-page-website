import { useEffect } from 'react';
import { SITE_CONFIG } from '../config/siteConfig';

interface SeoHeadProps {
  title: string;
  description: string;
  path: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.content = content;
}

export function SeoHead({ title, description, path, jsonLd }: SeoHeadProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE_CONFIG.name)
      ? title
      : `${title} – ${SITE_CONFIG.name}`;
    document.title = fullTitle;

    const origin =
      typeof window !== 'undefined' && window.location.origin
        ? window.location.origin
        : SITE_CONFIG.domain;
    const canonicalUrl = `${origin}${path}`;

    setMetaTag('name', 'description', description);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    const existingScript = document.getElementById('kuraindex-jsonld');
    if (existingScript) {
      existingScript.remove();
    }

    if (jsonLd) {
      const script = document.createElement('script');
      script.id = 'kuraindex-jsonld';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, path, jsonLd]);

  // Analytics placeholder hook (Cloudflare Web Analytics / Plausible)
  useEffect(() => {
    const cfToken = SITE_CONFIG.analytics.cloudflareWebAnalyticsToken;
    if (cfToken && !document.getElementById('cf-web-analytics')) {
      const s = document.createElement('script');
      s.id = 'cf-web-analytics';
      s.defer = true;
      s.src = 'https://static.cloudflareinsights.com/beacon.min.js';
      s.setAttribute('data-cf-beacon', JSON.stringify({ token: cfToken }));
      document.head.appendChild(s);
    }

    const plausibleDomain = SITE_CONFIG.analytics.plausibleDomain;
    if (plausibleDomain && !document.getElementById('plausible-analytics')) {
      const s = document.createElement('script');
      s.id = 'plausible-analytics';
      s.defer = true;
      s.setAttribute('data-domain', plausibleDomain);
      s.src = 'https://plausible.io/js/script.js';
      document.head.appendChild(s);
    }
  }, []);

  return null;
}
