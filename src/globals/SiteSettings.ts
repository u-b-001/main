import type { GlobalConfig } from 'payload'
import { publicAccess, isSuperAdmin } from '../access/roles'
import { themePresets } from '../globals/themePresets'
import { applyThemeToBlocks } from '../lib/applyThemeToBlocks'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: publicAccess,
    update: isSuperAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // When themePreset changes, auto-populate colors and fonts from the preset
        const newPreset = data?.themePreset
        const oldPreset = originalDoc?.themePreset

        if (newPreset && newPreset !== oldPreset && themePresets[newPreset]) {
          const preset = themePresets[newPreset]

          // Auto-fill colors
          if (!data.themeColors) data.themeColors = {}
          data.themeColors.primaryColor = preset.colors.primary
          data.themeColors.secondaryColor = preset.colors.secondary
          data.themeColors.accentColor = preset.colors.accent
          data.themeColors.backgroundColor = preset.colors.background
          data.themeColors.surfaceColor = preset.colors.surface
          data.themeColors.mutedBackgroundColor = preset.colors.muted
          data.themeColors.textColor = preset.colors.text

          // Auto-fill fonts
          data.headingFont = preset.fonts.heading
          data.bodyFont = preset.fonts.body
        }

        return data
      },
    ],
    afterChange: [
      async ({ doc, previousDoc, req }) => {
        // When themePreset changes, update all block layouts in the database
        const newPreset = doc?.themePreset
        const oldPreset = previousDoc?.themePreset

        if (newPreset && newPreset !== oldPreset) {
          // Run non-blocking so the admin save doesn't hang
          applyThemeToBlocks(req.payload, newPreset).catch((err) => {
            req.payload.logger.error(`[Theme] Failed to apply theme to blocks: ${err.message}`)
          })
        }
      },
    ],
  },
  admin: {
    group: 'Global',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'homePage',
      type: 'text',
      label: 'Home Page',
      admin: {
        components: {
          Field: '@/globals/HomePageSelectorField#HomePageSelectorField',
        },
        description:
          'Select which page should be the home page. This will be displayed when visitors go to the root URL (/).',
      },
    },
    {
      name: 'themePreset',
      type: 'select',
      label: 'Theme Preset',
      defaultValue: 'ducc',
      options: [
        { label: 'Theme A (Purple & Gold)', value: 'ducc' },
        { label: 'Theme B (Teal & Dark)', value: 'learner' },
      ],
      admin: {
        description:
          'One-click theme change. Selecting a preset changes colors, fonts, and layout styles across the entire site.',
      },
    },
    {
      name: 'headingFont',
      type: 'select',
      label: 'Heading Font',
      defaultValue: 'Playfair Display',
      options: [
        { label: 'Playfair Display (Serif)', value: 'Playfair Display' },
        { label: 'Raleway (Sans)', value: 'Raleway' },
        { label: 'Montserrat (Sans)', value: 'Montserrat' },
        { label: 'Inter (Sans)', value: 'Inter' },
        { label: 'Roboto (Sans)', value: 'Roboto' },
        { label: 'Poppins (Sans)', value: 'Poppins' },
      ],
    },
    {
      name: 'bodyFont',
      type: 'select',
      label: 'Body Font',
      defaultValue: 'Inter',
      options: [
        { label: 'Inter', value: 'Inter' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Open Sans', value: 'Open Sans' },
        { label: 'Poppins', value: 'Poppins' },
        { label: 'Lato', value: 'Lato' },
      ],
    },
    {
      type: 'group',
      name: 'themeColors',
      label: 'Theme Colors',
      fields: [
        {
          name: 'primaryColor',
          type: 'text',
          defaultValue: '#4B2E83',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
            },
            description: 'Pick primary brand color',
          },
        },
        {
          name: 'secondaryColor',
          type: 'text',
          defaultValue: '#1A103D',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
            },
            description: 'Pick secondary brand color',
          },
        },
        {
          name: 'accentColor',
          type: 'text',
          defaultValue: '#EAB308',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
            },
            description: 'Pick accent/highlight color',
          },
        },
        {
          name: 'backgroundColor',
          type: 'text',
          defaultValue: '#FFFFFF',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
            },
            description: 'Main page background color',
          },
        },
        {
          name: 'surfaceColor',
          type: 'text',
          defaultValue: '#FFFFFF',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
            },
            description: 'Card/surface background color',
          },
        },
        {
          name: 'mutedBackgroundColor',
          type: 'text',
          defaultValue: '#F8F4FF',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
            },
            description: 'Section muted background color',
          },
        },
        {
          name: 'textColor',
          type: 'text',
          defaultValue: '#1A103D',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
            },
            description: 'Default body text color',
          },
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      label: 'Social Media Links',
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter / X', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'LinkedIn', value: 'linkedin' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
