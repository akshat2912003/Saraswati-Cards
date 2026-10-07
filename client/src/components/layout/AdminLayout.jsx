import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import {
  HiMenu,
  HiX,
  HiViewGrid,
  HiCollection,
  HiPlusCircle,
  HiTag,
  HiLogout,
  HiChevronRight,
} from 'react-icons/hi'
import { useAuth } from '../../hooks/useAuth.jsx'

const ADMIN_NAV = [
  { label: 'Dashboard', href: '/admin', icon: HiViewGrid, end: true },
  { label: 'Products', href: '/admin/products', icon: HiCollection },
  { label: 'Add Product', href: '/admin/products/add', icon: HiPlusCircle },
  { label: 'Categories', href: '/admin/categories', icon: HiTag },
]

// Map path to page title
const PAGE_TITLES = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/products/add': 'Add Product',
  '/admin/categories': 'Categories',
}

function Sidebar({ onClose }) {
  const { logout, admin } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    onClose?.()
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Sidebar header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <span
            className="font-serif font-bold text-brand-700 text-lg leading-none block"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            SC Admin
          </span>
          <span className="text-xs text-gray-400 mt-0.5 block">Saraswati Cards</span>
        </div>
        {/* Close button on mobile */}
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors lg:hidden"
            aria-label="Close sidebar"
          >
            <HiX className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                ['admin-nav-link', isActive ? 'active' : ''].join(' ')
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
              <HiChevronRight className="w-4 h-4 ml-auto opacity-40" />
            </NavLink>
          )
        })}
      </nav>

      {/* Admin email + Logout */}
      <div className="border-t border-gray-100 p-3">
        {admin && (
          <p className="text-xs text-gray-400 px-3 pb-2 truncate" title={admin.email}>
            {admin.email}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="admin-nav-link w-full text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <HiLogout className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { admin } = useAuth()
  const location = useLocation()

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  // Prevent body scroll when sidebar open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [sidebarOpen])

  const pageTitle =
    PAGE_TITLES[location.pathname] ||
    (location.pathname.includes('/edit/') ? 'Edit Product' : 'Admin')

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          {/* Panel */}
          <div className="absolute top-0 left-0 h-full w-60 shadow-xl z-10">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex items-center gap-3 px-4 sm:px-6 h-14 bg-white border-b border-gray-200 shrink-0">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors lg:hidden"
          >
            <HiMenu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <h1
            className="font-serif font-semibold text-gray-800 text-lg flex-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {pageTitle}
          </h1>

          {/* Admin email — desktop */}
          {admin && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-brand-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
                {admin.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="text-sm text-gray-600 max-w-[180px] truncate">{admin.email}</span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
