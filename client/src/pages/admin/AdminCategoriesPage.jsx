import React, { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi'
import { categoryAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AdminCategoriesPage = () => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [editingId, setEditingId] = useState(null)

  const { data: categories, isLoading, refetch } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: () => categoryAPI.getAll({ all: true }).then((res) => res.data.data || []),
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) return toast.error('Category name is required')

    try {
      if (editingId) {
        await categoryAPI.update(editingId, { name: name.trim(), description: description.trim() })
        toast.success('Category updated successfully')
      } else {
        await categoryAPI.create({ name: name.trim(), description: description.trim() })
        toast.success('Category created successfully')
      }

      setName('')
      setDescription('')
      setEditingId(null)
      refetch()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category')
    }
  }

  const handleEditClick = (cat) => {
    setEditingId(cat._id)
    setName(cat.name)
    setDescription(cat.description || '')
  }

  const handleDelete = async (id, catName) => {
    if (window.confirm(`Are you sure you want to delete category "${catName}"?`)) {
      try {
        await categoryAPI.delete(id)
        toast.success('Category deleted')
        refetch()
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete category')
      }
    }
  }

  return (
    <>
      <Helmet>
        <title>Manage Categories | Saraswati Cards Admin</title>
      </Helmet>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Product Categories</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Add / Edit Form (Left) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm h-fit">
            <h2 className="text-sm font-bold text-gray-900 mb-4">
              {editingId ? 'Edit Category' : 'Add New Category'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Wedding Cards"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary for category banner..."
                  className="input"
                ></textarea>
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="btn-primary w-full text-xs py-2.5 font-semibold">
                  {editingId ? 'Update Category' : 'Create Category'}
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null)
                      setName('')
                      setDescription('')
                    }}
                    className="btn-outline text-xs py-2.5 px-3"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Categories List Table (Right) */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 font-bold text-xs text-gray-700">
              Active Category Architecture ({categories?.length || 0})
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Slug</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">Loading categories...</td>
                    </tr>
                  ) : categories?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-6 text-center text-gray-400">No categories found.</td>
                    </tr>
                  ) : (
                    categories?.map((c) => (
                      <tr key={c._id} className="hover:bg-gray-50/50">
                        <td className="py-3 px-4 font-semibold text-gray-900">{c.name}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-gray-500">{c.slug}</td>
                        <td className="py-3 px-4 text-gray-500 max-w-xs truncate">{c.description || '-'}</td>
                        <td className="py-3 px-4 text-right space-x-1">
                          <button
                            onClick={() => handleEditClick(c)}
                            className="p-1.5 text-gray-600 hover:text-brand-700 hover:bg-brand-50 rounded"
                            title="Edit"
                          >
                            <HiOutlinePencil className="text-base" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id, c.name)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <HiOutlineTrash className="text-base" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminCategoriesPage
