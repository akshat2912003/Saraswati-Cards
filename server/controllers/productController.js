const slugify = require('slugify');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { REMOVED_CATEGORY_SLUGS } = require('../utils/removedCategories');

// Helper: generate URL-safe slug
const makeSlug = (name) =>
  slugify(name, { lower: true, strict: true, trim: true });

// Helper: build a unique slug (appends counter if needed)
const uniqueSlug = async (base, excludeId = null) => {
  let slug = base;
  let counter = 1;
  while (true) {
    const filter = { slug };
    if (excludeId) filter._id = { $ne: excludeId };
    const existing = await Product.findOne(filter);
    if (!existing) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
};

// @desc    Get all products with filtering, searching, sorting, and pagination
// @route   GET /api/products
// @access  Public / Private
const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      page = 1,
      limit = 20,
      stockStatus,
      isFeatured,
      isTrending,
      isNew,
      sort = 'newest',
    } = req.query;

    const isAdmin = !!req.admin;
    const filter = {};

    // Public users only see active, inStock products
    if (!isAdmin) {
      filter.stockStatus = 'inStock';
      filter.isActive = true;
    } else {
      filter.stockStatus = stockStatus || { $ne: 'deleted' };
    }

    // Boolean & Badge flags
    if (isFeatured === 'true') {
      filter.$or = [{ isFeatured: true }, { badges: 'Featured' }];
    }
    if (isTrending === 'true') {
      filter.$or = [{ isTrending: true }, { badges: 'Trending' }];
    }
    if (isNew === 'true') {
      filter.$or = [{ isNew: true }, { badges: 'New' }];
    }

    // Category filter (by slug or ObjectId)
    if (category) {
      const isObjectId = /^[a-f\d]{24}$/i.test(category);
      if (isObjectId) {
        const selectedCategory = await Category.findById(category).select('slug');
        if (!selectedCategory || REMOVED_CATEGORY_SLUGS.includes(selectedCategory.slug)) {
          return res.status(200).json({ success: true, count: 0, total: 0, page: 1, pages: 0, data: [] });
        }
        filter.category = selectedCategory._id;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat && !REMOVED_CATEGORY_SLUGS.includes(cat.slug)) {
          filter.category = cat._id;
        } else {
          // No matching category → return empty
          return res.status(200).json({ success: true, count: 0, total: 0, page: 1, pages: 0, data: [] });
        }
      }
    } else {
      const removedCategories = await Category.find({ slug: { $in: REMOVED_CATEGORY_SLUGS } }).select('_id');
      filter.category = { $nin: removedCategories.map(({ _id }) => _id) };
    }

    // Text search
    let useTextSearch = false;
    if (search && search.trim()) {
      filter.$text = { $search: search.trim() };
      useTextSearch = true;
    }

    // Sorting
    let sortOption = {};
    if (useTextSearch) {
      sortOption = { score: { $meta: 'textScore' } };
    } else {
      switch (sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'newest':
        default:
          sortOption = { createdAt: -1 };
          break;
      }
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const projection = useTextSearch ? { score: { $meta: 'textScore' } } : {};

    const [products, total] = await Promise.all([
      Product.find(filter, projection)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: products,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single product by slug, increment view count
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug, stockStatus: { $ne: 'deleted' }, isActive: true },
      { $inc: { viewCount: 1 } },
      { new: true }
    ).populate('category', 'name slug description');

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    if (REMOVED_CATEGORY_SLUGS.includes(product.category?.slug)) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      priceUnit,
      shortDescription,
      description,
      images,
      videos,
      thumbnail,
      tags,
      badges,
      stockStatus,
      isFeatured,
      isTrending,
      isNew,
      isActive,
      minimumOrderQuantity,
      specifications,
    } = req.body;

    if (!name || !category || price === undefined) {
      return res
        .status(400)
        .json({ success: false, message: 'name, category, and price are required.' });
    }

    // Verify category exists
    const cat = await Category.findById(category);
    if (!cat) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }
    if (REMOVED_CATEGORY_SLUGS.includes(cat.slug)) {
      return res.status(400).json({ success: false, message: 'This category is no longer available.' });
    }
    if (cat.slug === 'video-wedding-cards' && (images?.length || !videos?.length)) {
      return res.status(400).json({
        success: false,
        message: 'Video wedding card products must include at least one video and cannot include images.',
      });
    }
    if (cat.slug !== 'video-wedding-cards' && videos?.length) {
      return res.status(400).json({
        success: false,
        message: 'Videos can only be added to video wedding card products.',
      });
    }

    const baseSlug = makeSlug(name);
    const slug = await uniqueSlug(baseSlug);

    const badgesList = Array.isArray(badges) ? badges : [];
    const trendingVal = Boolean(isTrending || badgesList.includes('Trending'));
    const featuredVal = Boolean(isFeatured || badgesList.includes('Featured'));
    const newVal = isNew !== undefined ? Boolean(isNew || badgesList.includes('New')) : (badgesList.includes('New') || true);

    const product = await Product.create({
      name,
      slug,
      category,
      price,
      priceUnit: priceUnit || 'per piece',
      shortDescription: shortDescription || '',
      description: description || '',
      images: images || [],
      videos: videos || [],
      thumbnail: thumbnail || '',
      tags: tags || [],
      badges: badgesList,
      stockStatus: stockStatus || 'inStock',
      isFeatured: featuredVal,
      isTrending: trendingVal,
      isNew: newVal,
      isActive: isActive !== undefined ? isActive : true,
      minimumOrderQuantity: minimumOrderQuantity || 1,
      specifications: specifications || {},
    });

    res.status(201).json({ success: true, data: product });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Product slug must be unique.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const allowedFields = [
      'name',
      'category',
      'price',
      'priceUnit',
      'shortDescription',
      'description',
      'images',
      'videos',
      'thumbnail',
      'tags',
      'badges',
      'stockStatus',
      'isFeatured',
      'isTrending',
      'isNew',
      'isActive',
      'minimumOrderQuantity',
      'specifications',
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    }

    const categoryId = req.body.category || product.category;
    const category = await Category.findById(categoryId).select('slug');
    if (!category || REMOVED_CATEGORY_SLUGS.includes(category.slug)) {
      return res.status(400).json({ success: false, message: 'Invalid category ID.' });
    }
    if (category.slug === 'video-wedding-cards') {
      const videos = req.body.videos !== undefined ? req.body.videos : product.videos;
      const images = req.body.images !== undefined ? req.body.images : product.images;
      if (images.length || !videos.length) {
        return res.status(400).json({
          success: false,
          message: 'Video wedding card products must include at least one video and cannot include images.',
        });
      }
    } else {
      const videos = req.body.videos !== undefined ? req.body.videos : product.videos;
      if (videos.length) {
        return res.status(400).json({
          success: false,
          message: 'Videos can only be added to video wedding card products.',
        });
      }
      product.videos = [];
    }

    // Regenerate slug if name changed
    if (req.body.name && req.body.name !== product.name) {
      const baseSlug = makeSlug(req.body.name);
      product.slug = await uniqueSlug(baseSlug, product._id);
    }

    await product.save();

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Product slug must be unique.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Permanently delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    return res.status(200).json({ success: true, message: 'Product deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update product stockStatus
// @route   PATCH /api/products/:id/status
// @access  Private
const updateProductStatus = async (req, res) => {
  try {
    const { stockStatus } = req.body;
    const validStatuses = ['inStock', 'outOfStock', 'hidden', 'deleted'];

    if (!stockStatus || !validStatuses.includes(stockStatus)) {
      return res.status(400).json({
        success: false,
        message: `stockStatus must be one of: ${validStatuses.join(', ')}.`,
      });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { stockStatus },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({ success: true, data: product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Increment viewCount by 1 (standalone endpoint)
// @route   PATCH /api/products/:slug/view
// @access  Public
const incrementView = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      { $inc: { viewCount: 1 } },
      { new: true, select: 'slug viewCount' }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    res.status(200).json({ success: true, data: { slug: product.slug, viewCount: product.viewCount } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  incrementView,
};
