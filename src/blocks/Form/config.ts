import type { Block } from 'payload'

export const FormBlock: Block = {
  slug: 'formBlock',
  labels: { singular: 'Form', plural: 'Forms' },
  fields: [
    {
      type: 'collapsible',
      label: 'Header',
      fields: [
        { name: 'heading', type: 'text' },
        { name: 'description', type: 'textarea' },
      ],
    },
    {
      name: 'fields',
      type: 'array',
      label: 'Form Fields',
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: 'label', type: 'text', required: true },
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: { description: 'Unique key used in submitted data, e.g. "email"' },
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'text',
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Phone', value: 'tel' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Number', value: 'number' },
            { label: 'Select', value: 'select' },
            { label: 'Checkbox', value: 'checkbox' },
          ],
        },
        { name: 'placeholder', type: 'text' },
        { name: 'required', type: 'checkbox', defaultValue: false },
        { name: 'width', type: 'select', defaultValue: 'full', options: ['full', 'half'] },
        {
          name: 'options',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.type === 'select',
            initCollapsed: true,
          },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Submission Settings',
      fields: [
        { name: 'submitLabel', type: 'text', defaultValue: 'Submit' },
        {
          name: 'submitEndpoint',
          type: 'text',
          required: true,
          admin: { description: 'API route this form posts to, e.g. /api/contact' },
        },
        { name: 'successMessage', type: 'text', defaultValue: 'Thanks! We\u2019ll get back to you soon.' },
        { name: 'errorMessage', type: 'text', defaultValue: 'Something went wrong. Please try again.' },
      ],
    },
  ],
}