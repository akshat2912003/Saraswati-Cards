import React from 'react'
import { Link } from 'react-router-dom'
import { HiLocationMarker, HiPhone } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { SHOP_CONFIG, buildWhatsAppUrl, buildGeneralWhatsAppMessage } from '../../config/shop.js'

export default function Footer() {
  const whatsappUrl = buildWhatsAppUrl(buildGeneralWhatsAppMessage())

  const col1Categories = [
    { label: 'Wedding Cards', href: '/category/wedding-cards' },
    { label: 'Video Wedding Cards', href: '/category/video-wedding-cards' },
    { label: 'Welcome Boards', href: '/category/welcome-boards' },
  ]

  const col2Categories = [
    { label: 'Digital Wedding Cards', href: '/category/digital-wedding-cards' },
    { label: 'Birthday Cards', href: '/category/birthday-cards' },
    { label: 'Gift Envelopes', href: '/category/gift-envelopes' },
    { label: 'Visiting Cards', href: '/category/visiting-cards' },
  ]

  return (
    <footer className="bg-[#5C1622] text-gray-200 pt-8 pb-10 px-5 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Brand Header */}
        <div className="mb-6">
          <h2
            className="font-serif font-bold text-white text-2xl sm:text-3xl leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Saraswati Cards
          </h2>
          <p className="text-[#D49E43] font-serif text-sm mt-0.5 mb-3">
            Cards for Every Occasion
          </p>
          <p className="text-gray-200 text-xs sm:text-sm font-light leading-relaxed max-w-xl">
            Wedding cards, digital and video invitations, birthday cards, visiting cards, banners and more — designed and printed with care in Prayagraj.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="mb-6">
          <h3 className="text-[#D49E43] text-xs font-bold uppercase tracking-wider mb-2.5">
            QUICK LINKS
          </h3>
          <div className="space-y-1.5 text-xs sm:text-sm text-gray-200">
            <div>
              <Link to="/" className="hover:text-[#D49E43] transition-colors">
                Home
              </Link>
            </div>
            <div>
              <Link to="/products" className="hover:text-[#D49E43] transition-colors">
                All Products
              </Link>
            </div>
            <div>
              <Link to="/about" className="hover:text-[#D49E43] transition-colors">
                About Us
              </Link>
            </div>
            <div>
              <Link to="/contact" className="hover:text-[#D49E43] transition-colors">
                Contact
              </Link>
            </div>
            <div>
              <Link to="/about#faq" className="hover:text-[#D49E43] transition-colors">
                FAQ
              </Link>
            </div>
          </div>
        </div>

        {/* CATEGORIES — 2 Columns matching screenshot */}
        <div className="mb-6">
          <h3 className="text-[#D49E43] text-xs font-bold uppercase tracking-wider mb-2.5">
            CATEGORIES
          </h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-200">
            <div className="space-y-1.5">
              {col1Categories.map((cat) => (
                <div key={cat.href}>
                  <Link to={cat.href} className="hover:text-[#D49E43] transition-colors block truncate">
                    {cat.label}
                  </Link>
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              {col2Categories.map((cat) => (
                <div key={cat.href}>
                  <Link to={cat.href} className="hover:text-[#D49E43] transition-colors block truncate">
                    {cat.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CONTACT */}
        <div className="mb-8">
          <h3 className="text-[#D49E43] text-xs font-bold uppercase tracking-wider mb-2.5">
            CONTACT
          </h3>
          <div className="space-y-2.5 text-xs sm:text-sm text-gray-200">
            <div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-[#25D366] transition-colors"
              >
                <FaWhatsapp className="text-base text-[#25D366]" />
                <span>WhatsApp us</span>
              </a>
            </div>
            <div>
              <a
                href={`tel:${SHOP_CONFIG.phone}`}
                className="inline-flex items-center gap-2 hover:text-[#D49E43] transition-colors"
              >
                <HiPhone className="text-base text-gray-300" />
                <span>{SHOP_CONFIG.phone}</span>
              </a>
            </div>
            <div className="flex items-start gap-2 text-gray-300">
              <HiLocationMarker className="text-base text-gray-300 mt-0.5 shrink-0" />
              <span>Prayagraj, Uttar Pradesh</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-white/10 pt-4 text-center text-[11px] text-gray-400">
          © 2026 Saraswati Cards, Prayagraj. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
