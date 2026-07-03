import type { Block } from 'payload'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { getDefaultLexicalFeatures } from '../../fields/defaultLexical'
import { ContentLayout } from '../ContentLayout/config'
import { ImageBlock } from '../ImageBlock/config'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'textColor',
          type: 'text',
          label: 'Text Color',
          admin: {
            description: 'Custom color for the body text',
            components: {
              Field: '@/globals/ColorPickerField#ColorPickerField',
            },
          },
        },
        {
          name: 'headingColor',
          type: 'text',
          label: 'Heading Color',
          admin: {
            description: 'Custom color for headings',
            components: {
              Field: '@/globals/ColorPickerField#ColorPickerField',
            },
          },
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: [
          ...getDefaultLexicalFeatures(),
          BlocksFeature({
            blocks: [ContentLayout, ImageBlock],
          }),
        ],
      }),
    },
  ],
}
