export interface AdSlotConfig {
  enabled: boolean;
  label: string;
  headline: string;
  description: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const ADS_CONFIG = {
  /** Master switch to turn all ad slots on or off across the entire site */
  enabled: true,
  slots: {
    headerBanner: {
      enabled: true,
      label: 'Sponsored Partner',
      headline: 'Discover official Simulpubs & Collector Editions',
      description: 'Reserved responsive 728×90 / mobile banner placement configurable via src/config/ads.ts.',
      ctaLabel: 'Learn more',
      ctaUrl: '/about',
    },
    inGrid: {
      enabled: true,
      label: 'Featured Placement',
      headline: 'Promote your official anime tool or legal platform on KuraIndex',
      description: 'Clean, non-intrusive native directory slot between category cards.',
      ctaLabel: 'View sponsorship',
      ctaUrl: '/submit',
    },
    sidebar: {
      enabled: true,
      label: 'Partner Slot',
      headline: 'Reserved 300×250 Sidebar Placement',
      description: 'Toggle off anytime from src/config/ads.ts before connecting an ad network or direct sponsor.',
      ctaLabel: 'Contact',
      ctaUrl: '/about',
    },
  },
} as const;
