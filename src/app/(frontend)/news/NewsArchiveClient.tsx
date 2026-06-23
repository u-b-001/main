'use client'

import React, { useState } from 'react'
import type { News as NewsType } from '@/payload-types'
import { NewsCard } from '@/components/shared/NewsCard'
import { cn } from '@/utilities/ui'

interface NewsArchiveClientProps {
  newsItems: NewsType[]
}

type TagFilter = 'ALL' | 'ANNOUNCEMENT' | 'EVENT' | 'OPPORTUNITY' | 'RESULT' | 'NOTICE'

export const NewsArchiveClient: React.FC<NewsArchiveClientProps> = ({ newsItems }) => {
  const [selectedTag, setSelectedTag] = useState<TagFilter>('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Filter items
  const filteredItems = newsItems.filter((item) => {
    if (selectedTag === 'ALL') return true
    return item.tag === selectedTag
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

  const tags: { label: string; value: TagFilter }[] = [
    { label: 'All News', value: 'ALL' },
    { label: 'Announcements', value: 'ANNOUNCEMENT' },
    { label: 'Events', value: 'EVENT' },
    { label: 'Opportunities', value: 'OPPORTUNITY' },
    { label: 'Results', value: 'RESULT' },
    { label: 'Notices', value: 'NOTICE' },
  ]

  const handleTagChange = (tag: TagFilter) => {
    setSelectedTag(tag)
    setCurrentPage(1) // Reset to first page
  }

  return (
    <div className="space-y-8">
      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 border-b border-gray-100 dark:border-slate-800 pb-6">
        {tags.map((tag) => (
          <button
            key={tag.value}
            onClick={() => handleTagChange(tag.value)}
            className={cn(
              'px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 border cursor-pointer',
              selectedTag === tag.value
                ? 'bg-brand-navy border-brand-navy text-white dark:bg-slate-200 dark:border-slate-200 dark:text-slate-900 shadow-sm'
                : 'bg-white border-gray-200 text-slate-600 hover:text-brand-navy hover:border-brand-navy dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:text-slate-100'
            )}
          >
            {tag.label}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {paginatedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedItems.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-slate-400 font-serif italic">
          No notifications found in this category.
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            className="px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  'w-8 h-8 rounded-lg text-xs font-bold transition-all',
                  currentPage === page
                    ? 'bg-brand-red text-white'
                    : 'border border-gray-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                )}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            className="px-4 py-2 border border-gray-200 dark:border-slate-800 rounded-lg text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
