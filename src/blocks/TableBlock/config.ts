import type { Block } from 'payload'

export const TableBlock: Block = {
  slug: 'table',
  interfaceName: 'TableBlock',
  fields: [
    {
      name: 'caption',
      type: 'text',
    },
    {
      name: 'rows',
      type: 'array',
      fields: [
        {
          name: 'isHeader',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'cells',
          type: 'array',
          fields: [
            {
              name: 'value',
              type: 'text',
            },
          ],
        },
      ],
    },
  ],
}
