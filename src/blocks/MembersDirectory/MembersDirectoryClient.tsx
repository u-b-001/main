'use client'

import React, { useState, useMemo } from 'react'
import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

interface Member {
  id: string | number
  name: string
  membershipId?: string | null
  photo?: any | null
  designation?: string | null
  university?: string | null
  city?: string | null
  year?: string | null
  specialisation?: string | null
  fellowship?: string | null
  email?: string | null
  phone?: string | null
  presentAddress?: string | null
}

interface Props {
  title: string
  members: Member[]
  defaultView: 'all' | 'empty'
  enableLiveSearch: boolean
  searchFields: string[]
  showFields: string[]
}

const ALPHABET = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]

const getInitials = (name: string) => {
  if (!name) return ''
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

const getAvatarBg = (name: string) => {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

export const MembersDirectoryClient: React.FC<Props> = ({
  title,
  members,
  defaultView,
  enableLiveSearch,
  searchFields,
  showFields,
}) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearch, setActiveSearch] = useState('')

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSearch(searchQuery.trim())
    setSelectedLetter(null) // Clear letter filter on search submit
  }

  const handleLetterClick = (letter: string) => {
    if (selectedLetter === letter) {
      setSelectedLetter(null) // Toggle off if clicked again
    } else {
      setSelectedLetter(letter)
      setSearchQuery('')
      setActiveSearch('') // Clear search when selecting letter
    }
  }

  const clearAllFilters = () => {
    setSelectedLetter(null)
    setSearchQuery('')
    setActiveSearch('')
  }

  const isFiltered = !!selectedLetter || (enableLiveSearch ? !!searchQuery : !!activeSearch)

  const filteredMembers = useMemo(() => {
    const query = (enableLiveSearch ? searchQuery : activeSearch).trim().toLowerCase()

    if (!selectedLetter && !query) {
      if (defaultView === 'empty') return null
      return members.sort((a, b) => a.name.localeCompare(b.name))
    }

    return members
      .filter((member) => {
        // 1. Apply Alphabet Letter Filter
        if (selectedLetter) {
          if (selectedLetter === '#') {
            return !/^[a-zA-Z]/.test(member.name.charAt(0))
          }
          return member.name.charAt(0).toUpperCase() === selectedLetter
        }

        // 2. Apply Search Query Filter
        if (query) {
          return searchFields.some((field) => {
            const val = (member as any)[field]
            if (typeof val === 'string') {
              return val.toLowerCase().includes(query)
            }
            return false
          })
        }

        return true
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [members, selectedLetter, searchQuery, activeSearch, defaultView, enableLiveSearch, searchFields])

  return (
    <div className="w-full text-slate-800 dark:text-slate-100 font-sans">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold font-serif text-brand-navy dark:text-white uppercase tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Total of <span className="font-semibold text-slate-700 dark:text-slate-200">{members.length}</span> Members in public directory
          </p>
        </div>
        {isFiltered && (
          <button
            onClick={clearAllFilters}
            className="self-start md:self-auto text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Clear Filters / Show All
          </button>
        )}
      </div>

      {/* Alphabet Index */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800/80 mb-6">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Filter by Initial Letter</p>
        <div className="flex flex-wrap gap-1.5">
          {ALPHABET.map((letter) => (
            <button
              key={letter}
              onClick={() => handleLetterClick(letter)}
              className={cn(
                "h-8 w-8 text-sm font-semibold rounded-lg flex items-center justify-center transition-all duration-200",
                selectedLetter === letter
                  ? "bg-brand-red text-white shadow-xs"
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder={
              enableLiveSearch
                ? `Search by ${searchFields.map(f => f.toUpperCase()).join(', ')}...`
                : "Type search term and click Search..."
            }
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (enableLiveSearch) {
                setSelectedLetter(null) // Clear letter filter on search
              }
            }}
            className="w-full border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-24 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" />
            </svg>
          </div>
          {!enableLiveSearch && (
            <button
              type="submit"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-brand-red text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-brand-red/90 transition-colors shadow-xs"
            >
              Search
            </button>
          )}
        </div>
      </form>

      {/* Results Section */}
      <div className="min-h-[200px]">
        {filteredMembers === null ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-100 dark:border-slate-800 text-center shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.109A11.386 11.386 0 0110.089 20.8M15 19.128a9.38 9.38 0 002.625.372M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-slate-600 dark:text-slate-400 font-medium">Please enter a search query or select a letter to see member directories.</p>
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-8 border border-slate-100 dark:border-slate-800 text-center shadow-xs">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="text-slate-500 dark:text-slate-400 italic">No directory entries found matching the current filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="group border border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Photo & Identity Section */}
                  <div className="flex items-center gap-4 mb-4">
                    {member.photo ? (
                      <div className="h-14 w-14 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800 shrink-0 shadow-2xs relative">
                        <Media
                          resource={member.photo}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className={cn(
                        "h-14 w-14 rounded-full flex items-center justify-center font-bold text-base shrink-0 shadow-2xs",
                        getAvatarBg(member.name)
                      )}>
                        {getInitials(member.name)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-serif font-bold text-base text-brand-navy dark:text-white leading-tight group-hover:text-brand-red transition-colors">
                        {member.name}
                      </h3>
                      {showFields.includes('designation') && member.designation && (
                        <p className="text-xs text-brand-red font-semibold tracking-wide uppercase mt-1">
                          {member.designation}
                        </p>
                      )}
                      {member.membershipId && (
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          ID: {member.membershipId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* dynamic showFields details */}
                  <div className="space-y-2 text-[13px] border-t border-slate-50 dark:border-slate-800/50 pt-4">
                    {showFields.includes('university') && member.university && (
                      <p className="text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Institute:</span> {member.university}
                      </p>
                    )}
                    {showFields.includes('city') && member.city && (
                      <p className="text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">City:</span> {member.city}
                      </p>
                    )}
                    {showFields.includes('year') && member.year && (
                      <p className="text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Year:</span> {member.year}
                      </p>
                    )}
                    {showFields.includes('specialisation') && member.specialisation && (
                      <p className="text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Specialisation:</span> {member.specialisation}
                      </p>
                    )}
                    {showFields.includes('fellowship') && member.fellowship && (
                      <p className="text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Fellowship:</span> {member.fellowship}
                      </p>
                    )}
                    {showFields.includes('phone') && member.phone && (
                      <p className="text-slate-600 dark:text-slate-300">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Phone:</span>{' '}
                        <a href={`tel:${member.phone}`} className="hover:text-brand-red hover:underline transition-colors">{member.phone}</a>
                      </p>
                    )}
                    {showFields.includes('email') && member.email && (
                      <p className="text-slate-600 dark:text-slate-300 break-all">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">Email:</span>{' '}
                        <a href={`mailto:${member.email}`} className="text-brand-red hover:underline transition-colors">{member.email}</a>
                      </p>
                    )}
                  </div>
                </div>

                {showFields.includes('presentAddress') && member.presentAddress && (
                  <div className="text-[12.5px] text-slate-500 dark:text-slate-400 mt-4 pt-4 border-t border-slate-50 dark:border-slate-800/50">
                    <span className="block font-semibold text-slate-800 dark:text-slate-200 mb-0.5">Address:</span>
                    <span className="line-clamp-2 hover:line-clamp-none transition-all">{member.presentAddress}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
