/**
 * Affiliate URL override map (slug -> affiliate tracking URL).
 * Any site whose slug appears here will route its "Visit site" button
 * through the affiliate URL with rel="nofollow noopener sponsored".
 */
export const AFFILIATE_LINKS: Record<string, string> = {
  'crunchyroll': 'https://www.crunchyroll.com/?utm_source=kuraindex&utm_medium=directory',
  'bookwalker-global': 'https://global.bookwalker.jp/?utm_source=kuraindex&utm_medium=directory',
  'j-novel-club': 'https://j-novel.club/?utm_source=kuraindex&utm_medium=directory',
  'cdjapan': 'https://www.cdjapan.co.jp/?utm_source=kuraindex&utm_medium=directory',
};

export function resolveOutboundLink(slug: string, defaultUrl: string): {
  url: string;
  hasAffiliate: boolean;
} {
  const affiliateUrl = AFFILIATE_LINKS[slug];
  if (affiliateUrl) {
    return { url: affiliateUrl, hasAffiliate: true };
  }
  return { url: defaultUrl, hasAffiliate: false };
}
