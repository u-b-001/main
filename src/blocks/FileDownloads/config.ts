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
      name: 'blockStyle',
      type: 'select',
      label: 'Block Style',
      defaultValue: 'list',
      options: [
        { label: 'List View (Default)', value: 'list' },
        { label: 'Grid View (Cards)', value: 'grid' },
        { label: 'Minimal (Clean text)', value: 'minimal' },
      ],
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
