"use client"

import React, { useState, useEffect } from 'react'
import { Sliders, ChevronDown, X } from 'react-feather'
import { getCategories, getCities } from '@/app/services/listingService'

// Interface for API data
interface Category {
  id: number
  name: string
}

interface City {
  id: number
  name: string
}

// Filter settings interface to match API parameters
interface FilterSettings {
  category_id?: number
  city_id?: number
  min_price?: number
  max_price?: number
  min_rating?: number | null
  availability?: string[]
  distance?: number | null
}

interface SearchFiltersProps {
  isVisible: boolean
  onClose: () => void
  filters: FilterSettings
  onFilterChange: (filters: FilterSettings) => void
  className?: string
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ 
  isVisible,
  onClose,
  filters,
  onFilterChange,
  className = ''
}) => {
  // State for API data
  const [categories, setCategories] = useState<Category[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [loading, setLoading] = useState(true)
  
  // Local filter state
  const [localFilters, setLocalFilters] = useState<FilterSettings>({
    category_id: filters.category_id,
    city_id: filters.city_id,
    min_price: filters.min_price || 0,
    max_price: filters.max_price || 200,
    min_rating: filters.min_rating,
    availability: filters.availability || [],
    distance: filters.distance
  })

  // Default range values for price
  const priceRangeSettings = {
    min: 0,
    max: 500,
    step: 5
  }
  
  // Fetch categories and cities from API
  useEffect(() => {
    const fetchFilterData = async () => {
      setLoading(true)
      try {
        // Fetch categories from API
        const categoriesResponse = await getCategories()
        if (categoriesResponse.status === 'success' && categoriesResponse.data) {
          setCategories(categoriesResponse.data)
        }
        
        // Fetch cities from API
        const citiesResponse = await getCities()
        if (citiesResponse.status === 'success' && citiesResponse.data) {
          setCities(citiesResponse.data)
        }
      } catch (error) {
        console.error('Error fetching filter data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchFilterData()
  }, [])
  
  // Reset local filters when prop filters change
  useEffect(() => {
    setLocalFilters({
      category_id: filters.category_id,
      city_id: filters.city_id,
      min_price: filters.min_price || 0,
      max_price: filters.max_price || 200,
      min_rating: filters.min_rating,
      availability: filters.availability || [],
      distance: filters.distance
    })
  }, [filters])

  // Handle category selection
  const handleCategoryChange = (categoryId: number) => {
    setLocalFilters({
      ...localFilters,
      category_id: categoryId === localFilters.category_id ? undefined : categoryId
    })
  }

  // Handle city selection
  const handleCityChange = (cityId: number) => {
    setLocalFilters({
      ...localFilters,
      city_id: cityId === localFilters.city_id ? undefined : cityId
    })
  }

  // Handle availability change
  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    if (!localFilters.availability) {
      localFilters.availability = []
    }
    
    if (checked) {
      setLocalFilters({
        ...localFilters,
        availability: [...localFilters.availability, availability]
      })
    } else {
      setLocalFilters({
        ...localFilters,
        availability: localFilters.availability.filter(a => a !== availability)
      })
    }
  }

  // Handle rating selection
  const handleRatingChange = (rating: number | null) => {
    setLocalFilters({
      ...localFilters,
      min_rating: rating
    })
  }

  // Handle distance selection
  const handleDistanceChange = (distance: number | null) => {
    setLocalFilters({
      ...localFilters,
      distance: distance
    })
  }

  // Handle price range changes
  const handlePriceRangeChange = (value: string, isMin: boolean) => {
    const numValue = parseInt(value)
    setLocalFilters({
      ...localFilters,
      min_price: isMin ? numValue : localFilters.min_price,
      max_price: isMin ? localFilters.max_price : numValue
    })
  }

  // Apply current filters
  const applyFilters = () => {
    onFilterChange(localFilters)
    if (isVisible) onClose()
  }

  // Clear all filters
  const clearFilters = () => {
    const resetFilters = {
      category_id: undefined,
      city_id: undefined,
      min_price: undefined,
      max_price: undefined,
      min_rating: undefined,
      availability: [],
      distance: null
    }
    
    setLocalFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  const mobileClass = isVisible ? 'translate-x-0' : '-translate-x-full'

  return (
    <>
      {/* Mobile Filters */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden ${isVisible ? 'block' : 'hidden'}`} onClick={onClose}></div>
      <div className={`fixed top-0 left-0 bottom-0 w-80 max-w-full bg-white dark:bg-[var(--toolnest-gray-900)] z-50 transform transition-transform duration-300 ease-in-out p-5 overflow-y-auto lg:hidden ${mobileClass}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sliders size={18} className="mr-2 text-[var(--toolnest-primary-500)]" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <button onClick={onClose} className="text-[var(--toolnest-gray-500)] hover:text-[var(--toolnest-gray-700)] dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--toolnest-primary-500)]"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Category Filter */}
            <FilterSection title="Category">
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio"
                    className="form-radio text-[var(--toolnest-primary-500)]"
                    checked={localFilters.category_id === undefined}
                    onChange={() => handleCategoryChange(localFilters.category_id || 0)}
                    name="category"
                  />
                  <span className="ml-2 text-sm">All Categories</span>
                </label>
                {categories.map(category => (
                  <label key={category.id} className="flex items-center cursor-pointer">
                    <input 
                      type="radio"
                      className="form-radio text-[var(--toolnest-primary-500)]"
                      checked={localFilters.category_id === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      name="category"
                    />
                    <span className="ml-2 text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Location Filter */}
            <FilterSection title="Location">
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio"
                    className="form-radio text-[var(--toolnest-primary-500)]"
                    checked={localFilters.city_id === undefined}
                    onChange={() => handleCityChange(localFilters.city_id || 0)}
                    name="city"
                  />
                  <span className="ml-2 text-sm">All Locations</span>
                </label>
                {cities.map(city => (
                  <label key={city.id} className="flex items-center cursor-pointer">
                    <input 
                      type="radio"
                      className="form-radio text-[var(--toolnest-primary-500)]"
                      checked={localFilters.city_id === city.id}
                      onChange={() => handleCityChange(city.id)}
                      name="city"
                    />
                    <span className="ml-2 text-sm">{city.name}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Price Range Filter */}
            <FilterSection title="Price Range">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>${localFilters.min_price}</span>
                  <span>${localFilters.max_price}</span>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      value={localFilters.min_price}
                      onChange={(e) => handlePriceRangeChange(e.target.value, true)}
                      min={priceRangeSettings.min}
                      max={(localFilters.max_price || priceRangeSettings.max) - priceRangeSettings.step}
                      className="w-full py-2 pl-7 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Min"
                    />
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      value={localFilters.max_price}
                      onChange={(e) => handlePriceRangeChange(e.target.value, false)}
                      min={(localFilters.min_price || priceRangeSettings.min) + priceRangeSettings.step}
                      max={priceRangeSettings.max}
                      className="w-full py-2 pl-7 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </FilterSection>

            {/* Rating Filter */}
            <FilterSection title="Minimum Rating">
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio"
                    className="form-radio text-[var(--toolnest-primary-500)]"
                    checked={localFilters.min_rating === undefined}
                    onChange={() => handleRatingChange(null)}
                    name="rating"
                  />
                  <span className="ml-2 text-sm">Any Rating</span>
                </label>
                {[4.5, 4, 3, 2].map(rating => (
                  <label key={rating} className="flex items-center cursor-pointer">
                    <input 
                      type="radio"
                      className="form-radio text-[var(--toolnest-primary-500)]"
                      checked={localFilters.min_rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      name="rating"
                    />
                    <span className="ml-2 text-sm">{rating}+ Stars</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Availability Filter */}
            <FilterSection title="Availability">
              <div className="space-y-2">
                {['Available Now', 'Available This Week', 'Available This Month'].map(availability => (
                  <label key={availability} className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="form-checkbox rounded text-[var(--toolnest-primary-500)]"
                      checked={localFilters.availability?.includes(availability) || false}
                      onChange={(e) => handleAvailabilityChange(availability, e.target.checked)}
                    />
                    <span className="ml-2 text-sm">{availability}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Distance Filter */}
            <FilterSection title="Maximum Distance">
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio"
                    className="form-radio text-[var(--toolnest-primary-500)]"
                    checked={localFilters.distance === null}
                    onChange={() => handleDistanceChange(null)}
                    name="distance"
                  />
                  <span className="ml-2 text-sm">Any Distance</span>
                </label>
                {[5, 10, 20, 50].map(distance => (
                  <label key={distance} className="flex items-center cursor-pointer">
                    <input 
                      type="radio"
                      className="form-radio text-[var(--toolnest-primary-500)]"
                      checked={localFilters.distance === distance}
                      onChange={() => handleDistanceChange(distance)}
                      name="distance"
                    />
                    <span className="ml-2 text-sm">{distance} miles</span>
                  </label>
                ))}
              </div>
            </FilterSection>
          </div>
        )}

        <div className="mt-8 flex space-x-4">
          <button 
            onClick={clearFilters}
            className="tn-button tn-button-outline flex-1"
          >
            Clear All
          </button>
          <button 
            onClick={applyFilters}
            className="tn-button tn-button-primary flex-1"
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Desktop Filters */}
      <div className={`hidden lg:block bg-white dark:bg-[var(--toolnest-gray-800)] rounded-lg shadow-sm p-5 ${className}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Sliders size={18} className="mr-2 text-[var(--toolnest-primary-500)]" />
            <h2 className="text-lg font-semibold">Filters</h2>
          </div>
          <button 
            onClick={clearFilters}
            className="text-sm text-[var(--toolnest-gray-500)] hover:text-[var(--toolnest-primary-500)] dark:hover:text-white"
          >
            Clear All
          </button>
        </div>

        {loading ? (
          <div className="py-8 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--toolnest-primary-500)]"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Category Filter */}
            <FilterSection title="Category">
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio"
                    className="form-radio text-[var(--toolnest-primary-500)]"
                    checked={localFilters.category_id === undefined}
                    onChange={() => handleCategoryChange(localFilters.category_id || 0)}
                    name="category-desktop"
                  />
                  <span className="ml-2 text-sm">All Categories</span>
                </label>
                {categories.map(category => (
                  <label key={category.id} className="flex items-center cursor-pointer">
                    <input 
                      type="radio"
                      className="form-radio text-[var(--toolnest-primary-500)]"
                      checked={localFilters.category_id === category.id}
                      onChange={() => handleCategoryChange(category.id)}
                      name="category-desktop"
                    />
                    <span className="ml-2 text-sm">{category.name}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Location Filter */}
            <FilterSection title="Location">
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio"
                    className="form-radio text-[var(--toolnest-primary-500)]"
                    checked={localFilters.city_id === undefined}
                    onChange={() => handleCityChange(localFilters.city_id || 0)}
                    name="city-desktop"
                  />
                  <span className="ml-2 text-sm">All Locations</span>
                </label>
                {cities.map(city => (
                  <label key={city.id} className="flex items-center cursor-pointer">
                    <input 
                      type="radio"
                      className="form-radio text-[var(--toolnest-primary-500)]"
                      checked={localFilters.city_id === city.id}
                      onChange={() => handleCityChange(city.id)}
                      name="city-desktop"
                    />
                    <span className="ml-2 text-sm">{city.name}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Price Range Filter */}
            <FilterSection title="Price Range">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span>${localFilters.min_price}</span>
                  <span>${localFilters.max_price}</span>
                </div>
                
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      value={localFilters.min_price}
                      onChange={(e) => handlePriceRangeChange(e.target.value, true)}
                      min={priceRangeSettings.min}
                      max={(localFilters.max_price || priceRangeSettings.max) - priceRangeSettings.step}
                      className="w-full py-2 pl-7 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Min"
                    />
                  </div>
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      value={localFilters.max_price}
                      onChange={(e) => handlePriceRangeChange(e.target.value, false)}
                      min={(localFilters.min_price || priceRangeSettings.min) + priceRangeSettings.step}
                      max={priceRangeSettings.max}
                      className="w-full py-2 pl-7 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>
            </FilterSection>

            {/* Rating Filter */}
            <FilterSection title="Minimum Rating">
              <div className="space-y-2">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio"
                    className="form-radio text-[var(--toolnest-primary-500)]"
                    checked={localFilters.min_rating === undefined}
                    onChange={() => handleRatingChange(null)}
                    name="rating-desktop"
                  />
                  <span className="ml-2 text-sm">Any Rating</span>
                </label>
                {[4.5, 4, 3, 2].map(rating => (
                  <label key={rating} className="flex items-center cursor-pointer">
                    <input 
                      type="radio"
                      className="form-radio text-[var(--toolnest-primary-500)]"
                      checked={localFilters.min_rating === rating}
                      onChange={() => handleRatingChange(rating)}
                      name="rating-desktop"
                    />
                    <span className="ml-2 text-sm">{rating}+ Stars</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Availability Filter */}
            <FilterSection title="Availability">
              <div className="space-y-2">
                {['Available Now', 'Available This Week', 'Available This Month'].map(availability => (
                  <label key={availability} className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox"
                      className="form-checkbox rounded text-[var(--toolnest-primary-500)]"
                      checked={localFilters.availability?.includes(availability) || false}
                      onChange={(e) => handleAvailabilityChange(availability, e.target.checked)}
                    />
                    <span className="ml-2 text-sm">{availability}</span>
                  </label>
                ))}
              </div>
            </FilterSection>

            {/* Distance Filter */}
            
            
            <button 
              onClick={applyFilters}
              className="tn-button tn-button-primary w-full mt-4"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </>
  )
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div className="border-b border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] pb-4">
      <button
        className="flex items-center justify-between w-full text-left mb-3"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium">{title}</h3>
        <ChevronDown 
          size={16} 
          className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>
      <div className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        {children}
      </div>
    </div>
  )
}

export default SearchFilters