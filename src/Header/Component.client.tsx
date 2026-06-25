'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Header as HeaderType } from '@/payload-types'
import { Media } from '@/components/Media'
import { Menu, X, ChevronDown, ChevronUp, ChevronRight } from 'lucide-react'
import { cn } from '@/utilities/ui'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

interface HeaderClientProps {
  data: HeaderType
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null)
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<number | null>(null)
  const [activeMobileSubDropdown, setActiveMobileSubDropdown] = useState<string | null>(null)

  const isSticky = data?.sticky !== false
  const isHomepage = pathname === '/'
  const shouldOverlap = data?.overlapHomepageHero && isHomepage

  // Throttled scroll listener via requestAnimationFrame
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
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

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const navItems = data?.nav || []

  const isLinkActive = (link?: string | null) => {
    if (!link) return false
    if (link === '/') return pathname === '/'
    return pathname === link || pathname.startsWith(`${link}/`)
  }

  return (
    <>
      <header
        className={cn(
          'w-full z-50 transition-all duration-300',
          isSticky ? 'fixed top-0 left-0' : 'relative',
          isSticky && scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-3 dark:bg-slate-950/95 text-brand-navy dark:text-white'
            : shouldOverlap
              ? 'bg-transparent py-5 text-white'
              : 'bg-white py-5 dark:bg-slate-950 text-brand-navy dark:text-white',
        )}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            {data?.logo && typeof data.logo === 'object' ? (
              <div
                className={cn(
                  'relative flex items-center transition-all duration-300',
                  isSticky && scrolled ? 'h-10 lg:h-12' : 'h-14 lg:h-16',
                )}
              >
                <Media
                  resource={data.logo}
                  className="h-full w-auto"
                  imgClassName={cn(
                    'h-full w-auto object-contain transition-all duration-300',
                    shouldOverlap && !scrolled ? 'brightness-0 invert' : 'dark:brightness-110',
                  )}
                />
              </div>
            ) : (
              <span
                className={cn(
                  'font-serif font-bold text-2xl tracking-wide transition-colors duration-200',
                  shouldOverlap && !scrolled ? 'text-white' : 'text-brand-navy dark:text-white',
                )}
              >
                MOSAI
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map((item, idx) => {
              const hasChildren = item.children && item.children.length > 0
              const isActive = isLinkActive(item.link)
              const isDropdownOpen = activeDropdown === idx

              return (
                <div
                  key={idx}
                  className={cn(
                    'relative group py-2',
                    '[&_.dropdown-panel]:opacity-0 [&_.dropdown-panel]:translate-y-2 [&_.dropdown-panel]:pointer-events-none',
                    'hover:[&_.dropdown-panel]:opacity-100 hover:[&_.dropdown-panel]:translate-y-0 hover:[&_.dropdown-panel]:pointer-events-auto',
                    'focus-within:[&_.dropdown-panel]:opacity-100 focus-within:[&_.dropdown-panel]:translate-y-0 focus-within:[&_.dropdown-panel]:pointer-events-auto',
                  )}
                  onMouseEnter={() => hasChildren && setActiveDropdown(idx)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.link ? (
                    <Link
                      href={item.link}
                      target={item.openInNewTab ? '_blank' : undefined}
                      aria-haspopup={hasChildren ? 'true' : undefined}
                      aria-expanded={hasChildren ? isDropdownOpen : undefined}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-semibold tracking-wide flex items-center gap-1 transition-all duration-200',
                        isActive
                          ? 'text-brand-red'
                          : shouldOverlap && !scrolled
                            ? 'text-white hover:text-brand-red/90'
                            : 'text-brand-navy hover:text-brand-red dark:text-slate-200 dark:hover:text-brand-red',
                      )}
                    >
                      {item.label}
                      {hasChildren && (
                        <ChevronDown
                          className={cn(
                            'w-4 h-4 group-hover:rotate-180 transition-transform duration-200',
                            shouldOverlap && !scrolled ? 'text-white opacity-80' : 'opacity-70',
                          )}
                        />
                      )}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      aria-haspopup={hasChildren ? 'true' : undefined}
                      aria-expanded={hasChildren ? isDropdownOpen : undefined}
                      className={cn(
                        'px-4 py-2 rounded-lg text-sm font-semibold tracking-wide flex items-center gap-1 transition-all duration-200 cursor-pointer',
                        isActive
                          ? 'text-brand-red'
                          : shouldOverlap && !scrolled
                            ? 'text-white hover:text-brand-red/90'
                            : 'text-brand-navy hover:text-brand-red dark:text-slate-200 dark:hover:text-brand-red',
                      )}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 group-hover:rotate-180 transition-transform duration-200',
                          shouldOverlap && !scrolled ? 'text-white opacity-80' : 'opacity-70',
                        )}
                      />
                    </button>
                  )}

                  {/* Dropdown Menu */}
                  {hasChildren && (
                    <div
                      className={cn(
                        'dropdown-panel absolute top-full left-0 mt-1 min-w-[240px] bg-white dark:bg-slate-900 shadow-xl rounded-lg border border-gray-100 dark:border-slate-800 py-2 transition-all duration-200 origin-top z-50',
                      )}
                    >
                      {item.children?.map((child, childIdx) => {
                        const hasSubChildren = child.subChildren && child.subChildren.length > 0
                        const isChildActive = isLinkActive(child.link)

                        return (
                          <div key={childIdx} className="relative group/sub py-1 px-2">
                            {hasSubChildren ? (
                              <div className="relative">
                                <span
                                  tabIndex={0}
                                  className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium text-brand-navy dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-red/40"
                                >
                                  {child.label}
                                  <ChevronRight className="w-4 h-4 opacity-75" />
                                </span>

                                {/* Sub-dropdown Menu */}
                                <div
                                  className={cn(
                                    'absolute left-full top-0 ml-1 min-w-[220px] bg-white dark:bg-slate-900 shadow-xl rounded-lg border border-gray-100 dark:border-slate-800 py-2 transition-all duration-200 opacity-0 translate-x-2 pointer-events-none',
                                    'group-hover/sub:opacity-100 group-hover/sub:translate-x-0 group-hover/sub:pointer-events-auto',
                                    'focus-within:opacity-100 focus-within:translate-x-0 focus-within:pointer-events-auto',
                                  )}
                                >
                                  {child.subChildren?.map((subChild, subIdx) => (
                                    <Link
                                      key={subIdx}
                                      href={subChild.link}
                                      className={cn(
                                        'block px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors',
                                        isLinkActive(subChild.link)
                                          ? 'text-brand-red bg-slate-50 dark:bg-slate-800'
                                          : 'text-brand-navy dark:text-slate-300 hover:text-brand-red',
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
                                    : 'text-brand-navy dark:text-slate-300 hover:text-brand-red hover:bg-slate-50 dark:hover:bg-slate-800',
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
            <div
              className={cn(
                'ml-3 pl-3 border-l',
                shouldOverlap && !scrolled ? 'border-white/20' : 'border-slate-200 dark:border-slate-800',
              )}
            >
              <ThemeSelector />
            </div>
          </nav>

          {/* Hamburger Icon (Mobile) */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'lg:hidden p-2 rounded-lg transition-colors focus:outline-hidden',
              shouldOverlap && !scrolled
                ? 'text-white hover:text-brand-red/90'
                : 'text-brand-navy hover:text-brand-red dark:text-slate-200 dark:hover:text-brand-red',
            )}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav-panel"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Spacer to avoid content being covered by the sticky header */}
      {isSticky && !shouldOverlap && <div className="h-[96px] lg:h-[104px] w-full" />}

      {/* Mobile Slide-in Menu */}
      <div
        id="mobile-nav-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-[320px] bg-white dark:bg-slate-900 z-50 shadow-2xl border-l border-gray-100 dark:border-slate-800 transition-transform duration-300 transform lg:hidden flex flex-col',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <div className="p-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
          <span className="font-serif font-bold text-xl text-brand-navy dark:text-white">Navigation</span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg text-brand-navy hover:text-brand-red dark:text-slate-200 focus:outline-hidden"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {navItems.map((item, idx) => {
            const hasChildren = item.children && item.children.length > 0
            const isDropdownActive = activeMobileDropdown === idx
            const isActive = isLinkActive(item.link)

            return (
              <div
                key={idx}
                className="border-b border-slate-100 dark:border-slate-800/50 pb-2 last:border-b-0"
              >
                <div className="flex justify-between items-center py-2">
                  {item.link ? (
                    <Link
                      href={item.link}
                      target={item.openInNewTab ? '_blank' : undefined}
                      className={cn(
                        'font-semibold text-base transition-colors',
                        isActive ? 'text-brand-red' : 'text-brand-navy dark:text-slate-200',
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
                      type="button"
                      onClick={() => setActiveMobileDropdown(isDropdownActive ? null : idx)}
                      className="p-1 rounded-md bg-slate-50 dark:bg-slate-850 hover:bg-slate-100"
                      aria-label={isDropdownActive ? `Collapse ${item.label}` : `Expand ${item.label}`}
                      aria-expanded={isDropdownActive}
                    >
                      {isDropdownActive ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                {/* Mobile Dropdown Items */}
                {hasChildren && isDropdownActive && (
                  <div className="pl-4 mt-1 space-y-2 transition-all duration-200">
                    {item.children?.map((child, childIdx) => {
                      const hasSubChildren = child.subChildren && child.subChildren.length > 0
                      const subKey = `${idx}-${childIdx}`
                      const isSubDropdownActive = activeMobileSubDropdown === subKey
                      const isChildActive = isLinkActive(child.link)

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
                                  isChildActive
                                    ? 'text-brand-red'
                                    : 'text-brand-navy/85 dark:text-slate-300 hover:text-brand-red',
                                )}
                              >
                                {child.label}
                              </Link>
                            )}

                            {hasSubChildren && (
                              <button
                                type="button"
                                onClick={() =>
                                  setActiveMobileSubDropdown(isSubDropdownActive ? null : subKey)
                                }
                                className="p-1 rounded-md bg-slate-50/50"
                                aria-label={
                                  isSubDropdownActive ? `Collapse ${child.label}` : `Expand ${child.label}`
                                }
                                aria-expanded={isSubDropdownActive}
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
                                    isLinkActive(subChild.link)
                                      ? 'text-brand-red'
                                      : 'text-brand-navy/70 dark:text-slate-400 hover:text-brand-red',
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
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-sm font-semibold text-brand-navy dark:text-slate-200">Appearance</span>
          <ThemeSelector />
        </div>
      </div>

      {/* Backdrop for Mobile Menu */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          aria-hidden="true"
        />
      )}
    </>
  )
}