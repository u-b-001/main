import React from 'react'
import { cn } from '@/utilities/ui'
import type { FileDownloadsBlock as FileDownloadsProps } from '@/payload-types'
import { Download, FileText } from 'lucide-react'
import Link from 'next/link'

export const FileDownloadsComponent: React.FC<FileDownloadsProps> = ({ title, description, files }) => {
  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 max-w-4xl">
        {(title || description) && (
          <div className="mb-8">
            {title && <h2 className="text-2xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">{title}</h2>}
            {description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}
          </div>
        )}

        <div className="flex flex-col gap-4">
          {files?.map((item, idx) => {
            const fileData = typeof item.file === 'object' ? item.file : null
            const fileUrl = fileData?.url || '#'
            
            return (
              <Link 
                key={idx} 
                href={fileUrl}
                target="_blank"
                className="group flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 text-primary rounded-lg group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-primary font-medium text-sm pr-2">
                  <span className="hidden sm:inline">Download</span>
                  <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
