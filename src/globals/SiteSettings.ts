import type { GlobalConfig } from 'payload'
import { revalidateTag } from 'next/cache'
import { publicAccess, isSuperAdmin } from '../access/roles'
import { themePresets } from '../globals/themePresets'
import { applyThemeToBlocks } from '../lib/applyThemeToBlocks'
import { revalidateSiteSettings } from './hooks/revalidateSiteSettings'

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
        const newPreset = data?.themePreset
        const oldPreset = originalDoc?.themePreset

        if (newPreset && newPreset !== oldPreset && themePresets[newPreset]) {
          const preset = themePresets[newPreset]

          if (!data.themeColors) data.themeColors = {}

          data.themeColors.primaryColor = preset.colors.primary
          data.themeColors.secondaryColor = preset.colors.secondary
          data.themeColors.accentColor = preset.colors.accent
          data.themeColors.backgroundColor = preset.colors.background
          data.themeColors.surfaceColor = preset.colors.surface
          data.themeColors.mutedBackgroundColor = preset.colors.muted
          data.themeColors.textColor = preset.colors.text

          data.headingFont = preset.fonts.heading
          data.bodyFont = preset.fonts.body
        }

        return data
      },
    ],
    afterChange: [
      // IMPORTANT: this hook must run and FINISH before revalidateSiteSettings.
      // Previously this was fired without `await`, so the Next.js cache was
      // revalidated against the OLD block data (race condition) — that is why
      // colors/layouts appeared "stuck" on save even though themeColors updated.
      async ({ doc, previousDoc, req }) => {
        const newPreset = doc?.themePreset
        const oldPreset = previousDoc?.themePreset

        revalidateTag('global_site-settings', 'max')

        if (newPreset && newPreset !== oldPreset) {
          try {
            await applyThemeToBlocks(req.payload, newPreset)
          } catch (err) {
            req.payload.logger.error(
              `[Theme] Failed to apply theme to blocks: ${(err as Error).message}`,
            )
          }
        }
      },
      // Runs AFTER blocks have actually been updated in the DB, so the
      // revalidated page reflects the new theme instead of stale data.
      revalidateSiteSettings,
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
      defaultValue: 'mosai',
      options: [
        {
          label: 'MOSAI Modern (Purple & Gold)',
          value: 'mosai',
        },
        {
          label: 'MOSAI Classic (Red, Blue & Teal)',
          value: 'mosaiClassic',
        },
        {
          label: 'Learner (Teal & Navy)',
          value: 'learner',
        },
      ],
      admin: {
        description:
          'Choose a website theme. Selecting a preset automatically updates the colors, typography, header, and block layouts.',
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
    {
      type: 'group',
      name: 'popupNotification',
      label: 'Popup Notification',
      admin: {
        description: 'Configure the popup notification that appears on the home page.',
      },
      fields: [
        {
          name: 'enablePopup',
          type: 'checkbox',
          label: 'Enable Popup',
          defaultValue: false,
        },
        {
          name: 'showOnAllPages',
          type: 'checkbox',
          label: 'Show on all pages (Disable to show only on Home Page)',
          defaultValue: false,
          admin: {
            condition: (_, siblingData) => siblingData?.enablePopup,
          },
        },
        {
          name: 'displayFrequency',
          type: 'select',
          label: 'Display Frequency',
          defaultValue: 'once_per_session',
          options: [
            { label: 'Every time the page loads', value: 'always' },
            { label: 'Once per browser session', value: 'once_per_session' },
            { label: 'Once a day per user', value: 'once_per_day' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.enablePopup,
          },
        },
        {
          name: 'theme',
          type: 'select',
          label: 'Theme',
          defaultValue: 'light',
          options: [
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
            { label: 'Primary Color', value: 'primary' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.enablePopup,
          },
        },
        {
          name: 'popupHeadingColor',
          type: 'text',
          label: 'Popup Heading Color (Optional)',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
            },
            description: 'Override the theme heading color',
            condition: (_, siblingData) => siblingData?.enablePopup,
          },
        },
        {
          name: 'popupTextColor',
          type: 'text',
          label: 'Popup Text Color (Optional)',
          admin: {
            components: {
              Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
            },
            description: 'Override the theme description text color',
            condition: (_, siblingData) => siblingData?.enablePopup,
          },
        },
        {
          name: 'popupTitle',
          type: 'text',
          label: 'Popup Title',
          admin: {
            condition: (_, siblingData) => siblingData?.enablePopup,
          },
        },
        {
          name: 'popupDescription',
          type: 'textarea',
          label: 'Popup Description',
          admin: {
            condition: (_, siblingData) => siblingData?.enablePopup,
          },
        },
        {
          name: 'bottomDescription',
          type: 'textarea',
          label: 'Bottom Description',
          admin: {
            condition: (_, siblingData) => siblingData?.enablePopup,
            description: 'This description will appear at the bottom of the popup, below the images.',
          },
        },
        {
          name: 'imageLayoutDirection',
          type: 'radio',
          label: 'Image Layout Direction',
          defaultValue: 'horizontal',
          options: [
            { label: 'Side-by-side (Horizontal)', value: 'horizontal' },
            { label: 'Stacked (Vertical)', value: 'vertical' },
          ],
          admin: {
            condition: (_, siblingData) => siblingData?.enablePopup && siblingData?.popupImages?.length > 1,
            description: 'Choose how multiple images should be displayed.',
          },
        },
        {
          name: 'popupImages',
          type: 'array',
          label: 'Popup Images (e.g. QR Codes, Logos)',
          admin: {
            condition: (_, siblingData) => siblingData?.enablePopup,
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'title',
              type: 'text',
              label: 'Image Title (Optional)',
              admin: {
                description: 'e.g. "Vahan" or "Sarathi"',
              },
            },
            {
              name: 'linkUrl',
              type: 'text',
              label: 'Link URL (Optional)',
              admin: {
                description: 'A button with this link will appear below the image.',
              },
            },
          ],
        },
      ],
    },
  ],
}