const express = require('express');
const router = express.Router();
const { uploadImages, uploadVideos, getSignature } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// GET /api/upload/signature (for direct client-to-Cloudinary upload, bypassing serverless body limits)
router.get('/signature', protect, getSignature);

// POST /api/upload/images
router.post('/images', protect, uploadImages);

// POST /api/upload/videos
router.post('/videos', protect, uploadVideos);

module.exports = router;
