import React, { Fragment } from 'react'
import { AnimatedBlock } from '@/components/ui/AnimatedBlock'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { RichTextBlock } from '@/blocks/RichTextBlock/Component'
import { ImageWithTextBlock } from '@/blocks/ImageWithTextBlock/Component'
import { InfoCardBlock } from '@/blocks/InfoCardBlock/Component'
import { TableBlock } from '@/blocks/TableBlock/Component'
import { EmbedBlock } from '@/blocks/EmbedBlock/Component'
import { HeroBlock } from '@/blocks/Hero/Component'
import { MarqueeBlock } from '@/blocks/Marquee/Component'
import { StatsImpactBlock } from '@/blocks/Statistics/Component'
import { ShowcaseCardsBlock} from '@/blocks/Showcase/Component' 
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { FAQBlock } from '@/blocks/Faq/Component'

import {ImageGalleryBlock} from '@/blocks/ImageGallery/Component'
import { FormBlockComponent } from './Form/Component'
import {DataSnapshotBlock} from './DataSnapshot/Component'
import {CareerPostingBlock} from './CareerPosting/Component'
import {HelpSupportBlock} from './HelpAndSupport/Component'
import {StatusBadgeBlock } from './CardStautsBadge/Component'

import { FlexibleRowComponent } from '@/blocks/FlexibleRow/Component'
import { FeaturedCardsComponent } from '@/blocks/FeaturedCards/Component'
import { MediaContactComponent } from '@/blocks/MediaContact/Component'
import { SidebarLayoutComponent } from '@/blocks/SidebarLayout/Component'
import { ExamIntroComponent } from '@/blocks/ExamIntro/Component'
import { ContentLayoutComponent } from '@/blocks/ContentLayout/Component'
import { StepsComponent } from '@/blocks/Steps/Component'
import { FileDownloadsComponent } from '@/blocks/FileDownloads/Component'
import { NewsAndUpdatesComponent } from '@/blocks/NewsAndUpdates/Component'
import { ResourceLinksComponent } from '@/blocks/ResourceLinks/Component'
import { MembersDirectoryComponent } from '@/blocks/MembersDirectory/Component'
import { LayoutCardsBlock } from '@/blocks/LayoutCards/Component'
import { RibbonHeroBlock } from '@/blocks/RibbonHero/Component'
import { HeroMOSAIBlock } from '@/blocks/HeroMOSAI/Component'

export const blockComponents = {
  cta: CallToActionBlock,
  richText: RichTextBlock,
  imageWithText: ImageWithTextBlock,
  infoCard: InfoCardBlock,
  table: TableBlock,
  embed: EmbedBlock,
  hero : HeroBlock,
  marquee: MarqueeBlock,
  statistics: StatsImpactBlock,
  showcaseCards: ShowcaseCardsBlock,
  testimonials: TestimonialsBlock,
  faq: FAQBlock,

  imageGallery: ImageGalleryBlock,
  formBlock: FormBlockComponent,
  dataSnapshot: DataSnapshotBlock,
  careerPosting: CareerPostingBlock,
  flexibleRow: FlexibleRowComponent,
  featuredCards: FeaturedCardsComponent,
  newsAndUpdates: NewsAndUpdatesComponent,
  helpSupport: HelpSupportBlock,
  sidebarLayout: SidebarLayoutComponent,
  mediaContact: MediaContactComponent,
  examIntro: ExamIntroComponent,
  contentLayout: ContentLayoutComponent,
  steps: StepsComponent,
  fileDownloads: FileDownloadsComponent,
  resourceLinks: ResourceLinksComponent,
  membersDirectory: MembersDirectoryComponent,
  layoutCards: LayoutCardsBlock,
  ribbonHero: RibbonHeroBlock,
  heroMosai: HeroMOSAIBlock,
}

export const RenderBlocks: React.FC<{
  blocks: any[]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

          if (Block) {
              // Hero-type blocks must be immediately visible — skip the opacity:0 AnimatedBlock
              const skipAnimation = blockType === 'ribbonHero' || blockType === 'hero' || blockType === 'heroMosai'
              if (skipAnimation) {
                return (
                  <div className="mb-8" key={index}>
                    <Block {...block} />
                  </div>
                )
              }
              return (
                <AnimatedBlock className={index === 0 ? "mb-8" : "my-8"} key={index}>
                  <Block {...block} />
                </AnimatedBlock>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
