import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineSearch } from 'react-icons/hi'
import { productAPI, categoryAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AdminProductsPage = () => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const queryClient = useQueryClient()

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll().then((res) => res.data.data || []),
  })

  const { data: productsData, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'products', { search, selectedCategory, page }],
    queryFn: () =>
      productAPI
        .getAll({
          search,
          category: selectedCategory,
          page,
          limit: 15,
          admin: true,
        })
        .then((res) => res.data),
  })

  const products = productsData?.data || []
  const totalPages = productsData?.pages || 1

  const handleStatusChange = async (id, status) => {
    try {
      await productAPI.updateStatus(id, status)
      toast.success(`Product status updated to ${status}`)
      refetch()
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await productAPI.delete(id)
        toast.success('Product removed successfully')
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
          queryClient.invalidateQueries({ queryKey: ['products'] }),
          queryClient.invalidateQueries({ queryKey: ['product'] }),
        ])
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete product')
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Products | Saraswati Cards Admin</title>
      </Helmet>

      <div>
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Product Catalog Management</h1>
            <p className="text-xs text-gray-500 mt-1">Add, edit, toggle stock, or hide products from the public store</p>
          </div>

          <Link to="/admin/products/add" className="btn-primary text-xs py-2.5 px-4 self-start sm:self-auto">
            <HiOutlinePlus className="text-base" /> Add New Product
          </Link>
        </div>

        {/* Filters bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <HiOutlineSearch className="absolute left-3 top-3 text-gray-400 text-base" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or tags..."
              className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-700"
          >
            <option value="">All Categories</option>
            {categoriesData?.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Badges</th>
                  <th className="py-3 px-4">Stock Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">Loading product list...</td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">No products found matching filters.</td>
                  </tr>
                ) : (
                  products.map((p) => (
                    <tr key={p._id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-4">
                        {p.category?.slug === 'video-wedding-cards' && p.videos?.[0] ? (
                          <video src={p.videos[0]} muted preload="metadata" className="h-10 w-10 rounded-lg bg-black object-cover" />
                        ) : (
                          <img
                            src={p.thumbnail || (p.images && p.images[0]) || '/placeholder-card.jpg'}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200"
                          />
                        )}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-gray-900 max-w-xs">
                        <div className="truncate">{p.name}</div>
                        <div className="text-[10px] text-gray-400 font-normal">MOQ: {p.minimumOrderQuantity}</div>
                      </td>
                      <td className="py-2.5 px-4 text-gray-600">{p.category?.name || '-'}</td>
                      <td className="py-2.5 px-4 font-bold text-brand-700">₹{p.price} <span className="text-[10px] text-gray-400 font-normal">/ {p.priceUnit}</span></td>
                      <td className="py-2.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.badges?.map((b) => (
                            <span key={b} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                              {b}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-4">
                        <select
                          value={p.stockStatus}
                          onChange={(e) => handleStatusChange(p._id, e.target.value)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-md border focus:outline-none ${
                            p.stockStatus === 'inStock'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : p.stockStatus === 'outOfStock'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                        >
                          <option value="inStock">In Stock</option>
                          <option value="outOfStock">Out of Stock</option>
                          <option value="hidden">Hidden</option>
                        </select>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/products/edit/${p._id}`}
                            className="p-1.5 text-gray-600 hover:text-brand-700 hover:bg-brand-50 rounded transition-colors"
                            title="Edit Product"
                          >
                            <HiOutlinePencil className="text-base" />
                          </Link>
                          <button
                            onClick={() => handleDelete(p._id, p.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete Product"
                          >
                            <HiOutlineTrash className="text-base" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Prev
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminProductsPage
