import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
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
  uploadImages: (formData) =>
    api.post('/upload/images', formData, {
      headers: { 'Content-Type': undefined },
      timeout: 120000,
    }),
  uploadVideos: (formData) =>
    api.post('/upload/videos', formData, {
      headers: { 'Content-Type': undefined },
      timeout: 600000,
    }),
}

export default api
