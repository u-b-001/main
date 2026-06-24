import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { isEditor } from '../../access/roles'
import { RichTextBlock } from '../../blocks/RichTextBlock/config'
import { ImageWithTextBlock } from '../../blocks/ImageWithTextBlock/config'
import { InfoCardBlock } from '../../blocks/InfoCardBlock/config'
import { TableBlock } from '../../blocks/TableBlock/config'
import { EmbedBlock } from '../../blocks/EmbedBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { FlexibleRowBlock } from '../../blocks/FlexibleRow/config'
import { FeaturedCardsBlock } from '../../blocks/FeaturedCards/config'
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
      name: 'layoutStyle',
      type: 'select',
      label: 'Page Layout Style',
      defaultValue: 'sidebar',
      options: [
        { label: 'Left Sidebar (if sibling links exist)', value: 'sidebar' },
        { label: 'Right Sidebar (if sibling links exist)', value: 'rightSidebar' },
        { label: 'Centered Content (Text-focused)', value: 'centered' },
        { label: 'Full Width (Complex grids/tables)', value: 'fullWidth' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroStyle',
      type: 'select',
      label: 'Page Hero Banner Style',
      defaultValue: 'medium',
      options: [
        { label: 'No Hero (Minimal Text Header)', value: 'none' },
        { label: 'Small Banner', value: 'small' },
        { label: 'Medium Banner (Default)', value: 'medium' },
        { label: 'Large Banner', value: 'large' },
      ],
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Banner image shown at the top of inner pages. WARNING: To change this image, click the "X" button to clear the field, then select or upload a new one. DO NOT click the pencil "Edit" icon to replace the file inside the media drawer, as that will overwrite the shared media asset globally across all pages!',
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
        FlexibleRowBlock,
        FeaturedCardsBlock,
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
