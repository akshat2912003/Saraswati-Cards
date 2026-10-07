import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Helmet } from 'react-helmet-async'
import { HiOutlineUpload, HiOutlineTrash, HiArrowLeft } from 'react-icons/hi'
import { productAPI, categoryAPI, uploadAPI } from '../../services/api'
import toast from 'react-hot-toast'

const AdminAddProductPage = () => {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [price, setPrice] = useState('')
  const [priceUnit, setPriceUnit] = useState('per piece')
  const [minimumOrderQuantity, setMinimumOrderQuantity] = useState(1)
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState('')
  const [selectedBadges, setSelectedBadges] = useState([])
  const [stockStatus, setStockStatus] = useState('inStock')
  const [isFeatured, setIsFeatured] = useState(false)
  const [isTrending, setIsTrending] = useState(false)
  const [isNew, setIsNew] = useState(true)

  // Image files state
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviews, setImagePreviews] = useState([])
  const [imageUrlsInput, setImageUrlsInput] = useState('')
  const [videoFiles, setVideoFiles] = useState([])
  const [videoPreviews, setVideoPreviews] = useState([])

  const [loading, setLoading] = useState(false)

  // Fetch categories for select dropdown
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryAPI.getAll({ all: true }).then((res) => res.data.data || []),
  })
  const isVideoCategory = categoriesData?.find((item) => item._id === category)?.slug === 'video-wedding-cards'

  const availableBadges = ['Trending', 'Bestseller', 'New', 'Premium', 'Sale', 'Featured']

  const handleBadgeToggle = (badge) => {
    if (selectedBadges.includes(badge)) {
      setSelectedBadges(selectedBadges.filter((b) => b !== badge))
      if (badge === 'Trending') setIsTrending(false)
      if (badge === 'New') setIsNew(false)
      if (badge === 'Featured') setIsFeatured(false)
    } else {
      setSelectedBadges([...selectedBadges, badge])
      if (badge === 'Trending') setIsTrending(true)
      if (badge === 'New') setIsNew(true)
      if (badge === 'Featured') setIsFeatured(true)
    }
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles((prev) => [...prev, ...files])
    const previews = files.map((file) => URL.createObjectURL(file))
    setImagePreviews((prev) => [...prev, ...previews])
  }

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (videoFiles.length + files.length > 5) {
      toast.error('You can upload a maximum of 5 videos')
      e.target.value = ''
      return
    }
    const invalidFile = files.find((file) => !['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type))
    if (invalidFile) {
      toast.error('Only MP4, WebM, and MOV videos are supported')
      e.target.value = ''
      return
    }
    if (files.some((file) => file.size > 100 * 1024 * 1024)) {
      toast.error('Each video must be under 100 MB')
      e.target.value = ''
      return
    }
    setVideoFiles((prev) => [...prev, ...files])
    setVideoPreviews((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))])
    e.target.value = ''
  }

  const removeVideo = (index) => {
    URL.revokeObjectURL(videoPreviews[index])
    setVideoFiles((prev) => prev.filter((_, i) => i !== index))
    setVideoPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) return toast.error('Product name is required')
    if (!category) return toast.error('Please select a category')
    if (!price || isNaN(price)) return toast.error('Valid price is required')
    if (isVideoCategory && videoFiles.length === 0) return toast.error('Please upload at least one video')

    setLoading(true)

    try {
      let finalImages = []
      let finalVideos = []

      if (isVideoCategory) {
        const formData = new FormData()
        videoFiles.forEach((file) => formData.append('videos', file))
        const uploadRes = await uploadAPI.uploadVideos(formData)
        finalVideos = uploadRes.data.videos
      } else {
        // Add direct URL inputs if provided (comma separated)
        if (imageUrlsInput.trim()) {
          const urls = imageUrlsInput.split(',').map((u) => u.trim()).filter(Boolean)
          finalImages.push(...urls)
        }

        // Upload file images if selected
        if (imageFiles.length > 0) {
          const formData = new FormData()
          imageFiles.forEach((file) => formData.append('images', file))

          const uploadRes = await uploadAPI.uploadImages(formData)
          if (uploadRes.data.success) {
            finalImages.push(...uploadRes.data.images)
          }
        }
      }

      const productPayload = {
        name: name.trim(),
        category,
        price: parseFloat(price),
        priceUnit: priceUnit.trim() || 'per piece',
        minimumOrderQuantity: parseInt(minimumOrderQuantity, 10) || 1,
        shortDescription: shortDescription.trim(),
        description: description.trim(),
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        badges: selectedBadges,
        stockStatus,
        isFeatured,
        isTrending,
        isNew,
        images: finalImages,
        thumbnail: finalImages[0] || '',
        videos: finalVideos,
      }

      await productAPI.create(productPayload)
      toast.success('Product created successfully!')
      navigate('/admin/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <title>Add Product | Saraswati Cards Admin</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-brand-700 mb-4 font-semibold"
        >
          <HiArrowLeft /> Back to Products
        </button>

        <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Add New Card Design</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Name & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Traditional Wedding Card"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Category *
                </label>
                <select
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input"
                >
                  <option value="">Select Category</option>
                  {categoriesData?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price, Unit, MOQ */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="35"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Price Unit
                </label>
                <input
                  type="text"
                  value={priceUnit}
                  onChange={(e) => setPriceUnit(e.target.value)}
                  placeholder="e.g. per piece, per 100 pieces"
                  className="input"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Min Order Quantity (MOQ)
                </label>
                <input
                  type="number"
                  min="1"
                  value={minimumOrderQuantity}
                  onChange={(e) => setMinimumOrderQuantity(e.target.value)}
                  className="input"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Short Description (Card highlights)
              </label>
              <textarea
                rows={2}
                maxLength={300}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief 1-2 sentence overview of paper type, finish, or style..."
                className="input"
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                Full Description / Specifications
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detailed specifications (dimensions, envelope inclusions, insert count, printing details)..."
                className="input"
              ></textarea>
            </div>

            {/* Category media upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                {isVideoCategory ? 'Product Videos' : 'Product Images'}
              </label>
              {isVideoCategory ? (
                <>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-brand-300 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="video/mp4,video/webm,video/quicktime"
                      id="video-upload"
                      onChange={handleVideoChange}
                      className="hidden"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <HiOutlineUpload className="text-3xl text-brand-700" />
                      <span className="text-xs font-semibold text-gray-700">Click to upload invitation videos</span>
                      <span className="text-[10px] text-gray-400">MP4, WebM, MOV · up to 100MB each · max 5 videos</span>
                    </label>
                  </div>
                  {videoPreviews.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {videoPreviews.map((src, i) => (
                        <div key={src} className="relative overflow-hidden rounded-lg border border-gray-200">
                          <video src={src} controls className="aspect-video w-full bg-black" />
                          <button
                            type="button"
                            onClick={() => removeVideo(i)}
                            className="absolute right-2 top-2 rounded-full bg-red-600 p-2 text-xs text-white"
                            aria-label={`Remove video ${i + 1}`}
                          >
                            <HiOutlineTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-brand-300 transition-colors">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  id="image-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                  <HiOutlineUpload className="text-3xl text-brand-700" />
                  <span className="text-xs font-semibold text-gray-700">Click to upload image files</span>
                  <span className="text-[10px] text-gray-400">PNG, JPG, WEBP up to 5MB</span>
                </label>
              </div>

              {/* URL fallback input */}
              <div className="mt-2">
                <input
                  type="text"
                  value={imageUrlsInput}
                  onChange={(e) => setImageUrlsInput(e.target.value)}
                  placeholder="Or paste image URLs (comma separated)"
                  className="input text-xs"
                />
              </div>

              {/* Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {imagePreviews.map((src, i) => (
                    <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full text-xs"
                      >
                        <HiOutlineTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
                </>
              )}
            </div>

            {/* Badges & Tags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-2">
                  Product Badges
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableBadges.map((badge) => (
                    <button
                      type="button"
                      key={badge}
                      onClick={() => handleBadgeToggle(badge)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
                        selectedBadges.includes(badge)
                          ? 'bg-brand-700 text-white border-brand-700'
                          : 'bg-gray-50 text-gray-600 border-gray-200'
                      }`}
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="wedding, traditional, red, gold, royal"
                  className="input"
                />
              </div>
            </div>

            {/* Stock status & flags */}
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Status</label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                  className="input text-xs py-1.5"
                >
                  <option value="inStock">In Stock</option>
                  <option value="outOfStock">Out of Stock</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>

              <div className="flex gap-4 text-xs font-medium text-gray-700">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="accent-brand-700"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="accent-brand-700"
                  />
                  Trending
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="accent-brand-700"
                  />
                  New Arrival
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn-outline text-xs py-2.5 px-5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs py-2.5 px-6"
              >
                {loading ? 'Saving Product...' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default AdminAddProductPage
