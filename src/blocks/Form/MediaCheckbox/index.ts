import { Block } from 'payload'

export const MediaCheckboxBlock: Block = {
  slug: 'mediaCheckbox',
  labels: {
    singular: 'Media with Checkbox',
    plural: 'Media with Checkboxes',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'The internal name of this field for the form submission data.',
      }
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      defaultValue: 'Category B (Done)',
      admin: {
        description: 'The label for the checkbox.',
      }
    },
    {
      name: 'instructions',
      type: 'richText',
      admin: {
        description: 'Instructions to display above the media.',
      }
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'The media (e.g. payment details) to display.',
      }
    },
    {
      name: 'required',
      type: 'checkbox',
      defaultValue: true,
    }
  ]
}
