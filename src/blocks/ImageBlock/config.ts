import type { Block } from 'payload'

export const ImageBlock: Block = {
  slug: 'imageBlock',
  interfaceName: 'ImageBlockType',
  labels: { singular: 'Image Block', plural: 'Image Blocks' },
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
      admin: { description: 'Optional caption below the image' },
    },
    {
      name: 'objectFit',
      type: 'select',
      defaultValue: 'cover',
      options: [
        { label: 'Cover (fill & crop)', value: 'cover' },
        { label: 'Contain (fit inside)', value: 'contain' },
        { label: 'None (original size)', value: 'none' },
      ],
    },
    {
      name: 'rounded',
      type: 'select',
      defaultValue: 'lg',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Full (Circle)', value: 'full' },
      ],
    },
  ],
}
