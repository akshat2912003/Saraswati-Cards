// =============================================================
// SARASWATI CARDS — FRONTEND CONFIGURATION
// =============================================================
// All configurable values for the frontend

export const SHOP_CONFIG = {
  name: 'Saraswati Cards',
  tagline: 'Cards for Every Occasion',
  description:
    'Premium wedding invitation cards, digital invitations, birthday cards, visiting cards, welcome boards and more — based in Prayagraj, UP.',
  address: 'Prayagraj, Uttar Pradesh 212108',
  phone: '+91-9250139863',
  email: 'saraswatipress8@gmail.com',
  city: 'Prayagraj',
  state: 'Uttar Pradesh',
  country: 'India',
  // WhatsApp number: country code + number, NO +, NO spaces
  whatsappNumber: '919250139863',
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  socialLinks: {
    instagram: '',
    facebook: '',
    youtube: '',
  },
}

// WhatsApp URL helpers
export const buildWhatsAppUrl = (message) => {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${SHOP_CONFIG.whatsappNumber}?text=${encoded}`
}

export const buildProductWhatsAppMessage = ({ product, quantity = null }) => {
  const qty = quantity || product.minimumOrderQuantity || 1
  const productUrl = `${SHOP_CONFIG.siteUrl}/product/${product.slug}`
  return `Hello ${SHOP_CONFIG.name},

I am interested in this product:

📌 *Product:* ${product.name}
📂 *Category:* ${product.category?.name || ''}
💰 *Price:* ₹${product.price} ${product.priceUnit || 'per piece'}
📦 *Quantity:* ${qty} ${product.priceUnit?.includes('piece') ? 'pieces' : 'units'}
🔗 *Product Link:* ${productUrl}

Please share more details. Thank you!`
}

export const buildGeneralWhatsAppMessage = () => {
  return `Hello ${SHOP_CONFIG.name},

I would like to know more about your products. 

Please help me find the right design. Thank you!`
}

// API base URL
export const API_BASE = '/api'

// Pagination
export const PAGE_SIZE = 20

// Product stock statuses
export const STOCK_STATUS = {
  IN_STOCK: 'inStock',
  OUT_OF_STOCK: 'outOfStock',
  HIDDEN: 'hidden',
  DELETED: 'deleted',
}

// Badge colors mapping (for display)
export const BADGE_MAP = {
  Trending: 'badge-trending',
  New: 'badge-new',
  Premium: 'badge-premium',
  Bestseller: 'badge-bestseller',
  Sale: 'badge-sale',
  Featured: 'badge-featured',
}

// Category slugs (kept in sync with DB)
export const CATEGORY_SLUGS = {
  WEDDING_CARDS: 'wedding-cards',
  DIGITAL_WEDDING: 'digital-wedding-cards',
  VIDEO_WEDDING: 'video-wedding-cards',
  BIRTHDAY_CARDS: 'birthday-cards',
  WELCOME_BOARDS: 'welcome-boards',
  GIFT_ENVELOPES: 'gift-envelopes',
  VISITING_CARDS: 'visiting-cards',
}
