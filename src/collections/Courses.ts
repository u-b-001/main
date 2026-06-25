// src/collections/Courses.ts
import type { CollectionConfig } from 'payload'
import { anyone } from '../access/anyone'
import { isEditor } from '../access/roles'

export const Courses: CollectionConfig = {
  slug: 'courses',
  access: {
    create: isEditor,
    delete: isEditor,
    read: anyone,
    update: isEditor,
  },
  admin: {
    useAsTitle: 'name',
    group: 'Content',
    defaultColumns: ['name', 'level', 'mode', 'admissionOpenDate', 'featured'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'level',
      type: 'select',
      required: true,
      options: [
        { label: 'Basic Japanese', value: 'basic' },
        { label: 'Intermediate Japanese', value: 'intermediate' },
        { label: 'Advanced Japanese', value: 'advanced' },
        { label: 'Conversational Japanese', value: 'conversational' },
      ],
    },
    {
      name: 'session',
      type: 'text',
      required: true,
      admin: { description: 'e.g. "July 2026 – June 2027"' },
    },
    {
      name: 'mode',
      type: 'select',
      required: true,
      options: [
        { label: 'Online', value: 'online' },
        { label: 'Offline', value: 'offline' },
        { label: 'Hybrid', value: 'hybrid' },
      ],
    },
    { name: 'admissionOpenDate', type: 'date' },
    { name: 'admissionCloseDate', type: 'date' },
    {
      name: 'fee',
      type: 'number',
      admin: { description: 'Fee in INR' },
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'syllabus',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'applyLink',
      type: 'text',
      admin: { description: 'Admission form URL (internal or external)' },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'Show on homepage "We Offer" section' },
    },
  ],
}