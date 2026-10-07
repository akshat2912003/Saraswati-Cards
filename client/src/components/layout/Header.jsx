import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { HiSparkles } from 'react-icons/hi'
import { FaWhatsapp } from 'react-icons/fa'
import MobileMenu from './MobileMenu'
import { buildWhatsAppUrl, buildGeneralWhatsAppMessage } from '../../config/shop'

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Products', href: '/products' },
    { label: 'Wedding Cards', href: '/category/wedding-cards' },
    { label: 'Digital Cards', href: '/category/digital-wedding-cards' },
    { label: 'Video Cards', href: '/category/video-wedding-cards' },
    { label: 'Birthday Cards', href: '/category/birthday-cards' },
    { label: 'Welcome Boards', href: '/category/welcome-boards' },
    { label: 'Visiting Cards', href: '/category/visiting-cards' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ]

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FAF7F2] border-b border-gray-200/60 shadow-xs">
        <div className="container-page py-3 px-4 flex items-center justify-between">
          
          {/* Left: Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-gray-800 hover:text-brand-700 focus:outline-none"
              aria-label="Open Mobile Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Center: Saraswati Cards Logo & Tagline */}
          <Link to="/" className="flex flex-col items-center text-center">
            <span className="font-serif text-xl sm:text-2xl font-bold text-[#5C1622] tracking-tight leading-none">
              Saraswati Cards
            </span>
            <span className="text-[9px] sm:text-[10px] font-sans font-medium uppercase tracking-[0.2em] text-[#8C6D46] mt-0.5">
              CARDS FOR EVERY OCCASION
            </span>
          </Link>

          {/* Right: WhatsApp */}
          <div className="flex items-center gap-2">
            <Link
              to="/custom-design"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D49E43]/50 bg-[#D49E43]/10 px-2.5 py-2 text-[#5C1622] transition-colors hover:bg-[#D49E43]/20 sm:px-3"
              aria-label="Request a custom design"
            >
              <HiSparkles className="text-lg" />
              <span className="hidden text-xs font-semibold sm:inline">Custom Design</span>
            </Link>
            <a
              href={buildWhatsAppUrl(buildGeneralWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:scale-110 transition-transform p-1"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-2xl" />
            </a>
          </div>
        </div>

        {/* Desktop Navbar Row */}
        <nav className="hidden lg:block border-t border-gray-200/50 bg-[#FAF7F2]">
          <div className="container-page flex items-center justify-center gap-6 py-2 overflow-x-auto text-xs font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`py-1 transition-colors ${
                  isActive(link.href)
                    ? 'text-[#5C1622] font-bold border-b-2 border-[#5C1622]'
                    : 'text-gray-700 hover:text-[#5C1622]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  )
}

export default Header
