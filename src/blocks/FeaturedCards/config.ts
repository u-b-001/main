import type { Block } from 'payload'

export const FeaturedCardsBlock: Block = {
  slug: 'featuredCards',
  interfaceName: 'FeaturedCardsBlock',
  labels: { singular: 'Featured Cards', plural: 'Featured Cards' },
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
        { label: '1 Column', value: '1' },
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
          type: 'richText',
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
            description:
              'Image for this card. WARNING: To change this image, click the "X" button to clear the field, then select or upload a new one. DO NOT click the pencil "Edit" icon to replace the file inside the media drawer, as that will overwrite the shared media asset globally across all pages!',
          },
        },
        {
          name: 'tag',
          type: 'text',
          label: 'Badge/Tag (Optional, e.g. "New")',
        },
        {
          name: 'externalLink',
          type: 'checkbox',
          label: 'External Link',
          defaultValue: false,
          admin: {
            description: 'Open link in new tab',
          },
        },
        {
          name: 'featurePoints',
          type: 'array',
          label: 'Feature Points',
          admin: {
            description: 'Bullet points for the Service Detail layout',
          },
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Point Text',
              required: true,
            },
          ],
        },
        {
          name: 'buttonLabel',
          type: 'text',
          label: 'Button Label',
          defaultValue: 'View More',
          admin: {
            description: 'CTA button label (e.g. "Request Access")',
          },
        },
        {
          name: 'buttonUrl',
          type: 'text',
          label: 'Button Url',
          admin: {
            description: 'CTA button URL',
          },
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status',
          admin: {
            description: 'Project status badge (used in Project Cards layout)',
          },
          options: [
            { label: 'Ongoing', value: 'ongoing' },
            { label: 'Completed', value: 'completed' },
            { label: 'Upcoming', value: 'upcoming' },
          ],
        },
        {
          name: 'progress',
          type: 'text',
          label: 'Progress',
          admin: {
            description: 'Progress percentage 0-100 (used in Project Cards layout)',
          },
        },
        {
          name: 'level',
          type: 'select',
          label: 'Level',
          admin: {
            description: 'Difficulty level (used in Training Cards layout)',
          },
          options: [
            { label: 'Beginner', value: 'beginner' },
            { label: 'Intermediate', value: 'intermediate' },
            { label: 'Advanced', value: 'advanced' },
          ],
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Duration',
          admin: {
            description: 'e.g. "5 Days", "1 Day" (used in Training Cards layout)',
          },
        },
        {
          name: 'mode',
          type: 'text',
          label: 'Mode',
          admin: {
            description: 'e.g. "In-person", "Online", "Hybrid" (used in Training Cards layout)',
          },
        },
        {
          name: 'audience',
          type: 'text',
          label: 'Audience',
          admin: {
            description: 'e.g. "Faculty", "Students & Faculty" (used in Training Cards layout)',
          },
        },
        {
          name: 'date',
          type: 'date',
          label: 'Date',
          admin: {
            description: 'Next batch date (used in Training Cards layout)',
          },
        },
      ],
    },
  ],
}
