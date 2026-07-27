'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { FontSizePicker } from './FontSizePickerDropdown'

export const FontSizePickerFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: [
      {
        type: 'buttons',
        key: 'font-size-picker-fixed',
        order: 37,
        items: [
          {
            key: 'font-size-picker',
            Component: FontSizePicker,
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
        key: 'font-size-picker-inline',
        order: 37,
        items: [
          {
            key: 'font-size-picker',
            Component: FontSizePicker,
            order: 10,
          },
        ],
      },
    ],
  },
})
