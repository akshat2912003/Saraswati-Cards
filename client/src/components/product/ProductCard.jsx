import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaWhatsapp, FaPlay } from 'react-icons/fa'
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from '../../config/shop'

const ProductCard = ({ product }) => {
  const isOutOfStock = product.stockStatus === 'outOfStock'
  const isVideoProduct = product.category?.slug === 'video-wedding-cards'
  const imageSrc = product.thumbnail || (product.images && product.images[0]) || '/placeholder-card.jpg'

  const whatsappUrl = buildWhatsAppUrl(
    buildProductWhatsAppMessage({ product, quantity: product.minimumOrderQuantity || 1 })
  )

  const getBadgeClass = (badge) => {
    switch (badge?.toUpperCase()) {
      case 'NEW':
        return 'bg-[#D99B36] text-white'
      case 'TRENDING':
        return 'bg-[#5C1622] text-white'
      case 'BESTSELLER':
        return 'bg-[#4A1521] text-white'
      default:
        return 'bg-gray-800 text-white'
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-xs border border-gray-200/80 flex flex-col h-full relative group hover:shadow-md transition-all duration-300">
      
      {/* Image Block */}
      <div className="relative aspect-[4/3] sm:aspect-[4/3] w-full bg-gray-100 overflow-hidden">
        <Link to={`/product/${product.slug}`} className="block w-full h-full">
          {isVideoProduct && product.videos?.[0] ? (
            <>
              <video
                src={product.videos[0]}
                muted
                preload="metadata"
                className="w-full h-full bg-black object-cover"
              />
              <span className="absolute inset-0 flex items-center justify-center text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-black/55 shadow">
                  <FaPlay className="ml-0.5 text-base" />
                </span>
              </span>
            </>
          ) : isVideoProduct ? (
            <div className="flex h-full items-center justify-center bg-[#2A080E] px-4 text-center text-xs font-semibold text-white">
              Invitation video coming soon
            </div>
          ) : (
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80'
              }}
            />
          )}
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10">
          {product.badges && product.badges.slice(0, 2).map((badge) => (
            <span
              key={badge}
              className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs ${getBadgeClass(badge)}`}
            >
              {badge}
            </span>
          ))}
          {isOutOfStock && (
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gray-900 text-white shadow-xs">
              OUT OF STOCK
            </span>
          )}
        </div>
      </div>

      {/* Details Container */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-grow">
        {/* Name */}
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-serif text-sm sm:text-base font-bold text-gray-900 line-clamp-2 leading-snug hover:text-[#5C1622] transition-colors mb-1.5">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-auto flex items-baseline gap-1 mb-3">
          <span className="text-base sm:text-lg font-bold text-[#5C1622]">₹{product.price}</span>
          {product.priceUnit && (
            <span className="text-xs text-gray-500 font-normal">/ {product.priceUnit}</span>
          )}
        </div>

        {/* WhatsApp Order Button */}
        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="w-full py-2.5 bg-gray-100 text-gray-400 text-xs font-semibold rounded-xl cursor-not-allowed text-center"
            >
              Currently Unavailable
            </button>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-[#1D9A52] hover:bg-[#178345] text-white text-xs sm:text-sm font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <FaWhatsapp className="text-base" />
              <span>Order</span>
            </a>
          )}
        </div>

        {/* View Details Sublink */}
        <div className="text-center mt-2">
          <Link
            to={`/product/${product.slug}`}
            className="text-xs font-semibold text-[#5C1622] hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
