import React from 'react'
import { cn } from '@/utilities/ui'
import type { FileDownloadsBlock as FileDownloadsProps } from '@/payload-types'
import { Download, FileText } from 'lucide-react'
import Link from 'next/link'

export const FileDownloadsComponent: React.FC<FileDownloadsProps> = ({ title, description, files, blockStyle = 'list' }) => {
  const isGrid = blockStyle === 'grid';
  const isMinimal = blockStyle === 'minimal';

  return (
    <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 max-w-4xl">
        {(title || description) && (
          <div className="mb-8">
            {title && <h2 className="text-2xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">{title}</h2>}
            {description && <p className="text-gray-600 dark:text-gray-400">{description}</p>}
          </div>
        )}

        <div className={cn(
          isGrid ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"
        )}>
          {files?.map((item, idx) => {
            const fileData = typeof item.file === 'object' ? item.file : null
            const fileUrl = fileData?.url || '#'
            
            if (isMinimal) {
              return (
                <Link 
                  key={idx} 
                  href={fileUrl}
                  target="_blank"
                  className="group flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-800 hover:border-primary/50 transition-colors last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                    <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <Download size={16} className="text-gray-400 group-hover:text-primary transition-colors" />
                </Link>
              )
            }

            return (
              <Link 
                key={idx} 
                href={fileUrl}
                target="_blank"
                className={cn(
                  "group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 hover:shadow-md transition-all duration-300",
                  isGrid ? "flex flex-col p-6 rounded-xl hover:-translate-y-1" : "flex items-center justify-between p-4 rounded-lg"
                )}
              >
                <div className={cn("flex gap-4", isGrid ? "flex-col items-start mb-6" : "items-center")}>
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
                
                <div className={cn(
                  "flex items-center gap-2 text-primary font-medium text-sm",
                  isGrid ? "w-full pt-4 border-t border-gray-100 dark:border-gray-700/50 justify-between mt-auto" : "pr-2"
                )}>
                  <span className={cn(isGrid ? "inline" : "hidden sm:inline")}>Download File</span>
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
