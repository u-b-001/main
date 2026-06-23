'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const CalendarWidget: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  // Days in month
  const getDaysInMonth = (y: number, m: number) => {
    return new Date(y, m + 1, 0).getDate()
  }

  // First day of month (0 = Sunday, 1 = Monday...)
  const getFirstDayOfMonth = (y: number, m: number) => {
    return new Date(y, m, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const today = new Date()
  const isToday = (dayNum: number) => {
    return (
      today.getDate() === dayNum &&
      today.getMonth() === month &&
      today.getFullYear() === year
    )
  }

  // Generate calendar grid
  const calendarCells = []
  // Fill empty spaces before first day
  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-6 w-6"></div>)
  }
  // Fill month days
  for (let d = 1; d <= daysInMonth; d++) {
    const active = isToday(d)
    calendarCells.push(
      <div
        key={`day-${d}`}
        className={`h-6 w-6 flex items-center justify-center text-xs rounded-full font-sans transition-colors ${
          active
            ? 'bg-brand-red text-white font-bold'
            : 'text-gray-300 hover:bg-slate-800 hover:text-white cursor-pointer'
        }`}
      >
        {d}
      </div>
    )
  }

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg w-full max-w-[240px] text-white">
      <div className="flex justify-between items-center mb-3">
        <button
          onClick={handlePrevMonth}
          className="p-1 rounded-md hover:bg-slate-800 text-gray-400 hover:text-white"
          aria-label="Previous Month"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-sm font-semibold tracking-wide font-serif">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={handleNextMonth}
          className="p-1 rounded-md hover:bg-slate-800 text-gray-400 hover:text-white"
          aria-label="Next Month"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-[10px] text-gray-500 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="h-6 w-6 flex items-center justify-center">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 justify-items-center">
        {calendarCells}
      </div>
    </div>
  )
}
