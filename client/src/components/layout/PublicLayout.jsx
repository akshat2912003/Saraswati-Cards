import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import WhatsAppFloat from '../ui/WhatsAppFloat.jsx'

export default function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FAF7F2]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
