import type { TextFieldSingleValidation } from 'payload'
import { ImageBlock } from '@/blocks/ImageBlock/config'
import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  IndentFeature,
  ItalicFeature,
  InlineCodeFeature,
  LinkFeature,
  ParagraphFeature,
  OrderedListFeature,
  RelationshipFeature,
  StrikethroughFeature,
  SubscriptFeature,
  SuperscriptFeature,
  lexicalEditor,
  UploadFeature,
  UnderlineFeature,
  UnorderedListFeature,
  type LinkFields,
} from '@payloadcms/richtext-lexical'

import { ColorPickerFeature } from './features/ColorPicker/feature.server'
import { FontPickerFeature } from './features/FontPicker/feature.server'

export const getDefaultLexicalFeatures = () => [
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    StrikethroughFeature(),
    SubscriptFeature(),
    SuperscriptFeature(),
    FixedToolbarFeature(),
    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
    BlockquoteFeature(),
    HorizontalRuleFeature(),
    InlineCodeFeature(),
    IndentFeature(),
    AlignFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    ChecklistFeature(),
    ColorPickerFeature(),
    FontPickerFeature(),
    RelationshipFeature({ enabledCollections: ['pages', 'news'] }),
    UploadFeature({ enabledCollections: ['media'] }),
    BlocksFeature({
      blocks: [ImageBlock],
    }),
    LinkFeature({
      enabledCollections: ['pages', 'news'],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ('name' in field && field.name === 'url') return false
          return true
        })

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: 'url',
            type: 'text',
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== 'internal',
            },
            label: ({ t }) => t('fields:enterURL'),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === 'internal') {
                return true // no validation needed, as no url should exist for internal links
              }
              return value ? true : 'URL is required'
            }) as TextFieldSingleValidation,
          },
        ]
      },
    }),
]

export const defaultLexical = lexicalEditor({
  features: getDefaultLexicalFeatures(),
})
