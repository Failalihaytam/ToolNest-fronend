"use client"

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tool } from '../../types/Tool'
import ToolCard from '../tools/ToolCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import { useAuth } from '../../contexts/AuthContext'

const SavedToolsPage = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [savedTools, setSavedTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Redirect if not logged in
    if (!isAuthenticated) {
      navigate('/signin?redirect=/saved')
      return
    }

    const fetchSavedTools = async () => {
      setLoading(true)
      try {
        // In a real app, you would call your API to get saved tools
        // For now, let's simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data - replace with actual API call
        setSavedTools([])
      } catch (error) {
        console.error('Error fetching saved tools:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedTools()
  }, [isAuthenticated, navigate])

  const handleRemoveFromSaved = async (toolId: string) => {
    try {
      // In a real app, call API to remove from saved
      // For now, just update state
      setSavedTools(savedTools.filter(tool => tool.id !== toolId))
    } catch (error) {
      console.error('Error removing tool from saved:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Saved Tools</h1>
      
      {savedTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedTools.map(tool => (
            <div key={tool.id} className="relative">
              <ToolCard tool={tool} />
              <button
                onClick={() => handleRemoveFromSaved(tool.id)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                aria-label="Remove from saved"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No saved tools</h2>
          <p className="text-gray-600 mb-4">
            You haven't saved any tools yet.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Explore Tools
          </button>
        </div>
      )}
    </div>
  )
}

export default SavedToolsPage 