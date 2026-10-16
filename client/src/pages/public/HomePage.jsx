import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { FaWhatsapp, FaRupeeSign, FaLayerGroup } from 'react-icons/fa'
import {
  HiViewGrid,
  HiPencil,
  HiPrinter,
  HiTruck,
  HiSparkles,
} from 'react-icons/hi'
import SearchBar from '../../components/ui/SearchBar'
import ProductGrid from '../../components/product/ProductGrid'
import { productAPI, categoryAPI } from '../../services/api'
import { buildWhatsAppUrl, buildGeneralWhatsAppMessage } from '../../config/shop'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  // Fetch categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then((res) => res.data.data || []),
  })

  // Fetch trending products
  const { data: trendingData, isLoading: trendingLoading } = useQuery({
    queryKey: ['products', 'trending'],
    queryFn: () => productAPI.getAll({ isTrending: true, limit: 8 }).then((res) => res.data.data || []),
  })

  // Fetch new arrival products
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => productAPI.getAll({ isNew: true, limit: 8 }).then((res) => res.data.data || []),
  })

  const handleSearchSubmit = (query) => {
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`)
    }
  }

  // These supplied category images already include their category labels.
  const categoryImages = {
    'wedding-cards': '/images/wed_category.jpeg',
    'digital-wedding-cards': '/images/digital_category.jpeg',
    'video-wedding-cards': '/images/video_category.jpeg',
    'birthday-cards': '/images/birthday_category.jpeg',
    'welcome-boards': '/images/welcomeboard_category.jpeg',
    'gift-envelopes': '/images/Gift_enve_category.jpeg',
    'visiting-cards': '/images/visiting_category.jpeg',
  }

  // Trust features matching screenshot 3
  const whyChooseFeatures = [
    { icon: FaLayerGroup, title: 'Wide Variety of Designs' },
    { icon: HiPencil, title: 'Custom Designs' },
    { icon: FaRupeeSign, title: 'Reasonable Prices' },
    { icon: HiPrinter, title: 'Quality Printing' },
    { icon: FaWhatsapp, title: 'Easy WhatsApp Ordering' },
    { icon: HiTruck, title: 'Delivery Available' },
  ]

  return (
    <>
      <Helmet>
        <title>Saraswati Cards | Cards for Every Occasion — Prayagraj</title>
        <meta
          name="description"
          content="Saraswati Cards — Royal wedding invitation cards, digital invitations, video invitations, birthday cards, visiting cards & welcome boards in Prayagraj."
        />
      </Helmet>

      {/* 1. HERO SECTION */}
      <section className="relative bg-[#3F0F16] text-white min-h-[500px] sm:min-h-[560px] lg:min-h-[600px] flex flex-col justify-between overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700"
          style={{ backgroundImage: `url('/images/Hero_section.jpeg')` }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A080E]/70 via-[#3F0F16]/35 to-[#2A080E]/55" />

        {/* Content — stacked on mobile, side-by-side on desktop */}
        <div className="container-page relative z-10 flex-grow flex flex-col justify-center lg:flex-row lg:items-center lg:gap-12 py-12 sm:py-16 lg:py-20">
          {/* Text block */}
          <div className="text-center lg:text-left lg:flex-1 lg:max-w-xl">
            <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D99B36] mb-3">
              PRAYAGRAJ · ALL INDIA
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-serif font-bold text-white leading-tight mb-3">
              Beautiful Cards for Every Special Occasion
            </h1>
            <p className="text-sm sm:text-base text-gray-200 font-light mb-8 max-w-lg mx-auto lg:mx-0">
              Wedding cards, digital invitations, birthday cards, visiting cards and more.
            </p>
            <div className="flex flex-col gap-3 max-w-md mx-auto lg:mx-0 lg:flex-row lg:max-w-none">
              <Link
                to="/products"
                className="bg-[#D49E43] hover:bg-[#c48e35] text-[#2A080E] font-semibold py-3.5 px-6 rounded-2xl shadow-md text-sm transition-colors text-center lg:w-auto"
              >
                Explore Collection
              </Link>
              <a
                href={buildWhatsAppUrl(buildGeneralWhatsAppMessage())}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1D9A52] hover:bg-[#188545] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md text-sm transition-colors flex items-center justify-center gap-2 lg:w-auto"
              >
                <FaWhatsapp className="text-xl" />
                <span>Order on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Search bar — below text on mobile, right column on desktop */}
          <div className="mt-8 lg:mt-0 lg:flex-1 lg:max-w-md w-full max-w-xl mx-auto lg:mx-0">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              placeholder="Search cards, designs, categories..."
            />
          </div>
        </div>
      </section>


      {/* 2. SHOP BY CATEGORY SECTION */}
      <section className="py-6 sm:py-8 bg-[#FAF7F2]">
        <div className="container-page">
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-[#5C1622] mb-4">
            Shop by Category
          </h2>

          {categoriesLoading ? (
            <div className="flex gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible lg:pb-0 xl:grid-cols-7">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="skeleton w-28 h-32 sm:w-36 sm:h-40 lg:w-full lg:h-40 rounded-2xl flex-shrink-0 lg:flex-shrink" />
              ))}
            </div>
          ) : (
            <>
              {/* Mobile: horizontal scroll */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-snap-x pb-2 lg:hidden">
                {categoriesData?.map((cat) => {
                  const bgImg = categoryImages[cat.slug]
                  return (
                    <Link
                      key={cat._id || cat.slug}
                      to={`/category/${cat.slug}`}
                      className="relative w-28 h-32 sm:w-36 sm:h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm group border border-gray-200/80 scroll-snap-start"
                    >
                      {bgImg ? (
                        <img
                          src={bgImg}
                          alt={cat.name}
                          loading="lazy"
                          className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#2A080E] to-[#5C1622] p-3">
                          <span className="font-serif font-bold text-white text-xs leading-tight text-center">
                            {cat.name}
                          </span>
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>

              {/* Desktop: grid */}
              <div className="hidden lg:grid lg:grid-cols-5 xl:grid-cols-7 gap-4">
                {categoriesData?.map((cat) => {
                  const bgImg = categoryImages[cat.slug]
                  return (
                    <Link
                      key={cat._id || cat.slug}
                      to={`/category/${cat.slug}`}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group border border-gray-200/80"
                    >
                      {bgImg ? (
                        <img
                          src={bgImg}
                          alt={cat.name}
                          loading="lazy"
                          className="block w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#2A080E] to-[#5C1622] p-3">
                          <span className="font-serif font-bold text-white text-sm leading-tight text-center">
                            {cat.name}
                          </span>
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </section>


      {/* 3. TRENDING PRODUCTS */}
      <section className="py-8 sm:py-10 bg-[#FAF7F2]">
        <div className="container-page">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#5C1622]">
              Trending Products
            </h2>
            <Link
              to="/products?trending=true"
              className="text-[#5C1622] hover:underline font-semibold text-xs sm:text-sm"
            >
              View all
            </Link>
          </div>

          <ProductGrid products={trendingData} loading={trendingLoading} />
        </div>
      </section>

      {/* 4. DIGITAL & VIDEO INVITATION PROMO BANNER */}
      <section className="py-8 sm:py-10 bg-[#FAF7F2]">
        <div className="container-page">
          <div className="bg-[#5C1622] text-white rounded-3xl overflow-hidden shadow-xl border border-[#48111a] flex flex-col lg:flex-row lg:items-center">
            {/* Text block */}
            <div className="p-6 sm:p-10 text-center lg:text-left lg:flex-1 lg:py-14 lg:pl-14 lg:pr-8">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#D49E43] block mb-2">
                DIGITAL & VIDEO WEDDING INVITATIONS
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold mb-3 text-white leading-tight">
                Make Your Invitation More Special
              </h2>
              <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed mb-6 lg:max-w-md">
                Share beautiful invitations instantly with family and friends on WhatsApp.
              </p>
              <Link
                to="/category/digital-wedding-cards"
                className="inline-block bg-[#D49E43] hover:bg-[#c48e35] text-[#2A080E] font-semibold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-colors shadow-xs"
              >
                Explore Digital Invitations
              </Link>
            </div>

            {/* Image block */}
            <div className="w-full lg:w-[42%] p-5 pb-10 lg:pb-5 flex justify-center">
              <img
                src="/images/Digital_Invitaion.jpeg"
                alt="Digital Wedding Invitation Phone Mockup"
                className="w-full lg:h-72 lg:w-auto rounded-2xl shadow-2xl border-4 border-white/10 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-8 sm:py-10 bg-[#FAF7F2]">
        <div className="container-page">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#5C1622]">
                New Arrivals
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-sans">
                Fresh designs, just added
              </p>
            </div>
            <Link
              to="/products?isNew=true"
              className="text-[#5C1622] hover:underline font-semibold text-xs sm:text-sm"
            >
              View all
            </Link>
          </div>

          <ProductGrid products={newArrivalsData} loading={newArrivalsLoading} />
        </div>
      </section>

      {/* 6. WHY CHOOSE SARASWATI CARDS */}
      <section className="py-10 sm:py-14 bg-[#FAF7F2]">
        <div className="container-page">
          <div className="bg-[#F4EEE3] rounded-3xl p-6 sm:p-10 lg:p-14 border border-[#E7DECE] shadow-xs text-center">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5C1622] mb-1">
              Why Choose Saraswati Cards
            </h2>

            {/* Diamond divider */}
            <div className="flex items-center justify-center gap-3 max-w-[200px] mx-auto my-3 mb-8">
              <div className="h-[1px] bg-[#D49E43]/60 flex-grow" />
              <span className="text-[#D49E43] text-xs">◆</span>
              <div className="h-[1px] bg-[#D49E43]/60 flex-grow" />
            </div>

            {/* 2-col on mobile, 3-col on desktop */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 max-w-xl lg:max-w-4xl mx-auto">
              {whyChooseFeatures.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 sm:p-5 lg:p-6 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#F5EAD7] text-[#631726] flex items-center justify-center text-xl sm:text-2xl mb-3">
                      <Icon />
                    </div>
                    <span className="font-sans font-semibold text-gray-800 text-xs sm:text-sm leading-snug">
                      {item.title}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

    </>
  )
}

export default HomePage
