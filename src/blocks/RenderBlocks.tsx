import React, { Fragment } from 'react'

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
import { NewsAndUpdatesComponent } from '@/blocks/NewsAndUpdates/Component'

const blockComponents = {
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
  formBlockComponent: FormBlockComponent,
  dataSnapshotBlock : DataSnapshotBlock ,
  careerPostingBlock : CareerPostingBlock,
  flexibleRow: FlexibleRowComponent,
  featuredCards: FeaturedCardsComponent,
  newsAndUpdates: NewsAndUpdatesComponent,
  helpSupportBlock: HelpSupportBlock,
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
              return (
                <div className="my-8" key={index}>
                  <Block {...block} />
                </div>
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
