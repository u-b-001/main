import type { CollectionConfig } from 'payload'
import { isSuperAdmin, isSuperAdminOrSelf } from '../../access/roles'
import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    admin: authenticated,
    create: isSuperAdmin,
    delete: isSuperAdmin,
    read: isSuperAdminOrSelf,
    update: isSuperAdminOrSelf,
  },
  admin: {
    useAsTitle: 'email',
    group: 'Admin',
    defaultColumns: ['name', 'email', 'role'],
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'School Admin', value: 'schoolAdmin' },
        { label: 'Content Editor', value: 'editor' },
        { label: 'Viewer', value: 'viewer' },
      ],
      defaultValue: 'viewer',
      required: true,
      access: {
        update: isSuperAdmin as any,
      },
      admin: { position: 'sidebar' },
    },
  ],
}
