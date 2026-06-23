import React from 'react'
import type { TableBlock as TableBlockProps } from '@/payload-types'

export const TableBlock: React.FC<TableBlockProps> = ({ caption, rows }) => {
  if (!rows || rows.length === 0) return null

  return (
    <div className="container mx-auto px-4 py-6 max-w-[48rem]">
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-250 text-left border-collapse">
          {caption && (
            <caption className="py-2 text-sm text-gray-500 font-semibold text-center italic">
              {caption}
            </caption>
          )}
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, rowIndex) => {
              const cells = row.cells || []
              if (row.isHeader) {
                return (
                  <tr key={rowIndex} className="bg-brand-navy text-white text-sm font-semibold">
                    {cells.map((cell, cellIndex) => (
                      <th
                        key={cellIndex}
                        className="px-6 py-4 border-r border-slate-700 last:border-r-0 tracking-wider text-left uppercase"
                      >
                        {cell.value || ''}
                      </th>
                    ))}
                  </tr>
                )
              }

              return (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-brand-lightgray hover:bg-slate-50'}
                >
                  {cells.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 border-r border-gray-200 last:border-r-0 text-sm text-brand-text font-serif leading-relaxed"
                    >
                      {cell.value || ''}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
