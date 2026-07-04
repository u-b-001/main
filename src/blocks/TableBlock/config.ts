import type { Block } from 'payload'
import { colorField, iconField } from '../shared'

export const TableBlock: Block = {
  slug: 'table',
  interfaceName: 'TableBlock',
  labels: { singular: 'Table', plural: 'Tables' },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Table Heading',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Table Subtitle',
      admin: {
        description: 'Optional description text below the heading',
      },
    },
    {
      name: 'headingAlignment',
      type: 'select',
      defaultValue: 'center',
      label: 'Heading Alignment',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
    iconField('icon', 'Table Heading Icon'),
    colorField('iconColor', 'Heading Icon Color', '#1A103D'),
    {
      name: 'iconSize',
      type: 'select',
      defaultValue: 'md',
      label: 'Heading Icon Size',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
        { label: 'Extra Large', value: 'xl' },
      ],
    },
    {
      name: 'tableTheme',
      type: 'select',
      defaultValue: 'gradient',
      label: 'Table Theme Style',
      options: [
        { label: 'Premium Gradient Accent', value: 'gradient' },
        { label: 'Modern Glassmorphism', value: 'glass' },
        { label: 'Clean Minimalist', value: 'minimal' },
        { label: 'Neo-Brutalist (High Contrast)', value: 'brutalist' },
      ],
    },
    colorField('headerBgColor', 'Header Background Color', '#1A103D'),
    {
      name: 'stripedRows',
      type: 'checkbox',
      label: 'Striped Rows (Alternate background)',
      defaultValue: true,
    },
    {
      name: 'hoverEffect',
      type: 'checkbox',
      label: 'Highlight Rows on Hover',
      defaultValue: true,
    },
    {
      name: 'bordered',
      type: 'checkbox',
      label: 'Bordered Grid lines',
      defaultValue: true,
    },
    {
      name: 'borderRadius',
      type: 'select',
      defaultValue: 'xl',
      label: 'Table Corner Radius',
      options: [
        { label: 'Sharp (None)', value: 'none' },
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large (LG)', value: 'lg' },
        { label: 'Extra Large (XL)', value: 'xl' },
        { label: 'Double Extra Large (2XL)', value: '2xl' },
      ],
    },
    {
      name: 'shadow',
      type: 'select',
      defaultValue: 'sm',
      label: 'Shadow Density',
      options: [
        { label: 'None', value: 'none' },
        { label: 'Soft Shadow (XS)', value: 'xs' },
        { label: 'Medium Shadow (SM)', value: 'sm' },
        { label: 'Large Elevated (MD)', value: 'md' },
        { label: 'Deep Glow (LG)', value: 'lg' },
      ],
    },
    {
      name: 'cellPadding',
      type: 'select',
      defaultValue: 'medium',
      label: 'Cell Padding Density',
      options: [
        { label: 'Compact (Tight spacing)', value: 'compact' },
        { label: 'Medium (Balanced spacing)', value: 'medium' },
        { label: 'Spacious (Roomy layout)', value: 'spacious' },
      ],
    },
    {
      name: 'showScrollHint',
      type: 'checkbox',
      label: 'Show mobile scroll indicator hint',
      defaultValue: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Table Caption (Below table)',
    },
    {
      name: 'rows',
      type: 'array',
      label: 'Table Rows',
      required: true,
      fields: [
        {
          name: 'isHeader',
          type: 'checkbox',
          defaultValue: false,
          label: 'Is Header Row?',
        },
        {
          name: 'cells',
          type: 'array',
          label: 'Cells',
          fields: [
            {
              name: 'value',
              type: 'text',
              label: 'Cell Value',
            },
          ],
        },
      ],
    },
  ],
}
