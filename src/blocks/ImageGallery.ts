import type { Block } from 'payload'
import { sectionHeadingFields } from './shared'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  labels: { singular: 'Image Gallery', plural: 'Image Galleries' },
  fields: [
    ...sectionHeadingFields,
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Bento', value: 'bento' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Circular (3D)', value: 'circular' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      admin: {
        condition: (_, siblingData) => !siblingData?.layout || ['grid', 'masonry'].includes(siblingData?.layout),
      },
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'hoverEffect',
      type: 'select',
      defaultValue: 'none',
      admin: {
        condition: (_, siblingData) => !siblingData?.layout || ['grid', 'masonry', 'bento'].includes(siblingData?.layout),
      },
      options: [
        { label: 'None', value: 'none' },
        { label: 'Zoom', value: 'zoom' },
        { label: 'Overlay', value: 'overlay' },
        { label: 'Lift', value: 'lift' },
        { label: 'Grayscale', value: 'grayscale' },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'carousel',
      },
    },
    {
      name: 'circularBend',
      type: 'number',
      defaultValue: 3,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'circular',
      },
    },
    {
      name: 'circularTextColor',
      type: 'text',
      defaultValue: '#ffffff',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'circular',
      },
    },
    {
      name: 'circularBorderRadius',
      type: 'number',
      defaultValue: 0.05,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'circular',
      },
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'text',
        },
      ],
    },
  ],
}
