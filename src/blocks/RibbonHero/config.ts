import type { Block } from 'payload'
import { defaultLexical } from '../../fields/defaultLexical'

export const RibbonHeroBlock: Block = {
  slug: 'ribbonHero',
  interfaceName: 'RibbonHeroBlock',
  labels: { singular: 'Ribbon Hero', plural: 'Ribbon Heroes' },
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      admin: { description: 'Small text above the heading, e.g. "MOSAI - BRIDGING CULTURES..."' },
    },
    {
      name: 'title',
      type: 'richText',
      editor: defaultLexical,
      label: 'Title',
      admin: { description: 'The main large heading.' },
    },
    {
      name: 'description',
      type: 'richText',
      editor: defaultLexical,
      label: 'Description',
      admin: { description: 'Paragraph text below the title.' },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Buttons',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Url',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Variant',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      ],
    },
    {
      name: 'backgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: { description: 'Faded background image for the entire section.' },
    },
    {
      name: 'cutoutImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Cutout Image',
      admin: { description: 'Image of people without boundaries, positioned on the right.' },
    },
    {
      name: 'ribbonImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Ribbon Image',
      admin: { description: 'Wavy flag ribbon image positioned at the bottom.' },
    },
  ],
}
