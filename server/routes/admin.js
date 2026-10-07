const express = require('express');
const router = express.Router();
const { getStats } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

// GET /api/admin/stats
router.get('/stats', protect, getStats);

module.exports = router;
