import { createServerFeature } from '@payloadcms/richtext-lexical'

export const FontSizePickerFeature = createServerFeature({
  feature: {
    ClientFeature: '@/fields/features/FontSizePicker/feature.client#FontSizePickerFeatureClient',
  },
  key: 'font-size-picker',
})
