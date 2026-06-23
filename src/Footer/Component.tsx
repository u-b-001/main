import { getCachedGlobal } from '@/utilities/getGlobals'
import Link from 'next/link'
import React from 'react'
import { Facebook, Instagram, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { CalendarWidget } from './CalendarWidget'
import { VisitorCounter } from './VisitorCounter'

export async function Footer() {
  const footerData = await getCachedGlobal('footer', 1)()

  const orgName = footerData?.organizationName || 'MOMBUSHO SCHOLARS ASSOCIATION OF INDIA'
  const copyrightText = footerData?.copyright || `© ${new Date().getFullYear()} MOSAI. All rights reserved.`
  
  const social = footerData?.socialLinks || {}
  const contact = footerData?.contact || {}

  return (
    <footer className="bg-slate-950 border-t border-slate-900 text-slate-300 py-12 mt-auto">
      <div className="container mx-auto px-4">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 — Organization & Social */}
          <div className="space-y-4">
            <h3 className="font-serif font-bold text-lg text-white leading-tight uppercase tracking-wider">
              {orgName}
            </h3>
            <p className="text-sm text-slate-400 font-serif leading-relaxed">
              Promoting educational and cultural relations between India and Japan.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              {social.facebook && (
                <Link
                  href={social.facebook}
                  target="_blank"
                  className="p-2 rounded-full bg-slate-900 hover:bg-brand-red hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </Link>
              )}
              {social.instagram && (
                <Link
                  href={social.instagram}
                  target="_blank"
                  className="p-2 rounded-full bg-slate-900 hover:bg-brand-red hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </Link>
              )}
              {social.linkedin && (
                <Link
                  href={social.linkedin}
                  target="_blank"
                  className="p-2 rounded-full bg-slate-900 hover:bg-brand-red hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </Link>
              )}
              {social.youtube && (
                <Link
                  href={social.youtube}
                  target="_blank"
                  className="p-2 rounded-full bg-slate-900 hover:bg-brand-red hover:text-white transition-colors"
                  aria-label="YouTube"
                >
                  <Youtube className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Column 2 — Contact details */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-white tracking-wider uppercase border-b border-slate-900 pb-2">
              CONTACT US
            </h4>
            <ul className="space-y-3 text-sm">
              {contact.email && (
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <Link href={`mailto:${contact.email}`} className="hover:text-brand-red transition-colors break-all">
                    {contact.email}
                  </Link>
                </li>
              )}
              {contact.phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{contact.phone}</span>
                </li>
              )}
              {contact.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0 mt-0.5" />
                  <span className="leading-relaxed whitespace-pre-line text-slate-400 font-serif">
                    {contact.address}
                  </span>
                </li>
              )}
            </ul>
          </div>

          {/* Column 3 — Visitor Counter */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-white tracking-wider uppercase border-b border-slate-900 pb-2">
              VISITORS
            </h4>
            {footerData?.showVisitorCounter !== false ? (
              <VisitorCounter />
            ) : (
              <div className="text-xs text-slate-500 italic">Visitor statistics disabled</div>
            )}
          </div>

          {/* Column 4 — Calendar */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-sm text-white tracking-wider uppercase border-b border-slate-900 pb-2">
              CALENDAR
            </h4>
            {footerData?.showCalendar !== false ? (
              <CalendarWidget />
            ) : (
              <div className="text-xs text-slate-500 italic">Calendar disabled</div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-serif text-center sm:text-left gap-4">
          <p>{copyrightText}</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-brand-red transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-brand-red transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
