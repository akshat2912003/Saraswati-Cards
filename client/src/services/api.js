import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT token for admin requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sc_admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // If sending FormData, remove Content-Type so browser sets multipart/form-data with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sc_admin_token')
      // Only redirect if we're in admin area
      if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login'
      }
    }
    return Promise.reject(error)
  }
)

// ─── Products ───────────────────────────────────────────────

export const productAPI = {
  getAll: (params = {}) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  updateStatus: (id, status) => api.patch(`/products/${id}/status`, { stockStatus: status }),
  incrementView: (slug) => api.patch(`/products/${slug}/view`),
}

// ─── Categories ─────────────────────────────────────────────

export const categoryAPI = {
  getAll: (params = {}) => api.get('/categories', { params }),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

// ─── Admin Auth ──────────────────────────────────────────────

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
}

// ─── Admin Stats ─────────────────────────────────────────────

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
}

// ─── Upload ──────────────────────────────────────────────────

export const uploadAPI = {
  getSignature: () => api.get('/upload/signature'),

  uploadImages: async (formDataOrFiles, onProgress) => {
    // 1. Try direct signed upload to Cloudinary (bypasses serverless body size limits)
    try {
      const sigRes = await api.get('/upload/signature')
      if (sigRes.data?.success && sigRes.data?.signature) {
        const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data
        const files =
          formDataOrFiles instanceof FormData
            ? formDataOrFiles.getAll('images')
            : Array.isArray(formDataOrFiles)
            ? formDataOrFiles
            : [formDataOrFiles]

        const validFiles = files.filter((f) => f instanceof File)

        if (validFiles.length > 0) {
          const uploadPromises = validFiles.map(async (file, idx) => {
            const cldFormData = new FormData()
            cldFormData.append('file', file)
            cldFormData.append('api_key', apiKey)
            cldFormData.append('timestamp', timestamp)
            cldFormData.append('signature', signature)
            if (folder) cldFormData.append('folder', folder)

            const res = await axios.post(
              `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
              cldFormData,
              {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 300000,
                onUploadProgress: (progressEvent) => {
                  if (onProgress && progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    onProgress(percent, idx, file.name)
                  }
                },
              }
            )
            return res.data.secure_url || res.data.url
          })

          const uploadedUrls = await Promise.all(uploadPromises)
          return { data: { success: true, count: uploadedUrls.length, images: uploadedUrls } }
        }
      }
    } catch (directErr) {
      console.warn('Direct Cloudinary image upload fallback to server:', directErr)
    }

    // 2. Fallback to server endpoint
    const formData = formDataOrFiles instanceof FormData ? formDataOrFiles : new FormData()
    if (!(formDataOrFiles instanceof FormData)) {
      const files = Array.isArray(formDataOrFiles) ? formDataOrFiles : [formDataOrFiles]
      files.forEach((f) => formData.append('images', f))
    }
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': undefined },
      timeout: 120000,
    })
  },

  uploadVideos: async (formDataOrFiles, onProgress) => {
    // 1. Try direct upload to Cloudinary (bypasses Vercel 4.5MB Serverless Function payload limit!)
    try {
      const sigRes = await api.get('/upload/signature')
      if (sigRes.data?.success && sigRes.data?.signature) {
        const { timestamp, signature, apiKey, cloudName, folder } = sigRes.data
        const files =
          formDataOrFiles instanceof FormData
            ? formDataOrFiles.getAll('videos')
            : Array.isArray(formDataOrFiles)
            ? formDataOrFiles
            : [formDataOrFiles]

        const validFiles = files.filter((f) => f instanceof File)

        if (validFiles.length > 0) {
          const uploadPromises = validFiles.map(async (file, idx) => {
            const cldFormData = new FormData()
            cldFormData.append('file', file)
            cldFormData.append('api_key', apiKey)
            cldFormData.append('timestamp', timestamp)
            cldFormData.append('signature', signature)
            if (folder) cldFormData.append('folder', folder)

            const res = await axios.post(
              `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
              cldFormData,
              {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 600000,
                onUploadProgress: (progressEvent) => {
                  if (onProgress && progressEvent.total) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    onProgress(percent, idx, file.name)
                  }
                },
              }
            )
            return res.data.secure_url || res.data.url
          })

          const uploadedUrls = await Promise.all(uploadPromises)
          return { data: { success: true, count: uploadedUrls.length, videos: uploadedUrls } }
        }
      }
    } catch (directErr) {
      console.warn('Direct Cloudinary video upload failed, falling back to server route:', directErr)
      if (directErr.response?.data?.error?.message) {
        throw new Error(`Cloudinary error: ${directErr.response.data.error.message}`)
      }
    }

    // 2. Fallback to server endpoint
    const formData = formDataOrFiles instanceof FormData ? formDataOrFiles : new FormData()
    if (!(formDataOrFiles instanceof FormData)) {
      const files = Array.isArray(formDataOrFiles) ? formDataOrFiles : [formDataOrFiles]
      files.forEach((f) => formData.append('videos', f))
    }
    try {
      return await api.post('/upload/videos', formData, {
        headers: { 'Content-Type': undefined },
        timeout: 600000,
      })
    } catch (err) {
      if (err.response?.status === 413 || err.message?.includes('413')) {
        throw new Error(
          'Video file exceeds Vercel 4.5MB payload limit. Please ensure Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are added to your Vercel project settings, or paste a video URL.'
        )
      }
      throw err
    }
  },
}

export default api
