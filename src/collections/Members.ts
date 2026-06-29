// src/collections/Members.ts
import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { isEditor } from '../access/roles'

export const Members: CollectionConfig = {
  slug: 'members',
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'membershipId', 'designation', 'isPublic'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'membershipId',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'e.g. MOSAI-2024-0123' },
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'designation',
      type: 'text',
      admin: { description: 'e.g. Professor, Researcher, Alumni' },
    },
    {
      name: 'university',
      type: 'text',
      admin: { description: 'Japanese university attended on Monbukagakusho Scholarship' },
    },
    { name: 'joinDate', type: 'date' },
    { name: 'email', type: 'email' },
    { name: 'phone', type: 'text' },
    {
      name: 'city',
      type: 'text',
      admin: { description: 'City in Japan' },
    },
    { name: 'year', type: 'text' },
    { name: 'specialisation', type: 'text' },
    { name: 'fellowship', type: 'text' },
    { name: 'presentAddress', type: 'textarea' },
    {
      name: 'isPublic',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Show this member in the public Members Directory',
      },
    },
  ],
}