import type { Block } from 'payload'
import { opacityField } from '../shared'

export const NewsAndUpdatesBlock: Block = {
  slug: 'newsAndUpdates',
  interfaceName: 'NewsAndUpdatesBlock',
  labels: { singular: 'News & Updates', plural: 'News & Updates' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading',
      admin: { description: 'Section heading displayed above this block' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
      admin: { description: 'Optional description below the heading' },
    },
    {
      name: 'align',
      type: 'select',
      label: 'Heading Alignment',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      required: true,
      defaultValue: 'spotlight',
      admin: { description: 'Choose between a card grid or a featured spotlight layout' },
      options: [
        { label: 'Spotlight (featured + side list)', value: 'spotlight' },
        { label: 'Card Grid', value: 'grid' },
        { label: 'List View', value: 'list' },
        { label: 'Horizontal Slide View', value: 'horizontal-slide' },
        { label: 'Card Swap Stack', value: 'card-swap' },
      ],
    },
    {
      name: 'enableRollingMotion',
      type: 'checkbox',
      label: 'Enable Rolling Motion',
      defaultValue: false,
      admin: {
        description: 'Auto-scroll the news cards vertically',
        condition: (_, siblingData) => siblingData?.layout === 'list',
      },
    },
    {
      name: 'animationDuration',
      type: 'number',
      label: 'Animation Duration (seconds)',
      defaultValue: 20,
      admin: {
        description: 'Duration of one complete scroll cycle in seconds (e.g. 20 for fast, 40 for slow)',
        condition: (_, siblingData) => 
          siblingData?.layout === 'horizontal-slide' || 
          (siblingData?.layout === 'list' && siblingData?.enableRollingMotion),
      },
    },
    {
      name: 'cardSwapDelay',
      type: 'number',
      label: 'Card Swap Delay (ms)',
      defaultValue: 5000,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'card-swap',
      },
    },
    {
      name: 'cardSwapCardDistance',
      type: 'number',
      label: 'Card Swap Horizontal Distance',
      defaultValue: 60,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'card-swap',
      },
    },
    {
      name: 'cardSwapVerticalDistance',
      type: 'number',
      label: 'Card Swap Vertical Distance',
      defaultValue: 70,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'card-swap',
      },
    },
    {
      name: 'cardSwapSkewAmount',
      type: 'number',
      label: 'Card Swap Skew Amount',
      defaultValue: 6,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'card-swap',
      },
    },
    {
      name: 'cardSwapEasing',
      type: 'select',
      label: 'Card Swap Easing',
      defaultValue: 'elastic',
      options: [
        { label: 'Elastic', value: 'elastic' },
        { label: 'Linear', value: 'linear' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'card-swap',
      },
    },
    {
      name: 'cardSwapPauseOnHover',
      type: 'checkbox',
      label: 'Pause on Hover',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'card-swap',
      },
    },
    {
      name: 'newsSource',
      type: 'select',
      label: 'News Source',
      required: true,
      defaultValue: 'fetch',
      admin: { description: 'Choose manual card entry or automatic fetch from News collection.' },
      options: [
        { label: 'Fetch from News Collection', value: 'fetch' },
        { label: 'Manual Entry', value: 'manual' },
      ],
    },
    // Collection Fetch Settings
    {
      name: 'limit',
      type: 'number',
      label: 'Limit',
      defaultValue: 5,
      required: true,
      admin: {
        description: 'Maximum number of cards to fetch',
        condition: (_, siblingData) => siblingData?.newsSource === 'fetch',
      },
    },
    {
      name: 'sortBy',
      type: 'select',
      label: 'Card Order / Sorting',
      defaultValue: 'latest',
      admin: {
        description: 'Choose the order in which news cards are arranged',
      },
      options: [
        { label: 'Latest First (Newest Published)', value: 'latest' },
        { label: 'Oldest First (Chronological)', value: 'oldest' },
        { label: 'Featured / Pinned First', value: 'featured' },
        { label: 'Alphabetical by Title (A - Z)', value: 'title-asc' },
        { label: 'Reverse Alphabetical (Z - A)', value: 'title-desc' },
        { label: 'Manual Order (As Entered)', value: 'manual' },
      ],
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      admin: {
        description: 'Optional category filter (exact match)',
        condition: (_, siblingData) => siblingData?.newsSource === 'fetch',
      },
      options: [
        { label: 'All Categories', value: '' },
        { label: 'Announcement', value: 'ANNOUNCEMENT' },
        { label: 'Event', value: 'EVENT' },
        { label: 'Opportunity', value: 'OPPORTUNITY' },
        { label: 'Result', value: 'RESULT' },
        { label: 'Notice', value: 'NOTICE' },
      ],
    },
    {
      name: 'fetchOnlyFeatured',
      type: 'checkbox',
      label: 'Fetch only featured news',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.newsSource === 'fetch',
      },
    },
    // Manual Entry Settings
    {
      name: 'manualNews',
      type: 'array',
      label: 'Manual News Items',
      admin: {
        condition: (_, siblingData) => siblingData?.newsSource === 'manual',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'tag',
          type: 'select',
          label: 'Tag',
          required: true,
          options: [
            { label: 'Announcement', value: 'ANNOUNCEMENT' },
            { label: 'Event', value: 'EVENT' },
            { label: 'Opportunity', value: 'OPPORTUNITY' },
            { label: 'Result', value: 'RESULT' },
            { label: 'Notice', value: 'NOTICE' },
          ],
        },
        {
          name: 'excerpt',
          type: 'textarea',
          label: 'Excerpt',
          required: true,
        },
        {
          name: 'externalLink',
          type: 'text',
          label: 'External Link (Optional)',
        },
        {
          name: 'cardOverlayColor',
          type: 'text',
          label: 'Card Overlay Color',
          admin: {
            description: 'Pick a background / overlay color for the card (overrides block settings)',
            components: { Field: '@/globals/ColorPickerField.tsx#ColorPickerField' },
          },
        },
        opacityField('cardOverlayOpacity', 'Card Overlay Opacity', 100),
        {
          name: 'publishedAt',
          type: 'date',
          label: 'Published At',
          required: true,
        },
        {
          name: 'featured',
          type: 'checkbox',
          label: 'Featured',
          defaultValue: false,
        },
      ],
    },
    // View All Link Settings
    {
      name: 'viewAllEnabled',
      type: 'checkbox',
      label: 'View All Link Enabled',
      defaultValue: true,
    },
    {
      name: 'viewAllLabel',
      type: 'text',
      label: 'View All Link Label',
      defaultValue: 'All news',
      admin: {
        condition: (_, siblingData) => siblingData?.viewAllEnabled === true,
      },
    },
    {
      name: 'viewAllUrl',
      type: 'text',
      label: 'View All Link Url',
      defaultValue: '/news',
      admin: {
        condition: (_, siblingData) => siblingData?.viewAllEnabled === true,
      },
    },
    // Card Overlay Color
    {
      name: 'cardOverlayColor',
      type: 'text',
      label: 'Card Overlay Color',
      admin: {
        description: 'Pick an overlay / background color for the cards',
        components: {
          Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
        },
      },
    },
    opacityField('cardOverlayOpacity', 'Card Overlay Opacity', 100),
    // Section Background Color
    {
      name: 'sectionBgColor',
      type: 'text',
      label: 'Section Background Color',
      defaultValue: '#FFFFFF',
      admin: {
        description: 'Pick a color or enter hex value',
        components: {
          Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
        },
      },
    },
    // Section Heading Color
    {
      name: 'headingColor',
      type: 'text',
      label: 'Section Heading Color',
      admin: {
        description: 'Pick a color for the section heading',
        components: {
          Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
        },
      },
    },
    // Section Description Color
    {
      name: 'descriptionColor',
      type: 'text',
      label: 'Section Description Color',
      admin: {
        description: 'Pick a color for the section description',
        components: {
          Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
        },
      },
    },
  ],
}
