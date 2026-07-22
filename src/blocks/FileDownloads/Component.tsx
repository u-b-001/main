'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/ui'
import type { FileDownloadsBlock as FileDownloadsProps } from '@/payload-types'
import { Download, FileText, Eye, X, ExternalLink, FileImage, File } from 'lucide-react'

function formatBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) return ''
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export const FileDownloadsComponent: React.FC<FileDownloadsProps> = ({
  title,
  description,
  files,
  blockStyle = 'list',
}) => {
  const [activePreview, setActivePreview] = useState<{
    url: string
    title: string
    mimeType?: string
  } | null>(null)

  const isGrid = blockStyle === 'grid'
  const isMinimal = blockStyle === 'minimal'

  const handlePreview = (e: React.MouseEvent, fileUrl: string, itemTitle: string, mimeType?: string) => {
    e.preventDefault()
    e.stopPropagation()
    setActivePreview({
      url: fileUrl,
      title: itemTitle,
      mimeType,
    })
  }

  const isImage = (mimeType?: string, url?: string) => {
    if (mimeType?.startsWith('image/')) return true
    if (url && /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)) return true
    return false
  }

  return (
    <section className="py-12 bg-slate-50 dark:bg-slate-900/50">
      <div className="container mx-auto px-4 max-w-5xl">
        {(title || description) && (
          <div className="mb-8 text-left">
            {title && (
              <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight mb-2 text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div
          className={cn(
            isGrid
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'flex flex-col gap-4',
          )}
        >
          {files?.map((item, idx) => {
            const fileData = typeof item.file === 'object' && item.file ? item.file : null
            const fileUrl = fileData?.url || '#'
            const mimeType = fileData?.mimeType || ''
            const filesize = fileData?.filesize ? formatBytes(fileData.filesize) : ''
            const isImg = isImage(mimeType, fileUrl)

            if (isMinimal) {
              return (
                <div
                  key={idx}
                  className="group flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800 hover:border-brand-red/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-4">
                    {isImg ? (
                      <FileImage size={20} className="text-slate-400 group-hover:text-brand-red shrink-0" />
                    ) : (
                      <FileText size={20} className="text-slate-400 group-hover:text-brand-red shrink-0" />
                    )}
                    <span className="font-medium text-slate-800 dark:text-slate-200 truncate group-hover:text-brand-red transition-colors text-sm">
                      {item.title}
                    </span>
                    {filesize && (
                      <span className="text-xs text-slate-400 shrink-0 font-mono">({filesize})</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handlePreview(e, fileUrl, item.title, mimeType)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-100 hover:bg-brand-red/10 text-slate-700 hover:text-brand-red dark:bg-slate-800 dark:text-slate-300 dark:hover:text-brand-red transition-colors"
                      title="Preview file"
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </button>
                    <a
                      href={fileUrl}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-brand-navy hover:bg-brand-navy/90 text-white dark:bg-brand-red dark:hover:bg-brand-red/90 transition-colors"
                      title="Download file"
                    >
                      <Download size={14} />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              )
            }

            return (
              <div
                key={idx}
                className={cn(
                  'group bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 hover:border-brand-navy/30 dark:hover:border-brand-red/40 hover:shadow-lg transition-all duration-300',
                  isGrid
                    ? 'flex flex-col p-6 rounded-xl hover:-translate-y-1'
                    : 'flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-xl gap-4',
                )}
              >
                <div className={cn('flex gap-4 min-w-0', isGrid ? 'flex-col items-start mb-5' : 'items-start sm:items-center')}>
                  <div className="p-3 bg-slate-100 dark:bg-slate-700 text-brand-navy dark:text-white rounded-xl group-hover:scale-105 transition-transform shrink-0">
                    {isImg ? <FileImage size={26} /> : <FileText size={26} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-base text-slate-900 dark:text-white group-hover:text-brand-red transition-colors truncate">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                    {filesize && (
                      <span className="inline-block text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1.5 font-mono">
                        File size: {filesize}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className={cn(
                    'flex items-center gap-2 shrink-0',
                    isGrid ? 'w-full pt-4 border-t border-slate-100 dark:border-slate-700/60 justify-between mt-auto' : 'w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-700/60',
                  )}
                >
                  <button
                    type="button"
                    onClick={(e) => handlePreview(e, fileUrl, item.title, mimeType)}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 transition-all cursor-pointer flex-1 sm:flex-none"
                  >
                    <Eye size={15} />
                    <span>Preview</span>
                  </button>
                  <a
                    href={fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-brand-red text-white hover:bg-brand-red/90 shadow-xs transition-all flex-1 sm:flex-none"
                  >
                    <Download size={15} />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* File Preview Modal */}
      {activePreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 sm:p-6"
          onClick={() => setActivePreview(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
              <div className="flex items-center gap-3 min-w-0 pr-4">
                <FileText size={20} className="text-brand-red shrink-0" />
                <h3 className="font-semibold text-base text-slate-900 dark:text-white truncate">
                  {activePreview.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActivePreview(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                aria-label="Close preview"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-4 overflow-auto bg-slate-100 dark:bg-slate-950 flex items-center justify-center min-h-[350px]">
              {isImage(activePreview.mimeType, activePreview.url) ? (
                <img
                  src={activePreview.url}
                  alt={activePreview.title}
                  className="max-h-[65vh] max-w-full object-contain rounded-lg shadow-sm"
                />
              ) : (
                <iframe
                  src={activePreview.url}
                  className="w-full h-[65vh] rounded-lg border border-slate-200 dark:border-slate-800 bg-white"
                  title={activePreview.title}
                />
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 gap-3">
              <a
                href={activePreview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-red dark:text-slate-400 dark:hover:text-white transition-colors"
              >
                <ExternalLink size={14} />
                <span>Open in new tab</span>
              </a>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Close
                </button>
                <a
                  href={activePreview.url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-brand-red text-white hover:bg-brand-red/90 shadow-xs transition-colors"
                >
                  <Download size={14} />
                  <span>Download File</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
