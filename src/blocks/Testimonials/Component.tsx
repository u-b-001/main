import React from 'react'
import Image from 'next/image'

type Testimonial = {
  quote: string
  name: string
  role?: string
  avatar?: { url: string; alt?: string } | string
}
type TestimonialsProps = {
  heading?: string
  displayStyle?: 'grid' | 'carousel'
  testimonials: Testimonial[]
}

export const TestimonialsBlock: React.FC<TestimonialsProps> = ({
  heading,
  displayStyle = 'grid',
  testimonials,
}) => {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto">
      {heading && <h2 className="text-3xl font-bold text-center mb-10">{heading}</h2>}
      <div
        className={
          displayStyle === 'carousel'
            ? 'flex gap-6 overflow-x-auto pb-4'
            : 'grid grid-cols-1 md:grid-cols-3 gap-6'
        }
      >
        {testimonials.map((t, i) => {
          const avatarUrl = typeof t.avatar === 'object' ? t.avatar?.url : undefined
          return (
            <div
              key={i}
              className={`border rounded-lg p-6 bg-white ${displayStyle === 'carousel' ? 'min-w-[280px] shrink-0' : ''}`}
            >
              <p className="text-gray-600 italic">"{t.quote}"</p>
              <div className="flex items-center gap-3 mt-4">
                {avatarUrl && (
                  <Image src={avatarUrl} alt={t.name} width={40} height={40} className="rounded-full" />
                )}
                <div>
                  <p className="font-semibold">{t.name}</p>
                  {t.role && <p className="text-sm text-gray-500">{t.role}</p>}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}