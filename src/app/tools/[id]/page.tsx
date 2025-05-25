"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { getListing } from '@/app/services/listingService'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { CheckCircle } from 'react-feather'

export default function ToolDetails() {
  const { id } = useParams()
  const [tool, setTool] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchToolDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true)
        const response = await getListing(Number(id))
        
        console.log('API Response:', response) // Debug log
        
        if (response.status === 'success' && response.data) {
          console.log('Tool data:', response.data) // Debug log
          setTool(response.data)
        } else {
          setError(response.message || 'Failed to fetch tool details')
        }
      } catch (error) {
        console.error('Error fetching tool details:', error)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchToolDetails()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    )
  }

  if (error || !tool) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-600 dark:text-red-400">
          {error || "Failed to load tool details. Please try again."}
        </div>
      </div>
    )
  }

  // Ensure tool and its properties exist before rendering
  const features = tool?.features || []

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{tool.title}</h1>
          
          {/* Features Section */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Features</h3>
            {features.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No features available for this tool.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 