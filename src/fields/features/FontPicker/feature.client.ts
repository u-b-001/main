'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { FontPicker } from './FontPickerDropdown'



export const FontPickerFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: [
      {
        type: 'buttons',
        key: 'font-picker-fixed',
        order: 36,
        items: [
          {
            key: 'font-picker',
            Component: FontPicker,
            order: 10,
          },
        ],
      },
    ],
  },
  toolbarInline: {
    groups: [
      {
        type: 'buttons',
        key: 'font-picker-inline',
        order: 36,
        items: [
          {
            key: 'font-picker',
            Component: FontPicker,
            order: 10,
          },
        ],
      },
    ],
  },
})
