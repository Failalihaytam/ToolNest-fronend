"use client"

import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Mail, GitHub, Linkedin, Box, ArrowRight, Send, MapPin, Phone, CreditCard, Shield, Award, Heart } from "react-feather"

export default function Footer() {
  const currentYear = new Date().getFullYear()
  
  const categoryLinks = [
    { name: "Power Tools", path: "/category/power-tools" },
    { name: "Hand Tools", path: "/category/hand-tools" },
    { name: "Garden Tools", path: "/category/garden-tools" },
    { name: "Measurement", path: "/category/measurement" },
    { name: "Workshop", path: "/category/workshop" },
    { name: "Electrical", path: "/category/electrical" }
  ]

  const supportLinks = [
    { name: "Help Center", path: "/help" },
    { name: "Safety Guidelines", path: "/safety" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact Us", path: "/contact" }
  ]

  const legalLinks = [
    { name: "Terms of Service", path: "/terms" },
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Cookie Policy", path: "/cookies" }
  ]

  const socialLinks = [
    { icon: <Facebook size={18} />, name: "Facebook", url: "#" },
    { icon: <Twitter size={18} />, name: "Twitter", url: "#" },
    { icon: <Instagram size={18} />, name: "Instagram", url: "#" },
    { icon: <GitHub size={18} />, name: "GitHub", url: "#" },
    { icon: <Linkedin size={18} />, name: "LinkedIn", url: "#" }
  ]

  return (
    <footer className="bg-[rgb(203,243,239)] dark:bg-[rgb(203,243,239)] border-t border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-800)]">

      
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2  gap-8">
          {/* Logo & Description */}
          <div className="lg:col-span-2 animate-slide-up">
            <div className="flex items-center mb-6 group">
              <div className="relative mr-2">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--toolnest-primary-500)] to-[var(--toolnest-secondary-500)] opacity-75 blur-sm rounded-full"></div>
                <div className="relative">
                  <Box className="text-white" size={28} />
                </div>
              </div>
              <span className="text-2xl font-bold gradient-text tracking-tight">
                ToolNest
              </span>
            </div>
            <p className="text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)] mb-6 ">
              ToolNest is your smart, unified hub for powerful tools. We connect tool owners with people who need them, creating a community of shared resources and expertise.
            </p>
            
            {/* Three USPs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--toolnest-primary-100)] dark:bg-[var(--toolnest-primary-900)] flex items-center justify-center text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-primary-400)]">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-[var(--toolnest-gray-900)] dark:text-white">Secure & Trusted</h4>
                  <p className="text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
                    Verified users and secure transactions
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--toolnest-secondary-100)] dark:bg-[var(--toolnest-secondary-900)] flex items-center justify-center text-[var(--toolnest-secondary-600)] dark:text-[var(--toolnest-secondary-400)]">
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-[var(--toolnest-gray-900)] dark:text-white">Community-Focused</h4>
                  <p className="text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
                    Building local connections through shared resources
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--toolnest-accent-100)] dark:bg-[var(--toolnest-accent-900)] flex items-center justify-center text-[var(--toolnest-accent-600)] dark:text-[var(--toolnest-accent-400)]">
                  <Award size={18} />
                </div>
                <div>
                  <h4 className="font-medium text-[var(--toolnest-gray-900)] dark:text-white">Quality Guaranteed</h4>
                  <p className="text-sm text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
                    Well-maintained tools vetted by experts
                  </p>
                </div>
              </div>
            </div>
            
            {/* Social Links */}
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((link, index) => (
                <a 
                  key={link.name}
                  href={link.url} 
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] hover:bg-[var(--toolnest-primary-50)] hover:border-[var(--toolnest-primary-200)] dark:hover:bg-[var(--toolnest-gray-800)] text-[var(--toolnest-gray-600)] hover:text-[var(--toolnest-primary-600)] dark:text-[var(--toolnest-gray-400)] dark:hover:text-[var(--toolnest-primary-400)] transition-colors animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          

          {/* Support Column */}
          
          {/* Legal Column */}
          
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-800)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-[var(--toolnest-gray-500)] dark:text-[var(--toolnest-gray-400)]">
              &copy; {currentYear} ToolNest. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-[var(--toolnest-gray-500)] dark:text-[var(--toolnest-gray-400)]">
              <Link to="/terms" className="hover:text-[var(--toolnest-primary-600)] dark:hover:text-[var(--toolnest-primary-400)]">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-[var(--toolnest-primary-600)] dark:hover:text-[var(--toolnest-primary-400)]">
                Privacy
              </Link>
              <Link to="/cookies" className="hover:text-[var(--toolnest-primary-600)] dark:hover:text-[var(--toolnest-primary-400)]">
                Cookies
              </Link>
              <Link to="/sitemap" className="hover:text-[var(--toolnest-primary-600)] dark:hover:text-[var(--toolnest-primary-400)]">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
