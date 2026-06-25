import type { Block } from 'payload'

export const MediaContactBlock: Block = {
  slug: 'mediaContact',
  interfaceName: 'MediaContactBlock',
  labels: {
    singular: 'Media with Contact',
    plural: 'Media with Contacts',
  },
  fields: [
    {
      name: 'layoutDirection',
      type: 'select',
      label: 'Layout Orientation',
      options: [
        { label: 'Media on Left, Contact on Right', value: 'mediaLeft' },
        { label: 'Contact on Left, Media on Right', value: 'mediaRight' },
      ],
      defaultValue: 'mediaLeft',
      required: true,
    },
    {
      name: 'mediaWidth',
      type: 'select',
      label: 'Media Column Width (Desktop)',
      options: [
        { label: 'Narrow (1/3 of row)', value: 'col-span-4' },
        { label: 'Medium-Narrow (5/12 of row)', value: 'col-span-5' },
        { label: 'Equal (1/2 of row)', value: 'col-span-6' },
        { label: 'Medium-Wide (7/12 of row)', value: 'col-span-7' },
        { label: 'Wide (2/3 of row)', value: 'col-span-8' },
      ],
      defaultValue: 'col-span-6',
      required: true,
    },
    {
      name: 'verticalAlignment',
      type: 'select',
      label: 'Vertical Alignment (Desktop)',
      options: [
        { label: 'Align Top', value: 'items-start' },
        { label: 'Align Center', value: 'items-center' },
        { label: 'Align Bottom', value: 'items-end' },
      ],
      defaultValue: 'items-start',
      required: true,
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Section Background Color',
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
      name: 'padding',
      type: 'select',
      label: 'Section Padding',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Small', value: 'small' },
        { label: 'Medium (Default)', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
      defaultValue: 'medium',
      required: true,
    },
    {
      name: 'mediaType',
      type: 'select',
      label: 'Media Format Type',
      options: [
        { label: 'Uploaded File (Image or Video file)', value: 'upload' },
        { label: 'External Video URL (YouTube / Vimeo)', value: 'videoUrl' },
      ],
      defaultValue: 'upload',
      required: true,
    },
    {
      name: 'mediaFile',
      type: 'upload',
      relationTo: 'media',
      label: 'Upload Image / Video File',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'upload',
        description: 'Upload or select an image file or a video file (e.g. mp4, png, jpg) from the media gallery. WARNING: To change this, clear the field first using the "X" button.',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'YouTube / Vimeo Video Link',
      admin: {
        condition: (_, siblingData) => siblingData?.mediaType === 'videoUrl',
        description: 'Paste the share link of the video (e.g. https://www.youtube.com/watch?v=...)',
      },
    },
    {
      name: 'aspectRatio',
      type: 'select',
      label: 'Media Aspect Ratio',
      options: [
        { label: 'Original / Auto', value: 'original' },
        { label: 'Video Standard (16:9)', value: 'video' },
        { label: 'Square (1:1)', value: 'square' },
        { label: 'Portrait (3:4)', value: 'portrait' },
        { label: 'Tall / Mobile Video (9:16)', value: 'tall' },
      ],
      defaultValue: 'video',
      required: true,
    },
    {
      name: 'contactHeading',
      type: 'text',
      label: 'Contact Section Heading',
      defaultValue: 'Get in Touch',
      required: true,
    },
    {
      name: 'contactSubheading',
      type: 'text',
      label: 'Contact Section Subheading',
      defaultValue: 'Mombusho Scholars Association of India',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Contact Description / Welcome Text',
    },
    {
      name: 'contactDetails',
      type: 'array',
      label: 'Contact Information List',
      labels: {
        singular: 'Contact Detail',
        plural: 'Contact Details',
      },
      fields: [
        {
          name: 'type',
          type: 'select',
          label: 'Detail Type',
          options: [
            { label: 'Office Address', value: 'address' },
            { label: 'Phone Number', value: 'phone' },
            { label: 'Email Address', value: 'email' },
            { label: 'Office Hours', value: 'hours' },
            { label: 'General Info', value: 'general' },
          ],
          defaultValue: 'general',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
          admin: {
            placeholder: 'e.g. Registered Office, Secretary Phone',
          },
        },
        {
          name: 'value',
          type: 'textarea',
          label: 'Value',
          required: true,
          admin: {
            placeholder: 'e.g. +91-11-26442950, info@mosai.org.in',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Action Link (Optional)',
          admin: {
            placeholder: 'e.g. mailto:info@mosai.org.in or tel:+911126442950',
            description: 'Adds a link to the detail (e.g. tel:+91... for phone, mailto:foo@bar.com for email)',
          },
        },
      ],
    },
    {
      name: 'showForm',
      type: 'checkbox',
      label: 'Show Contact Message Form',
      defaultValue: true,
      required: true,
    },
    {
      name: 'formHeading',
      type: 'text',
      label: 'Form Section Heading',
      defaultValue: 'Send Us a Message',
      admin: {
        condition: (_, siblingData) => Boolean(siblingData?.showForm),
      },
    },
  ],
}
