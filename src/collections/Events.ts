import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { isEditor } from '../access/roles'

export const Events: CollectionConfig = {
  slug: 'events',
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Content',
    defaultColumns: ['title', 'eventDate', 'featured'],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'youtubeUrl',
      type: 'text',
      required: true,
      admin: { description: 'Paste the full YouTube embed URL (https://www.youtube.com/embed/VIDEO_ID)' },
    },
    { name: 'eventDate', type: 'date' },
    { name: 'organizer', type: 'text', defaultValue: 'Organized by MOSAI' },
    { name: 'description', type: 'textarea' },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on homepage Past Events section' },
    },
  ],
}
