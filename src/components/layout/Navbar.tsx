"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useTheme } from "../../contexts/ThemeContext"
import { 
  Search, Menu, X, Sun, Moon, User, Tool, 
  Heart, LogOut, Grid, Settings, Box, ChevronDown, 
  Package, Home, Compass, Bell
} from "react-feather"

export default function Navbar() {
  const { user, isAuthenticated, logout, becomePartner } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [upgrading, setUpgrading] = useState(false)
  const [showContractModal, setShowContractModal] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Track scroll position to apply styles when scrolled
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY
      setIsScrolled(offset > 10)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // Handle partner upgrade
  const handlePartnerUpgrade = (e: React.MouseEvent) => {
    e.preventDefault()
    setShowContractModal(true)
  }

  const handleAcceptContract = async () => {
    if (!agreementChecked) {
      alert("Please read and accept the Partner Agreement")
      return
    }

    setUpgrading(true)
    try {
      const success = await becomePartner()
      if (success) {
        setShowContractModal(false)
        alert("Congratulations! You are now a partner.")
        navigate('/partner-dashboard')
      } else {
        throw new Error("Failed to upgrade to partner status")
      }
    } catch (error) {
      console.error("Error upgrading to partner:", error)
      alert("Failed to complete partner upgrade. Please try again.")
    } finally {
      setUpgrading(false)
    }
  }

  const navbarClasses = `
    fixed top-0 left-0 w-full z-40 transition-all duration-300
    ${isScrolled 
      ? 'py-2 bg-[rgb(203,243,239)] backdrop-blur-md shadow-md dark:bg-[rgb(203,243,239)]' 
      : 'py-4 bg-[rgb(203,243,239)] dark:bg-[rgb(203,243,239)]'}
  `

  return (
    <>
      <header className={navbarClasses}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center group animate-float">
              <div className="relative mr-2 text-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--toolnest-primary-500)] to-[var(--toolnest-secondary-500)] opacity-75 blur-sm rounded-full"></div>
                <div className="relative">
                  <Box className="text-white" size={28} />
                </div>
              </div>
              <span className="text-2xl font-bold gradient-text tracking-tight">
                ToolNest
              </span>
            </Link>

            {/* Search Bar */}
            

            {/* User Menu / Auth Links */}
            <div className="hidden md:flex items-center space-x-3">
              

              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-1 rounded-full group-hover:bg-[var(--toolnest-gray-100)] dark:group-hover:bg-[var(--toolnest-gray-700)] transition-colors">
                    
                    <span className="text-[var(--toolnest-gray-800)] dark:text-white font-medium">
                      {user?.name?.split(' ')[0] || 'User'}
                    </span>
                    <ChevronDown size={16} className="text-[var(--toolnest-gray-500)] transition-transform group-hover:rotate-180" />
                  </button>
                  
                  <div className="absolute right-0 w-56 mt-2 bg-white rounded-lg shadow-lg overflow-hidden z-20 invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 dark:bg-[var(--toolnest-gray-800)] border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)]">
                    <div className="p-3 border-b border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] animate-scale-in">
                      <p className="text-sm font-medium text-[var(--toolnest-gray-900)] dark:text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-[var(--toolnest-gray-500)]">{user?.email || 'user@example.com'}</p>
                    </div>
                    
                    <div className="py-1 animate-slide-up delay-1">
                      <Link
                        to="/dashboard"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-[var(--toolnest-gray-700)] hover:bg-[var(--toolnest-gray-100)] dark:text-[var(--toolnest-gray-300)] dark:hover:bg-[var(--toolnest-gray-700)]"
                      >
                        <User size={16} />
                        <span>Dashboard</span>
                      </Link>

                      {user?.role === 'partner' ? (
                        <Link
                          to="/partner-dashboard"
                          className="flex items-center space-x-2 px-4 py-2 my-2 rounded-md bg-gradient-to-r from-blue-400 to-green-500 text-white font-bold text-base shadow-lg hover:scale-105 transition-transform duration-200"
                          style={{ justifyContent: 'center' }}
                        >
                          <Tool size={16} className="mr-1" />
                          <span>Partner Dashboard</span>
                        </Link>
                      ) : (
                        <button
                          onClick={handlePartnerUpgrade}
                          disabled={upgrading}
                          className="flex items-center space-x-2 px-4 py-2 my-2 w-full rounded-md bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 text-white font-bold text-base shadow-lg hover:scale-105 transition-transform duration-200"
                          style={{ justifyContent: 'center' }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.09 6.26L21 9.27l-5 4.87L17.18 21 12 17.27 6.82 21 8 14.14l-5-4.87 6.91-1.01L12 3z" />
                          </svg>
                          <span>{upgrading ? 'Processing...' : 'Upgrade to Partner'}</span>
                        </button>
                      )}
                    </div>
                    
                    <div className="py-1 border-t border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] animate-slide-up delay-2">
                      <button
                        onClick={logout}
                        className="flex w-full items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                      >
                        <LogOut size={16} />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link
                    to="/signin"
                    className="px-4 py-2 rounded-md text-[var(--toolnest-primary-700)] hover:bg-[var(--toolnest-primary-50)] transition-colors dark:text-[var(--toolnest-primary-400)] dark:hover:bg-[var(--toolnest-primary-950)]"
                  >
                    Sign In
                  </Link>
                  
                  <Link
                    to="/signup"
                    className="tn-button tn-button-primary rounded-md shadow-sm hover:shadow"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-md text-[var(--toolnest-gray-700)] hover:bg-[var(--toolnest-gray-100)] dark:text-[var(--toolnest-gray-300)] dark:hover:bg-[var(--toolnest-gray-700)] transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          <div 
            className={`md:hidden fixed inset-0 top-[calc(var(--navbar-height,4rem)+1px)] bg-white dark:bg-[var(--toolnest-gray-900)] z-30 transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="p-5 space-y-6 h-full overflow-y-auto">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for tools..."
                  className="w-full py-3 pl-10 pr-4 rounded-full border border-[var(--toolnest-gray-200)] focus:border-[var(--toolnest-primary-500)] bg-[var(--toolnest-gray-50)] dark:bg-[var(--toolnest-gray-800)] dark:text-white dark:border-[var(--toolnest-gray-700)]"
                />
                <Search 
                  size={18} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--toolnest-gray-400)]" 
                />
              </form>
              
              <nav className="flex flex-col space-y-2">
                <Link
                  to="/"
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-[var(--toolnest-gray-100)] dark:hover:bg-[var(--toolnest-gray-800)] animate-slide-in-right"
                  style={{ animationDelay: '0.1s' }}
                >
                  <Home size={20} className="text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]" />
                  <span className="font-medium text-[var(--toolnest-gray-800)] dark:text-white">Home</span>
                </Link>
                
                <Link
                  to="/explore"
                  className="flex items-center space-x-2 p-3 rounded-md hover:bg-[var(--toolnest-gray-100)] dark:hover:bg-[var(--toolnest-gray-800)] animate-slide-in-right"
                  style={{ animationDelay: '0.15s' }}
                >
                  <Compass size={20} className="text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]" />
                  <span className="font-medium text-[var(--toolnest-gray-800)] dark:text-white">Explore</span>
                </Link>
                
                <div className="pt-4 pb-2 animate-slide-in-right" style={{ animationDelay: '0.2s' }}>
                  <h3 className="px-3 text-sm font-semibold text-[var(--toolnest-gray-500)] uppercase tracking-wider">
                    Categories
                  </h3>
                </div>
                
                {['Power Tools', 'Hand Tools', 'Garden Tools', 'Measurement', 'Workshop', 'Electrical'].map((category, idx) => (
                  <Link
                    key={category}
                    to={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`}
                    className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-[var(--toolnest-gray-100)] dark:hover:bg-[var(--toolnest-gray-800)] text-[var(--toolnest-gray-700)] dark:text-[var(--toolnest-gray-300)] animate-slide-in-right"
                    style={{ animationDelay: `${0.25 + idx * 0.05}s` }}
                  >
                    <span>{category}</span>
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] mt-4 animate-slide-in-right" style={{ animationDelay: '0.55s' }}>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 w-full px-3 py-2 rounded-md hover:bg-[var(--toolnest-gray-100)] dark:hover:bg-[var(--toolnest-gray-800)]"
                  >
                    {theme === 'dark' ? <Sun size={20} className="text-[var(--toolnest-accent-500)]" /> : <Moon size={20} className="text-[var(--toolnest-primary-600)]" />}
                    <span className="font-medium text-[var(--toolnest-gray-800)] dark:text-white">
                      {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                    </span>
                  </button>
                </div>
                
                {isAuthenticated ? (
                  <div className="space-y-2 pt-4 border-t border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] mt-4 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
                    <div className="flex items-center space-x-3 px-3 py-3">
                      <img
                        src={user?.avatar || 'https://via.placeholder.com/40'}
                        alt="Profile"
                        className="w-10 h-10 rounded-full border-2 border-[var(--toolnest-primary-500)]"
                      />
                      <div>
                        <p className="font-medium text-[var(--toolnest-gray-900)] dark:text-white">{user?.name || 'User'}</p>
                        <p className="text-sm text-[var(--toolnest-gray-500)]">{user?.email || 'user@example.com'}</p>
                      </div>
                    </div>
                    
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-[var(--toolnest-gray-100)] dark:hover:bg-[var(--toolnest-gray-800)]"
                    >
                      <User size={20} className="text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]" />
                      <span className="text-[var(--toolnest-gray-800)] dark:text-white">Dashboard</span>
                    </Link>
                    
                    {user?.role === 'partner' ? (
                      <Link
                        to="/partner-dashboard"
                        className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-[var(--toolnest-gray-100)] dark:hover:bg-[var(--toolnest-gray-800)]"
                      >
                        <Tool size={20} className="text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]" />
                        <span className="text-[var(--toolnest-gray-800)] dark:text-white">Partner Dashboard</span>
                      </Link>
                    ) : (
                      <button
                        onClick={handlePartnerUpgrade}
                        disabled={upgrading}
                        className="flex items-center space-x-2 px-3 py-2 w-full text-left rounded-md hover:bg-[var(--toolnest-gray-100)] dark:hover:bg-[var(--toolnest-gray-800)]"
                      >
                        <Tool size={20} className="text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]" />
                        <span className="text-[var(--toolnest-gray-800)] dark:text-white">
                          {upgrading ? 'Processing...' : 'Upgrade to Partner'}
                        </span>
                      </button>
                    )}
                    
                    <button
                      onClick={logout}
                      className="flex items-center space-x-2 px-3 py-2 w-full rounded-md text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 mt-4"
                    >
                      <LogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-4 border-t border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] mt-4 px-3 animate-slide-in-right" style={{ animationDelay: '0.6s' }}>
                    <Link
                      to="/signin"
                      className="block w-full px-4 py-3 text-center font-medium rounded-md border border-[var(--toolnest-primary-600)] text-[var(--toolnest-primary-700)] dark:border-[var(--toolnest-primary-400)] dark:text-[var(--toolnest-primary-400)]"
                    >
                      Sign In
                    </Link>
                    
                    <Link
                      to="/signup"
                      className="block w-full px-4 py-3 text-center font-medium rounded-md bg-[var(--toolnest-primary-600)] text-white shadow hover:bg-[var(--toolnest-primary-700)] dark:bg-[var(--toolnest-primary-500)] dark:hover:bg-[var(--toolnest-primary-600)]"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Contract Modal */}
      {showContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Partner Agreement</h2>
            
            <div className="prose dark:prose-invert max-w-none mb-6">
              <h3>Terms and Conditions</h3>
              <p>Before becoming a partner, please read and accept our terms and conditions:</p>
              
              <ol className="list-decimal pl-5 space-y-2">
                <li>You agree to maintain high-quality standards for your tools and equipment.</li>
                <li>You must provide accurate descriptions and images of your tools.</li>
                <li>You must respond to rental requests within 24 hours.</li>
                <li>Service fees of 10% will be applied to each successful rental.</li>
                <li>You must comply with all local laws and regulations.</li>
                <li>You must maintain appropriate insurance coverage.</li>
                <li>ToolNest reserves the right to suspend partner accounts for violations.</li>
              </ol>

              <h3 className="mt-4">Partner Responsibilities</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Keep your tools well-maintained and safe for use</li>
                <li>Provide clear pickup/delivery instructions</li>
                <li>Respond promptly to customer inquiries</li>
                <li>Handle disputes professionally</li>
                <li>Maintain accurate calendar availability</li>
              </ul>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <input
                type="checkbox"
                id="nav-contract-agreement"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="form-checkbox h-4 w-4 text-green-600"
              />
              <label htmlFor="nav-contract-agreement" className="text-sm">
                I have read and agree to the Partner Agreement
              </label>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6 pt-4 border-t">
              <button
                onClick={() => setShowContractModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAcceptContract}
                disabled={upgrading || !agreementChecked}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {upgrading ? (
                  <div className="flex items-center space-x-2">
                    <span>Processing...</span>
                  </div>
                ) : (
                  "Accept & Become Partner"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}