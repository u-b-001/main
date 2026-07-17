import { createServerFeature } from '@payloadcms/richtext-lexical'

export const ColorPickerFeature = createServerFeature({
  feature: {
    ClientFeature: '@/fields/features/ColorPicker/feature.client#ColorPickerFeatureClient',
  },
  key: 'color-picker',
})
