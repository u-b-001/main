'use client'

import React, { useEffect, useState } from 'react'
import { Users, Activity } from 'lucide-react'

export const VisitorCounter: React.FC = () => {
  const [onlineCount, setOnlineCount] = useState(5)

  useEffect(() => {
    // Mock minor fluctuation in online users count
    const interval = setInterval(() => {
      setOnlineCount(prev => {
        const diff = Math.random() > 0.5 ? 1 : -1
        const next = prev + diff
        return next > 0 ? next : 3
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg w-full max-w-[240px] text-white">
      <div className="flex items-center gap-2 mb-3 border-b border-slate-850 pb-2">
        <Users className="w-4 h-4 text-brand-gold" />
        <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
          VISITORS STATS
        </span>
      </div>

      <div className="space-y-2 text-xs font-sans">
        <div className="flex justify-between items-center text-slate-300">
          <span>Today</span>
          <span className="font-semibold text-slate-100">1,248</span>
        </div>
        <div className="flex justify-between items-center text-slate-300">
          <span>Yesterday</span>
          <span className="font-semibold text-slate-100">2,410</span>
        </div>
        <div className="flex justify-between items-center text-slate-300">
          <span>This Week</span>
          <span className="font-semibold text-slate-100">8,590</span>
        </div>
        <div className="flex justify-between items-center text-slate-300">
          <span>This Month</span>
          <span className="font-semibold text-slate-100">32,492</span>
        </div>
        <div className="flex justify-between items-center text-slate-300 border-t border-slate-850 pt-2">
          <span>Total Hits</span>
          <span className="font-bold text-brand-gold">142,398</span>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs bg-slate-950 p-2 rounded-md border border-slate-850">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full inline-block animate-pulse"></span>
            <span className="text-slate-400 font-medium">Online Now</span>
          </div>
          <span className="font-bold text-green-400">{onlineCount}</span>
        </div>
      </div>
    </div>
  )
}
