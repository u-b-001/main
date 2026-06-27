import type { Block } from 'payload'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  labels: { singular: 'Call to Action', plural: 'Call to Actions' },
  fields: [
    {
      name: 'sectionHeading',
      type: 'text',
      label: 'Section Heading',
      admin: { description: 'Section heading displayed above this block' },
    },
    {
      name: 'sectionDescription',
      type: 'textarea',
      label: 'Section Description',
      admin: { description: 'Optional description below the heading' },
    },
    {
      name: 'align',
      type: 'select',
      label: 'Heading Alignment',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    {
      name: 'layout',
      type: 'select',
      label: 'Layout',
      required: true,
      defaultValue: 'gradient',
      admin: { description: 'Choose visual style for this CTA block' },
      options: [
        { label: 'Full-Width Banner (Gradient Card)', value: 'gradient' },
        { label: 'Centered Compact Card', value: 'compact' },
        { label: 'Split Image Banner', value: 'split' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      label: 'Heading',
      admin: { description: 'CTA headline text' },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: { description: 'CTA description text' },
    },
    {
      name: 'buttons',
      type: 'array',
      label: 'Buttons',
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Label',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Url',
          required: true,
        },
        {
          name: 'variant',
          type: 'select',
          label: 'Variant',
          defaultValue: 'primary',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
          ],
        },
      ],
    },
    {
      name: 'bgType',
      type: 'select',
      label: 'Background Type',
      defaultValue: 'color',
      options: [
        { label: 'Color', value: 'color' },
        { label: 'Gradient', value: 'gradient' },
        { label: 'Image', value: 'image' },
      ],
    },
    {
      name: 'backgroundColor',
      type: 'text',
      label: 'Background Color',
      admin: {
        description: 'Pick background color or enter hex value',
        components: {
          Field: '@/globals/ColorPickerField.tsx#ColorPickerField',
        },
        condition: (_, siblingData) =>
          siblingData?.bgType === 'color' || siblingData?.bgType === 'gradient',
      },
      defaultValue: '#1E40AF',
    },
    {
      name: 'bgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Background Image',
      admin: {
        condition: (_, siblingData) => siblingData?.bgType === 'image',
      },
    },
  ],
}
export default CallToAction
