import type { Block } from 'payload'

export const StatusBadgeBlock: Block = {
  slug: 'statusBadge',
  labels: {
    singular: 'Status Badge',
    plural: 'Status Badges',
  },
  fields: [
    {
      name: 'text',
      label: 'Badge Text',
      type: 'text',
      required: true,
      defaultValue: 'New',
    },
    {
      name: 'variant',
      label: 'Badge Type',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Trending', value: 'trending' },
        { label: 'Featured', value: 'featured' },
        { label: 'Popular', value: 'popular' },
        { label: 'Hot', value: 'hot' },
        { label: 'Recommended', value: 'recommended' },
        { label: 'Limited', value: 'limited' },
        { label: 'Coming Soon', value: 'coming-soon' },
        {label : 'Opportunity', value: 'opportunity'},
        {label : 'Event', value: 'event'},
        {label : 'Announcement', value: 'announcement'},
      ],
    },
    {
      name: 'size',
      label: 'Size',
      type: 'select',
      defaultValue: 'md',
      options: [
        { label: 'Small', value: 'sm' },
        { label: 'Medium', value: 'md' },
        { label: 'Large', value: 'lg' },
      ],
    },
  ],
}