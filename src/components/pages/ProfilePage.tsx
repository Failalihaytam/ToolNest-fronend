"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { User } from '../../types/User'
import LoadingSpinner from '../ui/LoadingSpinner'
import SignaleeButton from "./Signalee_Button"; // Adjust the path if needed
import { getUserProfile } from '@/app/services/userService'

const ProfilePage = () => {
  const { id } = useParams()
  const [profile, setProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const user = await getUserProfile(id!)
        setProfile(user)
      } catch (error) {
        setProfile(null)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">User not found</h1>
        <p>The requested profile does not exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <img 
            src={profile.avatar || "/placeholder.svg"}
            alt={profile.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
            <div className="mb-2 text-gray-700">{profile.email}</div>
            <div className="flex items-center mb-2">
              <span className="text-yellow-500 mr-1">★</span>
              <span>{profile.rating} • Member since {profile.memberSince ? new Date(profile.memberSince).toLocaleDateString() : ""}</span>
            </div>
            <p className="text-gray-700 mb-4">{profile.bio}</p>
            <SignaleeButton partnerId={Number(profile.id)} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage