import type { Block } from 'payload'

export const MembersDirectoryBlock: Block = {
  slug: 'membersDirectory',
  interfaceName: 'MembersDirectoryBlock',
  labels: { singular: 'Members Directory', plural: 'Members Directories' },
  fields: [
    {
      name: 'title',
      type: 'text',
      defaultValue: 'MEMBERS DIRECTORY',
      label: 'Directory Title',
    },
    {
      name: 'defaultView',
      type: 'select',
      label: 'Default View',
      defaultValue: 'all',
      options: [
        { label: 'Show All Members', value: 'all' },
        { label: 'Show Empty (Requires selection/search)', value: 'empty' },
      ],
    },
    {
      name: 'enableLiveSearch',
      type: 'checkbox',
      label: 'Live Search (Search as you type)',
      defaultValue: true,
    },
    {
      name: 'searchFields',
      type: 'select',
      label: 'Searchable Fields',
      hasMany: true,
      defaultValue: ['name', 'university', 'city', 'specialisation', 'designation'],
      options: [
        { label: 'Name', value: 'name' },
        { label: 'University', value: 'university' },
        { label: 'City', value: 'city' },
        { label: 'Specialisation', value: 'specialisation' },
        { label: 'Designation', value: 'designation' },
        { label: 'Fellowship', value: 'fellowship' },
      ],
    },
    {
      name: 'showFields',
      type: 'select',
      label: 'Display Fields on Member Card',
      hasMany: true,
      defaultValue: ['university', 'city', 'year', 'specialisation', 'designation', 'email'],
      options: [
        { label: 'University', value: 'university' },
        { label: 'City', value: 'city' },
        { label: 'Year', value: 'year' },
        { label: 'Specialisation', value: 'specialisation' },
        { label: 'Designation', value: 'designation' },
        { label: 'Fellowship', value: 'fellowship' },
        { label: 'Email', value: 'email' },
        { label: 'Phone', value: 'phone' },
        { label: 'Address', value: 'presentAddress' },
      ],
    },
    {
      name: 'designationFilter',
      type: 'text',
      label: 'Filter by Designation (Leave blank for all)',
      admin: {
        description: 'Only show members matching this designation (e.g. Professor)',
      },
    },
  ],
}
