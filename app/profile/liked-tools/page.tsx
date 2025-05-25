"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { 
  Star, 
  MapPin, 
  ArrowLeft, 
  Heart, 
  Trash2, 
  CheckCircle,
  ArrowRight
} from "lucide-react"

// Mock data for liked tools - in a real app, this would come from an API
const mockLikedTools = [
  {
    id: 1,
    name: "Professional Drill Kit",
    price: "8.50",
    rating: 4.9,
    image: "https://placehold.co/300x300/e9f5e9/1a8754?text=Pro+Drill+Kit",
    location: "0.8 miles away",
    category: "Power Tools",
    owner: {
      name: "Michael Smith",
      rating: 4.8
    }
  },
  {
    id: 2,
    name: "Circular Saw",
    price: "12.00",
    rating: 4.7,
    image: "https://placehold.co/300x300/e9f5e9/1a8754?text=Circular+Saw",
    location: "1.2 miles away",
    category: "Power Tools",
    owner: {
      name: "Jennifer K.",
      rating: 4.9
    }
  },
  {
    id: 3,
    name: "Extension Ladder",
    price: "15.50",
    rating: 4.8,
    image: "https://placehold.co/300x300/e9f5e9/1a8754?text=Extension+Ladder",
    location: "1.5 miles away",
    category: "Ladders & Scaffolding",
    owner: {
      name: "Robert L.",
      rating: 4.7
    }
  },
  {
    id: 4,
    name: "Pressure Washer",
    price: "25.00",
    rating: 4.8,
    image: "https://placehold.co/300x300/e9f5e9/1a8754?text=Pressure+Washer",
    location: "1.8 miles away",
    category: "Garden Tools",
    owner: {
      name: "Sarah M.",
      rating: 4.6
    }
  },
  {
    id: 5,
    name: "Paint Sprayer",
    price: "15.00",
    rating: 4.7,
    image: "https://placehold.co/300x300/e9f5e9/1a8754?text=Paint+Sprayer",
    location: "0.6 miles away",
    category: "Painting",
    owner: {
      name: "David W.",
      rating: 4.9
    }
  }
]

export default function LikedToolsPage() {
  const [likedTools, setLikedTools] = useState(mockLikedTools)
  
  // Function to remove a tool from liked list (just UI, no backend)
  const removeFromLiked = (toolId: number) => {
    setLikedTools(likedTools.filter(tool => tool.id !== toolId))
  }

  return (
    <main className="bg-gradient-to-b from-gray-50 to-white min-h-screen py-12">
      {/* Header and navigation */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="inline-block mb-6">
              <div className="flex items-center px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 hover:text-green-600 rounded-full border border-gray-200 hover:border-green-200 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                <span className="absolute inset-0 w-0 bg-green-50/50 group-hover:w-full transition-all duration-300 rounded-full"></span>
                <ArrowLeft className="h-4 w-4 mr-1.5 group-hover:-translate-x-0.5 transition-transform relative z-10" />
                <span className="font-medium relative z-10">Back to Home</span>
              </div>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Liked Tools</h1>
            <p className="text-gray-600">Tools you've saved for later consideration</p>
          </div>
          <div className="flex items-center gap-2 bg-green-50 py-2 px-4 rounded-lg">
            <Heart className="h-5 w-5 text-green-600 fill-green-600" />
            <span className="font-medium text-green-700">{likedTools.length} Saved Tools</span>
          </div>
        </div>
        
        {likedTools.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Liked Tools Yet</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              You haven't liked any tools yet. Explore our available tools and click the heart icon to save them here.
            </p>
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700">
                Explore Available Tools
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {likedTools.map((tool) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="relative">
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-900">
                    {tool.category}
                  </div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg px-2.5 py-1.5 text-sm font-medium text-gray-900 flex items-center gap-1.5 shadow-sm">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="font-semibold">{tool.rating}</span>
                  </div>
                  
                  {/* Image with gradient overlay and hover effect */}
                  <div className="relative h-60 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <img
                      src={tool.image}
                      alt={tool.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                    />
                    
                    {/* Quick action overlay that appears on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      <Link href={`/tools/${tool.id}`}>
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 cursor-pointer hover:bg-white transition-colors duration-200 shadow-lg mx-2" title="Quick view">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                      </Link>
                      <div 
                        onClick={() => removeFromLiked(tool.id)}
                        className="bg-white/90 backdrop-blur-sm rounded-full p-2 cursor-pointer hover:bg-red-50 transition-colors duration-200 shadow-lg mx-2" 
                        title="Remove from liked"
                      >
                        <Trash2 className="h-5 w-5 text-gray-700 hover:text-red-500" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Content section */}
                <div className="p-5">
                  {/* Tool availability indicator */}
                  <div className="flex items-center mb-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span className="text-xs text-green-600 font-medium">Available Now</span>
                  </div>
                  
                  {/* Name and price layout */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors duration-300 pr-2">{tool.name}</h3>
                    <div className="flex flex-col items-end">
                      <div className="text-green-700 font-bold">${tool.price}</div>
                      <div className="text-xs text-gray-500">per day</div>
                    </div>
                  </div>
                  
                  {/* Owner information */}
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <div className="flex items-center">
                      <span className="font-medium text-gray-700 mr-1">Owner:</span>
                      <span>{tool.owner.name}</span>
                    </div>
                    <div className="flex items-center ml-auto">
                      <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                      <span>{tool.owner.rating}</span>
                    </div>
                  </div>
                  
                  {/* Location */}
                  <div className="flex items-center text-gray-500 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                    <div className="bg-gray-100 rounded-full p-1.5 mr-2 group-hover:bg-green-100 group-hover:text-green-600 transition-all duration-300">
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <span>{tool.location}</span>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <Link href={`/tools/${tool.id}`} className="block w-full">
                      <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50 group">
                        <span>View Details</span>
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                    <Link href="/auth/signin" className="block w-full">
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Book Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
} 