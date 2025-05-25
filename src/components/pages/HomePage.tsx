"use client"

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Tool } from '../../types/Tool'
import ToolCard from '../tools/ToolCard'
import LoadingSpinner from '../ui/LoadingSpinner'
import { 
  Search, Tool as ToolIcon, Star, Clock, ArrowRight, 
  Compass, Heart, MessageCircle, Award, CheckCircle, ChevronRight,
  Zap, Shield, Truck, Users, MapPin, Briefcase, Key
} from 'react-feather'

const categories = [
  { id: 'power-tools', name: 'Power Tools', icon: <Zap size={24} /> },
  { id: 'hand-tools', name: 'Hand Tools', icon: <ToolIcon size={24} /> },
  { id: 'garden-tools', name: 'Garden Tools', icon: <Briefcase size={24} /> },
  { id: 'measurement', name: 'Measurement', icon: <Compass size={24} /> },
  { id: 'workshop', name: 'Workshop', icon: <Truck size={24} /> },
  { id: 'electrical', name: 'Electrical', icon: <Key size={24} /> }
]

const testimonials = [
  {
    id: 1,
    content: "ToolNest has been a game-changer for my small renovation business. Access to specialized tools without the huge upfront investment has helped me grow faster.",
    author: "Michael T.",
    role: "Contractor",
    avatar: "https://randomuser.me/api/portraits/men/43.jpg"
  },
  {
    id: 2,
    content: "As a weekend DIY enthusiast, ToolNest gives me access to professional-grade equipment I could never justify buying for occasional use.",
    author: "Sarah L.",
    role: "DIY Enthusiast",
    avatar: "https://randomuser.me/api/portraits/women/67.jpg"
  },
  {
    id: 3,
    content: "I've made over $2,000 renting out tools that were just collecting dust in my garage. The platform is super easy to use.",
    author: "David P.",
    role: "Tool Owner",
    avatar: "https://randomuser.me/api/portraits/men/22.jpg"
  }
]

const HomePage = () => {
  const [featuredTools, setFeaturedTools] = useState<Tool[]>([])
  const [popularTools, setPopularTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true)
      try {
        // In a real app, you would call your API to get this data
        // For now, simulate a delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Mock data - replace with actual API calls
        setFeaturedTools([])
        setPopularTools([])
      } catch (error) {
        console.error('Error fetching home data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="bg-[var(--toolnest-gray-50)] dark:bg-[var(--toolnest-gray-950)]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
          <div className="absolute -left-10 top-10 w-72 h-72 bg-[var(--toolnest-primary-400)] rounded-full blur-[100px]"></div>
          <div className="absolute right-0 top-0 w-96 h-96 bg-[var(--toolnest-secondary-400)] rounded-full blur-[120px]"></div>
          <div className="absolute left-1/4 bottom-0 w-64 h-64 bg-[var(--toolnest-accent-400)] rounded-full blur-[90px]"></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slide-up">
                <span className="text-[var(--toolnest-gray-900)] dark:text-white">Your Smart Hub for </span>
                <span className="gradient-text">Powerful Tools</span>
              </h1>
              <p className="text-xl text-[var(--toolnest-gray-700)] dark:text-[var(--toolnest-gray-300)] mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-slide-up delay-1">
                Connect with the tools you need and share your expertise with a community of makers, builders, and creators.
              </p>
              
              <form onSubmit={handleSearch} className="flex w-full max-w-lg mx-auto lg:mx-0 mb-8 animate-slide-up delay-2">
                <div className="relative flex-grow">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What tool are you looking for?" 
                    className="tn-input pr-10 rounded-r-none h-14"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search size={18} className="text-[var(--toolnest-gray-400)]" />
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="tn-button tn-button-primary rounded-l-none h-14 px-6"
                >
                  Search
                </button>
              </form>
              
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)] animate-slide-up delay-3">
                <span>Popular:</span>
                {['Drill', 'Sander', 'Lawn Mower', 'Pressure Washer'].map((term, index) => (
                  <Link 
                    key={term} 
                    to={`/search?q=${term}`}
                    className="hover:text-[var(--toolnest-primary-600)] dark:hover:text-[var(--toolnest-primary-400)] transition-colors"
                  >
                    {term}
                  </Link>
                ))}
              </div>
              
              <div className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 animate-slide-up delay-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--toolnest-primary-100)] dark:bg-[var(--toolnest-primary-900)] flex items-center justify-center text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]">
                    <Users size={20} />
                  </div>
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-[var(--toolnest-gray-900)] dark:text-white">5000+</div>
                    <div className="text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">Active Users</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--toolnest-secondary-100)] dark:bg-[var(--toolnest-secondary-900)] flex items-center justify-center text-[var(--toolnest-secondary-600)] dark:text-[var(--toolnest-secondary-400)]">
                    <ToolIcon size={20} />
                  </div>
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-[var(--toolnest-gray-900)] dark:text-white">12,000+</div>
                    <div className="text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">Available Tools</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[var(--toolnest-accent-100)] dark:bg-[var(--toolnest-accent-900)] flex items-center justify-center text-[var(--toolnest-accent-600)] dark:text-[var(--toolnest-accent-400)]">
                    <MapPin size={20} />
                  </div>
                  <div className="ml-3">
                    <div className="text-2xl font-bold text-[var(--toolnest-gray-900)] dark:text-white">200+</div>
                    <div className="text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">Locations</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 lg:pl-12 animate-float">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--toolnest-primary-500)] to-[var(--toolnest-secondary-500)] opacity-20 dark:opacity-40 blur-xl rounded-3xl transform rotate-3"></div>
                <img 
                  src="/toolnest.jpg" 
                  alt="Toolnest" 
                  className="relative rounded-3xl shadow-xl object-cover w-full h-[500px] z-10"
                />
                
                {/* Floating cards */}
                <div className="absolute -left-8 top-8 glass rounded-xl p-4 shadow-lg animate-float z-20">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--toolnest-primary-600)] flex items-center justify-center text-white mr-3">
                      <Star size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--toolnest-gray-900)] dark:text-white">4.9 Rating</div>
                      <div className="text-xs text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">From 2,392 reviews</div>
                    </div>
                  </div>
                </div>
                
                <div className="absolute -right-8 bottom-12 glass rounded-xl p-4 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[var(--toolnest-accent-600)] flex items-center justify-center text-white mr-3">
                      <Clock size={18} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-[var(--toolnest-gray-900)] dark:text-white">Quick Process</div>
                      <div className="text-xs text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">Rent in under 5 minutes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-[var(--toolnest-gray-900)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <div className="tn-section-title-container">
              <h2 className="tn-section-title tn-section-title-bg centered text-3xl font-bold text-[var(--toolnest-gray-900)] dark:text-white mb-4 animate-slide-up">
                Browse by <span className="tn-section-title-accent">Category</span>
              </h2>
            </div>
            <p className="text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)] max-w-2xl mx-auto animate-slide-up delay-1">
              Find the perfect tools for your next project across our wide range of categories
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link 
                key={category.id}
                to={`/category/${category.id}`} 
                className="tn-card flex flex-col items-center justify-center p-6 h-40 hover:bg-[var(--toolnest-primary-50)] dark:hover:bg-[var(--toolnest-gray-800)] group animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="w-14 h-14 rounded-full bg-[var(--toolnest-primary-100)] dark:bg-[var(--toolnest-primary-900)] flex items-center justify-center text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)] mb-4 group-hover:scale-110 transition-transform">
                  {category.icon}
                </div>
                <h3 className="font-medium text-lg text-[var(--toolnest-gray-900)] dark:text-white text-center">
                  {category.name}
                </h3>
                <div className="mt-auto pt-2 opacity-0 group-hover:opacity-100 transition-opacity text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)] flex items-center">
                  <span className="text-sm">Explore</span>
                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[var(--toolnest-gray-50)] dark:bg-[var(--toolnest-gray-800)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="tn-section-title-container">
              <h2 className="tn-section-title tn-section-title-bg centered text-3xl font-bold text-[var(--toolnest-gray-900)] dark:text-white mb-4 animate-slide-up">
                How <span className="tn-section-title-accent">ToolNest</span> Works
              </h2>
            </div>
            <p className="text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)] max-w-2xl mx-auto animate-slide-up delay-1">
              Renting tools has never been easier. Follow these simple steps to get started.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: 1,
                title: "Find a Tool",
                description: "Browse our extensive selection of tools available in your area with detailed specifications and reviews.",
                icon: <Search size={24} />,
                color: "primary"
              },
              {
                step: 2,
                title: "Book & Pay Securely",
                description: "Reserve your tools for the dates you need them and complete secure payment through our platform.",
                icon: <Shield size={24} />,
                color: "secondary"
              },
              {
                step: 3,
                title: "Pickup & Use",
                description: "Collect your tools from the owner and complete your project with the right equipment.",
                icon: <CheckCircle size={24} />,
                color: "accent"
              }
            ].map((item, index) => (
              <div 
                key={item.step}
                className="relative flex flex-col items-center text-center animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                {/* Step number */}
                <div className={`w-16 h-16 rounded-full bg-[var(--toolnest-${item.color}-100)] dark:bg-[var(--toolnest-${item.color}-900)] flex items-center justify-center text-[var(--toolnest-${item.color}-600)] dark:text-[var(--toolnest-${item.color}-400)] mb-6`}>
                  {item.icon}
                </div>
                
                {/* Connecting line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-8 left-[calc(50%+3rem)] right-[calc(50%-3rem)] h-0.5 bg-[var(--toolnest-gray-200)] dark:bg-[var(--toolnest-gray-700)]"></div>
                )}
                
                <h3 className="text-xl font-semibold mb-3 text-[var(--toolnest-gray-900)] dark:text-white">
                  {item.title}
                </h3>
                <p className="text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-20 bg-white dark:bg-[var(--toolnest-gray-900)]">
        <div className="container mx-auto px-6">
          <div className="mb-12">
            <div className="tn-section-title-container">
              <h2 className="tn-section-title tn-section-title-bg text-3xl font-bold text-[var(--toolnest-gray-900)] dark:text-white mb-4 animate-slide-up">
                Featured <span className="tn-section-title-accent">Tools</span>
              </h2>
            </div>
            <p className="text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)] max-w-2xl animate-slide-up delay-1">
              Discover our most popular and highly-rated tools available for rent
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : featuredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredTools.map((tool, index) => (
                <div 
                  key={tool.id} 
                  className="animate-slide-up"
                  style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                >
                  <ToolCard tool={tool} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 tn-card">
              <p className="text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)] text-lg mb-4">
                We're currently updating our featured tools collection.
              </p>
              <Link 
                to="/search" 
                className="tn-button tn-button-primary inline-flex items-center"
              >
                <span>Explore all tools</span>
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          )}
          
          <div className="md:hidden mt-8 text-center">
            <Link 
              to="/search" 
              className="tn-button tn-button-outline inline-flex items-center"
            >
              <span>View all tools</span>
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[var(--toolnest-primary-50)] dark:bg-[var(--toolnest-gray-900)]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[var(--toolnest-gray-900)] dark:text-white mb-4 animate-slide-up">
              What Our Community Says
            </h2>
            <p className="text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)] max-w-2xl mx-auto animate-slide-up delay-1">
              Join thousands of satisfied members in our growing tool-sharing community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((item, index) => (
              <div 
                key={item.id} 
                className="bg-white dark:bg-[var(--toolnest-gray-800)] rounded-2xl p-8 shadow-lg relative animate-slide-up"
                style={{ animationDelay: `${0.2 + index * 0.1}s` }}
              >
                <div className="absolute top-6 right-8 text-[var(--toolnest-primary-200)] dark:text-[var(--toolnest-primary-900)]">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.33333 22H2.66667V15.3333C2.66667 11.6547 5.65467 8.66667 9.33333 8.66667V12C8.22827 12 7.33333 12.895 7.33333 14V17.3333H9.33333V22ZM21.3333 22H14.6667V15.3333C14.6667 11.6547 17.6547 8.66667 21.3333 8.66667V12C20.2283 12 19.3333 12.895 19.3333 14V17.3333H21.3333V22Z" fill="currentColor"/>
                  </svg>
                </div>
                
                <p className="text-[var(--toolnest-gray-700)] dark:text-[var(--toolnest-gray-300)] mb-6 leading-relaxed">
                  {item.content}
                </p>
                
                <div className="flex items-center">
                  <img 
                    src={item.avatar} 
                    alt={item.author} 
                    className="w-12 h-12 rounded-full mr-4 border-2 border-[var(--toolnest-primary-200)] dark:border-[var(--toolnest-primary-800)]"
                  />
                  <div>
                    <h4 className="font-semibold text-[var(--toolnest-gray-900)] dark:text-white">
                      {item.author}
                    </h4>
                    <p className="text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
                      {item.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--toolnest-primary-600)] to-[var(--toolnest-secondary-600)] opacity-90"></div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 40 10 M 10 0 L 10 40" stroke="white" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-slide-up">
              Ready to start sharing and accessing tools?
            </h2>
            <p className="text-xl text-white text-opacity-90 mb-10 animate-slide-up delay-1">
              Join our community today and unlock access to thousands of tools or earn extra income by sharing yours.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slide-up delay-2">
              <Link 
                to="/signup" 
                className="tn-button bg-white text-[var(--toolnest-primary-700)] hover:bg-white/90 focus:ring-4 focus:ring-white/30 font-medium px-8 py-4 text-lg"
              >
                Sign Up Now
              </Link>
              <Link 
                to="/about" 
                className="tn-button border-2 border-white text-white hover:bg-white/10 focus:ring-4 focus:ring-white/30 font-medium px-8 py-4 text-lg"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
