import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { MembersDirectoryClient } from './MembersDirectoryClient'

export const MembersDirectoryComponent: React.FC<{
  title?: string
}> = async ({ title = 'MEMBERS DIRECTORY' }) => {
  const payload = await getPayload({ config: configPromise })
  
  // Fetch members, limit 1000 to ensure we get all of them
  const result = await payload.find({
    collection: 'members',
    limit: 1000,
    sort: 'name',
    where: {
      isPublic: {
        equals: true,
      },
    },
  })

  const members = result.docs || []

  return (
    <div className="py-12 bg-[#f4f9ff]">
      <div className="container mx-auto px-4 max-w-6xl">
        <MembersDirectoryClient title={title} members={members} />
      </div>
    </div>
  )
}
