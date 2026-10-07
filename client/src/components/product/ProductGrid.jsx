import React from 'react'
import ProductCard from './ProductCard'
import SkeletonCard from '../ui/SkeletonCard'
import EmptyState from '../ui/EmptyState'

const ProductGrid = ({ products = [], loading = false, emptyTitle, emptyDescription }) => {
  if (loading) {
    return (
      <div className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  )
}

export default ProductGrid
