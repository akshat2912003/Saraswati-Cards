import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import {
  FaWhatsapp,
  FaMinus,
  FaPlus,
  FaCheck,
  FaTimes,
  FaSearchPlus,
  FaSearchMinus,
} from 'react-icons/fa'
import { HiOutlineShare } from 'react-icons/hi'
import ProductGrid from '../../components/product/ProductGrid'
import { productAPI } from '../../services/api'
import { buildProductWhatsAppMessage, buildWhatsAppUrl, SHOP_CONFIG } from '../../config/shop'
import toast from 'react-hot-toast'

const getMinimumOrderQuantity = (product) => {
  const categorySlug = product.category?.slug
  const isPrintedInvitationCard =
    product.priceUnit?.toLowerCase().includes('piece') &&
    ['wedding-cards', 'birthday-cards'].includes(categorySlug)

  return isPrintedInvitationCard ? 100 : product.minimumOrderQuantity || 1
}

const getQuantityStep = (product, minOrder) => {
  const isPrintedInvitationCard =
    product.priceUnit?.toLowerCase().includes('piece') &&
    ['wedding-cards', 'birthday-cards'].includes(product.category?.slug)

  return isPrintedInvitationCard ? 50 : minOrder > 1 ? minOrder : 1
}

const ProductDetailPage = () => {
  const { slug } = useParams()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState('')
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false)
  const [imageZoom, setImageZoom] = useState(1)

  // Fetch Product — API returns { success, data: product }
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productAPI.getBySlug(slug).then((res) => res.data.data),
  })

  useEffect(() => {
    if (product) {
      const minOrder = getMinimumOrderQuantity(product)
      setQuantity(minOrder)
      const mainImg =
        product.category?.slug === 'video-wedding-cards'
          ? product.videos?.[0] || ''
          : product.thumbnail || product.images?.[0] || ''
      setActiveImage(mainImg)
      // Increment view count silently
      productAPI.incrementView(slug).catch(() => {})
    }
  }, [product, slug])

  useEffect(() => {
    if (!isImageViewerOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsImageViewerOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isImageViewerOpen])

  // Related products — API returns { success, data: [] }
  const { data: relatedData } = useQuery({
    queryKey: ['products', 'related', product?.category?.slug],
    queryFn: () =>
      productAPI
        .getAll({ category: product?.category?.slug, limit: 7 })
        .then((res) => res.data.data || []),
    enabled: !!product?.category?.slug,
  })
  const relatedProducts = (relatedData || []).filter((p) => p.slug !== slug).slice(0, 6)

  // ── Loading Skeleton ─────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="bg-[#FAF7F2] min-h-screen py-4 px-4">
        {/* Breadcrumb skeleton */}
        <div className="skeleton h-4 w-48 rounded mb-6" />
        {/* Image skeleton */}
        <div className="skeleton w-full aspect-[4/3] rounded-2xl mb-4" />
        {/* Thumbnails skeleton */}
        <div className="flex gap-2 mb-6">
          {[1,2,3].map(i => <div key={i} className="skeleton w-16 h-16 rounded-xl" />)}
        </div>
        {/* Badges skeleton */}
        <div className="flex gap-2 mb-3">
          <div className="skeleton h-6 w-24 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        {/* Name skeleton */}
        <div className="skeleton h-8 w-3/4 rounded mb-2" />
        <div className="skeleton h-8 w-1/2 rounded mb-4" />
        {/* Price skeleton */}
        <div className="skeleton h-10 w-32 rounded mb-6" />
        {/* WhatsApp button skeleton */}
        <div className="skeleton h-14 w-full rounded-2xl" />
      </div>
    )
  }

  // ── Not Found ────────────────────────────────────────────────
  if (isError || !product) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="text-6xl mb-4">😔</div>
        <h2 className="text-2xl font-serif font-bold text-gray-800 mb-2">Product Not Found</h2>
        <p className="text-sm text-gray-500 mb-6">
          The card you are looking for does not exist or has been removed.
        </p>
        <Link
          to="/products"
          className="bg-[#5C1622] text-white font-semibold px-6 py-3 rounded-xl text-sm"
        >
          Browse All Products
        </Link>
      </div>
    )
  }

  const isOutOfStock = product.stockStatus === 'outOfStock'
  const minOrder = getMinimumOrderQuantity(product)
  const quantityStep = getQuantityStep(product, minOrder)
  const isVideoProduct = product.category?.slug === 'video-wedding-cards'
  const mediaList = isVideoProduct ? product.videos || [] : product.images?.length
    ? product.images
    : ['https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80']

  const handleQtyChange = (delta) => {
    const newQty = quantity + delta * quantityStep
    if (newQty >= minOrder) setQuantity(newQty)
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  const openImageViewer = () => {
    setImageZoom(1)
    setIsImageViewerOpen(true)
  }

  const whatsappUrl = buildWhatsAppUrl(buildProductWhatsAppMessage({ product, quantity }))
  const askAvailabilityUrl = buildWhatsAppUrl(
    `Hello ${SHOP_CONFIG.name}, I am interested in "${product.name}" but it shows out of stock. Please let me know when it is available again.`
  )

  // Feature highlights
  const features = [
    'Custom name & date printing included',
    'Sample proof sent on WhatsApp before printing',
    'Premium quality paper stock',
    'All India delivery available',
  ]

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Saraswati Cards`}</title>
        <meta
          name="description"
          content={
            product.shortDescription ||
            `${product.name} — ₹${product.price} ${product.priceUnit}. Order on WhatsApp.`
          }
        />
        <meta property="og:title" content={product.name} />
        {!isVideoProduct && <meta property="og:image" content={activeImage || mediaList[0]} />}
      </Helmet>

      <div className="bg-[#FAF7F2] min-h-screen">

        {/* ── Breadcrumb ─────────────────────────────────────── */}
        <div className="px-4 pt-4 pb-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-[#5C1622]">Home</Link>
          {' / '}
          {product.category && (
            <>
              <Link to={`/category/${product.category.slug}`} className="hover:text-[#5C1622]">
                {product.category.name}
              </Link>
              {' / '}
            </>
          )}
          <span className="text-gray-700 font-medium">{product.name}</span>
        </div>

        <div className="px-4 pb-4 max-w-2xl mx-auto lg:max-w-5xl">

          {/* ── DESKTOP: Side-by-side / Mobile: Stacked ────── */}
          <div className="lg:grid lg:grid-cols-2 lg:gap-10 lg:items-start">

            {/* ── LEFT: Image Gallery ──────────────────────── */}
            <div>
              {/* Main Image */}
              <div className={`relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-gray-100 ${isVideoProduct ? 'bg-black' : 'bg-[#F1ECE3]'}`}>
                {isVideoProduct ? (
                  activeImage ? (
                    <video
                      key={activeImage}
                      src={activeImage}
                      controls
                      playsInline
                      preload="metadata"
                      className="h-full w-full object-contain"
                    >
                      Your browser does not support video playback.
                    </video>
                  ) : (
                    <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white">
                      No invitation video has been added yet.
                    </div>
                  )
                ) : (
                  <button
                    type="button"
                    onClick={openImageViewer}
                    className="block h-full w-full cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-[#D49E43]"
                    aria-label={`Enlarge image of ${product.name}`}
                  >
                    <img
                      src={activeImage || mediaList[0]}
                      alt={product.name}
                      className="h-full w-full object-contain"
                      onError={(e) => {
                        e.target.src =
                          'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80'
                      }}
                    />
                    <span className="absolute bottom-3 left-3 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white">
                      Tap to enlarge
                    </span>
                  </button>
                )}
                {/* Out of stock overlay */}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-gray-800 font-bold text-sm px-4 py-2 rounded-full shadow">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnails strip */}
              {mediaList.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {mediaList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        (activeImage || mediaList[0]) === img
                          ? 'border-[#5C1622] scale-95'
                          : 'border-gray-200 opacity-65 hover:opacity-100'
                      }`}
                    >
                      {isVideoProduct ? (
                        <video src={img} muted preload="metadata" className="h-full w-full bg-black object-cover" />
                      ) : (
                        <img src={img} alt="" className="h-full w-full bg-[#F1ECE3] object-contain" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Badges row (below thumbnails) */}
              {product.badges && product.badges.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className="bg-[#5C1622] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* ── RIGHT: Product Info ───────────────────────── */}
            <div className="mt-5 lg:mt-0">

              {/* Product Name */}
              <h1 className="font-serif font-bold text-gray-900 text-2xl sm:text-3xl leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price row */}
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl sm:text-4xl font-bold text-[#5C1622]">
                  ₹{product.price}
                </span>
                <span className="text-sm text-gray-500">/ {product.priceUnit || 'piece'}</span>
              </div>

              {/* In stock / Out of stock indicator */}
              <p className={`text-sm font-semibold mb-4 ${isOutOfStock ? 'text-red-500' : 'text-[#1D9A52]'}`}>
                {isOutOfStock ? '✕ Out of Stock' : '✓ In stock'}
              </p>

              {/* Short description */}
              {product.shortDescription && (
                <p className="text-sm text-gray-600 mb-5 leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Feature checklist with gold checkmarks */}
              <div className="space-y-2 mb-6">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="text-[#D49E43] mt-0.5 flex-shrink-0 font-bold text-base">✓</span>
                    <span className="text-sm text-gray-700">{feat}</span>
                  </div>
                ))}
                {/* Extra specs from product if any */}
                {product.specifications && typeof product.specifications === 'object' &&
                  Object.entries(product.specifications).map(([key, val]) => (
                    <div key={key} className="flex items-start gap-2.5">
                      <span className="text-[#D49E43] mt-0.5 flex-shrink-0 font-bold text-base">✓</span>
                      <span className="text-sm text-gray-700">
                        <span className="font-medium">{key}:</span> {val}
                      </span>
                    </div>
                  ))
                }
              </div>

              {/* Quantity Selector */}
              {!isOutOfStock && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-3">
                    Quantity
                  </label>
                  <div className="flex items-center gap-0">
                    <button
                      onClick={() => handleQtyChange(-1)}
                      disabled={quantity <= minOrder}
                      className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-l-xl text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base font-bold"
                      aria-label="Decrease quantity"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10)
                        if (!isNaN(v) && v >= minOrder && (v - minOrder) % quantityStep === 0) {
                          setQuantity(v)
                        }
                      }}
                      className="w-16 h-11 text-center font-bold text-gray-900 border-t border-b border-gray-200 focus:outline-none text-base bg-white"
                      min={minOrder}
                      step={quantityStep}
                    />
                    <button
                      onClick={() => handleQtyChange(1)}
                      className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-r-xl text-gray-600 hover:bg-gray-50 transition-colors text-base font-bold"
                      aria-label="Increase quantity"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Minimum order: {minOrder} {product.priceUnit?.includes('piece') ? 'pieces' : 'units'}</p>
                </div>
              )}

              {/* WhatsApp Order Button */}
              {isOutOfStock ? (
                <div className="space-y-3">
                  <div className="bg-amber-50 border border-amber-100 text-amber-700 rounded-xl px-4 py-3 text-xs">
                    This item is currently out of stock.
                  </div>
                  <a
                    href={askAvailabilityUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-[#1D9A52] hover:bg-[#178946] text-white font-bold py-4 rounded-2xl text-base shadow-md transition-colors"
                  >
                    <FaWhatsapp className="text-2xl" />
                    <span>Ask Availability on WhatsApp</span>
                  </a>
                </div>
              ) : (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 w-full bg-[#1D9A52] hover:bg-[#178946] text-white font-bold py-4 rounded-2xl text-base shadow-md transition-colors"
                >
                  <FaWhatsapp className="text-2xl" />
                  <span>Order on WhatsApp</span>
                </a>
              )}

              {/* Share link */}
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 mt-4 mx-auto w-full"
              >
                <HiOutlineShare />
                <span>Share this product</span>
              </button>
            </div>
          </div>

          {isImageViewerOpen && !isVideoProduct && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
              role="dialog"
              aria-modal="true"
              aria-label={`Image viewer for ${product.name}`}
              onClick={() => setIsImageViewerOpen(false)}
            >
              <div className="absolute right-4 top-4 z-10 flex items-center gap-2 rounded-full bg-black/60 p-2 text-white sm:right-6 sm:top-6">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setImageZoom((zoom) => Math.max(1, zoom - 0.5))
                  }}
                  disabled={imageZoom <= 1}
                  className="rounded-full p-2 hover:bg-white/15 disabled:opacity-40"
                  aria-label="Zoom out"
                >
                  <FaSearchMinus />
                </button>
                <span className="min-w-12 text-center text-xs">{Math.round(imageZoom * 100)}%</span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setImageZoom((zoom) => Math.min(3, zoom + 0.5))
                  }}
                  disabled={imageZoom >= 3}
                  className="rounded-full p-2 hover:bg-white/15 disabled:opacity-40"
                  aria-label="Zoom in"
                >
                  <FaSearchPlus />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    setIsImageViewerOpen(false)
                  }}
                  className="rounded-full p-2 hover:bg-white/15"
                  aria-label="Close image viewer"
                >
                  <FaTimes />
                </button>
              </div>

              <div
                className="h-[85vh] w-[90vw] overflow-auto"
                onClick={(event) => event.stopPropagation()}
              >
                <img
                  src={activeImage || mediaList[0]}
                  alt={product.name}
                  className="h-full w-full object-contain transition-transform duration-200"
                  style={{ transform: `scale(${imageZoom})` }}
                />
              </div>
              <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center text-xs text-white/75">
                Use zoom controls to inspect the image · Press Esc to close
              </p>
            </div>
          )}

          {/* ── Description ──────────────────────────────────── */}
          {product.description && (
            <div className="mt-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-serif font-bold text-gray-900 text-lg mb-3">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* ── Related Products ──────────────────────────────── */}
          {relatedProducts.length > 0 && (
            <div className="mt-10">
              <h2 className="font-serif font-bold text-[#5C1622] text-2xl mb-5">
                You May Also Like
              </h2>
              <ProductGrid products={relatedProducts} />
            </div>
          )}

        </div>
      </div>
    </>
  )
}

export default ProductDetailPage
