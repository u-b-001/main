/**
 * Shared block imports for use in any collection's layout field.
 */
import { Hero } from './Hero'
import { RichContent } from './RichContent'
import { FeatureCards } from './FeatureCards'
import { ImageGallery } from './ImageGallery'
import { FAQ } from './FAQ'
import { Statistics } from './Statistics'
import { Testimonials } from './Testimonials'
import { BannerAlert } from './BannerAlert'
import { TeamGrid } from './TeamGrid'
import { Tabs } from './Tabs'
import { ContentWithMedia } from './ContentWithMedia'
import { Marquee } from './Marquee'
import { ShowcaseCards } from './ShowcaseCards'
import { NewsUpdates } from './NewsUpdates'
import { InteractiveMap } from './InteractiveMap'
import { ScreenshotGallery } from './ScreenshotGallery'
import { HelpSupport } from './HelpSupport'
import { CareerPosting } from './CareerPosting'
import { StatesOnboarded } from './StatesOnboarded'
import { FormLayout } from './FormLayout'
import { GoaSchoolSnapshotBlock } from './GoaSchoolSnapshotBlock'

// New component-based blocks
import { CallToAction as CallToActionNew } from './CallToAction/config'
import { RichTextBlock } from './RichTextBlock/config'
import { ImageWithTextBlock } from './ImageWithTextBlock/config'
import { InfoCardBlock } from './InfoCardBlock/config'
import { TableBlock } from './TableBlock/config'
import { EmbedBlock } from './EmbedBlock/config'
import { FlexibleRowBlock } from './FlexibleRow/config'
import { FeaturedCardsBlock } from './FeaturedCards/config'
import { MediaContactBlock } from './MediaContact/config'

export const allBlocks = [
  Hero,
  Marquee,
  StatesOnboarded,
  ShowcaseCards,
  Statistics,
  NewsUpdates,
  InteractiveMap,
  ScreenshotGallery,
  HelpSupport,
  GoaSchoolSnapshotBlock,
  FormLayout,
  RichContent,
  FeatureCards,
  ImageGallery,
  FAQ,
  Testimonials,
  BannerAlert,
  TeamGrid,
  Tabs,
  ContentWithMedia,
  CareerPosting,
  // New component-based blocks
  CallToActionNew,
  RichTextBlock,
  ImageWithTextBlock,
  InfoCardBlock,
  TableBlock,
  EmbedBlock,
  FlexibleRowBlock,
  FeaturedCardsBlock,
  MediaContactBlock,
]

/** Blocks safe for non-Pages collections (excludes blocks with deeply nested names) */
export const collectionBlocks = [
  Hero,
  Marquee,
  StatesOnboarded,
  ShowcaseCards,
  Statistics,
  NewsUpdates,
  InteractiveMap,
  ScreenshotGallery,
  HelpSupport,
  FormLayout,
  RichContent,
  FeatureCards,
  ImageGallery,
  FAQ,
  Testimonials,
  BannerAlert,
  TeamGrid,
  Tabs,
  ContentWithMedia,
  CareerPosting,
  // New component-based blocks
  CallToActionNew,
  RichTextBlock,
  ImageWithTextBlock,
  InfoCardBlock,
  TableBlock,
  EmbedBlock,
  FlexibleRowBlock,
  FeaturedCardsBlock,
  MediaContactBlock,
]
