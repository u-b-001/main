import type { Block, Field } from 'payload'
import { link } from '../../fields/link'
import { defaultLexical } from '../../fields/defaultLexical'

export const HeroMOSAIBlock: Block = {
  slug: 'heroMosai',
  interfaceName: 'HeroMOSAIBlock',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'subtitle',
              type: 'text',
              defaultValue: 'MOSAI – BRIDGING CULTURES, BUILDING FUTURES',
            },
            {
              name: 'heading',
              type: 'richText',
              editor: defaultLexical,
            },
            {
              name: 'description',
              type: 'richText',
              editor: defaultLexical,
            },
            {
              name: 'textColor',
              type: 'text',
              defaultValue: '#1a2e4a',
              admin: {
                components: {
                  Field: '@/components/admin/ColorPickerField#ColorPickerField',
                },
                description: 'Color for the main heading and description text.',
              },
            },
            {
              name: 'height',
              type: 'number',
              defaultValue: 600,
              admin: {
                description: 'Hero height in pixels (e.g. 600)',
              },
            },
            {
              name: 'textAlignment',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
            {
              name: 'textVerticalPosition',
              type: 'select',
              defaultValue: 'center',
              options: [
                { label: 'Top', value: 'top' },
                { label: 'Center', value: 'center' },
                { label: 'Bottom', value: 'bottom' },
              ],
            },
            {
              name: 'contentMaxWidth',
              type: 'number',
              defaultValue: 1200,
              admin: {
                description: 'Maximum content width in pixels for hero text container',
              },
            },
            {
              name: 'contentPaddingX',
              type: 'number',
              defaultValue: 24,
              admin: {
                description: 'Horizontal content padding in pixels',
              },
            },
            {
              name: 'contentPaddingY',
              type: 'number',
              defaultValue: 30,
              admin: {
                description: 'Vertical content padding in pixels',
              },
            },
            {
              name: 'buttons',
              type: 'array',
              maxRows: 2,
              fields: [
                link({
                  appearances: ['primary', 'secondary', 'outline', 'ghost'],
                }),
                {
                  name: 'buttonColor',
                  type: 'text',
                  defaultValue: '#7a1a28',
                  admin: {
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                    description: 'Background color for this button.',
                  },
                },
                {
                  name: 'buttonTextColor',
                  type: 'text',
                  defaultValue: '#ffffff',
                  admin: {
                    components: {
                      Field: '@/components/admin/ColorPickerField#ColorPickerField',
                    },
                    description: 'Text color for this button.',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Hero Visuals',
          fields: [
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: {
                description: 'Upload the main unified background image (including leaders, landmarks, etc.).',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'bgImageScaleX', type: 'number', defaultValue: 100, admin: { description: 'Scale X (%)', width: '33%' } },
                { name: 'bgImageScaleY', type: 'number', defaultValue: 100, admin: { description: 'Scale Y (%)', width: '33%' } },
                { name: 'bgImageOpacity', type: 'number', defaultValue: 100, admin: { description: 'Opacity (%)', width: '33%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'bgImageShiftX', type: 'number', defaultValue: 0, admin: { description: 'Shift X (%)', width: '50%' } },
                { name: 'bgImageShiftY', type: 'number', defaultValue: 0, admin: { description: 'Shift Y (%)', width: '50%' } },
              ],
            },
            {
              name: 'mode',
              type: 'select',
              defaultValue: 'single',
              options: [
                { label: 'Single Image', value: 'single' },
                { label: 'Multiple Slide Carousel', value: 'carousel' },
              ],
              admin: {
                description: 'Select the mode for the hero image (right side).',
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (_, siblingData) => siblingData?.mode !== 'carousel',
                description: 'Upload the foreground hero image (typically displayed on the right).',
              },
            },
            {
              name: 'heroSlides',
              type: 'array',
              admin: {
                condition: (_, siblingData) => siblingData?.mode === 'carousel',
                description: 'Add multiple slides for the hero image carousel.',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'heroImageScaleX', type: 'number', defaultValue: 100, admin: { description: 'Scale X (%)', width: '33%' } },
                { name: 'heroImageScaleY', type: 'number', defaultValue: 100, admin: { description: 'Scale Y (%)', width: '33%' } },
                { name: 'heroImageOpacity', type: 'number', defaultValue: 100, admin: { description: 'Opacity (%)', width: '33%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'heroImageShiftX', type: 'number', defaultValue: 0, admin: { description: 'Shift X (%)', width: '50%' } },
                { name: 'heroImageShiftY', type: 'number', defaultValue: 0, admin: { description: 'Shift Y (%)', width: '50%' } },
              ],
            },

            {
              name: 'heroImageEdgeBlend',
              type: 'select',
              defaultValue: 'none',
              options: [
                { label: 'None (Sharp Edges)', value: 'none' },
                { label: 'Blend Top Edge Only', value: 'linear-top' },
                { label: 'Blend All Edges (Soft Oval)', value: 'radial' },
                { label: 'Blend Top & Sides (Solid Bottom)', value: 'radial-bottom' },
                { label: 'Blend Sides & Bottom (Solid Top)', value: 'radial-top' },
                { label: 'Blob Sides & Bottom (Soft)', value: 'blob' },
                { label: 'Blob Bottom (Soft)', value: 'blob-soft' },
                { label: 'Blob Soft Sides', value: 'blob-soft-sides' },
                { label: 'Soft and Blended Edges', value: 'soft-blended' },
              ],
              admin: {
                description: 'Smoothly fade the edges of the image into the background so it looks like one seamless scene.',
              }
            },
            {
              name: 'heroImageEdgePixelBlur',
              type: 'checkbox',
              defaultValue: false,
              admin: {
                description: 'Apply a physical pixel blur (out-of-focus effect) to the blended edges. Only works if an Edge Blend is selected above.',
              }
            },
            {
              name: 'heroImageShadow',
              type: 'select',
              defaultValue: 'none',
              options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', 'glow'],
              admin: {
                description: 'Apply a drop shadow around the hero image.',
              },
            },
            {
              name: 'ribbonImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Upload the wave/ribbon graphic that appears at the bottom.',
              },
            },
            {
              type: 'row',
              fields: [
                { name: 'ribbonImageScaleX', type: 'number', defaultValue: 100, admin: { description: 'Scale X (%)', width: '33%' } },
                { name: 'ribbonImageScaleY', type: 'number', defaultValue: 100, admin: { description: 'Scale Y (%)', width: '33%' } },
                { name: 'ribbonImageOpacity', type: 'number', defaultValue: 100, admin: { description: 'Opacity (%)', width: '33%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'ribbonImageShiftX', type: 'number', defaultValue: 0, admin: { description: 'Shift X (%)', width: '50%' } },
                { name: 'ribbonImageShiftY', type: 'number', defaultValue: 0, admin: { description: 'Shift Y (%)', width: '50%' } },
              ],
            },
          ],
        },

        {
          label: 'Feature Strip',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'featureStripScale', type: 'number', defaultValue: 100, admin: { description: 'Scale (%)', width: '33%' } },
                { name: 'featureStripShiftX', type: 'number', defaultValue: 0, admin: { description: 'Shift X (%)', width: '33%' } },
                { name: 'featureStripShiftY', type: 'number', defaultValue: 0, admin: { description: 'Shift Y (%)', width: '33%' } },
              ],
            },
            {
              name: 'features',
              type: 'array',
              minRows: 4,
              maxRows: 4,
              fields: [
                {
                  name: 'icon',
                  type: 'text',
                  required: true,
                  admin: {
                    components: {
                      Field: '@/globals/IconPickerField#IconPickerField',
                    },
                    description: 'Select a Lucide icon',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Settings',
          fields: [
            {
              name: 'enabled',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'backgroundColor',
              type: 'select',
              defaultValue: 'faf5f0',
              options: [
                { label: 'Warm White', value: 'faf5f0' },
                { label: 'White', value: 'ffffff' },
                { label: 'Light Gray', value: 'f9fafb' },
              ],
            },
            {
              name: 'containerWidth',
              type: 'select',
              defaultValue: 'full',
              options: [
                { label: 'Full Width', value: 'full' },
                { label: 'Contained', value: 'contained' },
              ],
            },
            {
              name: 'paddingTop',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'paddingBottom',
              type: 'number',
              defaultValue: 0,
            },
            {
              name: 'backgroundSettings',
              type: 'group',
              fields: [
                { name: 'backgroundGradient', type: 'checkbox', defaultValue: true },
                { name: 'radialGlow', type: 'checkbox', defaultValue: false },
                { name: 'overlayOpacity', type: 'number', defaultValue: 0.5, admin: { description: '0 to 1' } },
                { name: 'paperTexture', type: 'upload', relationTo: 'media' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
