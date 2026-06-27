import type { Block } from 'payload'
import { iconField } from '../shared'

export const ResourceLinksBlock: Block = {
  slug: 'resourceLinks',
  interfaceName: 'ResourceLinksBlock',
  labels: { singular: 'Resource Links', plural: 'Resource Links' },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Section Title',
      defaultValue: 'Helpful Resources',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Section Description',
    },
    {
      name: 'columns',
      type: 'select',
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
      required: true,
      minRows: 1,
      labels: { singular: 'Link', plural: 'Links' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Link Title',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Brief Description',
        },
        {
          name: 'url',
          type: 'text',
          required: true,
          label: 'URL',
        },
        iconField('icon', 'Icon'),
        {
          name: 'openInNewTab',
          type: 'checkbox',
          defaultValue: true,
          label: 'Open in new tab',
        },
      ],
    },
  ],
}
