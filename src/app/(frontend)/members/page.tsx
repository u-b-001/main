import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { PageHero } from '@/components/shared/PageHero'
import { Breadcrumb } from '@/components/shared/Breadcrumb'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Members Directory',
  description: 'Directory of MOSAI members.',
}

export default async function MembersPage() {
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
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-16">
      <PageHero title="Members Directory" />
      <Breadcrumb />
      <div className="container mx-auto px-4 py-10">
        {members.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            No members found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-900">
                <h3 className="font-serif font-bold text-lg text-brand-navy dark:text-white mb-3">
                  {member.name}
                </h3>
                
                <div className="space-y-1.5">
                  {member.university && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Institute:</span> {member.university}
                    </p>
                  )}
                  {member.city && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">City:</span> {member.city}
                    </p>
                  )}
                  {member.year && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Year:</span> {member.year}
                    </p>
                  )}
                  {member.specialisation && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Specialisation:</span> {member.specialisation}
                    </p>
                  )}
                  {member.fellowship && (
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Fellowship:</span> {member.fellowship}
                    </p>
                  )}
                  {member.email && (
                    <p className="text-sm text-slate-600 dark:text-slate-300 break-words">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Email:</span>{' '}
                      <a href={`mailto:${member.email}`} className="text-brand-red hover:underline">{member.email}</a>
                    </p>
                  )}
                </div>

                {member.presentAddress && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <span className="block font-semibold text-slate-800 dark:text-slate-200 mb-1">Address:</span> 
                    {member.presentAddress}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
