"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Tool } from '../../types/Tool'
import ToolCard from '../tools/ToolCard'
import LoadingSpinner from '../ui/LoadingSpinner'

const CategoryPage = () => {
  const { category } = useParams()
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategoryTools = async () => {
      setLoading(true)
      try {
        // In a real app, you would call your API with the category
        // For now, let's simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data - replace with actual API call
        const results: Tool[] = []
        setTools(results)
      } catch (error) {
        console.error('Error fetching category tools:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryTools()
  }, [category])

  const formatCategoryName = (cat: string | undefined) => {
    if (!cat) return ''
    return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/-/g, ' ')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{formatCategoryName(category)}</h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      ) : tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2">No tools found</h2>
          <p className="text-gray-600">
            There are no tools available in this category yet
          </p>
        </div>
      )}
    </div>
  )
}

export default CategoryPage 