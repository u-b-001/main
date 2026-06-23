import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Committee as CommitteeType } from '@/payload-types'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

interface CommitteeGridProps {
  type: 'committee' | 'advisory' | 'faculty'
}

export const CommitteeGrid: React.FC<CommitteeGridProps> = async ({ type }) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'committee',
    limit: 100,
    sort: 'order',
    where: {
      type: {
        equals: type,
      },
    },
  })

  const members = result.docs || []

  if (members.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 font-serif italic text-xs">
        No members listed under this section yet.
      </div>
    )
  }

  return (
    <div className="py-8">
      {/* 3-column / 4-column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {members.map((member: CommitteeType) => {
          const hasPhoto = member.photo && typeof member.photo === 'object'

          return (
            <div
              key={member.id}
              className="bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-xl p-6 text-center shadow-xs flex flex-col items-center justify-between group hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center">
                {/* Rounded avatar */}
                <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-2 border-brand-gold bg-slate-200 shadow-xs relative">
                  {hasPhoto ? (
                    <Media
                      resource={member.photo}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-250 text-slate-450 dark:bg-slate-800 dark:text-slate-500 font-bold text-xl uppercase font-serif">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>

                {/* Name */}
                <h3 className="font-serif font-bold text-lg text-brand-navy dark:text-white leading-snug">
                  {member.name}
                </h3>
                
                {/* Role */}
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-red mt-1.5">
                  {member.role}
                </p>

                {/* Designation */}
                {member.designation && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic font-serif leading-relaxed">
                    {member.designation}
                  </p>
                )}
              </div>

              {/* Optional Bio preview */}
              {member.bio && (
                <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-500 text-left line-clamp-3 w-full">
                  <RichText data={member.bio} enableGutter={false} className="prose-xs" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
