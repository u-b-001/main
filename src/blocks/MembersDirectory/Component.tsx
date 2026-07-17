import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { MembersDirectoryClient } from './MembersDirectoryClient'

export const MembersDirectoryComponent: React.FC<{
  title?: string
  defaultView?: 'all' | 'empty'
  enableLiveSearch?: boolean
  searchFields?: ('name' | 'university' | 'city' | 'specialisation' | 'designation' | 'fellowship')[]
  showFields?: ('university' | 'city' | 'year' | 'specialisation' | 'designation' | 'fellowship' | 'email' | 'phone' | 'presentAddress')[]
  designationFilter?: string
}> = async (props) => {
  const {
    title = 'MEMBERS DIRECTORY',
    defaultView = 'empty',
    enableLiveSearch = true,
    searchFields = ['name', 'university', 'city', 'specialisation', 'designation'],
    showFields = ['university', 'city', 'year', 'specialisation', 'designation', 'email'],
    designationFilter,
  } = props

  const payload = await getPayload({ config: configPromise })
  
  const query: any = {
    isPublic: {
      equals: true,
    },
  }

  if (designationFilter) {
    query.designation = {
      equals: designationFilter,
    }
  }

  // Fetch members, limit 1000 to ensure we get all of them
  const result = await payload.find({
    collection: 'members',
    limit: 1000,
    sort: 'name',
    where: query,
  })

  const members = result.docs || []

  return (
    <div className="py-12 bg-[#f4f9ff]">
      <div className="container mx-auto px-4 max-w-6xl">
        <MembersDirectoryClient
          title={title}
          members={members}
          defaultView={'empty'}
          enableLiveSearch={enableLiveSearch}
          searchFields={searchFields}
          showFields={showFields}
        />
      </div>
    </div>
  )
}
