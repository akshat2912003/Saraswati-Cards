const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    shortDescription: {
      type: String,
      default: '',
      maxlength: 300,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    priceUnit: {
      type: String,
      default: 'per piece',
    },
    images: [
      {
        type: String,
      },
    ],
    videos: [
      {
        type: String,
      },
    ],
    thumbnail: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        lowercase: true,
      },
    ],
    badges: [
      {
        type: String,
        enum: ['Trending', 'Bestseller', 'New', 'Premium', 'Sale', 'Featured'],
      },
    ],
    stockStatus: {
      type: String,
      enum: ['inStock', 'outOfStock', 'hidden', 'deleted'],
      default: 'inStock',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    minimumOrderQuantity: {
      type: Number,
      default: 1,
      min: 1,
    },
    specifications: {
      type: Map,
      of: String,
      default: {},
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    suppressReservedKeysWarning: true,
  }
);

// Text index for search
productSchema.index({
  name: 'text',
  shortDescription: 'text',
  description: 'text',
  tags: 'text',
});

// Regular indexes (slug already has unique: true index)
productSchema.index({ category: 1 });
productSchema.index({ stockStatus: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isTrending: 1 });
productSchema.index({ isNew: 1 });

module.exports = mongoose.model('Product', productSchema);
