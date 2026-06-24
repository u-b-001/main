import type { Block } from 'payload'

export const HelpSupport: Block = {
  slug: 'helpSupport',
  interfaceName: 'HelpSupportBlock',
  labels: {
    singular: 'Help & Support',
    plural: 'Help & Support',
  },
  fields: [
    {
      name: 'sectionTitle',
      type: 'text',
      label: 'Section Title',
    },
    {
      name: 'sectionSubtitle',
      type: 'textarea',
      label: 'Section Subtitle',
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      defaultValue: 'sideBySide',
      options: [
        {
          label: 'Side by Side (Cards + Video)',
          value: 'sideBySide',
        },
        {
          label: 'Stacked (Cards Above Video)',
          value: 'stacked',
        },
      ],
      required: true,
    },
    {
      name: 'supportCards',
      type: 'array',
      label: 'Support Cards',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Card Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Card Description',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Lucide Icon Name',
          admin: {
            description:
              'Example: LifeBuoy, Headphones, BookOpen, GraduationCap',
          },
        },
        {
          name: 'iconColor',
          type: 'text',
          label: 'Icon Color',
          defaultValue: '#3B82F6',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
        },
        {
          name: 'buttonUrl',
          type: 'text',
          label: 'Button URL',
        },
      ],
    },
    {
      name: 'video',
      type: 'group',
      label: 'Video Section',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          label: 'Enable Video',
          defaultValue: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Video Title',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'YouTube / Vimeo URL',
          admin: {
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'poster',
          type: 'upload',
          relationTo: 'media',
          label: 'Poster Image',
          admin: {
            description:
              'WARNING: To replace this image, clear the field first and then upload/select a new image. Do not edit the media asset directly.',
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
        {
          name: 'uploadedVideo',
          type: 'upload',
          relationTo: 'media',
          label: 'Uploaded Video',
          admin: {
            description: 'Upload MP4/WebM video directly.',
            condition: (_, siblingData) => siblingData?.enabled,
          },
        },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Section Background Color',
      defaultValue: '#FFFFFF',
    },
    {
      name: 'cardBgColor',
      type: 'text',
      label: 'Card Background Color',
      defaultValue: '#F9FAFB',
    },
  ],
}