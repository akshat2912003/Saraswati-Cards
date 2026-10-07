const express = require('express');
const router = express.Router();
const { uploadImages, uploadVideos } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// POST /api/upload/images
router.post('/images', protect, uploadImages);
router.post('/videos', protect, uploadVideos);

module.exports = router;
