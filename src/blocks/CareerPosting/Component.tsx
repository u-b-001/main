'use client'
import React, { useState } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

type Posting = {
  title: string
  department?: string
  location?: string
  type?: 'fullTime' | 'partTime' | 'internship' | 'contract'
  description?: any
  applyLink?: string
  postedDate?: string
}
type CareerPostingProps = {
  heading?: string
  description?: string
  postings: Posting[]
  emptyStateMessage?: string
}

const typeLabel: Record<string, string> = {
  fullTime: 'Full-time',
  partTime: 'Part-time',
  internship: 'Internship',
  contract: 'Contract',
}

export const CareerPostingBlock: React.FC<CareerPostingProps> = ({
  heading,
  description,
  postings,
  emptyStateMessage = 'No open positions right now. Check back soon!',
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 px-6 max-w-4xl mx-auto">
      {heading && <h2 className="text-3xl font-bold mb-2">{heading}</h2>}
      {description && <p className="text-gray-500 mb-8">{description}</p>}

      {!postings?.length ? (
        <p className="text-gray-400 text-center py-10">{emptyStateMessage}</p>
      ) : (
        <div className="divide-y border rounded-lg">
          {postings.map((post, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className="p-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{post.title}</h3>
                    <div className="flex gap-3 mt-1 text-sm text-gray-500">
                      {post.department && <span>{post.department}</span>}
                      {post.location && <span>· {post.location}</span>}
                      {post.type && <span>· {typeLabel[post.type]}</span>}
                    </div>
                  </div>
                  <span className="text-2xl text-gray-400">{isOpen ? '−' : '+'}</span>
                </button>

                {isOpen && (
                  <div className="mt-4 prose prose-neutral prose-sm">
                    {post.description && <RichText data={post.description} />}
                    <div className="mt-4 not-prose">
                      <Link
                        href={post.applyLink || '#apply'}
                        className="inline-block px-5 py-2.5 rounded-md bg-black text-white text-sm font-medium"
                      >
                        Apply Now
                      </Link>
                      {post.postedDate && (
                        <span className="ml-3 text-xs text-gray-400">
                          Posted {new Date(post.postedDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}