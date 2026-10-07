import React from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiOutlineCube, HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineFolder, HiOutlinePlus } from 'react-icons/hi'
import { adminAPI, productAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => adminAPI.getStats().then((res) => res.data.stats),
  })

  const { data: recentProducts, isLoading: productsLoading, refetch } = useQuery({
    queryKey: ['admin', 'recentProducts'],
    queryFn: () => productAPI.getAll({ limit: 10 }).then((res) => res.data.data),
  })

  const handleStatusToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'inStock' ? 'outOfStock' : 'inStock'
    try {
      await productAPI.updateStatus(id, nextStatus)
      toast.success(`Product marked as ${nextStatus}`)
      refetch()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const statCards = [
    { title: 'Total Products', value: stats?.totalProducts || 0, icon: HiOutlineCube, color: 'text-blue-600 bg-blue-50' },
    { title: 'In Stock', value: stats?.activeProducts || 0, icon: HiOutlineCheckCircle, color: 'text-emerald-600 bg-emerald-50' },
    { title: 'Out of Stock', value: stats?.outOfStock || 0, icon: HiOutlineExclamationCircle, color: 'text-amber-600 bg-amber-50' },
    { title: 'Categories', value: stats?.totalCategories || 0, icon: HiOutlineFolder, color: 'text-purple-600 bg-purple-50' },
  ]

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Saraswati Cards</title>
      </Helmet>

      <div>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-xs text-gray-500 mt-1">Manage your catalog, products, and categories</p>
          </div>

          <Link to="/admin/products/add" className="btn-primary text-xs py-2.5 px-4 self-start sm:self-auto">
            <HiOutlinePlus className="text-base" /> Add New Product
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => {
            const Icon = card.icon
            return (
              <div key={i} className="bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${card.color}`}>
                  <Icon />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{statsLoading ? '...' : card.value}</div>
                  <div className="text-xs font-medium text-gray-500">{card.title}</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Products Table */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 text-sm">Recent Catalog Products</h2>
            <Link to="/admin/products" className="text-xs text-brand-700 font-semibold hover:underline">
              View All Products &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {productsLoading ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">Loading products...</td>
                  </tr>
                ) : recentProducts?.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-gray-400">No products added yet.</td>
                  </tr>
                ) : (
                  recentProducts?.map((prod) => (
                    <tr key={prod._id} className="hover:bg-gray-50/50">
                      <td className="py-3 px-4 flex items-center gap-3">
                        {prod.category?.slug === 'video-wedding-cards' && prod.videos?.[0] ? (
                          <video src={prod.videos[0]} muted preload="metadata" className="h-10 w-10 rounded-lg bg-black object-cover" />
                        ) : (
                          <img
                            src={prod.thumbnail || (prod.images && prod.images[0]) || '/placeholder-card.jpg'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          />
                        )}
                        <div>
                          <div className="font-semibold text-gray-900 line-clamp-1">{prod.name}</div>
                          <div className="text-[10px] text-gray-400">MOQ: {prod.minimumOrderQuantity}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{prod.category?.name || '-'}</td>
                      <td className="py-3 px-4 font-semibold text-brand-700">₹{prod.price} <span className="text-[10px] font-normal text-gray-400">/ {prod.priceUnit}</span></td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.stockStatus === 'inStock' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {prod.stockStatus === 'inStock' ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => handleStatusToggle(prod._id, prod.stockStatus)}
                          className="text-[11px] font-medium text-gray-600 hover:text-brand-700 border border-gray-200 px-2 py-1 rounded"
                        >
                          Toggle Stock
                        </button>
                        <Link
                          to={`/admin/products/edit/${prod._id}`}
                          className="text-[11px] font-medium text-brand-700 hover:underline border border-brand-200 px-2 py-1 rounded bg-brand-50"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminDashboard
