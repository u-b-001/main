'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Header as HeaderType } from '@/payload-types'
import { Media } from '@/components/Media'
import { Menu, X, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: HeaderType
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<number | null>(null)
  const [activeMobileSubDropdown, setActiveMobileSubDropdown] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on path changes
  useEffect(() => {
    setIsOpen(false)
    setActiveMobileDropdown(null)
    setActiveMobileSubDropdown(null)
  }, [pathname])

  const navItems = data?.nav || []

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 w-full z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 dark:bg-slate-950/95'
            : 'bg-white py-5 dark:bg-slate-950'
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {data?.logo && typeof data.logo === 'object' ? (
              <div className="h-12 w-auto relative flex items-center">
                <Media
                  resource={data.logo}
                  className="max-h-12 w-auto object-contain dark:brightness-110"
                />
              </div>
            ) : (
              <span className="font-serif font-bold text-2xl tracking-wide text-brand-navy dark:text-white">
                MOSAI
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item, idx) => {
              const hasChildren = item.children && item.children.length > 0
              const isActive =
                item.link === '/' ? pathname === '/' : pathname.startsWith(item.link || '___never___')

              return (
                <div
                  key={idx}
                  className="relative group py-2"
                  onMouseEnter={() => hasChildren && setActiveDropdown(idx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.link ? (
                    <Link
                      href={item.link}
                      target={item.openInNewTab ? '_blank' : undefined}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-semibold tracking-wide flex items-center gap-1 transition-all duration-200',
                        isActive
                          ? 'text-brand-red dark:text-brand-red'
                          : 'text-brand-navy hover:text-brand-red dark:text-slate-200 dark:hover:text-brand-red'
                      )}
                    >
                      {item.label}
                      {hasChildren && <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-200" />}
                    </Link>
                  ) : (
                    <button
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-semibold tracking-wide flex items-center gap-1 transition-all duration-200 cursor-pointer',
                        isActive
                          ? 'text-brand-red'
                          : 'text-brand-navy hover:text-brand-red dark:text-slate-200 dark:hover:text-brand-red'
                      )}
                    >
                      {item.label}
                      <ChevronDown className="w-4 h-4 opacity-70 group-hover:rotate-180 transition-transform duration-200" />
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  {hasChildren && (
                    <div
                      className={cn(
                        'absolute top-full left-0 mt-1 min-w-[240px] bg-white dark:bg-slate-900 shadow-xl rounded-lg border border-gray-100 dark:border-slate-800 py-2 transition-all duration-200 origin-top opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto z-50'
                      )}
                    >
                      {item.children?.map((child, childIdx) => {
                        const hasSubChildren = child.subChildren && child.subChildren.length > 0
                        const isChildActive = pathname === child.link

                        return (
                          <div key={childIdx} className="relative group/sub py-1 px-2">
                            {hasSubChildren ? (
                              <div className="relative">
                                <span className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-brand-navy dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                                  {child.label}
                                  <ChevronRight className="w-4 h-4 opacity-75" />
                                </span>

                                {/* Sub-dropdown Menu */}
                                <div className="absolute left-full top-0 ml-1 min-w-[220px] bg-white dark:bg-slate-900 shadow-xl rounded-lg border border-gray-100 dark:border-slate-800 py-2 transition-all duration-200 opacity-0 translate-x-2 pointer-events-none group-hover/sub:opacity-100 group-hover/sub:translate-x-0 group-hover/sub:pointer-events-auto">
                                  {child.subChildren?.map((subChild, subIdx) => (
                                    <Link
                                      key={subIdx}
                                      href={subChild.link}
                                      className={cn(
                                        'block px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                                        pathname === subChild.link
                                          ? 'text-brand-red bg-slate-50 dark:bg-slate-800'
                                          : 'text-brand-navy dark:text-slate-300 hover:text-brand-red'
                                      )}
                                    >
                                      {subChild.label}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Link
                                href={child.link}
                                target={child.openInNewTab ? '_blank' : undefined}
                                className={cn(
                                  'block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                                  isChildActive
                                    ? 'text-brand-red bg-slate-50 dark:bg-slate-800'
                                    : 'text-brand-navy dark:text-slate-300 hover:text-brand-red hover:bg-slate-50 dark:hover:bg-slate-800'
                                )}
                              >
                                {child.label}
                              </Link>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Hamburger Icon (Mobile) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-brand-navy hover:text-brand-red dark:text-slate-200 dark:hover:text-brand-red focus:outline-hidden"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Spacer to avoid content being covered by the sticky header */}
      <div className="h-[76px] lg:h-[88px] w-full" />

      {/* Mobile Slide-in Menu */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-[320px] bg-white dark:bg-slate-900 z-50 shadow-2xl border-l border-gray-100 dark:border-slate-800 transition-transform duration-300 transform lg:hidden flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <span className="font-serif font-bold text-xl text-brand-navy dark:text-white">
            Navigation
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-brand-navy hover:text-brand-red dark:text-slate-200 focus:outline-hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0
            const isDropdownActive = activeMobileDropdown === idx
            const isActive =
              item.link === '/' ? pathname === '/' : pathname.startsWith(item.link || '___never___')

            return (
              <div key={idx} className="border-b border-slate-100 dark:border-slate-800/50 pb-2 last:border-b-0">
                <div className="flex justify-between items-center py-2">
                  {item.link ? (
                    <Link
                      href={item.link}
                      target={item.openInNewTab ? '_blank' : undefined}
                      className={cn(
                        'font-semibold text-base transition-colors',
                        isActive ? 'text-brand-red' : 'text-brand-navy dark:text-slate-200'
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="font-semibold text-base text-brand-navy dark:text-slate-200">
                      {item.label}
                    </span>
                  )}

                  {hasChildren && (
                    <button
                      onClick={() => setActiveMobileDropdown(isDropdownActive ? null : idx)}
                      className="p-1 rounded-md bg-slate-50 dark:bg-slate-850 hover:bg-slate-100"
                    >
                      {isDropdownActive ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown Items */}
                {hasChildren && isDropdownActive && (
                  <div className="pl-4 mt-1 space-y-2 transition-all duration-200">
                    {item.children?.map((child, childIdx) => {
                      const hasSubChildren = child.subChildren && child.subChildren.length > 0
                      const isSubDropdownActive = activeMobileSubDropdown === childIdx
                      const isChildActive = pathname === child.link

                      return (
                        <div key={childIdx} className="space-y-1">
                          <div className="flex justify-between items-center py-1">
                            {hasSubChildren ? (
                              <span className="text-sm font-medium text-brand-navy/80 dark:text-slate-300">
                                {child.label}
                              </span>
                            ) : (
                              <Link
                                href={child.link}
                                target={child.openInNewTab ? '_blank' : undefined}
                                className={cn(
                                  'text-sm font-medium transition-colors',
                                  isChildActive ? 'text-brand-red' : 'text-brand-navy/85 dark:text-slate-300 hover:text-brand-red'
                                )}
                              >
                                {child.label}
                              </Link>
                            )}

                            {hasSubChildren && (
                              <button
                                onClick={() =>
                                  setActiveMobileSubDropdown(isSubDropdownActive ? null : childIdx)
                                }
                                className="p-1 rounded-md bg-slate-50/50"
                              >
                                {isSubDropdownActive ? (
                                  <ChevronUp className="w-3.5 h-3.5" />
                                ) : (
                                  <ChevronDown className="w-3.5 h-3.5" />
                                )}
                              </button>
                            )}
                          </div>

                          {/* Mobile Sub-Dropdown Items */}
                          {hasSubChildren && isSubDropdownActive && (
                            <div className="pl-4 space-y-2 py-1 border-l-2 border-slate-100 dark:border-slate-800">
                              {child.subChildren?.map((subChild, subIdx) => (
                                <Link
                                  key={subIdx}
                                  href={subChild.link}
                                  className={cn(
                                    'block text-xs font-medium transition-colors',
                                    pathname === subChild.link
                                      ? 'text-brand-red'
                                      : 'text-brand-navy/70 dark:text-slate-400 hover:text-brand-red'
                                  )}
                                >
                                  {subChild.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Backdrop for Mobile Menu */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}
    </>
  )
}
