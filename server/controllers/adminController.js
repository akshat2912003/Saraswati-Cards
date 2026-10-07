const Product = require('../models/Product');
const Category = require('../models/Category');
const { REMOVED_CATEGORY_SLUGS } = require('../utils/removedCategories');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const removedCategories = await Category.find({
      slug: { $in: REMOVED_CATEGORY_SLUGS },
    }).select('_id');
    const visibleProductFilter = {
      category: { $nin: removedCategories.map(({ _id }) => _id) },
    };
    const [
      totalProducts,
      activeProducts,
      outOfStock,
      hidden,
      totalCategories,
      newProducts,
      trendingProducts,
    ] = await Promise.all([
      Product.countDocuments({ ...visibleProductFilter, stockStatus: { $ne: 'deleted' } }),
      Product.countDocuments({ ...visibleProductFilter, stockStatus: 'inStock', isActive: true }),
      Product.countDocuments({ ...visibleProductFilter, stockStatus: 'outOfStock' }),
      Product.countDocuments({ ...visibleProductFilter, stockStatus: 'hidden' }),
      Category.countDocuments({ slug: { $nin: REMOVED_CATEGORY_SLUGS } }),
      Product.countDocuments({ ...visibleProductFilter, isNew: true, stockStatus: { $ne: 'deleted' } }),
      Product.countDocuments({
        ...visibleProductFilter,
        isTrending: true,
        stockStatus: { $ne: 'deleted' },
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        outOfStock,
        hidden,
        totalCategories,
        newProducts,
        trendingProducts,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getStats };
