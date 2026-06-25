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
    hero:
      | 'mosaiFullscreen'
      | 'mosaiClassicHero'
      | 'split'

    featureCards:
      | 'mosaiService'
      | 'mosaiClassicCards'
      | 'classic'

    featureCardsTheme: 'dark' | 'light'

    featureCardsShowButton: boolean

    news:
      | 'mosaiCards'
      | 'mosaiClassicNews'
      | 'spotlight'

    statistics:
      | 'mosaiStrip'
      | 'cardGrid'

    testimonials:
      | 'mosaiQuote'
      | 'default'

    callToAction:
      | 'mosaiBanner'
      | 'default'

    faq:
      | 'mosaiAccordion'
      | 'default'
  }
}

export const themePresets: Record<string, ThemePreset> = {
  /**
   * Modern MOSAI
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
   * Learner Theme
   */
  learner: {
    colors: {
      primary: '#04415f',
      secondary: '#011e2c',
      accent: '#2086b8',
      background: '#f1f5f7',
      surface: '#ffffff',
      muted: '#e6edf0',
      text: '#010608',
    },

    fonts: {
      heading: 'Raleway',
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
      hero: 'split',
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

  mosaiClassic: {
    colors: {
      primary: '#C62828',
      secondary: '#0F4C81',
      accent: '#18A0AE',
      background: '#EEF3F7',
      surface: '#FFFFFF',
      muted: '#F8FAFC',
      text: '#1F2937',
    },

    fonts: {
      heading: 'Playfair Display',
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