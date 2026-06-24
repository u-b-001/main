import React from 'react'
import Image from 'next/image'

type Metric = {
  label: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  icon?: { url: string; alt?: string } | string
}
type DataSnapshotProps = {
  heading?: string
  description?: string
  metrics: Metric[]
  lastUpdated?: string
}

const trendColor: Record<string, string> = {
  up: 'text-green-600',
  down: 'text-red-600',
  neutral: 'text-gray-500',
}

export const DataSnapshotBlock: React.FC<DataSnapshotProps> = ({
  heading,
  description,
  metrics,
  lastUpdated,
}) => {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-2">
        <div>
          {heading && <h2 className="text-3xl font-bold">{heading}</h2>}
          {description && <p className="text-gray-500 mt-1">{description}</p>}
        </div>
        {lastUpdated && (
          <p className="text-xs text-gray-400">
            Data as of {new Date(lastUpdated).toLocaleDateString()}
          </p>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const iconUrl = typeof m.icon === 'object' ? m.icon?.url : undefined
          return (
            <div key={i} className="border rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-500">{m.label}</p>
                {iconUrl && <Image src={iconUrl} alt="" width={20} height={20} />}
              </div>
              <p className="text-2xl font-bold">{m.value}</p>
              {m.change && (
                <p className={`text-xs mt-1 font-medium ${trendColor[m.trend || 'neutral']}`}>
                  {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : ''} {m.change}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}