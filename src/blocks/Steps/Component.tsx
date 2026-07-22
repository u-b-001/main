import React from 'react'
import { cn } from '@/utilities/ui'
import type { StepsBlock as StepsProps } from '@/payload-types'
import * as LucideIcons from 'lucide-react'
import RichText from '@/components/RichText'
import { StaggerContainer, StaggerItem } from '@/components/ui/StaggerAnimation'

export const StepsComponent: React.FC<StepsProps> = ({
  title,
  description,
  steps,
  hoverBulge,
  hoverLuminous,
  backgroundColor,
  layout = 'vertical',
  enableStepAnimations = true,
  staggerDelay = 0.2,
}) => {
  return (
    <section 
      className="py-16 bg-white dark:bg-gray-900"
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="container mx-auto px-4 max-w-5xl">
        {(title || description) && (
          <div className="text-center mb-12 flex flex-col items-center">
            {title && <h2 className="text-3xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">{title}</h2>}
            {description && (
              <div className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto prose prose-lg dark:prose-invert text-center">
                <RichText data={description} enableGutter={false} />
              </div>
            )}
          </div>
        )}

        <div className="relative">
          {layout === 'horizontal-snake' ? (
            <>
              <style>{`
                .snake-item { order: var(--order-sm); }
                @media (min-width: 768px) { .snake-item { order: var(--order-md); } }
                @media (min-width: 1024px) { .snake-item { order: var(--order-lg); } }
              `}</style>
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 relative" enabled={enableStepAnimations ?? undefined} staggerDelay={staggerDelay ?? undefined}>
                {steps?.map((step, idx) => {
                  const IconComponent = step.icon ? (LucideIcons as any)[step.icon] : null;
                  const isLastItem = idx === steps.length - 1;
                  
                  // LG calculations (3 columns)
                  const lgRow = Math.floor(idx / 3);
                  const isLgEvenRow = lgRow % 2 === 0;
                  const lgOrder = isLgEvenRow ? idx + 1 : (lgRow * 3) + 3 - (idx % 3);
                  const isLgRowEnd = isLgEvenRow ? idx % 3 === 2 : idx % 3 === 0;
                  
                  // MD calculations (2 columns)
                  const mdRow = Math.floor(idx / 2);
                  const isMdEvenRow = mdRow % 2 === 0;
                  const mdOrder = isMdEvenRow ? idx + 1 : (mdRow * 2) + 2 - (idx % 2);
                  const isMdRowEnd = isMdEvenRow ? idx % 2 === 1 : idx % 2 === 0;

                  return (
                    <StaggerItem 
                      key={idx} 
                      className="snake-item flex flex-col items-center relative group"
                      enabled={enableStepAnimations ?? undefined}
                      style={{
                        '--order-lg': lgOrder,
                        '--order-md': mdOrder,
                        '--order-sm': idx + 1,
                      }}
                    >
                      {/* Arrow logic for LG */}
                      {!isLastItem && (
                        <>
                          {/* LG Right Arrow */}
                          {!isLgRowEnd && isLgEvenRow && (
                            <div className="hidden lg:flex absolute top-1/2 -right-10 w-12 items-center justify-center text-primary transform -translate-y-1/2 z-0">
                              <LucideIcons.ArrowRight size={32} />
                            </div>
                          )}
                          {/* LG Left Arrow */}
                          {!isLgRowEnd && !isLgEvenRow && (
                            <div className="hidden lg:flex absolute top-1/2 -left-10 w-12 items-center justify-center text-primary transform -translate-y-1/2 z-0">
                              <LucideIcons.ArrowLeft size={32} />
                            </div>
                          )}
                          {/* LG Down Arrow */}
                          {isLgRowEnd && (
                            <div className="hidden lg:flex absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-primary z-0">
                              <LucideIcons.ArrowDown size={32} />
                            </div>
                          )}
                        </>
                      )}

                      {/* Arrow logic for MD (visible only on md screens) */}
                      {!isLastItem && (
                        <>
                          {/* MD Right Arrow */}
                          {!isMdRowEnd && isMdEvenRow && (
                            <div className="hidden md:flex lg:hidden absolute top-1/2 -right-10 w-12 items-center justify-center text-primary transform -translate-y-1/2 z-0">
                              <LucideIcons.ArrowRight size={32} />
                            </div>
                          )}
                          {/* MD Left Arrow */}
                          {!isMdRowEnd && !isMdEvenRow && (
                            <div className="hidden md:flex lg:hidden absolute top-1/2 -left-10 w-12 items-center justify-center text-primary transform -translate-y-1/2 z-0">
                              <LucideIcons.ArrowLeft size={32} />
                            </div>
                          )}
                          {/* MD Down Arrow */}
                          {isMdRowEnd && (
                            <div className="hidden md:flex lg:hidden absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-primary z-0">
                              <LucideIcons.ArrowDown size={32} />
                            </div>
                          )}
                        </>
                      )}

                      {/* SM Down Arrow */}
                      {!isLastItem && (
                         <div className="md:hidden flex absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-primary z-0">
                            <LucideIcons.ArrowDown size={32} />
                         </div>
                      )}

                      <div className={cn(
                        "bg-gray-50 dark:bg-gray-800 w-full p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center transition-all duration-300 relative z-10 flex flex-col items-center",
                        hoverBulge && "hover:scale-105 hover:shadow-md",
                        hoverLuminous && "hover:shadow-[0_0_30px_rgba(250,204,21,0.6)] hover:border-yellow-400/50"
                      )}>
                        <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-4 shadow-md border-4 border-white dark:border-gray-900">
                           {IconComponent ? <IconComponent size={24} /> : <span className="font-bold text-xl">{idx + 1}</span>}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                           {step.title}
                        </h3>
                        {step.description && (
                           <div className="text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none text-center">
                             <RichText data={step.description} enableGutter={false} />
                           </div>
                        )}
                      </div>
                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            </>
          ) : (
            <>
              {/* Vertical line connecting steps */}
              <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-gray-200 dark:bg-gray-700 transform md:-translate-x-1/2"></div>

              <StaggerContainer className="space-y-8" enabled={enableStepAnimations ?? undefined} staggerDelay={staggerDelay ?? undefined}>
                {steps?.map((step, idx) => {
                  const isEven = idx % 2 === 0
                  const IconComponent = step.icon ? (LucideIcons as any)[step.icon] : null

                  return (
                    <StaggerItem key={idx} className={cn("relative flex items-center md:justify-between w-full")} enabled={enableStepAnimations ?? undefined}>
                      
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
                          {step.description && (
                            <div className="text-gray-600 dark:text-gray-400 prose prose-sm dark:prose-invert max-w-none">
                              <RichText data={step.description} enableGutter={false} />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Center Circle / Icon */}
                      <div className="absolute left-0 md:left-1/2 md:order-2 transform md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white border-4 border-white dark:border-gray-900 shadow z-10">
                        {IconComponent ? <IconComponent size={20} /> : <span className="font-bold">{idx + 1}</span>}
                      </div>
                      
                      {/* Empty spacer for opposite side on Desktop */}
                      <div className="hidden md:block md:w-[45%] md:order-1"></div>

                    </StaggerItem>
                  )
                })}
              </StaggerContainer>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
