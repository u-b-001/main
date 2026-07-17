import { createServerFeature } from '@payloadcms/richtext-lexical'

export const FontPickerFeature = createServerFeature({
  feature: {
    ClientFeature: '@/fields/features/FontPicker/feature.client#FontPickerFeatureClient',
  },
  key: 'font-picker',
})
