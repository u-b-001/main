'use client'

import { createClientFeature } from '@payloadcms/richtext-lexical/client'
import { TextColorPicker, BgColorPicker } from './ColorPickerDropdown'

export const ColorPickerFeatureClient = createClientFeature({
  toolbarFixed: {
    groups: [
      {
        type: 'buttons',
        key: 'color-picker-fixed',
        order: 35,
        items: [
          {
            key: 'text-color',
            Component: TextColorPicker,
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
        key: 'color-picker-inline',
        order: 35,
        items: [
          {
            key: 'text-color-inline',
            Component: TextColorPicker,
            order: 10,
          },
        ],
      },
    ],
  },
})
