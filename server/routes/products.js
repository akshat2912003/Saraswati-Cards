const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  incrementView,
} = require('../controllers/productController');
const { protect } = require('../middleware/auth');

// Middleware: optionally attach admin if token is present (doesn't block if missing)
const optionalAuth = async (req, res, next) => {
  const { protect: protectMiddleware } = require('../middleware/auth');
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    return protectMiddleware(req, res, next);
  }
  next();
};

// GET /api/products         — public (filtered) or admin (all)
router.get('/', optionalAuth, getProducts);

// PATCH /api/products/:slug/view  — must be before /:id routes to avoid conflict
router.patch('/:slug/view', incrementView);

// PATCH /api/products/:id/status
router.patch('/:id/status', protect, updateProductStatus);

// GET /api/products/:slug
router.get('/:slug', getProductBySlug);

// POST /api/products
router.post('/', protect, createProduct);

// PUT /api/products/:id
router.put('/:id', protect, updateProduct);

// DELETE /api/products/:id
router.delete('/:id', protect, deleteProduct);

module.exports = router;
