import React from 'react'
import type { InfoCardBlock as InfoCardBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'

export const InfoCardBlock: React.FC<InfoCardBlockProps> = ({ title, content, style }) => {
  const styles = {
    default: 'bg-brand-lightgray border-l-4 border-brand-navy text-brand-text',
    highlight: 'bg-brand-cream border border-brand-gold text-brand-navy shadow-sm',
    warning: 'bg-red-50 border-l-4 border-brand-red text-red-900',
  }

  return (
    <div className="container mx-auto px-4 py-4 max-w-[48rem]">
      <div className={cn('p-6 rounded-lg shadow-xs transition-shadow hover:shadow-md', styles[style || 'default'])}>
        {title && <h3 className="text-xl font-bold font-serif mb-3 leading-tight">{title}</h3>}
        {content && <RichText data={content} enableGutter={false} className="prose-sm" />}
      </div>
    </div>
  )
}
