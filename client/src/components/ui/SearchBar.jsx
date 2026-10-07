import React from 'react'

const SearchBar = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search cards, designs, categories...',
  autoFocus = false,
  className = '',
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) onSubmit(value)
  }

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <div className="relative flex items-center bg-white rounded-full border border-gray-200/90 shadow-md p-1 pl-4">
        <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 focus:outline-none py-2 font-sans"
        />

        <button
          type="submit"
          className="bg-[#5C1622] hover:bg-[#48111a] text-white text-xs sm:text-sm font-medium px-5 sm:px-6 py-2.5 rounded-full flex-shrink-0 transition-colors shadow-xs"
        >
          Search
        </button>
      </div>
    </form>
  )
}

export default SearchBar
