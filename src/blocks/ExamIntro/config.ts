import type { Block } from 'payload'

export const ExamIntroBlock: Block = {
  slug: 'examIntro',
  interfaceName: 'ExamIntroBlock',
  labels: {
    singular: 'Exam Intro',
    plural: 'Exam Intros',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Exam Title',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Exam Subtitle (Optional)',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'examDate',
      type: 'date',
      label: 'Exam Date',
    },
    {
      name: 'applicationDeadline',
      type: 'date',
      label: 'Application Deadline',
    },
    {
      name: 'venue',
      type: 'text',
      label: 'Venue',
    },
    {
      name: 'fee',
      type: 'text',
      label: 'Examination Fee',
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
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Cover Image',
    },
  ],
}
