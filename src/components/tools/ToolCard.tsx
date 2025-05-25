"use client"

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, MapPin, Calendar, Heart, Clock, Tag, Clipboard, Check } from 'react-feather'
import { Tool } from '../../types/Tool'
import ListingLikedButton from '../pages/ListingLikedButton'

interface ToolCardProps {
  tool: Tool
  view?: 'grid' | 'list'
  action?: React.ReactNode
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, view = 'grid', action }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  
  // This is a placeholder for actual tool data
  // In a real application, you would use the tool prop
  
  // Example placeholder data
  const placeholderTool = {
    id: tool.id || '1',
    name: tool.name || 'Professional Power Drill',
    image: tool.image || 'https://images.unsplash.com/photo-1504148455328-c376907d081c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    price: tool.price || 25,
    rating: tool.rating || 4.8,
    reviewCount: tool.reviewCount || 42,
    location: tool.location || 'San Francisco, CA',
    distance: tool.distance || '2.3 miles away',
    category: tool.category || 'Power Tools',
    availability: tool.availability || 'Available Now'
  }
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }
  
  // Calculate badge color based on availability
  const getBadgeColor = () => {
    if (placeholderTool.availability === 'Available Now') {
      return 'bg-green-500 dark:bg-green-600'
    } else if (placeholderTool.availability === 'Available This Week') {
      return 'bg-yellow-500 dark:bg-yellow-600'
    } else {
      return 'bg-blue-500 dark:bg-blue-600'
    }
  }
  
  if (view === 'list') {
    return (
      <div 
        className="group tn-card p-0 flex flex-col sm:flex-row gap-4 transition-all duration-300 hover:shadow-md border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] hover:border-[var(--toolnest-primary-300)] dark:hover:border-[var(--toolnest-primary-700)] overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0 relative overflow-hidden">
          <Link to={`/tools/${placeholderTool.id}`}>
            <img 
              src={placeholderTool.image} 
              alt={placeholderTool.name} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>
          {(tool.isPremium || tool.is_premium) && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full z-10">
          PREMIUM
          </div>
          )}
          <button 
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              isFavorite 
                ? 'bg-[var(--toolnest-accent-100)] text-[var(--toolnest-accent-500)]' 
                : 'bg-white/80 backdrop-blur-sm text-[var(--toolnest-gray-400)] hover:bg-white'
            }`}
            onClick={handleFavoriteClick}
          >
            
          </button>
          <div className={`absolute bottom-3 left-3 text-xs font-semibold text-white py-1 px-2 rounded-full ${getBadgeColor()}`}>
            {placeholderTool.availability}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col p-4">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--toolnest-gray-100)] dark:bg-[var(--toolnest-gray-800)] text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
                {placeholderTool.category}
              </span>
              <div className="flex items-center">
                <Star size={14} className="text-[var(--toolnest-accent-500)] mr-1" />
                <span className="text-sm font-medium text-[var(--toolnest-gray-900)] dark:text-white">{placeholderTool.rating}</span>
                <span className="text-xs text-[var(--toolnest-gray-500)] dark:text-[var(--toolnest-gray-400)] ml-1">({placeholderTool.reviewCount})</span>
              </div>
            </div>
            
            <Link to={`/tools/${placeholderTool.id}`} className="block group-hover:text-[var(--toolnest-primary-600)] dark:group-hover:text-[var(--toolnest-primary-400)] transition-colors">
              <h3 className="text-lg font-semibold text-[var(--toolnest-gray-900)] dark:text-white mb-2">
                {placeholderTool.name}
              </h3>
            </Link>
            
            <div className="mb-2 flex items-center text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
              <MapPin size={14} className="mr-1 text-[var(--toolnest-gray-500)]" />
              <span>{placeholderTool.location} ({placeholderTool.distance})</span>
            </div>
            
            <div className="mb-2 flex items-center text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
              <Calendar size={14} className="mr-1 text-[var(--toolnest-gray-500)]" />
              <span>Available for daily or weekly rental</span>
            </div>
            
            <div className="mb-2 flex items-center text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
              <Tag size={14} className="mr-1 text-[var(--toolnest-gray-500)]" />
              <span>Great for home renovation, construction</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)]">
            <div>
              <span className="text-xl font-bold text-[var(--toolnest-gray-900)] dark:text-white">${placeholderTool.price}</span>
              <span className="text-sm text-[var(--toolnest-gray-500)] dark:text-[var(--toolnest-gray-400)]">/day</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className="tn-button-outline py-2 px-3 text-sm inline-flex items-center"
              >
                <Clipboard size={14} className="mr-1" />
                Details
              </button>
              <Link 
                to={`/tools/${placeholderTool.id}`} 
                className="tn-button tn-button-primary py-2 px-4 inline-flex items-center group-hover:shadow-md transition-all"
              >
                Rent Now
                <Check size={16} className="ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div 
      className="group tn-card p-0 flex flex-col hover:shadow-md transition-all duration-300 border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] hover:border-[var(--toolnest-primary-300)] dark:hover:border-[var(--toolnest-primary-700)] overflow-hidden h-full relative bg-white rounded-lg shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-2 right-2 z-10">
        <ListingLikedButton listingId={Number(tool.id)} />
      </div>
      {tool.isPremium && (
      <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full z-10">
      PREMIUM
      </div>
      )}
      <div className="relative overflow-hidden">
        <Link to={`/tools/${placeholderTool.id}`}>
          <img 
            src={placeholderTool.image} 
            alt={placeholderTool.name} 
            className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-[var(--toolnest-gray-700)]">
            {placeholderTool.category}
          </span>
        
        </div>
        <div className={`absolute bottom-3 left-3 text-xs font-semibold text-white py-1 px-2 rounded-full ${getBadgeColor()}`}>
          {placeholderTool.availability}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star size={14} className="text-[var(--toolnest-accent-500)] mr-1" />
            <span className="text-sm font-medium text-[var(--toolnest-gray-900)] dark:text-white">{placeholderTool.rating}</span>
            <span className="text-xs text-[var(--toolnest-gray-500)] dark:text-[var(--toolnest-gray-400)] ml-1">({placeholderTool.reviewCount})</span>
          </div>
          <div className="flex items-center text-xs text-[var(--toolnest-gray-500)]">
            <Clock size={12} className="mr-1" />
            <span>24h rental</span>
          </div>
        </div>
        
        <Link to={`/tools/${placeholderTool.id}`} className="block group-hover:text-[var(--toolnest-primary-600)] dark:group-hover:text-[var(--toolnest-primary-400)] transition-colors">
          <h3 className="text-lg font-semibold text-[var(--toolnest-gray-900)] dark:text-white mb-2 line-clamp-2">
            {placeholderTool.name}
          </h3>
        </Link>
        
        <div className="mb-1 flex items-center text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
          <MapPin size={14} className="mr-1 text-[var(--toolnest-gray-500)]" />
          <span>{placeholderTool.distance}</span>
        </div>
        
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)]">
          <div>
            <span className="text-lg font-bold text-[var(--toolnest-gray-900)] dark:text-white">${placeholderTool.price}</span>
            <span className="text-sm text-[var(--toolnest-gray-500)] dark:text-[var(--toolnest-gray-400)]">/day</span>
          </div>
          
          <Link 
            to={`/tools/${placeholderTool.id}`} 
            className={`tn-button py-1.5 px-3 text-sm inline-flex items-center transition-all ${
              isHovered 
                ? 'tn-button-primary' 
                : 'tn-button-outline'
            }`}
          >
            {isHovered ? 'Rent Now' : 'View'}
            {isHovered && <Check size={14} className="ml-1" />}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ToolCard