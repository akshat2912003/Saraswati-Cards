import React from 'react'
import { Link } from 'react-router-dom'
import { HiChevronRight, HiHome } from 'react-icons/hi'

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav className="breadcrumb py-2 text-xs sm:text-sm text-gray-500 font-medium" aria-label="Breadcrumb">
      <Link to="/" className="flex items-center gap-1 hover:text-brand-700 transition-colors">
        <HiHome className="text-base" />
        <span>Home</span>
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <React.Fragment key={index}>
            <HiChevronRight className="text-gray-400 text-xs flex-shrink-0" />
            {isLast || !item.href ? (
              <span className="text-gray-800 font-semibold truncate max-w-[150px] sm:max-w-xs">{item.label}</span>
            ) : (
              <Link to={item.href} className="hover:text-brand-700 transition-colors truncate max-w-[120px] sm:max-w-xs">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

export default Breadcrumb
