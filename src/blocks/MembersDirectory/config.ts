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
  ],
}
