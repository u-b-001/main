import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'
import { isSuperAdmin, isSchoolAdmin } from '../access/roles'

const autoDeleteWhenMarkedDeleted: CollectionAfterChangeHook = async ({ doc, req, operation }) => {
  if (operation === 'update' && doc.status === 'deleted') {
    // Perform cascading delete asynchronously or synchronously
    try {
      if (doc.resume) {
        // Assume resume is a relation ID or object
        const resumeId = typeof doc.resume === 'object' ? doc.resume.id : doc.resume
        if (resumeId) {
          await req.payload.delete({
            collection: 'media',
            id: resumeId,
          })
        }
      }
      
      // Delete the JobApplication record itself
      await req.payload.delete({
        collection: 'jobApplications',
        id: doc.id,
      })
    } catch (err) {
      console.error('Error during cascading delete of JobApplication:', err)
    }
  }
  return doc
}

export const JobApplications: CollectionConfig = {
  slug: 'jobApplications',
  admin: {
    useAsTitle: 'name',
    group: 'Admin',
  },
  access: {
    read: isSchoolAdmin,
    create: () => true, // Or public if it's a public form
    update: isSchoolAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'resume',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Delete (Triggers Hard Delete)', value: 'deleted' },
      ],
      defaultValue: 'pending',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    afterChange: [autoDeleteWhenMarkedDeleted],
  },
}
