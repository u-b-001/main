import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { isEditor } from '../access/roles'

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Media',
    defaultColumns: ['title', 'album', 'date', 'order'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      admin: {
        description:
          'Optional caption shown under the image (e.g. "Dr. Ashok Jain, President MOSAI")',
      },
    },
    {
      name: 'event',
      type: 'relationship',
      relationTo: 'events',
      admin: { description: 'Link this image to a specific event, if applicable' },
    },
    {
      name: 'album',
      type: 'text',
      index: true,
      admin: {
        description:
          'Group images by album/event name (optional, use only if not linking via event above)',
      },
    },
    { name: 'date', type: 'date' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show in homepage gallery carousel' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Lower numbers appear first' },
    },
  ],
}
