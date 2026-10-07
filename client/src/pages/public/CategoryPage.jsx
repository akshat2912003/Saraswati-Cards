import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import Breadcrumb from '../../components/ui/Breadcrumb'
import SearchBar from '../../components/ui/SearchBar'
import ProductGrid from '../../components/product/ProductGrid'
import { productAPI, categoryAPI } from '../../services/api'

const categoryBanners = {
  'wedding-cards': '/images/wed_page_banner.png',
  'digital-wedding-cards': '/images/digital_page_banner.png',
  'video-wedding-cards': '/images/video_page_banner.png',
  'birthday-cards': '/images/Birthday_page_banner.png',
  'welcome-boards': '/images/Welcome_board_page_banner.png',
  'gift-envelopes': '/images/Gift_enevlope_page_banner.png',
  'visiting-cards': '/images/Visitng_page_banner.png',
}

const CategoryPage = () => {
  const { slug } = useParams()
  const [search, setSearch] = useState('')
  const banner = categoryBanners[slug]

  // Fetch Category info
  const { data: category, isLoading: catLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoryAPI.getBySlug(slug).then((res) => res.data.data),
  })

  // Fetch Products in Category
  const { data: productsData, isLoading: prodLoading } = useQuery({
    queryKey: ['products', 'category', slug, search],
    queryFn: () => productAPI.getAll({ category: slug, search, limit: 20 }).then((res) => res.data),
  })

  const products = productsData?.data || []

  return (
    <>
      <Helmet>
        <title>{category ? `${category.name} Designs | Saraswati Cards` : 'Category Catalog'}</title>
        <meta
          name="description"
          content={category?.description || `Browse custom ${category?.name || 'card'} designs at Saraswati Cards. Order directly on WhatsApp.`}
        />
      </Helmet>

      <div className="py-6 sm:py-8 bg-[#FAF7F2] min-h-screen">
        <div className="container-page">
          <Breadcrumb
            items={[
              { label: 'All Products', href: '/products' },
              { label: category?.name || 'Category' },
            ]}
          />

          {/* Category Banner/Header */}
          <div className={`my-6 ${banner ? 'overflow-hidden rounded-2xl shadow-md' : 'bg-gradient-to-r from-brand-800 to-brand-900 text-white rounded-2xl p-6 sm:p-8 shadow-md'}`}>
            {catLoading ? (
              <div className={`skeleton w-full ${banner ? 'aspect-[3.125/1]' : 'h-10 max-w-48 bg-white/20'}`}></div>
            ) : banner ? (
              <>
                <h1 className="sr-only">{category?.name}</h1>
                <img
                  src={banner}
                  alt={`${category?.name} category banner`}
                  className="block h-auto w-full"
                />
              </>
            ) : (
              <>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-cream-100 mb-2">
                  {category?.name}
                </h1>
                <p className="text-xs sm:text-sm text-gray-200 max-w-xl font-light">
                  {category?.description || `Explore our exclusive collection of ${category?.name} designs.`}
                </p>
              </>
            )}
          </div>

          {/* Search inside category */}
          <div className="mb-6 max-w-md">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder={`Search within ${category?.name || 'this category'}...`}
            />
          </div>

          {/* Product Grid */}
          <ProductGrid
            products={products}
            loading={prodLoading}
            emptyTitle={`No designs found in ${category?.name || 'this category'}`}
            emptyDescription="Try clearing your search query or check back later for new arrivals."
          />
        </div>
      </div>
    </>
  )
}

export default CategoryPage
