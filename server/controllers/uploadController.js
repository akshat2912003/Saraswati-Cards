const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const stream = require('stream');
const fs = require('fs');
const path = require('path');

// ── Cloudinary Config ────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
  timeout:    60 * 1000,
});

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );

// ── Local fallback directory ─────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ── Multer — memory storage so we can pipe to Cloudinary ────────────────────
const memoryStorage = multer.memoryStorage();

const imageFileFilter = (req, file, callback) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Only JPEG, JPG, PNG and WEBP images are allowed.'), false);
  }
};

const videoFileFilter = (req, file, callback) => {
  const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (allowed.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error('Only MP4, WebM and MOV videos are allowed.'), false);
  }
};

const uploadMemoryImages = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024, files: 10 },
});

const uploadMemoryVideos = multer({
  storage: memoryStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 100 * 1024 * 1024, files: 5 },
});

// ── Helper: upload buffer → Cloudinary ──────────────────────────────────────
const uploadToCloudinary = (fileBuffer, resourceType) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error('Cloudinary credentials not configured.'));
    }

    const upStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || 'saraswati-cards',
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url || result.url);
      }
    );

    const readable = new stream.PassThrough();
    readable.end(fileBuffer);
    readable.pipe(upStream);
  });
};

// ── Helper: save buffer to local /uploads/ as fallback ──────────────────────
const saveLocally = (fileBuffer, originalName) => {
  const ext = path.extname(originalName) || '.jpg';
  const uniqueName = `img-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);
  fs.writeFileSync(filePath, fileBuffer);
  return `/uploads/${uniqueName}`;
};

// ── POST /api/upload/images ──────────────────────────────────────────────────
const uploadImages = (req, res) => {
  uploadMemoryImages.array('images', 10)(req, res, async (multerError) => {
    if (multerError) {
      let msg = multerError.message;
      if (multerError.code === 'LIMIT_FILE_SIZE') msg = 'Each image must be under 10 MB.';
      if (multerError.code === 'LIMIT_FILE_COUNT') msg = 'Max 10 images allowed at once.';
      return res.status(400).json({ success: false, message: msg });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided for upload.' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      try {
        // ✅ Try Cloudinary first
        const cloudUrl = await uploadToCloudinary(file.buffer, 'image');
        uploadedUrls.push(cloudUrl);
        console.log(`✅ Cloudinary upload success: ${cloudUrl}`);
      } catch (err) {
        // ⚠️ Cloudinary failed — fall back to local storage (never blocks product creation)
        console.warn(`⚠️ Cloudinary upload failed (${err.message}). Using local fallback.`);
        try {
          const localUrl = saveLocally(file.buffer, file.originalname);
          uploadedUrls.push(localUrl);
          console.log(`💾 Saved locally: ${localUrl}`);
        } catch (localErr) {
          console.error('❌ Local save also failed:', localErr.message);
          // Still don't crash — skip this file
        }
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'All image uploads failed. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      count: uploadedUrls.length,
      images: uploadedUrls,
    });
  });
};

// ── POST /api/upload/videos ──────────────────────────────────────────────────
const uploadVideos = (req, res) => {
  uploadMemoryVideos.array('videos', 5)(req, res, async (multerError) => {
    if (multerError) {
      let msg = multerError.message;
      if (multerError.code === 'LIMIT_FILE_SIZE') msg = 'Each video must be under 100 MB.';
      if (multerError.code === 'LIMIT_FILE_COUNT') msg = 'Max 5 videos allowed at once.';
      return res.status(400).json({ success: false, message: msg });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No videos provided for upload.' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      try {
        const cloudUrl = await uploadToCloudinary(file.buffer, 'video');
        uploadedUrls.push(cloudUrl);
        console.log(`✅ Cloudinary video upload success: ${cloudUrl}`);
      } catch (err) {
        console.warn(`⚠️ Cloudinary video upload failed (${err.message}). Using local fallback.`);
        try {
          const localUrl = saveLocally(file.buffer, file.originalname);
          uploadedUrls.push(localUrl);
        } catch (localErr) {
          console.error('❌ Local video save also failed:', localErr.message);
        }
      }
    }

    if (uploadedUrls.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'All video uploads failed. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      count: uploadedUrls.length,
      videos: uploadedUrls,
    });
  });
};

module.exports = { uploadImages, uploadVideos };