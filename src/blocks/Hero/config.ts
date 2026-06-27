import type { Block } from 'payload'

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'buttons',
      type: 'array',
      maxRows: 2,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        {
          name: 'style',
          type: 'select',
          defaultValue: 'primary',
          options: ['primary', 'secondary'],
        },
      ],
    },
    {
      type: 'group',
      name: 'designSettings',
      label: 'Design & Overlap Settings',
      fields: [
        {
          name: 'overlapHeader',
          type: 'checkbox',
          defaultValue: false,
          label: 'Overlap with Header (Move Hero Up)',
          admin: {
            description: 'Pull the hero section up to render underneath a transparent header.',
          },
        },
        {
          name: 'imageOpacity',
          type: 'number',
          defaultValue: 100,
          min: 0,
          max: 100,
          label: 'Background Image Opacity (%)',
          admin: {
            description: 'Set the opacity of the background image (0-100). Default is 100.',
            components: {
              Field: '@/components/admin/OpacitySliderField#OpacitySliderField',
            },
          },
        },
        {
          name: 'imageScale',
          type: 'number',
          defaultValue: 100,
          min: 50,
          max: 200,
          label: 'Background Image Scale (%)',
          admin: {
            description: 'Scale the background image up or down (e.g., 110 for slight zoom). Default is 100.',
          },
        },
      ],
    },
  ],
}