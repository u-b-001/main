import type { Block } from 'payload'
import { colorField } from '../shared'

export const ImageGallery: Block = {
  slug: 'imageGallery',
  labels: { singular: 'Image Gallery', plural: 'Image Galleries' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'imageSource',
      type: 'radio',
      defaultValue: 'manual',
      options: [
        { label: 'Manual Upload', value: 'manual' },
        { label: 'From Gallery Collection', value: 'gallery' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'images',
      type: 'array',
      minRows: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.imageSource === 'manual',
      },
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'galleryItems',
      type: 'relationship',
      relationTo: 'gallery',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.imageSource === 'gallery',
        description: 'Select items from the Gallery collection',
      },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: ['grid', 'masonry', 'bento', 'carousel', 'circular'],
    },
    {
      ...colorField('bentoHoverColor', 'Bento Hover Glow Color (Hex)', '#8400ff'),
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'bento',
        description: 'Pick a glow color for the Bento hover effect.',
        components: {
          Field: '@/components/admin/ColorPickerField#ColorPickerField',
        },
      },
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4'],
      admin: {
        condition: (_, siblingData) => siblingData?.layout !== 'bento',
      },
    },
    {
      name: 'hoverEffect',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Zoom In', value: 'zoom' },
        { label: 'Caption Overlay', value: 'overlay' },
        { label: 'Lift / Shadow', value: 'lift' },
        { label: 'Grayscale to Color', value: 'grayscale' },
      ],
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay Carousel',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'carousel',
      },
    },
    {
      name: 'autoplaySpeed',
      type: 'number',
      label: 'Autoplay Speed',
      defaultValue: 1,
      admin: {
        description: 'Speed of continuous scroll (1 = normal, 2 = fast, etc)',
        condition: (_, siblingData) => siblingData?.layout === 'carousel' && siblingData?.autoplay,
      },
    },
    {
      name: 'enableViewMore',
      type: 'checkbox',
      label: 'Enable "View More / View Less" button',
      defaultValue: false,
      admin: {
        condition: (_, siblingData) => siblingData?.layout !== 'carousel',
      },
    },
    {
      name: 'initialVisibleCount',
      type: 'number',
      defaultValue: 6,
      admin: {
        condition: (_, siblingData) => siblingData?.enableViewMore,
        description: 'Number of images visible before "View More" is clicked',
      },
    },
    {
      name: 'circularBend',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'circular',
        description: 'Default is 3. Negative values bend in the opposite direction.',
      },
    },
    {
      name: 'circularTextColor',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'circular',
        description: 'Hex color for text (default: #ffffff)',
      },
    },
    {
      name: 'circularBorderRadius',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData?.layout === 'circular',
        description: 'Border radius (default: 0.05)',
      },
    },
  ],
}