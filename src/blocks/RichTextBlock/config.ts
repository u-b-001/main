import type { Block } from 'payload'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
import { getDefaultLexicalFeatures } from '../../fields/defaultLexical'
import { ContentLayout } from '../ContentLayout/config'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor({
        features: [
          ...getDefaultLexicalFeatures(),
          BlocksFeature({
            blocks: [ContentLayout],
          }),
        ],
      }),
    },
  ],
}
