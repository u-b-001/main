import React from 'react'
import { cn } from '@/utilities/ui'
import type { StepsBlock as StepsProps } from '@/payload-types'
import * as LucideIcons from 'lucide-react'

export const StepsComponent: React.FC<StepsProps> = ({ title, description, steps, hoverBulge, hoverLuminous }) => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 max-w-5xl">
        {(title || description) && (
          <div className="text-center mb-12">
            {title && <h2 className="text-3xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">{title}</h2>}
            {description && <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{description}</p>}
          </div>
        )}

        <div className="relative">
          {/* Vertical line connecting steps */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 transform md:-translate-x-1/2"></div>

          <div className="space-y-8">
            {steps?.map((step, idx) => {
              const isEven = idx % 2 === 0
              const IconComponent = step.icon && (step.icon as any) !== 'none' ? (LucideIcons as any)[step.icon] : null

              return (
                <div key={idx} className={cn("relative flex items-center md:justify-between w-full")}>
                  
                  {/* Left / Right spacing logic for Desktop */}
                  <div className={cn("w-full md:w-[45%] ml-16 md:ml-0 flex", isEven ? "md:justify-end" : "md:justify-start", !isEven && "md:order-3")}>
                    <div className={cn(
                      "bg-gray-50 dark:bg-gray-800 w-full p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-left transition-all duration-300",
                      hoverBulge && "hover:scale-105 hover:shadow-md",
                      hoverLuminous && "hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:border-yellow-400/50 z-10"
                    )}>
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-gray-900 dark:text-white">
                         <span className="text-primary font-black opacity-30 text-2xl mr-1">{idx + 1}.</span>
                         {step.title}
                      </h3>
                      {step.description && <p className="text-gray-600 dark:text-gray-400">{step.description}</p>}
                    </div>
                  </div>

                  {/* Center Circle / Icon */}
                  <div className="absolute left-0 md:left-1/2 md:order-2 transform md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white border-4 border-white dark:border-gray-900 shadow z-10">
                    {IconComponent ? <IconComponent size={20} /> : <span className="font-bold">{idx + 1}</span>}
                  </div>
                  
                  {/* Empty spacer for opposite side on Desktop */}
                  <div className="hidden md:block md:w-[45%] md:order-1"></div>

                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
