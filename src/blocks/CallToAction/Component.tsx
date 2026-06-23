import React from 'react'
import Link from 'next/link'
import type { CallToActionBlock as CallToActionProps } from '@/payload-types'
import { cn } from '@/utilities/ui'

export const CallToActionBlock: React.FC<CallToActionProps> = ({
  heading,
  body,
  buttonText,
  buttonLink,
  buttonStyle,
}) => {
  const buttonStyles = {
    primary: 'bg-brand-red text-white hover:bg-red-750 focus:ring-brand-red',
    secondary: 'bg-brand-navy text-white hover:bg-slate-900 focus:ring-brand-navy',
    outline: 'bg-transparent border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white focus:ring-brand-navy',
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-[56rem]">
      <div className="bg-brand-cream border border-brand-gold/30 rounded-xl p-8 md:p-12 shadow-sm text-center flex flex-col items-center justify-center">
        {heading && (
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-brand-navy mb-4 leading-snug max-w-2xl">
            {heading}
          </h2>
        )}
        {body && (
          <p className="text-brand-text mb-8 leading-relaxed max-w-xl text-center">
            {body}
          </p>
        )}
        {buttonText && buttonLink && (
          <Link
            href={buttonLink}
            className={cn(
              'px-8 py-3 rounded-lg font-semibold tracking-wide shadow-sm hover:shadow-md transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-offset-2',
              buttonStyles[buttonStyle || 'primary']
            )}
          >
            {buttonText}
          </Link>
        )}
      </div>
    </div>
  )
}
