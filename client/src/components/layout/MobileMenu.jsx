import React, { useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  HiX,
  HiHome,
  HiViewGrid,
  HiSparkles,
  HiFilm,
  HiGift,
  HiMail,
  HiPhone,
  HiTemplate,
  HiPhotograph,
  HiInformationCircle,
  HiChatAlt2,
  HiTag,
  HiCreditCard,
} from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import { SHOP_CONFIG, buildWhatsAppUrl, buildGeneralWhatsAppMessage } from '../../config/shop.js'

const MENU_LINKS = [
  { label: 'Home', href: '/', icon: HiHome },
  { label: 'All Products', href: '/products', icon: HiViewGrid },
  { label: 'Wedding Cards', href: '/category/wedding-cards', icon: HiSparkles },
  { label: 'Digital Wedding Cards', href: '/category/digital-wedding-cards', icon: HiMail },
  { label: 'Video Wedding Cards', href: '/category/video-wedding-cards', icon: HiFilm },
  { label: 'Birthday Cards', href: '/category/birthday-cards', icon: HiTag },
  { label: 'Welcome Boards', href: '/category/welcome-boards', icon: HiTemplate },
  { label: 'Gift Envelopes', href: '/category/gift-envelopes', icon: HiGift },
  { label: 'Visiting Cards', href: '/category/visiting-cards', icon: HiCreditCard },
  { label: 'About Us', href: '/about', icon: HiInformationCircle },
  { label: 'Contact', href: '/contact', icon: HiChatAlt2 },
]

export default function MobileMenu({ isOpen, onClose }) {
  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isOpen])

  if (!isOpen) return null

  const whatsappUrl = buildWhatsAppUrl(buildGeneralWhatsAppMessage())

  return (
    <div className="fixed inset-0 z-[9999] md:hidden mobile-menu-overlay">
      {/* Dark overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in panel */}
      <div
        className="absolute top-0 right-0 h-full w-[80%] max-w-[340px] bg-white flex flex-col shadow-2xl mobile-menu-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <Link to="/" onClick={onClose} className="flex flex-col leading-tight">
            <span
              className="font-serif font-bold text-brand-700 text-lg leading-none"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Saraswati Cards
            </span>
            <span className="text-[10px] text-gold-500 font-medium tracking-wide mt-0.5">
              {SHOP_CONFIG.tagline}
            </span>
          </Link>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 overflow-y-auto py-2">
          <ul className="space-y-0.5 px-2">
            {MENU_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <li key={link.href}>
                  <NavLink
                    to={link.href}
                    end={link.href === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors duration-150',
                        isActive
                          ? 'text-brand-700 bg-brand-50'
                          : 'text-gray-700 hover:text-brand-700 hover:bg-gray-50',
                      ].join(' ')
                    }
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom: WhatsApp section */}
        <div className="border-t border-gray-100 px-4 py-4 space-y-3">
          <a
            href={`tel:${SHOP_CONFIG.phone}`}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-brand-700 transition-colors"
          >
            <HiPhone className="w-4 h-4 text-brand-700" />
            <span>{SHOP_CONFIG.phone}</span>
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp w-full text-sm"
            onClick={onClose}
          >
            <FaWhatsapp className="w-5 h-5" />
            Order on WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
