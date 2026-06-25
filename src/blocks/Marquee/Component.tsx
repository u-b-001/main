import React from 'react'
import Image from 'next/image'

type Item = { text?: string; logo?: { url: string; alt?: string } | string }
type MarqueeProps = { items: Item[]; speed?: number; direction?: 'left' | 'right' }

export const MarqueeBlock: React.FC<MarqueeProps> = ({ items, speed = 30, direction = 'left' }) => {
  return (
    <div className="overflow-hidden bg-neutral-900 py-6">
      <div
        className="flex gap-12 whitespace-nowrap animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: direction === 'right' ? 'reverse' : 'normal',
        }}
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-white text-lg shrink-0">
            {typeof item.logo === 'object' && item.logo?.url && (
              <Image src={item.logo.url} alt={item.logo.alt || ''} width={32} height={32} />
            )}
            {item.text && <span>{item.text}</span>}
          </div>
        ))}
      </div>
    </div>
  )
}