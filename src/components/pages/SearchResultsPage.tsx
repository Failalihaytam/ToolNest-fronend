"use client"

import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import ToolCard from '../tools/ToolCard'
import SearchFilters from '../search/SearchFilters'
import LoadingSpinner from '../ui/LoadingSpinner'
import dynamic from 'next/dynamic'
import { 
  Grid, 
  List, 
  Sliders,

  ChevronDown, 
  ChevronLeft, 
  ChevronRight, 
  Search as SearchIcon 
} from 'react-feather'
import { searchListings, Listing, ListingSearchParams } from '@/app/services/listingService'

// Dynamically import InteractiveMap to prevent SSR issues
const InteractiveMap = dynamic(
  () => import('../map/InteractiveMap'),
  {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading Map...</div>
  }
)

const SearchResultsPage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false)
  
  // Prevent SSR rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return <div className="flex justify-center items-center h-screen">
      <LoadingSpinner />
    </div>
  }

  return <SearchResultsPageContent />
}

const SearchResultsPageContent: React.FC = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  
  // State for listings and loading
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isFilterVisible, setIsFilterVisible] = useState(false)
  
  // State for filters
  const [filters, setFilters] = useState({
    category_id: searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined,
    city_id: searchParams.get('city_id') ? Number(searchParams.get('city_id')) : undefined,
    min_rating: searchParams.get('min_rating') ? Number(searchParams.get('min_rating')) : undefined,
    min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
    max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
  })
  
  // State for sorting and pagination
  const [sortBy, setSortBy] = useState(searchParams.get('sort_by') || 'priority')
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort_order') as 'asc' | 'desc' || 'asc')
  const [currentPage, setCurrentPage] = useState(searchParams.get('page') ? Number(searchParams.get('page')) : 1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)
  const [searchQuery, setSearchQuery] = useState(query)
  
  // Fetch listings based on search query and filters
  useEffect(() => {
    fetchSearchResults()
  }, [query, filters, sortBy, sortOrder, currentPage])
  
  // Add this useEffect to trigger search on mount if no query/filters are set
  useEffect(() => {
    // If there are no search params (fresh visit or after login), load all tools
    if (!query && !filters.category_id && !filters.city_id && !filters.min_rating && !filters.min_price && !filters.max_price) {
      fetchSearchResults();
    }
  }, []);
  
  // Find the fetchSearchResults function and modify it:

const fetchSearchResults = async () => {
  setLoading(true)
  setError(null)
  
  try {
    const searchParams: ListingSearchParams = {
      query: query,
      page: currentPage,
      per_page: 12,
      sort_by: 'is_premium',
      sort_order: 'desc',
      // Add secondary sort if specified by user
      ...(sortBy !== 'priority' && { 
        secondary_sort: sortBy,
        secondary_order: sortOrder
      }),
      ...filters
    }
    
    const response = await searchListings(searchParams)
    
    if (response.status === 'success' && response.data) {
      let listings = Array.isArray(response.data)
        ? response.data
        : (response.data && typeof response.data === 'object' && 'data' in response.data && Array.isArray((response.data as any).data)
            ? (response.data as { data: Listing[] }).data
            : [])

      // Debug: Log listings with coordinates
      console.log('Listings with coordinates:', listings.filter(l => l.latitude && l.longitude));

      // Ensure premium listings appear first
      listings.sort((a, b) => {
        if (a.is_premium && !b.is_premium) return -1
        if (!a.is_premium && b.is_premium) return 1
        return 0
      })

      setListings(listings)
      setTotalResults(response.meta?.total || 0)
      setTotalPages(response.meta?.last_page || 1)
    } else {
      setError(response.message || 'Failed to fetch listings')
      setListings([])
    }
  } catch (error) {
    console.error('Error fetching search results:', error)
    setError('An unexpected error occurred')
    setListings([])
  } finally {
    setLoading(false)
  }
}
  
  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams()
    
    if (query) newSearchParams.set('q', query)
    if (filters.category_id) newSearchParams.set('category_id', String(filters.category_id))
    if (filters.city_id) newSearchParams.set('city_id', String(filters.city_id))
    if (filters.min_rating) newSearchParams.set('min_rating', String(filters.min_rating))
    if (filters.min_price) newSearchParams.set('min_price', String(filters.min_price))
    if (filters.max_price) newSearchParams.set('max_price', String(filters.max_price))
    if (sortBy !== 'created_at') newSearchParams.set('sort_by', sortBy)
    if (sortOrder !== 'desc') newSearchParams.set('sort_order', sortOrder)
    if (currentPage > 1) newSearchParams.set('page', String(currentPage))
    
    navigate(`/search?${newSearchParams.toString()}`, { replace: true })
  }, [filters, sortBy, sortOrder, currentPage, query])
  
  const handleFilterChange = (newFilters: any) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters
    }))
    setCurrentPage(1) // Reset to first page when filters change
  }
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortOrder] = e.target.value.split('-')
    setSortBy(newSortBy)
    setSortOrder(newSortOrder as 'asc' | 'desc')
    setCurrentPage(1) // Reset to first page when sorting changes
  }
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of results
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Update query and reset page using Next.js navigation
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }
  
  // Render functions
  const renderResultsHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in">
      <div className="mb-4 sm:mb-0">
        <h2 className="text-xl md:text-2xl font-bold text-[var(--toolnest-gray-900)] dark:text-white">
          {loading ? (
            <span className="flex items-center">
              <span className="mr-3">Searching</span>
              <span className="flex space-x-1">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
              </span>
            </span>
          ) : (
            <>
              <span className="text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]">{totalResults}</span> tools found
            </>
          )}
        </h2>
        <p className="text-sm text-[var(--toolnest-gray-500)] dark:text-[var(--toolnest-gray-400)]">
          {query ? `Results for "${query}"` : 'Browse our selection of quality tools available for rent'}
        </p>
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <div className="relative flex-1 sm:flex-none">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={handleSortChange}
            className="tn-input appearance-none pr-10 py-2 w-full"
          >
            <option value="priority-asc">Featured First</option>
            <option value="price_per_day-asc">Price: Low to High</option>
            <option value="price_per_day-desc">Price: High to Low</option>
            <option value="avg_rating-desc">Rating: High to Low</option>
            <option value="created_at-desc">Newest First</option>
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <ChevronDown size={16} />
          </div>
        </div>
        
        <div className="hidden sm:flex items-center border border-[var(--toolnest-gray-300)] dark:border-[var(--toolnest-gray-700)] rounded-lg overflow-hidden">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 transition-colors ${
              viewMode === 'grid'
                ? 'bg-[var(--toolnest-gray-100)] dark:bg-[var(--toolnest-gray-800)] text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]'
                : 'text-[var(--toolnest-gray-500)] hover:bg-[var(--toolnest-gray-50)] dark:hover:bg-[var(--toolnest-gray-800)] dark:text-[var(--toolnest-gray-400)]'
            }`}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 transition-colors ${
              viewMode === 'list'
                ? 'bg-[var(--toolnest-gray-100)] dark:bg-[var(--toolnest-gray-800)] text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]'
                : 'text-[var(--toolnest-gray-500)] hover:bg-[var(--toolnest-gray-50)] dark:hover:bg-[var(--toolnest-gray-800)] dark:text-[var(--toolnest-gray-400)]'
            }`}
          >
            <List size={18} />
          </button>
        </div>
      </div>
    </div>
  )
  
  const renderNoResults = () => (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="mx-auto w-16 h-16 bg-[var(--toolnest-gray-100)] dark:bg-[var(--toolnest-gray-700)] rounded-full flex items-center justify-center mb-4">
        <SearchIcon size={24} className="text-[var(--toolnest-gray-500)]" />
      </div>
      <h3 className="text-xl font-semibold mb-2">No tools found</h3>
      <p className="text-[var(--toolnest-gray-500)] dark:text-[var(--toolnest-gray-400)] mb-6">
        We couldn't find any tools matching your search criteria.
      </p>
      <button
        onClick={() => {
          setFilters({
            category_id: undefined,
            city_id: undefined,
            min_rating: undefined,
            min_price: undefined,
            max_price: undefined
          })
          navigate('/search')
        }}
        className="tn-button tn-button-primary"
      >
        Clear Filters
      </button>
    </div>
  )
  
  const renderPagination = () => (
    <div className="flex justify-center items-center mt-12">
      <nav className="inline-flex items-center space-x-1">
        {currentPage > 1 && (
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className="p-2 rounded-lg border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] text-[var(--toolnest-gray-700)] dark:text-[var(--toolnest-gray-300)] hover:bg-[var(--toolnest-gray-50)] dark:hover:bg-[var(--toolnest-gray-800)]"
          >
            <ChevronLeft size={16} />
          </button>
        )}
        
        {Array.from({ length: totalPages }).map((_, index) => {
          const pageNumber = index + 1
          // Only show pageNumber if it's within a range of current page, or is first/last page
          if (
            pageNumber === 1 ||
            pageNumber === totalPages ||
            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
          ) {
            return (
              <button
                key={pageNumber}
                onClick={() => handlePageChange(pageNumber)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                  currentPage === pageNumber
                    ? 'bg-[var(--toolnest-primary-600)] text-white'
                    : 'border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] text-[var(--toolnest-gray-700)] dark:text-[var(--toolnest-gray-300)] hover:bg-[var(--toolnest-gray-50)] dark:hover:bg-[var(--toolnest-gray-800)]'
                }`}
              >
                {pageNumber}
              </button>
            )
          }
          // Show ellipsis for gaps
          if (
            (pageNumber === currentPage - 3 && currentPage > 4) ||
            (pageNumber === currentPage + 3 && currentPage < totalPages - 3)
          ) {
            return <span key={pageNumber} className="px-2">…</span>
          }
          return null
        })}
        
        {currentPage < totalPages && (
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className="p-2 rounded-lg border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] text-[var(--toolnest-gray-700)] dark:text-[var(--toolnest-gray-300)] hover:bg-[var(--toolnest-gray-50)] dark:hover:bg-[var(--toolnest-gray-800)]"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </nav>
    </div>
  )
  
  return (
    <div className="min-h-screen bg-[var(--toolnest-gray-50)] dark:bg-[var(--toolnest-gray-950)] pt-[60px]">
      {/* Search Header */}
      <div className="bg-[var(--toolnest-gray-100)] dark:bg-[var(--toolnest-gray-900)] py-6 sm:py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto flex items-center gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tools by name, category, or keyword..."
                  className="tn-input w-full py-3 pl-12 pr-4"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                  <SearchIcon size={18} className="text-[var(--toolnest-gray-400)]" />
                </div>
                <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <div className="tn-button-sm tn-button-primary">Search</div>
                </button>
              </div>
            </form>
            <div className="relative">
              <InteractiveMap 
                listings={listings} 
                onMarkerClick={(listing) => {
                  // Handle marker click - you can navigate to the listing details
                  console.log('Clicked listing:', listing);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 mt-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Filters */}
          <div className="lg:w-1/4">
            <SearchFilters
              isVisible={isFilterVisible}
              onClose={() => setIsFilterVisible(false)}
              filters={filters}
              onFilterChange={handleFilterChange}
              className="sticky top-[calc(16rem+4.5rem)] lg:top-[calc(14rem+4.5rem)]"
            />
          </div>
          
          {/* Search Results */}
          <div className="lg:w-3/4">
            {renderResultsHeader()}
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg animate-fade-in">
                {error}
              </div>
            ) : listings.length === 0 ? (
              renderNoResults()
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                } animate-fade-in`}>
                  {listings.map((listing) => (
                    <ToolCard 
                      key={listing.id}
                      tool={{
                        id: listing.id.toString(),
                        name: listing.title,
                        price: listing.price_per_day,
                        rating: listing.avg_rating,
                        reviewCount: listing.review_count,
                        location: listing.city?.name || 'Unknown',
                        image: listing.images && listing.images.length > 0
                          ? listing.images[0].url
                          : 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                        isPremium: listing.is_premium,
                        owner: {
                          id: listing.partner?.id.toString() || '0',
                          name: listing.partner?.name || 'Unknown',
                          avatar: listing.partner?.avatar_url || '/placeholder.svg',
                          rating: listing.partner?.avg_rating_as_partner || 0
                        }
                      }}
                    />
                  ))}
                </div>
                
                {totalPages > 1 && renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchResultsPage