import type { CollectionConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { isEditor, isSchoolAdmin } from '../../access/roles'
import { RichTextBlock } from '../../blocks/RichTextBlock/config'
import { ImageWithTextBlock } from '../../blocks/ImageWithTextBlock/config'
import { InfoCardBlock } from '../../blocks/InfoCardBlock/config'
import { TableBlock } from '../../blocks/TableBlock/config'
import { EmbedBlock } from '../../blocks/EmbedBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'

import { Hero } from '../../blocks/Hero/config'
import { Marquee } from '../../blocks/Marquee/config'
import { StatsImpact } from '../../blocks/Statistics/config'
import { ShowcaseCards } from '../../blocks/Showcase/config'
import { Testimonials } from '../../blocks/Testimonials/config'
import { FAQ } from '@/blocks/Faq/confg'
import { ImageGallery } from '../../blocks/ImageGallery/config'

import { FormBlock } from '../../blocks/Form/config'
import { DataSnapshot } from '../../blocks/DataSnapshot/config'
import { CareerPosting } from '../../blocks/CareerPosting/config'
import { HelpSupport } from '../../blocks/HelpAndSupport/config'
import { StatusBadgeBlock } from '../../blocks/CardStautsBadge/config'

import { FlexibleRowBlock } from '../../blocks/FlexibleRow/config'
import { FeaturedCardsBlock } from '../../blocks/FeaturedCards/config'
import { SidebarLayoutBlock } from '../../blocks/SidebarLayout/config'
import { MediaContactBlock } from '../../blocks/MediaContact/config'
import { ExamIntroBlock } from '../../blocks/ExamIntro/config'
import { ContentLayout } from '../../blocks/ContentLayout/config'
import { StepsBlock } from '../../blocks/Steps/config'
import { FileDownloadsBlock } from '../../blocks/FileDownloads/config'
import { NewsAndUpdatesBlock } from '../../blocks/NewsAndUpdates/config'
import { ResourceLinksBlock } from '../../blocks/ResourceLinks/config'
import { MembersDirectoryBlock } from '../../blocks/MembersDirectory/config'
import { LayoutCardsBlock } from '../../blocks/LayoutCards/config'
import { RibbonHeroBlock } from '../../blocks/RibbonHero/config'
import { HeroMOSAIBlock } from '../../blocks/HeroMOSAI/config'

import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { revalidateDelete, revalidatePage } from './hooks/revalidatePage'
import { syncNavAfterChange, syncNavAfterDelete } from '../../hooks/syncNavItems'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: isEditor,
    delete: isSchoolAdmin,
    read: authenticatedOrPublished,
    update: anyone,
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
        hidden: true,
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
        description: 'Configure the size/style of this page hero. Note: This will be overridden if "Use universal hero banner settings" is enabled in Site Settings.',
      },
    },
    {
      name: 'heroType',
      type: 'select',
      label: 'Hero Type',
      defaultValue: 'image',
      options: [
        { label: 'Background Image', value: 'image' },
        { label: 'Curved/Wavy Gradient', value: 'gradient' },
        { label: 'Solid Color', value: 'color' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Configure the background type of this page hero. Note: This will be overridden if "Use universal hero banner settings" is enabled in Site Settings.',
      },
    },
    {
      name: 'heroGradientPreset',
      type: 'select',
      label: 'Hero Gradient Preset',
      defaultValue: 'blue',
      options: [
        { label: 'Blue Wave', value: 'blue' },
        { label: 'Deep Navy', value: 'navy' },
        { label: 'Purple Sunset', value: 'purple' },
        { label: 'Emerald Wave', value: 'emerald' },
      ],
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.heroType === 'gradient',
      },
    },
    {
      name: 'heroBgColor',
      type: 'text',
      label: 'Hero Background Color',
      admin: {
        components: {
          Field: '@/globals/ColorPickerField#ColorPickerField',
        },
        condition: (_, siblingData) => siblingData?.heroType === 'color',
        description: 'Choose a background color for the hero banner. Note: This color is overridden if "Use a single universal background color" is enabled in Site Settings.',
        position: 'sidebar',
      },
    },
    {
      name: 'heroShape',
      type: 'select',
      label: 'Hero Bottom Shape',
      defaultValue: 'straight',
      options: [
        { label: 'Straight Bottom', value: 'straight' },
        { label: 'Curved Bottom', value: 'curved' },
        { label: 'Wavy Bottom', value: 'wavy' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroEyebrow',
      type: 'text',
      label: 'Hero Eyebrow (Badge Text)',
      admin: {
        description: 'Small uppercase badge text above the main title.',
      },
    },
    {
      name: 'heroEyebrowColor',
      type: 'text',
      label: 'Hero Eyebrow Text Color',
      admin: {
        components: {
          Field: '@/globals/ColorPickerField#ColorPickerField',
        },
        description: 'Optional color for the eyebrow badge text (overrides default).',
      },
    },
    {
      name: 'heroSubtitle',
      type: 'textarea',
      label: 'Hero Subtitle (Description)',
      admin: {
        description: 'A description displayed below the title.',
      },
    },
    {
      name: 'heroPaddingTop',
      type: 'select',
      label: 'Hero Padding Top',
      defaultValue: 'medium',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'X-Large', value: 'xlarge' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroPaddingBottom',
      type: 'select',
      label: 'Hero Padding Bottom',
      defaultValue: 'medium',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'X-Large', value: 'xlarge' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroMarginBottom',
      type: 'select',
      label: 'Hero Margin Bottom',
      defaultValue: 'medium',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'X-Large', value: 'xlarge' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'hero',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, siblingData) => siblingData?.heroType === 'image',
        description:
          'Banner image shown at the top of inner pages. WARNING: To change this image, click the "X" button to clear the field, then select or upload a new one. DO NOT click the pencil "Edit" icon to replace the file inside the media drawer, as that will overwrite the shared media asset globally across all pages!',
      },
    },
    {
      name: 'backgroundSettings',
      type: 'group',
      label: 'Background Settings',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'theme',
          type: 'select',
          label: 'Background Theme',
          defaultValue: 'default',
          options: [
            { label: 'Default (White/Dark based on system)', value: 'default' },
            { label: 'Light Gray', value: 'light-gray' },
            { label: 'Dark Navy', value: 'dark-navy' },
            { label: 'Custom Color', value: 'custom' },
          ],
        },
        {
          name: 'customColor',
          type: 'text',
          label: 'Custom Background Color',
          admin: {
            condition: (_, siblingData) => siblingData?.theme === 'custom',
            description: 'Enter a valid CSS color (e.g. #f3f4f6, rgb(0,0,0))',
          },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
          label: 'Background Image',
          admin: {
            description: 'Optional image to place behind all page content.',
          },
        },
      ],
    },
    {
      name: 'typographySettings',
      type: 'group',
      label: 'Typography Settings',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'headingFont',
          type: 'select',
          label: 'Layout Heading Font',
          defaultValue: 'serif',
          options: [
            { label: 'Serif (Playfair Display)', value: 'serif' },
            { label: 'Sans-Serif (Inter)', value: 'sans' },
          ],
          admin: {
            description: 'Select the font family for headings (h2, h3) in this page\'s layouts.',
          },
        },
      ],
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
        HelpSupport,

        FormBlock,
        DataSnapshot,
        CareerPosting,
        FlexibleRowBlock,
        FeaturedCardsBlock,
        NewsAndUpdatesBlock,
        StatusBadgeBlock,
        SidebarLayoutBlock,
        MediaContactBlock,
        ExamIntroBlock,
        ContentLayout,
        StepsBlock,
        FileDownloadsBlock,
        ResourceLinksBlock,
        MembersDirectoryBlock,
        LayoutCardsBlock,
        RibbonHeroBlock,
        HeroMOSAIBlock,
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
    {
      name: 'showInNav',
      type: 'checkbox',
      label: 'Show in Navigation',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'navOrder',
      type: 'number',
      label: 'Navigation Order',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidatePage, syncNavAfterChange],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateDelete, syncNavAfterDelete],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
