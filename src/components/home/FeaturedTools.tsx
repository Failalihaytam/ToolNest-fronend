"use client"

import { useState } from "react"
import ToolGrid from "../tools/ToolGrid"

interface Tool {
  id: string
  name: string
  image: string
  price: number
  rating: number
  reviewCount: number
  location: string
  distance: number
  isSaved?: boolean
}

interface FeaturedToolsProps {
  tools: Tool[]
}

export default function FeaturedTools({ tools }: FeaturedToolsProps) {
  const [savedTools, setSavedTools] = useState<string[]>([])

  const handleSaveToggle = (id: string) => {
    setSavedTools((prev) => (prev.includes(id) ? prev.filter((toolId) => toolId !== id) : [...prev, id]))
  }

  const toolsWithSavedState = tools.map((tool) => ({
    ...tool,
    isSaved: savedTools.includes(tool.id),
  }))

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">Featured Tools</h2>

        <ToolGrid tools={toolsWithSavedState} onSaveToggle={handleSaveToggle} />
      </div>
    </section>
  )
}
