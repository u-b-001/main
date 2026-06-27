import type { Block } from 'payload'
import { RichTextBlock } from '../RichTextBlock/config'
import { ImageWithTextBlock } from '../ImageWithTextBlock/config'
import { InfoCardBlock } from '../InfoCardBlock/config'
import { TableBlock } from '../TableBlock/config'
import { EmbedBlock } from '../EmbedBlock/config'
import { CallToAction } from '../CallToAction/config'

export const SidebarLayoutBlock: Block = {
  slug: 'sidebarLayout',
  interfaceName: 'SidebarLayoutBlock',
  labels: {
    singular: 'Sidebar Layout',
    plural: 'Sidebar Layouts',
  },
  fields: [
    {
      name: 'sidebarPosition',
      type: 'select',
      label: 'Sidebar Position',
      options: [
        { label: 'Left Sidebar', value: 'left' },
        { label: 'Right Sidebar', value: 'right' },
      ],
      defaultValue: 'right',
      required: true,
    },
    {
      name: 'sidebarWidth',
      type: 'select',
      label: 'Sidebar Width',
      options: [
        { label: '1/4 (25%)', value: '1/4' },
        { label: '1/3 (33%)', value: '1/3' },
      ],
      defaultValue: '1/3',
      required: true,
    },
    {
      name: 'mainContent',
      type: 'blocks',
      label: 'Main Content Blocks',
      blocks: [
        RichTextBlock,
        ImageWithTextBlock,
        InfoCardBlock,
        TableBlock,
        EmbedBlock,
        CallToAction,
      ],
      required: true,
    },
    {
      name: 'sidebarContent',
      type: 'blocks',
      label: 'Sidebar Content Blocks',
      blocks: [
        RichTextBlock,
        ImageWithTextBlock,
        InfoCardBlock,
        EmbedBlock,
        CallToAction,
      ],
      required: true,
    },
  ],
}
