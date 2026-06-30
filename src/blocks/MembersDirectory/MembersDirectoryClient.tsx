'use client'

import React, { useState, useMemo } from 'react'

interface Member {
  id: string | number
  name: string
  university?: string | null
  city?: string | null
  year?: string | null
  specialisation?: string | null
  fellowship?: string | null
  email?: string | null
  presentAddress?: string | null
}

interface Props {
  title: string
  members: Member[]
}

const ALPHABET = ['#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')]

export const MembersDirectoryClient: React.FC<Props> = ({ title, members }) => {
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearch, setActiveSearch] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setActiveSearch(searchQuery.trim())
    setSelectedLetter(null) // Clear letter when searching
  }

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(letter)
    setSearchQuery('')
    setActiveSearch('') // Clear search when clicking letter
  }

  const filteredMembers = useMemo(() => {
    if (!selectedLetter && !activeSearch) return null

    return members.filter((member) => {
      if (selectedLetter) {
        if (selectedLetter === '#') {
          return !/^[a-zA-Z]/.test(member.name.charAt(0))
        }
        return member.name.charAt(0).toUpperCase() === selectedLetter
      }

      if (activeSearch) {
        const query = activeSearch.toLowerCase()
        const matchName = member.name?.toLowerCase().includes(query)
        const matchCity = member.city?.toLowerCase().includes(query)
        const matchUni = member.university?.toLowerCase().includes(query)
        const matchSpec = member.specialisation?.toLowerCase().includes(query)
        
        return matchName || matchCity || matchUni || matchSpec
      }

      return true
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [members, selectedLetter, activeSearch])

  return (
    <div className="w-full text-slate-800 font-sans">
      <h2 className="text-[15px] mb-4 text-slate-700 uppercase tracking-wide">
        {title}
      </h2>
      
      {/* Alphabet Index */}
      <div className="flex flex-wrap gap-2.5 mb-2 font-medium">
        {ALPHABET.map((letter) => (
          <button
            key={letter}
            onClick={() => handleLetterClick(letter)}
            className={`hover:text-black transition-colors ${
              selectedLetter === letter ? 'text-black font-bold' : 'text-slate-800'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-3">
        <input
          type="text"
          placeholder="Search for..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-slate-300 rounded-sm px-2 py-1.5 text-[13px] mb-2 focus:outline-none focus:border-slate-400 bg-white"
        />
        <button
          type="submit"
          className="bg-[#1a1a1a] text-white text-[12px] font-bold px-3 py-1 rounded-sm hover:bg-black transition-colors"
        >
          Search
        </button>
      </form>

      {/* Status & Instructions */}
      <div className="mb-10">
        <p className="text-[14.5px] text-slate-700 mb-2">
          There are currently {members.length} Members in this directory
        </p>
        
        {!selectedLetter && !activeSearch && (
          <p className="text-[14.5px] text-slate-700 pl-4 mb-4">
            Please select a letter from the index (above) to see entries
          </p>
        )}
      </div>

      {/* Results */}
      {filteredMembers && (
        <div className="mb-10">
          {filteredMembers.length === 0 ? (
            <p className="text-[14.5px] pl-4 text-slate-500 italic">No entries found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(member => (
                 <div key={member.id} className="border border-slate-200 bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                   <h3 className="font-serif font-bold text-lg text-brand-navy mb-3">
                     {member.name}
                   </h3>
                   
                   <div className="space-y-1.5 text-[13.5px] text-slate-600">
                     {member.university && (
                       <p><span className="font-semibold text-slate-800">Institute:</span> {member.university}</p>
                     )}
                     {member.city && (
                       <p><span className="font-semibold text-slate-800">City:</span> {member.city}</p>
                     )}
                     {member.year && (
                       <p><span className="font-semibold text-slate-800">Year:</span> {member.year}</p>
                     )}
                     {member.specialisation && (
                       <p><span className="font-semibold text-slate-800">Specialisation:</span> {member.specialisation}</p>
                     )}
                     {member.fellowship && (
                       <p><span className="font-semibold text-slate-800">Fellowship:</span> {member.fellowship}</p>
                     )}
                     {member.email && (
                       <p className="break-words">
                         <span className="font-semibold text-slate-800">Email:</span>{' '}
                         <a href={`mailto:${member.email}`} className="text-brand-red hover:underline">{member.email}</a>
                       </p>
                     )}
                   </div>
   
                   {member.presentAddress && (
                     <p className="text-[13.5px] text-slate-600 mt-4 pt-4 border-t border-slate-200">
                       <span className="block font-semibold text-slate-800 mb-1">Address:</span> 
                       {member.presentAddress}
                     </p>
                   )}
                 </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Footer Keywords */}
      <p className="text-[blue] font-bold text-[14px] uppercase tracking-wide">
        SEARCH KEYWORDS: NAME, CITY , UNIVERSITY, SPECIALIZATION
      </p>
    </div>
  )
}
