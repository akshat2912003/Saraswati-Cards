import React from 'react'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | Saraswati Cards</title>
      </Helmet>

      <div className="min-h-[70vh] bg-cream-50 flex flex-col items-center justify-center text-center px-4 py-16">
        <h1 className="text-7xl sm:text-9xl font-serif font-extrabold text-brand-700 tracking-wider">404</h1>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mt-2 mb-3">Page Not Found</h2>
        <p className="text-sm text-gray-500 max-w-md mb-8">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="btn-primary text-sm py-3 px-6">
            Go to Home Page
          </Link>
          <Link to="/products" className="btn-outline text-sm py-3 px-6">
            Browse Product Catalog
          </Link>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage
