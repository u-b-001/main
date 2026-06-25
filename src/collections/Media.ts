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
  },
  fields: [
    { name: 'alt', type: 'text', required: true },
    { name: 'caption', type: 'text' },
  ],
  upload: {
    staticDir: path.resolve(dirname, '../../public/media'),
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 800, height: 600, position: 'centre' },
      { name: 'hero', width: 1920, height: 800, position: 'centre' },
      { name: 'gallery', width: 600, height: 450, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*', 'application/pdf', 'video/*'],
  },
}
