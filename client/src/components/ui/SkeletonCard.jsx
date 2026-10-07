import React from 'react'

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden border border-gray-100 p-3 flex flex-col">
      <div className="skeleton aspect-[4/3] w-full rounded-lg mb-3"></div>
      <div className="skeleton h-3 w-1/3 mb-2"></div>
      <div className="skeleton h-4 w-5/6 mb-2"></div>
      <div className="skeleton h-4 w-1/2 mb-4"></div>
      <div className="mt-auto pt-2 border-t border-gray-100 flex gap-2">
        <div className="skeleton h-9 w-full rounded-lg"></div>
      </div>
    </div>
  )
}

export default SkeletonCard
