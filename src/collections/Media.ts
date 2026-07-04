import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { anyone } from '../access/anyone'
import { isEditor } from '../access/roles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    group: 'Media',
    defaultColumns: ['filename', 'alt', 'mimeType', 'updatedAt'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: false,
      admin: { description: 'Required for accessibility — describe the image for screen readers/SEO' },
    },
    { name: 'caption', type: 'text' },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photo credit/source, e.g. "Embassy of Japan" (optional, useful for event/official photos)' },
    },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    focalPoint: true,
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 800, position: 'centre' },
      { name: 'gallery', width: 600, height: 450, position: 'centre' },
    ],
    formatOptions: {
      format: 'webp',
      options: { quality: 80 },
    },
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf', 'video/*'],
  },
}
