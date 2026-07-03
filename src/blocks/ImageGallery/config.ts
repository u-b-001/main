import type { Block } from 'payload'

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
      options: ['grid', 'masonry', 'bento'],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4'],
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
      name: 'enableViewMore',
      type: 'checkbox',
      label: 'Enable "View More / View Less" button',
      defaultValue: false,
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
  ],
}