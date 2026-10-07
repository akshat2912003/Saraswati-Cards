import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../../components/ui/Breadcrumb'
import SearchBar from '../../components/ui/SearchBar'
import ProductGrid from '../../components/product/ProductGrid'
import { productAPI, categoryAPI } from '../../services/api'

const AllProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10))

  const isTrending = searchParams.get('trending') === 'true'
  const isNew = searchParams.get('isNew') === 'true'

  // Update query params when search changes
  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setSelectedCategory(searchParams.get('category') || '')
  }, [searchParams])

  // Fetch categories for dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then((res) => res.data.data || []),
  })

  // Fetch products
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', { search, selectedCategory, sort, page, isTrending, isNew }],
    queryFn: () =>
      productAPI
        .getAll({
          search,
          category: selectedCategory,
          sort,
          page,
          limit: 16,
          isTrending: isTrending ? true : undefined,
          isNew: isNew ? true : undefined,
        })
        .then((res) => res.data),
  })

  const products = productsData?.data || []
  const totalPages = productsData?.pages || 1
  const totalProducts = productsData?.total || 0

  const handleSearchSubmit = (val) => {
    const params = new URLSearchParams(searchParams)
    if (val.trim()) {
      params.set('search', val.trim())
    } else {
      params.delete('search')
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleCategoryChange = (e) => {
    const cat = e.target.value
    setSelectedCategory(cat)
    const params = new URLSearchParams(searchParams)
    if (cat) params.set('category', cat)
    else params.delete('category')
    params.set('page', '1')
    setSearchParams(params)
  }

  const handleSortChange = (e) => {
    const s = e.target.value
    setSort(s)
    const params = new URLSearchParams(searchParams)
    params.set('sort', s)
    setSearchParams(params)
  }

  return (
    <>
      <Helmet>
        <title>All Card Designs & Printing Catalog | Saraswati Cards</title>
        <meta name="description" content="Browse wedding cards, digital invitations, birthday cards, visiting cards, welcome boards and gift envelopes at Saraswati Cards." />
      </Helmet>

      <div className="py-6 sm:py-8 bg-[#FAF7F2] min-h-screen">
        <div className="container-page">
          <Breadcrumb items={[{ label: 'All Products' }]} />

          {/* Header */}
          <div className="my-6">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
              {isTrending ? 'Trending Card Designs' : isNew ? 'New Arrivals' : 'All Product Catalog'}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Explore our full collection of invitation cards and commercial printing products
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6 max-w-xl">
            <SearchBar
              value={search}
              onChange={(val) => setSearch(val)}
              onSubmit={handleSearchSubmit}
              placeholder="Search wedding cards, digital invitations, visiting cards..."
            />
          </div>

          {/* Filters and Sort Row */}
          <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-700"
              >
                <option value="">All Categories</option>
                {categoriesData?.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={sort}
                onChange={handleSortChange}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs sm:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-700"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 font-medium self-end sm:self-center">
              Showing <span className="font-semibold text-gray-800">{products.length}</span> of {totalProducts} items
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={products}
            loading={isLoading}
            emptyTitle="No card designs found"
            emptyDescription="Try clearing your search or choosing a different category filter."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="btn-outline text-xs py-2 px-4 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-xs font-semibold text-gray-700 px-3">
                Page {page} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="btn-outline text-xs py-2 px-4 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AllProductsPage
