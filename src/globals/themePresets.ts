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
    hero: 'mosaiFullscreen' | 'mosaiClassicHero' | 'split'
    featureCards: 'mosaiService' | 'mosaiClassicCards' | 'classic'
    featureCardsTheme: 'dark' | 'light'
    featureCardsShowButton: boolean
    news: 'mosaiCards' | 'mosaiClassicNews' | 'spotlight'
    statistics: 'mosaiStrip' | 'cardGrid'
    testimonials: 'mosaiQuote' | 'default'
    callToAction: 'mosaiBanner' | 'default'
    faq: 'mosaiAccordion' | 'default'
  }
}

export const themePresets: Record<string, ThemePreset> = {
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
      news: 'mosaiCards',
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
      news: 'spotlight',
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
      news: 'mosaiClassicNews',
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