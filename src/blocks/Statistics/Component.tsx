import React from 'react'

type Stat = { value: string; label: string; suffix?: string }
type StatsImpactProps = { heading?: string; stats: Stat[] }

export const StatsImpactBlock: React.FC<StatsImpactProps> = ({ heading, stats }) => {
  return (
    <section className="py-16 px-6 bg-white text-center">
      {heading && <h2 className="text-3xl font-bold mb-10">{heading}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        {stats.map((stat, i) => (
          <div key={i}>
            <p className="text-4xl font-bold text-black">
              {stat.value}{stat.suffix}
            </p>
            <p className="text-gray-500 mt-2">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}