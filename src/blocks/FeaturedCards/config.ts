import type { Block } from 'payload'

export const FeaturedCardsBlock: Block = {
  slug: 'featuredCards',
  interfaceName: 'FeaturedCardsBlock',
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Section Heading (Optional)',
    },
    {
      name: 'subheading',
      type: 'text',
      label: 'Section Subheading (Optional)',
    },
    {
      name: 'columns',
      type: 'select',
      label: 'Columns in Grid',
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns (Default)', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
      defaultValue: '3',
      required: true,
    },
    {
      name: 'cardStyle',
      type: 'select',
      label: 'Card Style Theme',
      options: [
        { label: 'Standard White', value: 'standard' },
        { label: 'Glassmorphism', value: 'glassmorphism' },
        { label: 'Navy Theme', value: 'navy' },
        { label: 'Red Theme', value: 'red' },
        { label: 'Bordered/Minimal', value: 'bordered' },
      ],
      defaultValue: 'standard',
      required: true,
    },
    {
      name: 'cards',
      type: 'array',
      label: 'Cards',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Card Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Card Description',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Card Icon',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Academic/Education', value: 'academic' },
            { label: 'Globe/Language', value: 'globe' },
            { label: 'Calendar/Event', value: 'calendar' },
            { label: 'Award/Scholarship', value: 'award' },
            { label: 'Book/Study', value: 'book' },
            { label: 'Group/Community', value: 'group' },
            { label: 'Info/About', value: 'info' },
            { label: 'Star/Featured', value: 'star' },
          ],
          defaultValue: 'info',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Background/Top Image (Optional)',
          admin: {
            description: 'Image for this card. WARNING: To change this image, click the "X" button to clear the field, then select or upload a new one. DO NOT click the pencil "Edit" icon to replace the file inside the media drawer, as that will overwrite the shared media asset globally across all pages!',
          },
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Badge/Tag (Optional, e.g. "New")',
        },
        {
          name: 'linkLabel',
          type: 'text',
          label: 'Link Label',
          defaultValue: 'Learn More',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL (Optional)',
        },
      ],
    },
  ],
}
