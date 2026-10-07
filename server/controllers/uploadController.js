const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const stream = require('stream');

// Ensure local uploads directory exists for reliable fallback
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  timeout: 60 * 1000,
});

const isCloudinaryConfigured = () =>
  Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );

// Memory storage so we can attempt Cloudinary first and fallback to disk if Cloudinary fails
const memoryStorage = multer.memoryStorage();

const imageFileFilter = (req, file, callback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        'Only jpeg, jpg, png, and webp images are allowed.'
      ),
      false
    );
  }
};

const videoFileFilter = (req, file, callback) => {
  const allowedMimeTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(
      new multer.MulterError(
        'LIMIT_UNEXPECTED_FILE',
        'Only MP4, WebM, and MOV videos are allowed.'
      ),
      false
    );
  }
};

const uploadMemoryImages = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

const uploadMemoryVideos = multer({
  storage: memoryStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 5,
  },
});

// Helper: upload single buffer to Cloudinary
const uploadToCloudinary = (fileBuffer, resourceType, originalName) => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryConfigured()) {
      return reject(new Error('Cloudinary credentials not configured.'));
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: process.env.CLOUDINARY_FOLDER || 'saraswati-cards',
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url || result.url);
      }
    );

    const readable = new stream.Readable();
    readable._read = () => {};
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// Helper: save file buffer to local uploads folder as fallback
const saveLocally = (fileBuffer, originalName) => {
  const ext = path.extname(originalName) || '.jpg';
  const uniqueName = `file-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
  const filePath = path.join(uploadsDir, uniqueName);
  fs.writeFileSync(filePath, fileBuffer);
  return `/uploads/${uniqueName}`;
};

// @desc    Upload product images to Cloudinary (with local fallback)
// @route   POST /api/upload/images
// @access  Private
const uploadImages = (req, res) => {
  uploadMemoryImages.array('images', 10)(req, res, async (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        let message = error.message;
        if (error.code === 'LIMIT_FILE_SIZE') message = 'Each image must be under 10 MB.';
        if (error.code === 'LIMIT_FILE_COUNT') message = 'You can upload a maximum of 10 images at once.';
        return res.status(400).json({ success: false, message });
      }
      return res.status(400).json({ success: false, message: error.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No images provided for upload.' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      try {
        // Try uploading to Cloudinary
        const cloudUrl = await uploadToCloudinary(file.buffer, 'image', file.originalname);
        uploadedUrls.push(cloudUrl);
      } catch (err) {
        console.warn(`⚠️ Cloudinary image upload failed (${err.message}). Falling back to local storage.`);
        // Fallback to saving locally so product creation NEVER fails
        const localUrl = saveLocally(file.buffer, file.originalname);
        uploadedUrls.push(localUrl);
      }
    }

    return res.status(200).json({
      success: true,
      count: uploadedUrls.length,
      images: uploadedUrls,
    });
  });
};

// @desc    Upload product videos to Cloudinary (with local fallback)
// @route   POST /api/upload/videos
// @access  Private
const uploadVideos = (req, res) => {
  uploadMemoryVideos.array('videos', 5)(req, res, async (error) => {
    if (error) {
      if (error instanceof multer.MulterError) {
        let message = error.message;
        if (error.code === 'LIMIT_FILE_SIZE') message = 'Each video must be under 100 MB.';
        if (error.code === 'LIMIT_FILE_COUNT') message = 'You can upload a maximum of 5 videos at once.';
        return res.status(400).json({ success: false, message });
      }
      return res.status(400).json({ success: false, message: error.message });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No videos provided for upload.' });
    }

    const uploadedUrls = [];

    for (const file of req.files) {
      try {
        // Try uploading to Cloudinary
        const cloudUrl = await uploadToCloudinary(file.buffer, 'video', file.originalname);
        uploadedUrls.push(cloudUrl);
      } catch (err) {
        console.warn(`⚠️ Cloudinary video upload failed (${err.message}). Falling back to local storage.`);
        // Fallback to saving locally so product creation NEVER fails
        const localUrl = saveLocally(file.buffer, file.originalname);
        uploadedUrls.push(localUrl);
      }
    }

    return res.status(200).json({
      success: true,
      count: uploadedUrls.length,
      videos: uploadedUrls,
    });
  });
};

module.exports = { uploadImages, uploadVideos };
