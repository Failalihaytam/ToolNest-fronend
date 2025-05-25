import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Tool, Archive, Star, FileText, Settings, Home, 
  Package, Calendar, Bell, Users, PlusCircle, 
  DollarSign, BarChart2, Edit, Trash2, Eye, AlertCircle, Check, User
} from 'react-feather'
import LoadingSpinner from '../ui/LoadingSpinner'
import EditProfile from './EditProfile'

// @ts-ignore
import { getListing, Listing, getPartnerListings } from '@/app/services/listingService'
import { getUserReservations, Reservation, getPartnerReservations } from '@/app/services/reservationService'
import PartnerReviewSection from '../reviews/PartnerReviewSection';
import { 
  acceptReservation, 
  declineReservation
} from '@/app/services/reservationService'
import { toast } from 'react-hot-toast'

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'tools', label: 'My Tools', icon: Tool },
  { id: 'reservations', label: 'Reservations', icon: Calendar },
  { id: 'notifications', label: 'Notifications', icon: Bell }
]

// Statistics for the dashboard
const initialStatistics = {
  activeAnnounces: 0,
  totalReservations: 0,
  averageRating: 0,
  totalRevenue: "$0"
}

const PartnerDashboardPage = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [selectedSection, setSelectedSection] = useState('dashboard')
  const [statistics, setStatistics] = useState(initialStatistics)
  const [activeTools, setActiveTools] = useState<Listing[]>([])
  const [toolsLoading, setToolsLoading] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [reservationsLoading, setReservationsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeToolTab, setActiveToolTab] = useState('active')

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        navigate('/signin?redirect=/partner-dashboard')
        return
      }
      
      // Check if user is a partner
      if (user && user.role !== 'partner') {
        // Redirect to client dashboard with a message
        navigate('/dashboard?error=partnersOnly')
        return
      }
      
      try {
        // Load partner dashboard data
        await fetchPartnerData()
      } catch (error) {
        console.error('Error loading partner dashboard:', error)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [isAuthenticated, navigate, user])

  const fetchPartnerData = async () => {
    try {
      // Fetch partner's listings
      await fetchListings()
      
      // Fetch partner's reservations
      await fetchReservations()
      
      // Update statistics based on the data
      updateStatistics()
    } catch (error) {
      console.error('Error fetching partner data:', error)
      throw error
    }
  }

  const fetchListings = async () => {
    setToolsLoading(true)
    try {
      const response = await getPartnerListings()
      if (response.status === 'success' && response.data) {
        // Handle possible pagination in the response
        const listings = Array.isArray(response.data)
          ? response.data
          : (typeof response.data === 'object' && response.data !== null && 'data' in response.data && Array.isArray((response.data as any).data)
              ? (response.data as { data: Listing[] }).data
              : [])

        setActiveTools(listings)
        
        // Update statistics
        setStatistics(prev => ({
          ...prev,
          activeAnnounces: listings.filter((l: { status: string }) => l.status === 'active').length
        }))
      }
    } catch (error) {
      console.error('Error fetching listings:', error)
      setError('Failed to load your listings')
    } finally {
      setToolsLoading(false)
    }
  }

  const fetchReservations = async () => {
    setReservationsLoading(true)
    try {
      const response = await getPartnerReservations()
      if (response.status === 'success' && response.data) {
        // Handle possible pagination in the response
        const reservationData = Array.isArray(response.data) 
          ? response.data 
          : (typeof response.data === 'object' && response.data !== null && 'data' in response.data && Array.isArray((response.data as any).data)
              ? (response.data as { data: Reservation[] }).data
              : [])
        
        setReservations(reservationData)
        
        // Update statistics
        const totalRevenue = reservationData
          .filter((r: Reservation) => r.status === 'completed')
          .reduce((sum: number, r: Reservation) => sum + (r.total_price || 0), 0)
          
        setStatistics(prev => ({
          ...prev,
          totalReservations: reservationData.length,
          totalRevenue: `$${totalRevenue.toFixed(2)}`
        }))
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setReservationsLoading(false)
    }
  }

  const updateStatistics = () => {
    // Calculate average rating from tools
    const tools = activeTools.filter(tool => tool.avg_rating > 0)
    const avgRating = tools.length > 0
      ? tools.reduce((sum, tool) => sum + Number(tool.avg_rating), 0) / tools.length
      : 0
      
    setStatistics(prev => ({
      ...prev,
      averageRating: avgRating
    }))
  }

  const handleViewTool = (id: number) => {
    navigate(`/tools/${id}`)
  }

  const handleEditTool = (id: number) => {
    navigate(`/edit-listing/${id}`)
  }

  const handleArchiveTool = async (id: number) => {
    if (window.confirm('Are you sure you want to archive this listing?')) {
      try {
        // TODO: Implement archive API call
        // await archiveListing(id)
        
        // Refresh listings after archiving
        await fetchListings()
      } catch (error) {
        console.error('Error archiving listing:', error)
        alert('Failed to archive listing')
      }
    }
  }

  // Add the accept/decline reservation handlers
  const handleAcceptReservation = async (id: number) => {
    try {
      const response = await acceptReservation(id);
      
      if (response.status === 'success') {
        // Show success message
        toast.success('Reservation accepted successfully');
        // Refresh reservations
        await fetchReservations();
      } else {
        toast.error(response.message || 'Failed to accept reservation');
      }
    } catch (error) {
      console.error('Error accepting reservation:', error);
      toast.error('An unexpected error occurred');
    }
  }

  const handleDeclineReservation = async (id: number) => {
    if (window.confirm('Are you sure you want to decline this reservation?')) {
      try {
        const response = await declineReservation(id);
        
        if (response.status === 'success') {
          // Show success message
          toast.success('Reservation declined');
          // Refresh reservations
          await fetchReservations();
        } else {
          toast.error(response.message || 'Failed to decline reservation');
        }
      } catch (error) {
        console.error('Error declining reservation:', error);
        toast.error('An unexpected error occurred');
      }
    }
  }

  const renderContent = () => {
    switch (selectedSection) {
      case 'dashboard':
        return (
          <>
            {/* Statistics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 flex items-center">
                <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 mr-4">
                  <Tool size={24} className="text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Active Listings</h3>
                  <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{statistics.activeAnnounces}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 flex items-center">
                <div className="p-3 rounded-full bg-green-50 dark:bg-green-900/20 mr-4">
                  <Calendar size={24} className="text-green-500 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Reservations</h3>
                  <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{statistics.totalReservations}</p>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 flex items-center">
                <div className="p-3 rounded-full bg-amber-50 dark:bg-amber-900/20 mr-4">
                  <Star size={24} className="text-amber-500 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Average Rating</h3>
                  <div className="flex items-center mt-1">
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{statistics.averageRating}</p>
                    <Star size={16} className="text-amber-400 ml-2" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 flex items-center">
                <div className="p-3 rounded-full bg-purple-50 dark:bg-purple-900/20 mr-4">
                  <DollarSign size={24} className="text-purple-500 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm">Total Revenue</h3>
                  <p className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{statistics.totalRevenue}</p>
                </div>
              </div>
            </div>

            {/* Tools Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Listings</h2>
                <div className="flex space-x-2">
                  <Link to="/tools" className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Settings size={14} className="mr-2" />
                    Manage All
                  </Link>
                  <Link to="/create-listing" className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                    <PlusCircle size={14} className="mr-2" />
                    New Listing
                  </Link>
                </div>
              </div>

              {/* Tools List */}
              {toolsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : activeTools.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <Tool size={40} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Tools Listed Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Start earning by adding your first tool listing.</p>
                  <Link to="/create-listing" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                    <PlusCircle size={16} className="mr-2" />
                    Add Your First Tool
                  </Link>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tool
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Rating
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {activeTools.slice(0, 5).map((tool) => (
                        <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                {tool.images && tool.images.length > 0 ? (
                                  <img 
                                    src={tool.images[0].url} 
                                    alt={tool.title} 
                                    className="h-10 w-10 object-cover"
                                  />
                                ) : (
                                  <div className="h-10 w-10 flex items-center justify-center text-gray-500">
                                    <Package size={16} />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.title}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{tool.category?.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">${tool.price_per_day}/day</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <Star size={16} className="text-amber-400 mr-1" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {tool.avg_rating > 0 ? Number(tool.avg_rating).toFixed(1) : 'New'}
                              </span>
                              <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                                ({tool.review_count || 0})
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${tool.status === 'active' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                            >
                              {tool.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleViewTool(tool.id)} 
                                className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                                title="View"
                              >
                                <Eye size={16} />
                              </button>
                              <button 
                                onClick={() => handleEditTool(tool.id)} 
                                className="text-blue-400 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleArchiveTool(tool.id)} 
                                className="text-red-400 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                                title="Archive"
                              >
                                <Archive size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Reservations */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Recent Reservations</h2>
                <Link to="/reservations" className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  View All
                </Link>
              </div>

              {reservationsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : reservations.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                  <Calendar size={40} className="mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Reservations Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400">You don't have any reservations yet.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Client
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Tool
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Dates
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {reservations.slice(0, 5).map((reservation) => (
                        <tr key={reservation.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                {reservation.user?.avatar ? (
                                  <img 
                                    src={reservation.user.avatar} 
                                    alt={reservation.user.name} 
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <div className="h-8 w-8 flex items-center justify-center text-gray-500">
                                    <Users size={14} />
                                  </div>
                                )}
                              </div>
                              <div className="ml-3">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {reservation.user?.name || 'Unknown User'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {reservation.listing?.title || 'Unknown Tool'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${reservation.status === 'confirmed' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                                : reservation.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                  : reservation.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
                            >
                              {reservation.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            {reservation.status === 'pending' ? (
                              <div className="flex justify-end space-x-2">
                                <button 
                                  onClick={() => handleAcceptReservation(reservation.id)} 
                                  className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                                >
                                  Accept
                                </button>
                                <button 
                                  onClick={() => handleDeclineReservation(reservation.id)} 
                                  className="text-red-600 hover:text-red-700 dark:text-red-500 dark:hover:text-red-400"
                                >
                                  Decline
                                </button>
                              </div>
                            ) : (
                              <button className="text-blue-400 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                View Details
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        );
      case 'profile':
        return (
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg shadow p-6 mb-6">
              <EditProfile />
            </div>
          </div>
        );
      case 'tools':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Tool Management</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Manage your tools, check statistics, and update listings
                </p>
              </div>
              <Link to="/create-listing" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600">
                <PlusCircle size={16} className="mr-2" />
                Add New Tool
              </Link>
            </div>
            
            <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveToolTab('active')}
                  className={`px-1 py-4 text-sm font-medium ${
                    activeToolTab === 'active'
                      ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  Active Listings
                </button>
                <button
                  onClick={() => setActiveToolTab('archived')}
                  className={`px-1 py-4 text-sm font-medium ${
                    activeToolTab === 'archived'
                      ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  Archived Listings
                </button>
                <button
                  onClick={() => setActiveToolTab('drafts')}
                  className={`px-1 py-4 text-sm font-medium ${
                    activeToolTab === 'drafts'
                      ? 'border-b-2 border-green-500 text-green-600 dark:text-green-400'
                      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
                  }`}
                >
                  Drafts
                </button>
              </nav>
            </div>
            
            {toolsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : activeTools.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                <Tool size={40} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Tools Listed Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Start earning by adding your first tool listing.</p>
                <Link to="/create-listing" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700">
                  <PlusCircle size={16} className="mr-2" />
                  Add Your First Tool
                </Link>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tool
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Rating
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Rentals
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {activeTools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                              {tool.images && tool.images.length > 0 ? (
                                <img 
                                  src={tool.images[0].url} 
                                  alt={tool.title} 
                                  className="h-10 w-10 object-cover"
                                />
                              ) : (
                                <div className="h-10 w-10 flex items-center justify-center text-gray-500">
                                  <Package size={16} />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{tool.title}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{tool.category?.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">${tool.price_per_day}/day</div>
                          {tool.security_deposit && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              ${tool.security_deposit} deposit
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Star size={16} className="text-amber-400 mr-1" />
                            <span className="text-sm text-gray-900 dark:text-white">
                              {tool.avg_rating > 0 ? Number(tool.avg_rating).toFixed(1) : 'New'}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">
                              ({tool.review_count || 0})
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {tool.total_rentals || 0} rentals
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${tool.status === 'active' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}
                          >
                            {tool.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button 
                              onClick={() => handleViewTool(tool.id)} 
                              className="text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300"
                              title="View"
                            >
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => handleEditTool(tool.id)} 
                              className="text-blue-400 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={() => handleArchiveTool(tool.id)} 
                              className="text-red-400 hover:text-red-500 dark:text-red-400 dark:hover:text-red-300"
                              title="Archive"
                            >
                              <Archive size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      case 'reservations':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Reservations Management</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View and manage all reservations for your tools
                </p>
              </div>
            </div>
            
            {reservationsLoading ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : reservations.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
                <Calendar size={40} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Reservations Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You don't have any reservations for your tools yet.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {reservations.map(reservation => (
                  <div key={reservation.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex flex-wrap items-start">
                      <div className="w-full md:w-1/2 lg:w-2/3 flex">
                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                          {reservation.listing?.images && reservation.listing.images.length > 0 ? (
                            <img 
                              src={reservation.listing.images[0].url} 
                              alt={reservation.listing.title} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 flex items-center justify-center text-gray-500">
                              <Package size={24} />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{reservation.listing?.title || 'Unknown Tool'}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <Users size={14} className="mr-1" />
                            <span>{reservation.user?.name || 'Unknown User'}</span>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar size={14} className="mr-1" />
                            <span>
                              {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-1/2 lg:w-1/3 flex justify-between items-center mt-4 md:mt-0 md:justify-end">
                        <div className="mr-4">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${reservation.status === 'confirmed' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : reservation.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                : reservation.status === 'completed'
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}
                          >
                            {reservation.status}
                          </span>
                          <div className="text-lg font-bold mt-1 text-gray-900 dark:text-white">${reservation.total_price}</div>
                        </div>
                        <div className="flex space-x-2">
                          {reservation.status === 'pending' && (
                            <>
                              <button 
                                onClick={() => handleAcceptReservation(reservation.id)}
                                className="px-3 py-2 border border-transparent text-sm font-medium rounded-md bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                              >
                                Accept
                              </button>
                              <button 
                                onClick={() => handleDeclineReservation(reservation.id)}
                                className="px-3 py-2 border border-transparent text-sm font-medium rounded-md bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          <button className="px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                    {reservation.status === 'completed' && (
      <PartnerReviewSection 
        reservation={reservation} 
        onReviewSubmitted={() => fetchReservations()} 
      />
    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'clients':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Client Management</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  View and manage your clients and their rental history
                </p>
              </div>
            </div>
            
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-900/30 rounded-lg">
              <Users size={40} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Client Data Coming Soon</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                This feature is under development. Check back soon!
              </p>
            </div>
          </div>
        );
      case 'notifications':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Notifications</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Stay updated with all your listing and reservation activities
                </p>
              </div>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                Mark All as Read
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/10 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      New reservation request for <span className="font-medium">Bosch Impact Drill</span>
                    </p>
                    <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                      30 minutes ago
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-l-4 border-green-400 bg-green-50 dark:bg-green-900/10 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Check className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Payment received for <span className="font-medium">Makita Circular Saw</span> rental
                    </p>
                    <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                      2 hours ago
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-l-4 border-blue-400 bg-blue-50 dark:bg-blue-900/10 rounded-r-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Star className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      New 5-star review for <span className="font-medium">DeWalt Hammer Drill</span>
                    </p>
                    <div className="mt-2 text-xs text-blue-600 dark:text-blue-400">
                      1 day ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-24">
        <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-lg text-red-600 dark:text-red-400 max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
          <p>{error}</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-600 hover:text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 lg:shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
            {/* Profile section */}
            <div className="text-center p-4 border-b border-gray-200 dark:border-gray-700 mb-4">
              
              <h3 className="font-semibold text-gray-900 dark:text-white mt-2">{user?.name || 'Partner'}</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">Partner Account</span>
            </div>
            
            {/* Menu items */}
            <div className="space-y-2">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSection(item.id)}
                  className={`w-full flex items-center space-x-2 p-3 rounded-lg transition-colors
                    ${selectedSection === item.id 
                      ? 'bg-[#0ac5b2]/10 text-[#0ac5b2] dark:bg-[#0ac5b2]/20 dark:text-[#0ac5b2]' 
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link 
                to="/dashboard" 
                className="w-full flex items-center space-x-2 p-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50"
              >
                <Users size={18} />
                <span>Switch to User Dashboard</span>
              </Link>
              
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {menuItems.find(item => item.id === selectedSection)?.label || 'Partner Dashboard'}
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                {selectedSection === 'dashboard' 
                  ? 'Welcome back! Here\'s an overview of your rental business.' 
                  : selectedSection === 'tools'
                    ? 'Manage your tool listings, pricing, and availability.'
                    : selectedSection === 'reservations'
                      ? 'View and manage all your tool rental requests and bookings.'
                      : selectedSection === 'clients'
                        ? 'Track your client interactions and history.'
                        : 'Stay updated with all your platform notifications.'}
              </p>
            </div>
            
            {selectedSection === 'dashboard' && (
              <Link to="/create-listing" className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#0ac5b2] hover:bg-[#09b3a2] dark:bg-[#0ac5b2] dark:hover:bg-[#09b3a2]">
                <PlusCircle size={16} className="mr-2" />
                New Listing
              </Link>
            )}
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default PartnerDashboardPage