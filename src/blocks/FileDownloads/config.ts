import type { Block } from 'payload'

export const FileDownloadsBlock: Block = {
  slug: 'fileDownloads',
  interfaceName: 'FileDownloadsBlock',
  labels: { singular: 'File Downloads', plural: 'File Downloads' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Downloads',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
    },
    {
      name: 'files',
      type: 'array',
      required: true,
      minRows: 1,
      labels: { singular: 'File', plural: 'Files' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'File Title',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Brief Description',
        },
        {
          name: 'file',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
