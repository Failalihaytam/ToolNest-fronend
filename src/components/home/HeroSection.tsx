"use client"

import type React from "react"

import { Link } from "react-router-dom"
import { Search } from "react-feather"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-green-500 to-green-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">Borrow the tools you need</h1>
          <p className="mt-3 max-w-md mx-auto text-xl text-white opacity-90 sm:text-2xl">
            Find tools in your neighborhood and save money while helping the environment.
          </p>

          <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="What tool do you need?"
                className="w-full px-5 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-green-600 p-2 rounded-full hover:bg-green-700 transition-colors"
              >
                <Search className="h-6 w-6 text-white" />
              </button>
            </form>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/category/power-tools"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full text-white text-sm font-medium transition-colors"
              >
                Power Tools
              </Link>
              <Link
                to="/category/hand-tools"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full text-white text-sm font-medium transition-colors"
              >
                Hand Tools
              </Link>
              <Link
                to="/category/garden"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full text-white text-sm font-medium transition-colors"
              >
                Garden Tools
              </Link>
              <Link
                to="/category/ladders"
                className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-full text-white text-sm font-medium transition-colors"
              >
                Ladders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
