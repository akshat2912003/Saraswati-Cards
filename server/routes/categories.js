const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');

// Middleware: optionally attach admin if token is present
const optionalAuth = (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    const { protect: protectFn } = require('../middleware/auth');
    return protectFn(req, res, next);
  }
  next();
};

// GET /api/categories          — ?all=true with token returns inactive too
router.get('/', optionalAuth, getCategories);

// GET /api/categories/:slug
router.get('/:slug', getCategoryBySlug);

// POST /api/categories
router.post('/', protect, createCategory);

// PUT /api/categories/:id
router.put('/:id', protect, updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', protect, deleteCategory);

module.exports = router;
