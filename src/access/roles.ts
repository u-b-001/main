import type { Access, AccessArgs } from 'payload'
import type { User } from '@/payload-types'

export const publicAccess: Access = () => true

export const isSuperAdmin: Access = ({ req: { user } }) => {
  return Boolean(user && user.role === 'superAdmin')
}

export const isEditor: Access = ({ req: { user } }) => {
  return Boolean(user && ['superAdmin', 'editor'].includes(user.role || ''))
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
