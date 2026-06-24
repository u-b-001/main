import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { isEditor } from '../../access/roles'
import { RichTextBlock } from '../../blocks/RichTextBlock/config'
import { ImageWithTextBlock } from '../../blocks/ImageWithTextBlock/config'
import { InfoCardBlock } from '../../blocks/InfoCardBlock/config'
import { TableBlock } from '../../blocks/TableBlock/config'
import { EmbedBlock } from '../../blocks/EmbedBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Hero } from '../../blocks/Hero/config'
import { Marquee } from '../../blocks/Marquee/config'
import { StatsImpact } from '../../blocks/Statistics/config'
import {ShowcaseCards} from '../../blocks/Showcase/config'
import {Testimonials} from '../../blocks/Testimonials/config'
import { FAQ } from '@/blocks/Faq/confg'
import {ImageGallery} from '../../blocks/ImageGallery/config'
import {FeatureCards} from '../../blocks/FeaturedCard/config'
import {FormBlock} from '../../blocks/Form/config'
import {DataSnapshot} from '../../blocks/DataSnapshot/config'
import {CareerPosting} from '../../blocks/CareerPosting/config'



import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'


import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'


export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) =>
        generatePreviewPath({
          slug: data?.slug,
          collection: 'pages',
          req,
        }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: data?.slug as string,
        collection: 'pages',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Banner image shown at the top of inner pages',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [
        RichTextBlock,
        ImageWithTextBlock,
        InfoCardBlock,
        TableBlock,
        EmbedBlock,
        CallToAction,
        Hero,
        StatsImpact,
        Marquee,
        ShowcaseCards,
        Testimonials,
        FAQ,
        ImageGallery,
        // FeaturedCard,
        FormBlock,
        DataSnapshot,
        CareerPosting
      ],
      required: true,
      admin: {
        initCollapsed: true,
      },
    },
    {
      name: 'seo',
      type: 'group',
      admin: {
        position: 'sidebar',
      },
      fields: [
        OverviewField({
          titlePath: 'seo.metaTitle',
          descriptionPath: 'seo.metaDescription',
          imagePath: 'seo.ogImage',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'seo.metaTitle',
          descriptionPath: 'seo.metaDescription',
        }),
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
