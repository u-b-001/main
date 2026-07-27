import React from 'react'
import type { TableBlock as TableBlockProps } from '@/payload-types'
import { cn } from '@/utilities/ui'
import * as LucideIcons from 'lucide-react'

export const TableBlock: React.FC<TableBlockProps> = ({
  heading,
  subtitle,
  headingAlignment = 'center',
  icon,
  iconColor = '#1A103D',
  iconSize = 'md',
  tableTheme = 'gradient',
  headerBgColor = '#1A103D',
  stripedRows = true,
  hoverEffect = true,
  bordered = true,
  borderRadius = 'xl',
  shadow = 'sm',
  cellPadding = 'medium',
  headerAlignment = 'left',
  cellAlignment = 'left',
  showScrollHint = true,
  caption,
  rows,
}) => {
  if (!rows || rows.length === 0) return null

  // Helper function to resolve header alignment
  const getHeaderAlignClass = (cell: any) => {
    if (cell?.alignment && cell.alignment !== 'default') {
      if (cell.alignment === 'center') return 'text-center'
      if (cell.alignment === 'right') return 'text-right'
      return 'text-left'
    }
    if (headerAlignment === 'center') return 'text-center'
    if (headerAlignment === 'right') return 'text-right'
    return 'text-left'
  }

  // Helper function to resolve cell alignment
  const getCellAlignClass = (cell: any) => {
    const cellVal = cell?.value || ''
    const isNumeric = !isNaN(Number(cellVal.replace(/[^0-9.-]/g, ''))) && cellVal.trim() !== ''

    if (cell?.alignment && cell.alignment !== 'default') {
      if (cell.alignment === 'center') return 'text-center'
      if (cell.alignment === 'right') return 'text-right'
      return 'text-left'
    }
    if (cellAlignment === 'center') return 'text-center'
    if (cellAlignment === 'right') return 'text-right'
    if (cellAlignment === 'auto') return isNumeric ? 'text-right tabular-nums' : 'text-left'
    return 'text-left'
  }

  // 1. Padding classes based on selection
  const paddingMap = {
    compact: 'px-4 py-2 text-xs md:text-sm',
    medium: 'px-6 py-4 text-sm md:text-base',
    spacious: 'px-8 py-5 text-base md:text-lg',
  }
  const cellPaddingClass = paddingMap[cellPadding as keyof typeof paddingMap] || paddingMap.medium

  // 2. Corner radius mapping
  const radiusMap = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
  }
  const borderRadiusClass = radiusMap[borderRadius as keyof typeof radiusMap] || radiusMap.xl

  // 3. Shadow mapping
  const shadowMap = {
    none: 'shadow-none',
    xs: 'shadow-xs',
    sm: 'shadow-sm',
    md: 'shadow-md border border-slate-150 dark:border-slate-800',
    lg: 'shadow-lg border border-slate-150 dark:border-slate-800',
  }
  const shadowClass = shadowMap[shadow as keyof typeof shadowMap] || shadowMap.sm

  // Find max column count across all rows
  const maxCols = Math.max(...rows.map((r: any) => (r.cells || []).length), 1)

  // 4. Style Themes
  const isGlass = tableTheme === 'glass'
  const isMinimal = tableTheme === 'minimal'
  const isBrutalist = tableTheme === 'brutalist'

  let tableContainerClass = cn("overflow-x-auto transition-all duration-300", borderRadiusClass, shadowClass)
  let tableElementClass = "min-w-full text-left border-collapse"
  
  if (isGlass) {
    tableContainerClass = cn(
      tableContainerClass,
      "bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/30"
    )
  } else if (isMinimal) {
    tableContainerClass = cn(tableContainerClass, "bg-transparent shadow-none border-none")
  } else if (isBrutalist) {
    tableContainerClass = cn(tableContainerClass, "bg-white dark:bg-slate-950 border-3 border-slate-900 dark:border-white shadow-[6px_6px_0px_0px_#000] dark:shadow-[6px_6px_0px_0px_#fff]")
  } else { // gradient theme / standard card
    tableContainerClass = cn(tableContainerClass, "bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800")
  }

  // Header styling
  const headerStyle = {
    backgroundColor: headerBgColor || '#1A103D',
    color: '#FFFFFF'
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="w-full my-4 group/table">
        {/* Heading & Subtitle Block */}
        {(heading || subtitle || icon) && (
          <div className={cn(
            "flex flex-col mb-6 gap-1",
            headingAlignment === 'left' && "text-left items-start",
            headingAlignment === 'right' && "text-right items-end",
            (headingAlignment === 'center' || !headingAlignment) && "text-center items-center"
          )}>
            <div className="flex items-center gap-2.5">
              {(() => {
                const IconComponent = icon ? (LucideIcons as any)[icon] : null;
                if (!IconComponent) return null;

                const sizeClasses = {
                  sm: 'w-5 h-5',
                  md: 'w-6 h-6',
                  lg: 'w-8 h-8',
                  xl: 'w-10 h-10',
                };
                const iconSizeClass = sizeClasses[iconSize as keyof typeof sizeClasses] || sizeClasses.md;

                return (
                  <IconComponent
                    className={cn("shrink-0", iconSizeClass)}
                    style={{ color: iconColor || '#1A103D' }}
                  />
                );
              })()}
              {heading && (
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight font-serif">
                  {heading}
                </h3>
              )}
            </div>
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl font-sans">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Scroll wrapper */}
        <div className="relative">
          <div className={tableContainerClass}>
            <table className={tableElementClass}>
              <tbody className="divide-y divide-slate-200/60 dark:divide-slate-800/40">
                {rows.map((row: any, rowIndex: number) => {
                  const cells = row.cells || []
                  const isSingleCell = cells.length === 1 && maxCols > 1

                  if (row.isHeader) {
                    return (
                      <tr 
                        key={rowIndex} 
                        className={cn(
                          "font-semibold tracking-wide uppercase text-sm border-b",
                          isSingleCell ? "text-center" : getHeaderAlignClass(cells[0])
                        )}
                        style={headerStyle}
                      >
                        {isSingleCell ? (
                          <th
                            colSpan={maxCols}
                            className={cn(cellPaddingClass, getHeaderAlignClass(cells[0]))}
                          >
                            {cells[0].value || ''}
                          </th>
                        ) : (
                          cells.map((cell: any, cellIndex: number) => (
                            <th
                              key={cellIndex}
                              className={cn(
                                cellPaddingClass,
                                getHeaderAlignClass(cell),
                                bordered && !isMinimal ? "border-r border-white/10 last:border-r-0" : ""
                              )}
                            >
                              {cell.value || ''}
                            </th>
                          ))
                        )}
                      </tr>
                    )
                  }

                  // Dynamic Row Styling
                  const isAlternate = rowIndex % 2 !== 0
                  let rowStyle: React.CSSProperties = {}
                  if (stripedRows && isAlternate && !isMinimal) {
                    rowStyle.backgroundColor = '#F8FAFC'
                  }

                  // Border rules
                  const cellBorderClass = bordered && !isMinimal
                    ? `border-r border-slate-200 dark:border-slate-800 last:border-r-0`
                    : ''

                  return (
                    <tr
                      key={rowIndex}
                      className={cn(
                        "transition-all duration-200",
                        hoverEffect && !isMinimal && "hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:translate-x-0.5"
                      )}
                      style={rowStyle}
                    >
                      {isSingleCell ? (
                        <td
                          colSpan={maxCols}
                          className={cn(
                            cellPaddingClass,
                            "text-slate-700 dark:text-slate-300 font-serif leading-relaxed font-medium",
                            getCellAlignClass(cells[0])
                          )}
                        >
                          {cells[0].value || ''}
                        </td>
                      ) : (
                        cells.map((cell: any, cellIndex: number) => {
                          const cellVal = cell.value || ''

                          return (
                            <td
                              key={cellIndex}
                              className={cn(
                                cellPaddingClass,
                                "text-slate-700 dark:text-slate-300 font-serif leading-relaxed font-sans",
                                cellBorderClass,
                                getCellAlignClass(cell)
                              )}
                            >
                              {cellVal}
                            </td>
                          )
                        })
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Swipe Hint overlay (appears on mobile only if width overflows) */}
          {showScrollHint && (
            <div className="lg:hidden flex items-center justify-center gap-1.5 mt-2.5 text-xs text-slate-400 dark:text-slate-500 select-none">
              <LucideIcons.ArrowLeft className="w-3.5 h-3.5" />
              <span>Swipe horizontally to view full table</span>
              <LucideIcons.ArrowRight className="w-3.5 h-3.5" />
            </div>
          )}
        </div>

        {caption && (
          <p className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-semibold text-center italic font-sans">
            {caption}
          </p>
        )}
      </div>
    </div>
  )
}
