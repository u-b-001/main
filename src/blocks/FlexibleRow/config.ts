import type { Block } from 'payload'

// Sub-blocks configuration for items inside a column

const colRichTextBlock: Block = {
  slug: 'colRichText',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Elements',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
    },
  ],
}

const colCardBlock: Block = {
  slug: 'colCard',
  labels: {
    singular: 'Card Content',
    plural: 'Card Contents',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Card Image',
    },
    {
      name: 'title',
      type: 'text',
      label: 'Card Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Card Description',
    },
    {
      name: 'ctaLabel',
      type: 'text',
      label: 'Button Label',
    },
    {
      name: 'ctaLink',
      type: 'text',
      label: 'Button Link',
    },
    {
      name: 'cardStyle',
      type: 'select',
      label: 'Card Theme Style',
      options: [
        { label: 'Standard White', value: 'standard' },
        { label: 'Brand Slate', value: 'slate' },
        { label: 'Accent Border', value: 'border' },
      ],
      defaultValue: 'standard',
    },
  ],
}

const colImageBlock: Block = {
  slug: 'colImage',
  labels: {
    singular: 'Image Element',
    plural: 'Image Elements',
  },
  fields: [
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Image',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Image Caption (Optional)',
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Image Aspect Ratio',
      options: [
        { label: 'Original', value: 'original' },
        { label: 'Square (1:1)', value: 'square' },
        { label: 'Video (16:9)', value: 'video' },
        { label: 'Circle', value: 'circle' },
      ],
      defaultValue: 'original',
    },
  ],
}

const colCtaBlock: Block = {
  slug: 'colCta',
  labels: {
    singular: 'Call to Action Button',
    plural: 'Call to Action Buttons',
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      label: 'Button Label',
      required: true,
    },
    {
      name: 'link',
      type: 'text',
      label: 'Button Link',
      required: true,
    },
    {
      name: 'style',
      type: 'select',
      label: 'Button Style',
      options: [
        { label: 'Navy Button', value: 'primary' },
        { label: 'Red Button', value: 'secondary' },
        { label: 'Outline Button', value: 'outline' },
      ],
      defaultValue: 'primary',
    },
  ],
}

const colEmbedBlock: Block = {
  slug: 'colEmbed',
  labels: {
    singular: 'Video Embed',
    plural: 'Video Embeds',
  },
  fields: [
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video Link (YouTube or Vimeo)',
      required: true,
      admin: {
        description: 'Provide the full share link of the video (e.g. https://www.youtube.com/watch?v=...)',
      },
    },
  ],
}

export const FlexibleRowBlock: Block = {
  slug: 'flexibleRow',
  interfaceName: 'FlexibleRowBlock',
  fields: [
    {
      name: 'containerWidth',
      type: 'select',
      label: 'Row Container Width',
      options: [
        { label: 'Boxed (Constrained)', value: 'boxed' },
        { label: 'Full Width (Viewport)', value: 'fullWidth' },
      ],
      defaultValue: 'boxed',
      required: true,
    },
    {
      name: 'rowBackground',
      type: 'select',
      label: 'Row Background Color',
      options: [
        { label: 'Transparent', value: 'transparent' },
        { label: 'Slate Light (slate-50)', value: 'slate50' },
        { label: 'Brand Navy (1A2B4A)', value: 'brandNavy' },
        { label: 'Brand Red (Japanese Red)', value: 'brandRed' },
        { label: 'Light Cream', value: 'brandCream' },
      ],
      defaultValue: 'transparent',
      required: true,
    },
    {
      name: 'rowPadding',
      type: 'select',
      label: 'Row Padding',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      defaultValue: 'none',
      required: true,
    },
    {
      name: 'gridGap',
      type: 'select',
      label: 'Gap between Columns',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      defaultValue: 'medium',
      required: true,
    },
    {
      name: 'alignItems',
      type: 'select',
      label: 'Vertical Alignment',
      options: [
        { label: 'Top', value: 'start' },
        { label: 'Center', value: 'center' },
        { label: 'Bottom', value: 'end' },
        { label: 'Stretch', value: 'stretch' },
      ],
      defaultValue: 'stretch',
      required: true,
    },
    {
      name: 'columns',
      type: 'array',
      label: 'Columns',
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: 'Column',
        plural: 'Columns',
      },
      fields: [
        {
          name: 'width',
          type: 'select',
          label: 'Column Width (Desktop)',
          options: [
            { label: 'Full Width (12/12)', value: 'col-span-12' },
            { label: 'Half Width (6/12)', value: 'col-span-6' },
            { label: 'One Third (4/12)', value: 'col-span-4' },
            { label: 'Two Thirds (8/12)', value: 'col-span-8' },
            { label: 'One Quarter (3/12)', value: 'col-span-3' },
            { label: 'Three Quarters (9/12)', value: 'col-span-9' },
          ],
          defaultValue: 'col-span-6',
          required: true,
        },
        {
          name: 'columnStyle',
          type: 'select',
          label: 'Column Layout Style',
          options: [
            { label: 'Simple Text/Image', value: 'simple' },
            { label: 'Card Box (Shadow & Hover)', value: 'card' },
            { label: 'Bordered/Minimal Card', value: 'bordered' },
            { label: 'Glassmorphism Card', value: 'glassmorphism' },
          ],
          defaultValue: 'simple',
          required: true,
        },
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Background Color (within Column)',
          options: [
            { label: 'Transparent', value: 'transparent' },
            { label: 'Slate Light (slate-50)', value: 'slate50' },
            { label: 'Brand Navy (1A2B4A)', value: 'brandNavy' },
            { label: 'Brand Red (Japanese Red)', value: 'brandRed' },
            { label: 'Light Cream', value: 'brandCream' },
          ],
          defaultValue: 'transparent',
          required: true,
        },
        {
          name: 'textColor',
          type: 'select',
          label: 'Text Color Scheme',
          options: [
            { label: 'Default / Dark Text', value: 'dark' },
            { label: 'Light / White Text', value: 'light' },
          ],
          defaultValue: 'dark',
          required: true,
        },
        {
          name: 'columnPadding',
          type: 'select',
          label: 'Column Padding',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
          ],
          defaultValue: 'none',
          required: true,
        },
        {
          name: 'alignment',
          type: 'select',
          label: 'Content Alignment',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          defaultValue: 'left',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Column Image (Optional / Legacy)',
          admin: {
            description: 'Legacy Image for this column. Kept for backward compatibility.',
          },
        },
        {
          name: 'imagePosition',
          type: 'select',
          label: 'Image Position (Legacy)',
          options: [
            { label: 'Top of column', value: 'top' },
            { label: 'Bottom of column', value: 'bottom' },
          ],
          defaultValue: 'top',
        },
        {
          name: 'imageShape',
          type: 'select',
          label: 'Image Shape style (Legacy)',
          options: [
            { label: 'Rounded Rect', value: 'rounded' },
            { label: 'Circle', value: 'circle' },
            { label: 'Square/Cover', value: 'square' },
            { label: 'Original Ratio', value: 'original' },
          ],
          defaultValue: 'rounded',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Column Title (Optional / Legacy)',
        },
        {
          name: 'content',
          type: 'richText',
          label: 'Column Content (Optional / Legacy)',
        },
        {
          name: 'ctaLabel',
          type: 'text',
          label: 'Call to Action Label (Optional / Legacy)',
        },
        {
          name: 'ctaLink',
          type: 'text',
          label: 'Call to Action Link (Optional / Legacy)',
        },
        {
          name: 'blocks',
          type: 'blocks',
          label: 'Column Content Elements (New Dynamic Blocks)',
          admin: {
            description: 'Add multiple elements of different styles (Rich Text, Cards, Images, Buttons, Videos) inside this column. If blocks are added here, they will display instead of the legacy content fields above.',
          },
          blocks: [
            colRichTextBlock,
            colCardBlock,
            colImageBlock,
            colCtaBlock,
            colEmbedBlock,
          ],
        },
      ],
    },
  ],
}

export const FlexibleColumnBlock: Block = {
  slug: 'flexibleColumn',
  interfaceName: 'FlexibleColumnBlock',
  labels: {
    singular: 'Flexible Column',
    plural: 'Flexible Columns',
  },
  fields: FlexibleRowBlock.fields,
}
