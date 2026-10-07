import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth.jsx'

// Layouts
import PublicLayout from './components/layout/PublicLayout.jsx'
import AdminLayout from './components/layout/AdminLayout.jsx'

// Public pages (lazy loaded)
const HomePage = React.lazy(() => import('./pages/public/HomePage.jsx'))
const AllProductsPage = React.lazy(() => import('./pages/public/AllProductsPage.jsx'))
const CategoryPage = React.lazy(() => import('./pages/public/CategoryPage.jsx'))
const ProductDetailPage = React.lazy(() => import('./pages/public/ProductDetailPage.jsx'))
const AboutPage = React.lazy(() => import('./pages/public/AboutPage.jsx'))
const ContactPage = React.lazy(() => import('./pages/public/ContactPage.jsx'))
const CustomDesignPage = React.lazy(() => import('./pages/public/CustomDesignPage.jsx'))
const NotFoundPage = React.lazy(() => import('./pages/public/NotFoundPage.jsx'))

// Admin pages (lazy loaded)
const AdminLoginPage = React.lazy(() => import('./pages/admin/AdminLoginPage.jsx'))
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard.jsx'))
const AdminProductsPage = React.lazy(() => import('./pages/admin/AdminProductsPage.jsx'))
const AdminAddProductPage = React.lazy(() => import('./pages/admin/AdminAddProductPage.jsx'))
const AdminEditProductPage = React.lazy(() => import('./pages/admin/AdminEditProductPage.jsx'))
const AdminCategoriesPage = React.lazy(() => import('./pages/admin/AdminCategoriesPage.jsx'))

// Full-page spinner
const FullPageSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-brand-100 border-t-brand-700 rounded-full animate-spin" />
      <p className="text-sm text-gray-500 font-medium">Loading…</p>
    </div>
  </div>
)

// Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 border-4 border-brand-100 border-t-brand-700 rounded-full animate-spin" />
  </div>
)

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return <FullPageSpinner />
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  return children
}

export default function App() {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/custom-design" element={<CustomDesignPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Admin login — no layout */}
        <Route
          path="/admin/login"
          element={
            <React.Suspense fallback={<PageLoader />}>
              <AdminLoginPage />
            </React.Suspense>
          }
        />

        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="products/add" element={<AdminAddProductPage />} />
          <Route path="products/edit/:id" element={<AdminEditProductPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
        </Route>
      </Routes>
    </React.Suspense>
  )
}
