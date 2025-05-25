import ToolCard from "./ToolCard"

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

interface ToolGridProps {
  tools: Tool[]
  onSaveToggle?: (id: string) => void
}

export default function ToolGrid({ tools, onSaveToggle }: ToolGridProps) {
  if (tools.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No tools found.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {tools.map((tool) => (
        <ToolCard
          key={tool.id}
          id={tool.id}
          name={tool.name}
          image={tool.image}
          price={tool.price}
          rating={tool.rating}
          reviewCount={tool.reviewCount}
          location={tool.location}
          distance={tool.distance}
          isSaved={tool.isSaved}
          onSaveToggle={onSaveToggle}
        />
      ))}
    </div>
  )
}
