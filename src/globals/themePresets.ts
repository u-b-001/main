export interface ThemePreset {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    muted: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  /** Header style overrides */
  header: {
    /**
     * mosai = Modern MOSAI
     * mosaiClassic = Original MOSAI website
     * learner = Learning theme
     */
    layout: 'mosai' | 'mosaiClassic' | 'learner'
    showTopBar: boolean
    height: number
    showBottomBorder: boolean
    ctaStyle: 'square' | 'pill'
  }
  /** Layout overrides */
  layouts: {
    hero: 'mosaiFullscreen' | 'mosaiClassicHero' | 'split' | 'default'
    featureCards: 'mosaiService' | 'mosaiClassicCards' | 'classic' | 'default'
    featureCardsTheme: 'dark' | 'light'
    featureCardsShowButton: boolean
    news: 'grid' | 'spotlight' | 'list' | 'default'
    gallery: 'grid' | 'masonry' | 'bento' | 'default'
    statistics: 'mosaiStrip' | 'cardGrid' | 'default'
    testimonials: 'mosaiQuote' | 'default'
    callToAction: 'mosaiBanner' | 'default'
    faq: 'mosaiAccordion' | 'default'
  }
}

export const themePresets: Record<string, ThemePreset> = {
  /**
   * Default Theme
   * Clean, unstyled base theme using standard component layouts
   */
  default: {
    colors: {
      primary: '#0F172A',
      secondary: '#1E293B',
      accent: '#3B82F6',
      background: '#FFFFFF',
      surface: '#F8FAFC',
      muted: '#F1F5F9',
      text: '#0F172A',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    header: {
      layout: 'mosai',
      showTopBar: false,
      height: 80,
      showBottomBorder: true,
      ctaStyle: 'square',
    },
    layouts: {
      hero: 'default',
      featureCards: 'default',
      featureCardsTheme: 'light',
      featureCardsShowButton: true,
      news: 'grid',
      gallery: 'grid',
      statistics: 'default',
      testimonials: 'default',
      callToAction: 'default',
      faq: 'default',
    },
  },
  /**
   * MOSAI Modern — Purple & Gold
   * Premium, academic, scholarship-prestige feel. Best default for mosai.org's
   * homepage hero + dark feature cards.
   */
  mosai: {
    colors: {
      primary: '#4B2E83',
      secondary: '#1A103D',
      accent: '#EAB308',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      muted: '#F8F4FF',
      text: '#1A103D',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    header: {
      layout: 'mosai',
      showTopBar: true,
      height: 100,
      showBottomBorder: false,
      ctaStyle: 'square',
    },
    layouts: {
      hero: 'mosaiFullscreen',
      featureCards: 'mosaiService',
      featureCardsTheme: 'dark',
      featureCardsShowButton: false,
      news: 'grid',
      gallery: 'bento',
      statistics: 'mosaiStrip',
      testimonials: 'mosaiQuote',
      callToAction: 'mosaiBanner',
      faq: 'mosaiAccordion',
    },
  },

  /**
   * Learner — Indigo & Teal
   * Calm, official, "institutional trust" feel. Good for the
   * scholars-association / govt-affiliated tone, light feature cards.
   */
  learner: {
    colors: {
      primary: '#1E3A8A',
      secondary: '#0F172A',
      accent: '#14B8A6',
      background: '#F1F5F9',
      surface: '#FFFFFF',
      muted: '#E6EDF5',
      text: '#0F172A',
    },
    fonts: {
      heading: 'Montserrat',
      body: 'Roboto',
    },
    header: {
      layout: 'learner',
      showTopBar: false,
      height: 70,
      showBottomBorder: true,
      ctaStyle: 'pill',
    },
    layouts: {
      hero: 'mosaiFullscreen',
      featureCards: 'classic',
      featureCardsTheme: 'light',
      featureCardsShowButton: true,
      news: 'list',
      gallery: 'masonry',
      statistics: 'mosaiStrip',
      testimonials: 'mosaiQuote',
      callToAction: 'mosaiBanner',
      faq: 'mosaiAccordion',
    },
  },

  /**
   * MOSAI Classic — Sakura Pink & Slate
   * Lighter, youthful, Japan-connection feel (sakura pink + warm gold accent).
   * Good alternative skin for alumni/community-facing pages.
   */
  mosaiClassic: {
    colors: {
      primary: '#D94F70',
      secondary: '#2B2B3D',
      accent: '#F4C542',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      muted: '#FFF5F7',
      text: '#2B2B3D',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    },
    header: {
      layout: 'mosaiClassic',
      showTopBar: false,
      height: 110,
      showBottomBorder: true,
      ctaStyle: 'square',
    },
    layouts: {
      hero: 'mosaiClassicHero',
      featureCards: 'mosaiClassicCards',
      featureCardsTheme: 'light',
      featureCardsShowButton: true,
      news: 'spotlight',
      gallery: 'grid',
      statistics: 'mosaiStrip',
      testimonials: 'mosaiQuote',
      callToAction: 'mosaiBanner',
      faq: 'mosaiAccordion',
    },
  },

  /**
   * MOSAI Enhanced Theme
   * Navy Blue, Bright Green, and Orange
   */
  mosaiEnhanced: {
    colors: {
      primary: '#142890',
      secondary: '#00AF00',
      accent: '#F48C06',
      background: '#FFFFFF',
      surface: '#FFFFFF',
      muted: '#F1F1F1',
      text: '#0E0E0E',
    },
    fonts: {
      heading: 'Poppins',
      body: 'Inter',
    },
    header: {
      layout: 'mosai',
      showTopBar: true,
      height: 90,
      showBottomBorder: true,
      ctaStyle: 'square',
    },
    layouts: {
      hero: 'default',
      featureCards: 'default',
      featureCardsTheme: 'light',
      featureCardsShowButton: true,
      news: 'grid',
      gallery: 'grid',
      statistics: 'default',
      testimonials: 'default',
      callToAction: 'default',
      faq: 'default',
    },
  },

  /**
   * Crimson Authoritative Theme
   * Deep Crimson, Dark Indigo, Warm Cream
   */
  crimsonAuthoritative: {
    colors: {
      primary: '#B32424',
      secondary: '#1D2D44',
      accent: '#2F3E46',
      background: '#FDFBF7',
      surface: '#FFFFFF',
      muted: '#FDFBF7',
      text: '#1D2D44',
    },
    fonts: {
      heading: 'Playfair Display',
      body: 'Inter',
    },
    header: {
      layout: 'mosai',
      showTopBar: true,
      height: 90,
      showBottomBorder: true,
      ctaStyle: 'square',
    },
    layouts: {
      hero: 'mosaiFullscreen',
      featureCards: 'classic',
      featureCardsTheme: 'light',
      featureCardsShowButton: true,
      news: 'grid',
      gallery: 'bento',
      statistics: 'mosaiStrip',
      testimonials: 'mosaiQuote',
      callToAction: 'mosaiBanner',
      faq: 'mosaiAccordion',
    },
  },
}

export function getPreset(name?: string | null): ThemePreset {
  return themePresets[name ?? 'mosai'] ?? themePresets.mosai
}