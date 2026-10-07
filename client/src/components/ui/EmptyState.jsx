import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineFolderOpen } from 'react-icons/hi'

const EmptyState = ({
  title = 'No products found',
  description = 'Try adjusting your search query or selected category filter.',
  actionLabel = 'Browse All Products',
  actionHref = '/products',
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center text-brand-700 mb-4 text-3xl">
        <HiOutlineFolderOpen />
      </div>
      <h3 className="text-lg font-serif font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm mb-6">{description}</p>
      {actionHref && (
        <Link to={actionHref} className="btn-primary text-xs sm:text-sm">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}

export default EmptyState
