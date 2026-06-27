import type { Block } from 'payload'

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
      ],
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
      label: 'Sort By',
      defaultValue: 'latest',
      admin: {
        condition: (_, siblingData) => siblingData?.newsSource === 'fetch',
      },
      options: [
        { label: 'Latest First', value: 'latest' },
        { label: 'Oldest First', value: 'oldest' },
        { label: 'Featured Pin First', value: 'featured' },
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
  ],
}
