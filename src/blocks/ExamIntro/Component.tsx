import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const ExamIntroComponent: React.FC<any> = (props) => {
  const { title, subtitle, description, examDate, applicationDeadline, venue, fee, ctaLabel, ctaLink, image } = props

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden my-8">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          {subtitle && <h4 className="text-red-600 font-semibold tracking-wider uppercase text-sm mb-2">{subtitle}</h4>}
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">{title}</h2>
          
          {description && (
            <div className="prose prose-slate max-w-none mb-8">
              <RichText data={description} />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {examDate && (
              <div>
                <p className="text-sm text-slate-500 uppercase font-semibold">Exam Date</p>
                <p className="font-medium text-slate-800">{new Date(examDate).toLocaleDateString()}</p>
              </div>
            )}
            {applicationDeadline && (
              <div>
                <p className="text-sm text-slate-500 uppercase font-semibold">Application Deadline</p>
                <p className="font-medium text-red-600">{new Date(applicationDeadline).toLocaleDateString()}</p>
              </div>
            )}
            {venue && (
              <div>
                <p className="text-sm text-slate-500 uppercase font-semibold">Venue</p>
                <p className="font-medium text-slate-800">{venue}</p>
              </div>
            )}
            {fee && (
              <div>
                <p className="text-sm text-slate-500 uppercase font-semibold">Fee</p>
                <p className="font-medium text-slate-800">{fee}</p>
              </div>
            )}
          </div>

          {ctaLabel && ctaLink && (
            <div>
              <a href={ctaLink} className="inline-block bg-slate-900 text-white px-8 py-3 rounded-md font-semibold hover:bg-slate-800 transition-colors">
                {ctaLabel}
              </a>
            </div>
          )}
        </div>
        
        {image && typeof image === 'object' && image.url && (
          <div className="relative h-64 lg:h-auto min-h-[400px]">
            <img src={image.url} alt={image.alt || title} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  )
}
