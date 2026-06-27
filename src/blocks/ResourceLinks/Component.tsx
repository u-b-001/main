import React from 'react'
import { cn } from '@/utilities/ui'
import type { ResourceLinksBlock as ResourceLinksProps } from '@/payload-types'
import * as LucideIcons from 'lucide-react'
import Link from 'next/link'
import { ArrowRight, Link as LinkIcon } from 'lucide-react'

export const ResourceLinksComponent: React.FC<ResourceLinksProps> = ({ title, description, columns, links }) => {
  const gridClasses = {
    '1': 'grid-cols-1',
    '2': 'grid-cols-1 md:grid-cols-2',
    '3': 'grid-cols-1 md:grid-cols-3',
  }

  const cols = columns || '2'

  return (
    <section className="py-12 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        {(title || description) && (
          <div className="mb-10 text-center max-w-3xl mx-auto">
            {title && <h2 className="text-3xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">{title}</h2>}
            {description && <p className="text-lg text-gray-600 dark:text-gray-400">{description}</p>}
          </div>
        )}

        <div className={cn('grid gap-6', gridClasses[cols as keyof typeof gridClasses])}>
          {links?.map((link, idx) => {
            const IconComponent = link.icon ? (LucideIcons as any)[link.icon] : LinkIcon

            return (
              <Link 
                key={idx} 
                href={link.url || '#'}
                target={link.openInNewTab ? '_blank' : '_self'}
                className="group flex flex-col justify-between p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none">
                  {IconComponent && <IconComponent size={64} className="text-primary" />}
                </div>
                
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                    {IconComponent && <IconComponent size={24} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    {link.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {link.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-primary font-semibold text-sm mt-auto group-hover:gap-3 transition-all">
                  <span>Visit Resource</span>
                  <ArrowRight size={16} />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
