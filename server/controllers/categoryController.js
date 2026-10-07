const slugify = require('slugify');
const Category = require('../models/Category');
const Product = require('../models/Product');
const { REMOVED_CATEGORY_SLUGS } = require('../utils/removedCategories');

// Helper: generate a URL-safe slug
const makeSlug = (name) =>
  slugify(name, { lower: true, strict: true, trim: true });

// @desc    Get all categories (active only for public; all for admin)
// @route   GET /api/categories
// @access  Public / Private
const getCategories = async (req, res) => {
  try {
    const isAdmin = req.query.all === 'true' && req.admin;
    const filter = {
      slug: { $nin: REMOVED_CATEGORY_SLUGS },
      ...(isAdmin ? {} : { isActive: true }),
    };

    const categories = await Category.find(filter).sort({ order: 1, name: 1 });

    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get single category by slug with product count
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = async (req, res) => {
  try {
    if (REMOVED_CATEGORY_SLUGS.includes(req.params.slug)) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const productCount = await Product.countDocuments({
      category: category._id,
      stockStatus: { $ne: 'deleted' },
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: { ...category.toObject(), productCount },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const { name, description, image, isActive, order } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required.' });
    }

    const slug = makeSlug(name);

    if (REMOVED_CATEGORY_SLUGS.includes(slug)) {
      return res.status(400).json({ success: false, message: 'This category is no longer available.' });
    }

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res
        .status(400)
        .json({ success: false, message: `A category with slug "${slug}" already exists.` });
    }

    const category = await Category.create({
      name,
      slug,
      description: description || '',
      image: image || '',
      isActive: isActive !== undefined ? isActive : true,
      order: order !== undefined ? order : 0,
    });

    res.status(201).json({ success: true, data: category });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: 'Category name or slug already exists.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const { name, description, image, isActive, order } = req.body;

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }
    if (REMOVED_CATEGORY_SLUGS.includes(category.slug)) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    // Regenerate slug only if name changes
    if (name && name !== category.name) {
      const newSlug = makeSlug(name);
      if (REMOVED_CATEGORY_SLUGS.includes(newSlug)) {
        return res.status(400).json({ success: false, message: 'This category is no longer available.' });
      }

      const slugExists = await Category.findOne({
        slug: newSlug,
        _id: { $ne: category._id },
      });
      if (slugExists) {
        return res
          .status(400)
          .json({ success: false, message: `Slug "${newSlug}" is already taken.` });
      }
      category.slug = newSlug;
      category.name = name;
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;
    if (order !== undefined) category.order = order;

    await category.save();

    res.status(200).json({ success: true, data: category });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: 'Category name or slug already exists.' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Delete a category (only if no products exist)
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found.' });
    }

    const productCount = await Product.countDocuments({
      category: category._id,
      stockStatus: { $ne: 'deleted' },
    });

    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} active product(s). Remove or reassign them first.`,
      });
    }

    await category.deleteOne();

    res.status(200).json({ success: true, message: 'Category deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
