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
    'wedding-cards': '/images/wed_category.png',
    'digital-wedding-cards': '/images/digital_category.png',
    'video-wedding-cards': '/images/video_category.png',
    'birthday-cards': '/images/birthday_category.png',
    'welcome-boards': '/images/welcomeboard_category.png',
    'gift-envelopes': '/images/Gift_enve_category.png',
    'visiting-cards': '/images/visiting_category.png',
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

      {/* 1. HERO SECTION (Screenshot 2 & Image 2 Background) */}
      <section className="relative bg-[#3F0F16] text-white min-h-[500px] sm:min-h-[560px] flex flex-col justify-between overflow-hidden">
        {/* Flat-lay wedding invitation card background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-700"
          style={{
            backgroundImage: `url('/images/Hero_section.jpeg')`,
          }}
        ></div>

        {/* Dark maroon gradient overlay for crisp text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2A080E]/70 via-[#3F0F16]/35 to-[#2A080E]/55"></div>

        <div className="container-page pt-12 pb-8 sm:pt-16 sm:pb-12 text-center relative z-10 max-w-2xl mx-auto flex-grow flex flex-col justify-center">
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D99B36] mb-3">
            PRAYAGRAJ · ALL INDIA
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-3">
            Beautiful Cards for Every Special Occasion
          </h1>

          <p className="text-sm sm:text-base text-gray-200 font-light mb-8 max-w-lg mx-auto">
            Wedding cards, digital invitations, birthday cards, visiting cards and more.
          </p>

          <div className="flex flex-col gap-3 max-w-md mx-auto w-full mb-6">
            <Link
              to="/products"
              className="w-full bg-[#D49E43] hover:bg-[#c48e35] text-[#2A080E] font-semibold py-3.5 px-6 rounded-2xl shadow-md text-sm transition-colors text-center"
            >
              Explore Collection
            </Link>

            <a
              href={buildWhatsAppUrl(buildGeneralWhatsAppMessage())}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#1D9A52] hover:bg-[#188545] text-white font-semibold py-3.5 px-6 rounded-2xl shadow-md text-sm transition-colors flex items-center justify-center gap-2"
            >
              <FaWhatsapp className="text-xl" />
              <span>Order on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Integrated Floating Search Bar (Screenshot 1 & 2) */}
        <div className="container-page pb-6 relative z-20 max-w-xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearchSubmit}
            placeholder="Search cards, designs, categories..."
          />
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION (Compact Square Cards) */}
      <section className="py-6 sm:py-8 bg-[#FAF7F2]">
        <div className="container-page">
          <h2 className="text-xl sm:text-3xl font-serif font-bold text-[#5C1622] mb-4">
            Shop by Category
          </h2>

          {categoriesLoading ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="skeleton w-36 h-40 sm:w-44 sm:h-48 rounded-2xl flex-shrink-0"></div>
              ))}
            </div>
          ) : (
            <div className="flex gap-3 overflow-x-auto no-scrollbar scroll-snap-x pb-2">
              {categoriesData?.map((cat) => {
                const bgImg = categoryImages[cat.slug]
                return (
                  <Link
                    key={cat._id || cat.slug}
                    to={`/category/${cat.slug}`}
                    className="relative w-36 h-40 sm:w-44 sm:h-48 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm group border border-gray-200/80 scroll-snap-start"
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
                        <span className="font-serif font-bold text-white text-xs sm:text-sm leading-tight text-center">
                          {cat.name}
                        </span>
                      </div>
                    )}
                  </Link>
                )
              })}
            </div>
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
        <div className="container-page max-w-4xl">
          <div className="bg-[#5C1622] text-white rounded-3xl overflow-hidden shadow-xl border border-[#48111a] flex flex-col items-center">
            {/* Header text container */}
            <div className="p-6 sm:p-10 text-center max-w-xl">
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[#D49E43] block mb-2">
                DIGITAL & VIDEO WEDDING INVITATIONS
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold mb-3 text-white leading-tight">
                Make Your Invitation More Special
              </h2>
              <p className="text-sm sm:text-base text-gray-200 font-light leading-relaxed mb-6">
                Share beautiful invitations instantly with family and friends on WhatsApp.
              </p>

              <Link
                to="/category/digital-wedding-cards"
                className="inline-block bg-[#D49E43] hover:bg-[#c48e35] text-[#2A080E] font-semibold text-xs sm:text-sm py-3.5 px-6 rounded-xl transition-colors shadow-xs"
              >
                Explore Digital Invitations
              </Link>
            </div>

            {/* Mobile phone photo container */}
            <div className="w-full max-w-md p-5 pb-10 flex justify-center">
              <img
                src="/images/Digital_Invitaion.jpeg"
                alt="Digital Wedding Invitation Phone Mockup"
                className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white/10 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEW ARRIVALS */}
      <section className="py-8 sm:py-10 bg-[#FAF7F2]">
        <div className="container-page">
          <div className="mb-5">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#5C1622]">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5 font-sans">
              Fresh designs, just added
            </p>
          </div>

          <ProductGrid products={newArrivalsData} loading={newArrivalsLoading} />
        </div>
      </section>

      {/* 6. WHY CHOOSE SARASWATI CARDS (Image 3: Warm darker off-white container card) */}
      <section className="py-10 sm:py-14 bg-[#FAF7F2]">
        <div className="container-page max-w-3xl">
          <div className="bg-[#F4EEE3] rounded-3xl p-6 sm:p-10 border border-[#E7DECE] shadow-xs text-center">
            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#5C1622] mb-1">
              Why Choose Saraswati Cards
            </h2>

            {/* Diamond emblem line divider matching screenshot */}
            <div className="flex items-center justify-center gap-3 max-w-[200px] mx-auto my-3 mb-7">
              <div className="h-[1px] bg-[#D49E43]/60 flex-grow"></div>
              <span className="text-[#D49E43] text-xs">◆</span>
              <div className="h-[1px] bg-[#D49E43]/60 flex-grow"></div>
            </div>

            {/* 2-Column Grid (Image 3) */}
            <div className="grid grid-cols-2 gap-3.5 sm:gap-5 max-w-xl mx-auto">
              {whyChooseFeatures.map((item, idx) => {
                const Icon = item.icon
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-gray-100 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow"
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
