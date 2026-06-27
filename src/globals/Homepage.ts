import type { GlobalConfig, Block, Field } from 'payload'
import { isSuperAdmin } from '../access/roles'
import { revalidateHomepage } from './hooks/revalidateHomepage'

/* ------------------------------------------------------------------ */
/*  Reusable field builders                                           */
/*  Every section needs heading + alignment + size + background +    */
/*  underline. Previously this was copy-pasted 5x in blocks AND       */
/*  again 5x at the global's top level (10 copies of the same code).  */
/*  Now there's exactly ONE definition. Change it once, every section */
/*  picks it up — no more risk of one block drifting out of sync.     */
/*                                                                    */
/*  NOTE on the `as Field` casts below: Payload's Field type is a     */
/*  30+ member discriminated union. When a `row`/`group`'s `fields`   */
/*  array is itself a literal nested inside another literal array,    */
/*  TS's structural checker can lose track of the discriminant and    */
/*  report a confusing mismatch against an unrelated union member     */
/*  (e.g. `collapsible`). Casting the row/group object itself as      */
/*  `Field` sidesteps that — it's a known friction point with deeply  */
/*  nested Payload field literals, not a real type error.             */
/* ------------------------------------------------------------------ */

const headingControlFields = (defaultHeading: string): Field[] => [
  {
    name: 'heading',
    type: 'text',
    defaultValue: defaultHeading,
    required: true,
  },
  {
    type: 'row',
    fields: [
      {
        name: 'align',
        type: 'select',
        label: 'Heading Alignment',
        defaultValue: 'center',
        admin: { width: '50%' },
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Center', value: 'center' },
          { label: 'Right', value: 'right' },
        ],
        required: true,
      },
      {
        name: 'size',
        type: 'select',
        label: 'Heading Size',
        defaultValue: 'medium',
        admin: { width: '50%' },
        options: [
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
        ],
        required: true,
      },
    ],
  } as Field,
]

const backgroundAndUnderlineFields = (
  defaultBg: 'white' | 'slate' | 'cream',
): Field[] => [
  {
    type: 'row',
    fields: [
      {
        name: 'bg',
        type: 'select',
        label: 'Background Theme',
        defaultValue: defaultBg,
        admin: { width: '50%' },
        options: [
          { label: 'White (Standard)', value: 'white' },
          { label: 'Light Slate Gray', value: 'slate' },
          { label: 'Warm Cream', value: 'cream' },
        ],
        required: true,
      },
      {
        name: 'showUnderline',
        type: 'checkbox',
        label: 'Show Heading Underline Decoration',
        defaultValue: true,
        admin: { width: '50%' },
        required: true,
      },
    ],
  } as Field,
]

// Lets the admin hide a section WITHOUT deleting it / losing its order
// in the layout. Previously the only way to "hide" a section was to
// remove the block, which threw away every setting inside it.
const enabledToggleField: Field = {
  name: 'enabled',
  type: 'checkbox',
  label: 'Show this section on the homepage',
  defaultValue: true,
  admin: {
    description:
      'Turn off to temporarily hide this section without losing its content or position.',
  },
}

// Shared display-count field with sane bounds, so nobody can type
// "limit: 9999" and silently break the page. Optional width lets us
// drop it straight into a `row` without a spread-override.
const displayCountField = (defaultValue: number, max = 20, width?: string): Field => ({
  name: 'limit',
  type: 'number',
  label: 'Display Count',
  defaultValue,
  min: 1,
  max,
  required: true,
  ...(width ? { admin: { width } } : {}),
})

const imageUploadField = (description: string): Field => ({
  name: 'image',
  type: 'upload',
  relationTo: 'media',
  required: true,
  filterOptions: {
    mimeType: { contains: 'image' },
  },
  admin: { description },
})

/* ------------------------------------------------------------------ */
/*  Blocks                                                            */
/* ------------------------------------------------------------------ */

const heroCarouselBlock: Block = {
  slug: 'carousel',
  labels: {
    singular: 'Hero Carousel',
    plural: 'Hero Carousels',
  },
  fields: [
    enabledToggleField,
    {
      type: 'row',
      fields: [
        {
          name: 'carouselHeight',
          type: 'select',
          label: 'Carousel Height',
          defaultValue: 'medium',
          admin: { width: '50%' },
          options: [
            { label: 'Short (400px)', value: 'short' },
            { label: 'Medium (550px)', value: 'medium' },
            { label: 'Tall (700px)', value: 'tall' },
            { label: 'Full Screen', value: 'fullscreen' },
          ],
          required: true,
        },
        {
          name: 'carouselLayout',
          type: 'select',
          label: 'Carousel Layout',
          defaultValue: 'fullWidth',
          admin: { width: '50%' },
          options: [
            { label: 'Full Width', value: 'fullWidth' },
            { label: 'Boxed Container', value: 'boxed' },
          ],
          required: true,
        },
      ],
    } as Field,
    {
      type: 'row',
      fields: [
        {
          name: 'carouselImageOpacity',
          type: 'select',
          label: 'Image Opacity (Dimming)',
          defaultValue: '100',
          admin: { width: '50%' },
          options: [
            { label: '100% (Normal)', value: '100' },
            { label: '90%', value: '90' },
            { label: '80%', value: '80' },
            { label: '70%', value: '70' },
            { label: '60%', value: '60' },
            { label: '50%', value: '50' },
          ],
          required: true,
        },
        {
          name: 'carouselAutoplay',
          type: 'checkbox',
          label: 'Autoplay Slides',
          defaultValue: true,
          admin: { width: '50%' },
        },
      ],
    } as Field,
    {
      name: 'carouselAutoplayInterval',
      type: 'number',
      label: 'Autoplay Speed (in milliseconds)',
      defaultValue: 5000,
      min: 1000,
      admin: {
        description: 'Minimum 1000ms — anything faster feels jarring.',
        condition: (data, siblingData) => Boolean(siblingData?.carouselAutoplay),
      },
    },
    {
      name: 'slides',
      type: 'array',
      label: 'Hero Carousel Slides',
      maxRows: 10,
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        imageUploadField(
          'Slide image. To change this, click the "X" to clear the field, then pick/upload a new one. Do NOT use the pencil "Edit" icon inside the media drawer — that overwrites the shared media asset everywhere it\'s used.',
        ),
        { name: 'alt', type: 'text', required: true },
        {
          type: 'row',
          fields: [
            {
              name: 'link',
              type: 'text',
              admin: { width: '70%', description: 'Optional: clicking the slide goes here' },
            },
            {
              name: 'linkNewTab',
              type: 'checkbox',
              label: 'Open in new tab',
              defaultValue: false,
              admin: { width: '30%' },
            },
          ],
        } as Field,
        {
          type: 'row',
          fields: [
            {
              name: 'imageAlignment',
              type: 'select',
              label: 'Image Alignment',
              defaultValue: 'center',
              admin: { width: '34%' },
              options: [
                { label: 'Center', value: 'center' },
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Left', value: 'left' },
                { label: 'Right', value: 'right' },
              ],
            },
            {
              name: 'overlayOpacity',
              type: 'select',
              label: 'Dark Overlay Opacity',
              defaultValue: 'medium',
              admin: { width: '33%' },
              options: [
                { label: '0% (None)', value: 'none' },
                { label: '20% (Light)', value: 'light' },
                { label: '40% (Medium)', value: 'medium' },
                { label: '60% (Dark)', value: 'dark' },
                { label: '80% (Extra Dark)', value: 'extraDark' },
              ],
            },
            {
              name: 'textAlignment',
              type: 'select',
              label: 'Text Alignment',
              defaultValue: 'left',
              admin: { width: '33%' },
              options: [
                { label: 'Left', value: 'left' },
                { label: 'Center', value: 'center' },
                { label: 'Right', value: 'right' },
              ],
            },
          ],
        } as Field,
        { name: 'title', type: 'text', label: 'Slide Heading Overlay' },
        { name: 'subtitle', type: 'text', label: 'Slide Subtitle / Description' },
        {
          type: 'row',
          fields: [
            { name: 'buttonLabel', type: 'text', label: 'Button Label', admin: { width: '50%' } },
            { name: 'buttonLink', type: 'text', label: 'Button Link', admin: { width: '50%' } },
          ],
        } as Field,
      ],
    },
  ],
}

const servicesGridBlock: Block = {
  slug: 'services',
  labels: {
    singular: 'Services Grid ("We Offer")',
    plural: 'Services Grids',
  },
  fields: [
    enabledToggleField,
    ...headingControlFields('WE OFFER'),
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      admin: { description: 'Select up to 4 service cards to display' },
      validate: (value: unknown) => {
        if (Array.isArray(value) && value.length > 4) {
          return 'Select a maximum of 4 services — the grid layout is built for 4 cards.'
        }
        return true
      },
    },
    ...backgroundAndUnderlineFields('slate'),
  ],
}

const newsSectionBlock: Block = {
  slug: 'news',
  labels: {
    singular: 'News & Notifications Section',
    plural: 'News Sections',
  },
  fields: [
    enabledToggleField,
    ...headingControlFields('NEWS & NOTIFICATIONS'),
    {
      name: 'newsSubheading',
      type: 'text',
      defaultValue: 'Stay updated with the latest news, announcements, and achievements from MOSAI.',
    },
    {
      type: 'row',
      fields: [
        displayCountField(8, 20, '34%'),
        {
          name: 'newsViewAllLink',
          type: 'text',
          defaultValue: '/news',
          required: true,
          admin: { width: '33%' },
        },
        {
          name: 'newsViewAllLabel',
          type: 'text',
          label: 'View All Button Label',
          defaultValue: 'View All Notifications',
          required: true,
          admin: { width: '33%' },
        },
      ],
    } as Field,
    ...backgroundAndUnderlineFields('white'),
  ],
}

const gallerySectionBlock: Block = {
  slug: 'gallery',
  labels: {
    singular: 'Gallery Section',
    plural: 'Gallery Sections',
  },
  fields: [
    enabledToggleField,
    ...headingControlFields('MOSAI Gallery'),
    {
      type: 'row',
      fields: [
        displayCountField(4, 20, '50%'),
        {
          name: 'galleryViewAllLabel',
          type: 'text',
          label: 'View All Button Label',
          defaultValue: 'View More',
          required: true,
          admin: { width: '50%' },
        },
      ],
    } as Field,
    ...backgroundAndUnderlineFields('slate'),
  ],
}

const pastEventsSectionBlock: Block = {
  slug: 'events',
  labels: {
    singular: 'Past Events Section',
    plural: 'Past Events Sections',
  },
  fields: [
    enabledToggleField,
    ...headingControlFields('Our Past Events'),
    displayCountField(2, 10),
    ...backgroundAndUnderlineFields('white'),
  ],
}

/* ------------------------------------------------------------------ */
/*  Global                                                            */
/*                                                                    */
/*  `layout` now ships with a defaultValue containing all 5 sections  */
/*  in the standard order. That means the array is NEVER empty for a  */
/*  fresh site, so the frontend doesn't need an "if layout is empty,  */
/*  render hardcoded fallback sections" branch anymore — that whole   */
/*  ~180-line duplicate field set is gone. Single source of truth.    */
/* ------------------------------------------------------------------ */

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
    update: isSuperAdmin,
  },
  admin: { group: 'Site Settings' },
  fields: [
    {
      name: 'layout',
      type: 'blocks',
      label: 'Homepage Sections',
      minRows: 1,
      defaultValue: [
        { blockType: 'carousel' },
        { blockType: 'services' },
        { blockType: 'news' },
        { blockType: 'gallery' },
        { blockType: 'events' },
      ],
      blocks: [
        heroCarouselBlock,
        servicesGridBlock,
        newsSectionBlock,
        gallerySectionBlock,
        pastEventsSectionBlock,
      ],
      admin: {
        initCollapsed: true,
        description:
          'Drag to reorder sections. Use the toggle inside each block to hide/show a section without losing its settings.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateHomepage],
  },
}