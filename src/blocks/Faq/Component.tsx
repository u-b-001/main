'use client'
import React, { useState } from 'react'

type FAQItem = { question: string; answer: string }
type FAQProps = { heading?: string; items: FAQItem[] }

export const FAQBlock: React.FC<FAQProps> = ({ heading, items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16 px-6 max-w-3xl mx-auto">
      {heading && <h2 className="text-3xl font-bold text-center mb-10">{heading}</h2>}
      <div className="divide-y">
        {items.map((item, i) => (
          <div key={i} className="py-4">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex justify-between items-center text-left font-medium"
            >
              {item.question}
              <span>{openIndex === i ? '−' : '+'}</span>
            </button>
            {openIndex === i && <p className="text-gray-500 mt-2">{item.answer}</p>}
          </div>
        ))}
      </div>
    </section>
  )
}
