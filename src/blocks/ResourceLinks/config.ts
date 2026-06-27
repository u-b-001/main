import type { Block } from 'payload'

export const ResourceLinksBlock: Block = {
  slug: 'resourceLinks',
  interfaceName: 'ResourceLinksBlock',
  labels: {
    singular: 'Resource Links',
    plural: 'Resource Links Blocks',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columns',
      defaultValue: '2',
      options: [
        { label: '1 Column', value: '1' },
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
      ],
    },
    {
      name: 'links',
      type: 'array',
      label: 'Links',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'url',
          type: 'text',
          label: 'URL',
          required: true,
        },
        {
          name: 'openInNewTab',
          type: 'checkbox',
          label: 'Open in new tab',
          defaultValue: false,
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Lucide Icon Name (e.g. FileText, Link, Download)',
        },
      ],
    },
  ],
}
