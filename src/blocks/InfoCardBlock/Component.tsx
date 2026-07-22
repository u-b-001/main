import React from 'react'
import type { InfoCardBlock as InfoCardBlockProps } from '@/payload-types'
import RichText from '@/components/RichText'
import { cn } from '@/utilities/ui'
import * as LucideIcons from 'lucide-react'

export const InfoCardBlock: React.FC<InfoCardBlockProps> = ({ title, content, style, icon, iconColor, animation }) => {
  const styles = {
    default: 'bg-brand-lightgray border-l-4 border-brand-navy text-brand-text',
    highlight: 'bg-brand-cream border border-brand-gold text-brand-navy shadow-sm',
    warning: 'bg-red-50 border-l-4 border-brand-red text-red-900',
  }

  const animationClasses = {
    'none': '',
    'fade-in': 'animate-fade-in',
    'slide-up': 'animate-in fade-in slide-in-from-bottom-8 duration-500',
    'pulse': 'animate-pulse',
    'bounce': 'animate-bounce',
    'lift-up': 'hover:-translate-y-2 hover:shadow-lg transition-all duration-300',
  }

  const animationClass = animation ? (animationClasses as any)[animation] : ''

  return (
    <div className="container mx-auto px-4 py-4 max-w-[48rem] block-info-card">
      <div className={cn('p-6 rounded-lg shadow-xs transition-all duration-300 hover:shadow-md info-card', styles[style || 'default'], animationClass)}>
        {(title || icon) && (
          <div className="flex items-center gap-3 mb-3">
            {(() => {
              const IconComponent = icon ? (LucideIcons as any)[icon] : null;
              if (!IconComponent) return null;
              return (
                <IconComponent
                  className="shrink-0 w-6 h-6"
                  style={{ color: iconColor || '#1A103D' }}
                />
              );
            })()}
            {title && <h3 className="text-xl font-bold font-serif leading-tight">{title}</h3>}
          </div>
        )}
        {content && <RichText data={content} enableGutter={false} className="prose-sm" />}
      </div>
    </div>
  )
}
