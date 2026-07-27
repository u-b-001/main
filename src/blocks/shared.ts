import type { Field, NumberField, TextField } from 'payload'
import deepMerge from '@/utilities/deepMerge'

export const sectionHeadingFields: Field[] = [
  {
    name: 'sectionHeading',
    type: 'text',
    admin: {
      description: 'Section heading displayed above this block',
    },
  },
  {
    name: 'sectionDescription',
    type: 'textarea',
    admin: {
      description: 'Optional description below the heading',
    },
  },
  {
    name: 'headingAlignment',
    type: 'select',
    defaultValue: 'center',
    options: [
      { label: 'Left', value: 'left' },
      { label: 'Center', value: 'center' },
      { label: 'Right', value: 'right' },
    ],
  },
]

const commonLucideIcons = [
  'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown',
  'ChevronRight', 'ChevronLeft', 'ChevronUp', 'ChevronDown',
  'Check', 'CheckCircle2', 'X', 'XCircle',
  'Info', 'AlertCircle', 'AlertTriangle', 'HelpCircle',
  'Settings', 'Search', 'User', 'Users',
  'Home', 'Menu', 'MoreHorizontal', 'MoreVertical',
  'Star', 'Heart', 'ThumbsUp', 'ThumbsDown',
  'MapPin', 'Phone', 'Mail', 'Clock',
  'Calendar', 'Globe', 'Award', 'BookOpen',
  'GraduationCap', 'Briefcase', 'Play', 'Shield',
  'Zap', 'Download', 'Camera', 'Bell', 'Send',
  'academic', 'globe', 'calendar', 'award', 'book', 'group', 'info', 'star', // legacy mapping support
  'address', 'phone', 'email', 'hours', 'general' // legacy mapping support
].map(icon => ({ label: icon, value: icon }));

export const iconField = (name: string, label?: string, overrides?: Partial<TextField>): Field => {
  const defaultField: TextField = {
    name,
    type: 'text',
    label: label || 'Icon',
    admin: {
      components: {
        Field: '@/globals/IconPickerField#IconPickerField',
      },
      description: 'Select a Lucide icon',
    },
  }

  return deepMerge(defaultField, overrides || {})
}

export const colorField = (
  name: string,
  label: string,
  defaultVal?: string,
  overrides?: Partial<TextField>,
): Field => {
  const defaultField: TextField = {
    name,
    type: 'text',
    label,
    defaultValue: defaultVal,
    admin: {
      components: {
        Field: '@/components/admin/ColorPickerField#ColorPickerField',
      },
      description: 'Pick a color or enter hex value',
    },
  }

  return deepMerge(defaultField, overrides || {})
}

export const opacityField = (
  name: string,
  label: string,
  defaultVal = 50,
  overrides?: Partial<NumberField>,
): Field => {
  const defaultField: NumberField = {
    name,
    type: 'number',
    label,
    defaultValue: defaultVal,
    min: 0,
    max: 100,
    admin: {
      components: {
        Field: '@/components/admin/OpacitySliderField#OpacitySliderField',
      },
      description: 'Opacity percentage (0-100)',
    },
  }

  return deepMerge(defaultField, overrides || {})
}
