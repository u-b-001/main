import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const CareerPosting: Block = {
  slug: 'careerPosting',
  labels: { singular: 'Career Posting', plural: 'Career Postings' },
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Open Positions' },
    { name: 'description', type: 'textarea' },
    {
      name: 'postings',
      type: 'array',
      minRows: 1,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'department',
          type: 'text',
          admin: { description: 'e.g. Engineering, Research, Operations' },
        },
        {
          name: 'location',
          type: 'text',
          admin: { description: 'e.g. Delhi, Remote, Hybrid' },
        },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'fullTime',
          options: [
            { label: 'Full-time', value: 'fullTime' },
            { label: 'Part-time', value: 'partTime' },
            { label: 'Internship', value: 'internship' },
            { label: 'Contract', value: 'contract' },
          ],
        },
        {
          name: 'description',
          type: 'richText',
          editor: lexicalEditor({}),
        },
        {
          name: 'applyLink',
          type: 'text',
          admin: { description: 'External application URL, or leave blank to use the form below' },
        },
        { name: 'postedDate', type: 'date' },
      ],
    },
    {
      name: 'emptyStateMessage',
      type: 'text',
      defaultValue: 'No open positions right now. Check back soon!',
    },
  ],
}