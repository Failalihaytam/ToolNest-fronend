"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link, useNavigate, useSearchParams } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Facebook, Mail, Lock, LogIn, User, AlertCircle, Box, ArrowRight, GitHub } from "react-feather"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const { login, loginWithGoogle, loginWithFacebook } = useAuth()
  const navigate = useNavigate()
  const searchParams = useSearchParams()[0]
  
  // Get redirect URL from query params if available
  const redirectUrl = searchParams.get('redirect') || '/'

// Define a type for the possible response structure
type LoginResponse =
  | { token: string }
  | { data: { token: string } }
  | { access_token: string }
  | null
  | undefined;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);
  try {
    const success = await login(email, password, rememberMe);
    if (success) {
      navigate('/search');
    } else {
      setError("Failed to sign in. Please check your credentials.");
    }
  } catch (err) {
    setError("Failed to sign in. Please check your credentials.");
  } finally {
    setIsLoading(false);
  }
};
  
    const handleGoogleSignIn = async () => {
      setIsLoading(true)
      try {
        await loginWithGoogle()
        navigate(redirectUrl)
      } catch (err) {
        setError("Failed to sign in with Google.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    };
  
    const handleFacebookSignIn = async () => {
      setIsLoading(true)
      try {
        await loginWithFacebook()
        navigate(redirectUrl)
      } catch (err) {
        setError("Failed to sign in with Facebook.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    };
  
    return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--toolnest-gray-50)] dark:bg-[var(--toolnest-gray-950)] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="absolute -left-10 top-1/3 w-72 h-72 bg-[var(--toolnest-primary-400)] rounded-full blur-[100px]"></div>
        <div className="absolute right-0 bottom-1/4 w-80 h-80 bg-[var(--toolnest-secondary-400)] rounded-full blur-[120px]"></div>
      </div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="tn-card p-8 border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-800)]">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center group">
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
          </div>
          
          <div className="mb-6">
            <h2 className="text-center text-3xl font-bold text-[var(--toolnest-gray-900)] dark:text-white mb-2">
              Welcome back
            </h2>
            <p className="text-center text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
              Sign in to your account to continue
            </p>
          </div>

          {error && (
            <div className="mb-6 flex items-start p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400">
              <AlertCircle size={18} className="mr-3 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5 mb-8" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email-address" className="block text-sm font-medium text-[var(--toolnest-gray-700)] dark:text-[var(--toolnest-gray-300)] mb-1">
                  Email address
                </label>
                <div className="relative">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="tn-input icon-input"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--toolnest-gray-400)]" />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-[var(--toolnest-gray-700)] dark:text-[var(--toolnest-gray-300)]">
                    Password
                  </label>
                  <a href="#" className="text-sm font-medium text-[var(--toolnest-primary-600)] hover:text-[var(--toolnest-primary-700)] dark:text-[var(--toolnest-primary-400)] dark:hover:text-[var(--toolnest-primary-300)]">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="tn-input icon-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[var(--toolnest-gray-400)]" />
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-[var(--toolnest-gray-300)] text-[var(--toolnest-primary-600)] focus:ring-[var(--toolnest-primary-500)] dark:border-[var(--toolnest-gray-600)] dark:bg-[var(--toolnest-gray-800)]"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-[var(--toolnest-gray-700)] dark:text-[var(--toolnest-gray-300)]">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="tn-button tn-button-primary w-full py-2.5 flex items-center justify-center group"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in
                  <LogIn size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </button>
          </form>

          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-[var(--toolnest-gray-800)] text-[var(--toolnest-gray-500)]">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="flex items-center justify-center py-2.5 px-4 rounded-md border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] bg-white dark:bg-[var(--toolnest-gray-800)] hover:bg-[var(--toolnest-gray-50)] dark:hover:bg-[var(--toolnest-gray-700)] transition-colors group tn-button-social"
              >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </button>

              <button
                onClick={handleFacebookSignIn}
                disabled={isLoading}
                className="flex items-center justify-center py-2.5 px-4 rounded-md border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] bg-white dark:bg-[var(--toolnest-gray-800)] hover:bg-[var(--toolnest-gray-50)] dark:hover:bg-[var(--toolnest-gray-700)] transition-colors group tn-button-social"
              >
                <Facebook className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                disabled={isLoading}
                className="flex items-center justify-center py-2.5 px-4 rounded-md border border-[var(--toolnest-gray-200)] dark:border-[var(--toolnest-gray-700)] bg-white dark:bg-[var(--toolnest-gray-800)] hover:bg-[var(--toolnest-gray-50)] dark:hover:bg-[var(--toolnest-gray-700)] transition-colors group tn-button-social"
              >
                <GitHub className="w-5 h-5 text-[var(--toolnest-gray-900)] dark:text-white group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[var(--toolnest-gray-600)] dark:text-[var(--toolnest-gray-400)]">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-[var(--toolnest-primary-600)] hover:text-[var(--toolnest-primary-700)] dark:text-[var(--toolnest-primary-400)] dark:hover:text-[var(--toolnest-primary-300)] inline-flex items-center"
              >
                Sign up
                <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
