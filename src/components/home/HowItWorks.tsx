import { Search, Calendar, Tool, ThumbsUp } from "react-feather"

export default function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Find Tools",
      description: "Search for tools in your area by category, name, or specific needs.",
    },
    {
      icon: Calendar,
      title: "Book & Pay",
      description: "Select your rental dates and securely pay through our platform.",
    },
    {
      icon: Tool,
      title: "Pick Up & Use",
      description: "Meet the owner to pick up the tool and complete your project.",
    },
    {
      icon: ThumbsUp,
      title: "Return & Review",
      description: "Return the tool and share your experience with the community.",
    },
  ]

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">How ToolShare Works</h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            Renting tools from your neighbors is easy and convenient.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="bg-green-100 dark:bg-green-900 p-4 rounded-full mb-4">
                <step.icon className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
              <p className="text-gray-500 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
