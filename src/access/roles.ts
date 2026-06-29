import type { Access, AccessArgs } from 'payload'
import type { User } from '@/payload-types'

export const publicAccess: Access = () => true

export const isSuperAdmin = ({ req: { user } }: any) => {
  return Boolean(user && user.role === 'superAdmin')
}

export const isSchoolAdmin = ({ req: { user } }: any) => {
  return Boolean(user && ['superAdmin', 'schoolAdmin'].includes(user.role || ''))
}

export const isEditor = ({ req: { user } }: any) => {
  return Boolean(user && ['superAdmin', 'schoolAdmin', 'editor'].includes(user.role || ''))
}

export const isViewer = ({ req: { user } }: any) => {
  return Boolean(user && ['superAdmin', 'schoolAdmin', 'editor', 'viewer'].includes(user.role || ''))
}

export const isSuperAdminOrSelf: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'superAdmin') return true
  return {
    id: {
      equals: user.id,
    },
  }
}
