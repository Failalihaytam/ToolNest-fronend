"use client"

import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
// Standardized on lucide-react, aliasing Tool and User
import { 
  Calendar, 
  Wrench as ToolIcon, 
  AlertCircle, 
  Home, 
  Heart, 
  Bell, 
  User as UserIcon, 
  Award, 
  MessageSquare, 
  Check, 
  Loader2 
} from 'lucide-react'
import LoadingSpinner from '../ui/LoadingSpinner'
import { getUserReservations, Reservation } from '@/app/services/reservationService'
import EditProfile from './EditProfile';
import { getUserLikedListings, Listing } from '@/app/services/listingService';
import ToolCard from '../tools/ToolCard';
import ReviewForm  from '../reviews/ReviewForm';
import { checkPendingReviews, submitReview, ReviewSubmission } from '@/app/services/reviewService';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'react-hot-toast';

// If you have a local Tool type, you might import it like this:
// import { Tool as ToolType } from '@/types/Tool'; // Adjust path as needed

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'profile', label: 'Profile', icon: UserIcon },
  { id: 'reservations', label: 'Reservations', icon: Calendar },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'notifications', label: 'Notification', icon: Bell },
];

const notificationsSampleData = [
  {
    id: 1,
    title: "Reservation Confirmed",
    message: "Your reservation for Bosch Impact Drill has been confirmed",
    time: "2 hours ago"
  },
  {
    id: 2,
    title: "Return Reminder",
    message: "Makita Circular Saw needs to be returned in 2 days",
    time: "2 days ago"
  }
];

const initialStatistics = {
  activeAnnounces: 0,
  totalReservations: 0,
  averageRating: 0,
  totalRevenue: "$0"
};

interface PendingReviewInfo {
  canReviewListing: boolean;
  canReviewPartner: boolean;
  listingId?: number;
  listingTitle?: string;
  partnerId?: number;
  partnerName?: string;
}

const DashboardPage = () => {
  const { user, isAuthenticated, loading: authLoading, becomePartner, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('dashboard');
  const [selectedTab, setSelectedTab] = useState('current');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [statistics, setStatistics] = useState(initialStatistics);

  const [currentReservations, setCurrentReservations] = useState<Reservation[]>([]);
  const [pastReservations, setPastReservations] = useState<Reservation[]>([]);
  const [reservationsLoading, setReservationsLoading] = useState(true);
  const [reservationsError, setReservationsError] = useState<string | null>(null);

  const [likedListings, setLikedListings] = useState<Listing[]>([]);
  const [likedLoading, setLikedLoading] = useState(true);
  const [likedError, setLikedError] = useState<string | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [currentReservationForReview, setCurrentReservationForReview] = useState<Reservation | null>(null);
  const [pendingReviewInfo, setPendingReviewInfo] = useState<PendingReviewInfo | null>(null);
  const [reviewModalLoading, setReviewModalLoading] = useState(false);
  const [reviewModalError, setReviewModalError] = useState<string | null>(null);
  const [currentReviewFormDisplay, setCurrentReviewFormDisplay] = useState<'selection' | 'listing' | 'partner' | 'none' | null>(null);

  const [agreementChecked, setAgreementChecked] = useState(false);
  const [contractError, setContractError] = useState<string | null>(null);
  const [showContractModal, setShowContractModal] = useState(false);

  const fetchReservations = useCallback(async () => {
    if (!isAuthenticated) return;
    setReservationsLoading(true);
    setReservationsError(null);
    try {
      const response = await getUserReservations();
      if (response.status === 'success' && response.data) {
        const allReservationData = Array.isArray(response.data)
          ? response.data
          : (typeof response.data === 'object' && response.data !== null && 'data' in response.data && Array.isArray((response.data as any).data)
              ? (response.data as { data: Reservation[] }).data
              : []);

        const now = new Date();
        const current = allReservationData.filter(reservation =>
          new Date(reservation.end_date) >= now &&
          reservation.status !== 'canceled' &&
          reservation.status !== 'completed'
        );
        const past = allReservationData.filter(reservation =>
          new Date(reservation.end_date) < now ||
          reservation.status === 'canceled' ||
          reservation.status === 'completed'
        );

        setCurrentReservations(current);
        setPastReservations(past);

        const totalRevenue = past
          .filter((r: Reservation) => r.status === 'completed' && r.total_price)
          .reduce((sum: number, r: Reservation) => sum + (r.total_price || 0), 0);

        setStatistics(prev => ({
          ...prev,
          totalReservations: allReservationData.length,
          totalRevenue: `$${totalRevenue.toFixed(2)}`
        }));
      } else {
        setReservationsError(response.message || 'Failed to load reservations.');
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setReservationsError('An unexpected error occurred while fetching reservations.');
    } finally {
      setReservationsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/signin?redirect=/dashboard');
    } else if (isAuthenticated) {
      setLoading(true);
      fetchReservations().finally(() => setLoading(false));
    }
  }, [isAuthenticated, authLoading, navigate, fetchReservations]);

  useEffect(() => {
    if (selectedSection === 'favorites' && isAuthenticated) {
      setLikedLoading(true);
      setLikedError(null);
      getUserLikedListings()
        .then(res => {
          if (res.status === 'success' && res.data) {
            setLikedListings(res.data);
          } else {
            setLikedError(res.message || 'Failed to load favorites');
          }
        })
        .catch(() => setLikedError('An unexpected error occurred while fetching favorites.'))
        .finally(() => setLikedLoading(false));
    }
  }, [selectedSection, isAuthenticated]);

  const handleStartPartnerUpgrade = () => {
    setShowContractModal(true);
    setContractError(null);
  };

  const handleAcceptContract = async () => {
    if (!agreementChecked) {
      setContractError("Please read and accept the Partner Agreement.");
      return;
    }
    setIsUpgrading(true);
    setContractError(null);
    try {
      const success = await becomePartner();
      if (success) {
        if (refreshUser) await refreshUser();
        setUpgradeSuccess(true);
        setShowContractModal(false);
        toast.success("Successfully upgraded to Partner! Redirecting...");
        setTimeout(() => {
          navigate('/partner-dashboard');
        }, 2000);
      } else {
        const errorMessage = (typeof success === 'object' && success !== null && 'message' in success)
                               ? (success as { message: string }).message
                               : "Failed to upgrade to partner status. Please try again.";
        setContractError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error: any) {
      console.error("Error upgrading to partner:", error);
      const message = error?.response?.data?.message || error?.message || "An unexpected error occurred during upgrade.";
      setContractError(message);
      toast.error(message);
    } finally {
      setIsUpgrading(false);
    }
  };

  const renderPartnerUpgradeCard = () => (
    <div className="tn-card bg-card dark:bg-gray-800 p-6 shadow rounded-lg border dark:border-gray-700">
        <div className="flex items-center space-x-3 mb-3">
            <Award size={24} className="text-primary" />
            <h2 className="font-semibold text-lg text-card-foreground dark:text-gray-100">Become a Partner</h2>
        </div>
        <p className="text-muted-foreground dark:text-gray-400 mb-4 text-sm">
            List your tools and earn money by renting them to others in your community.
        </p>
        <Button onClick={handleStartPartnerUpgrade} className="w-full" disabled={isUpgrading}>
            {isUpgrading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ToolIcon size={16} className="mr-2" />}
            {isUpgrading ? 'Processing...' : 'Start Partner Application'}
        </Button>
    </div>
  );

  const handlePartnerUpgrade_Direct = async () => { // This function might be redundant if modal is primary flow
    if (isUpgrading || !isAuthenticated) return;
    setIsUpgrading(true);
    try {
      const success = await becomePartner();
      if (success) {
        if (refreshUser) await refreshUser();
        setUpgradeSuccess(true);
        toast.success("Successfully upgraded to Partner! Redirecting...");
        setTimeout(() => {
          navigate('/partner-dashboard');
        }, 2000);
      } else {
        toast.error("Failed to upgrade to partner. Please try again later.");
      }
    } catch (error) {
      console.error("Error upgrading to partner:", error);
      toast.error("An unexpected error occurred during upgrade.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleOpenReviewModal = useCallback(async (reservation: Reservation) => {
    if (!reservation || !reservation.id) {
      toast.error("Invalid reservation data for review.");
      return;
    }
    setIsReviewModalOpen(true);
    setCurrentReservationForReview(reservation);
    setReviewModalLoading(true);
    setReviewModalError(null);
    setPendingReviewInfo(null);
    setCurrentReviewFormDisplay(null);

    try {
      const response = await checkPendingReviews(reservation.id);
      if (response.status === 'success' && response.data && response.data.pendingReviews) {
        const listingTitle = reservation.listing?.title || 'the tool';
        const partnerName = reservation.partner?.name || 'the partner';
        const canReviewListing = response.data.pendingReviews.forListing;
        const canReviewPartner = response.data.pendingReviews.forPartner;

        setPendingReviewInfo({
          canReviewListing: canReviewListing,
          canReviewPartner: canReviewPartner,
          listingId: reservation.listing?.id,
          listingTitle: listingTitle,
          partnerId: reservation.partner?.id,
          partnerName: partnerName,
        });

        if (canReviewListing && canReviewPartner) {
          setCurrentReviewFormDisplay('selection');
        } else if (canReviewListing) {
          setCurrentReviewFormDisplay('listing');
        } else if (canReviewPartner) {
          setCurrentReviewFormDisplay('partner');
        } else {
          setCurrentReviewFormDisplay('none');
        }
      } else {
        setReviewModalError(response.message || "Could not determine review status.");
        setCurrentReviewFormDisplay(null);
      }
    } catch (error: any) {
      console.error("Error checking pending reviews:", error);
      setReviewModalError(error.message || "An error occurred while checking for pending reviews.");
      setCurrentReviewFormDisplay(null);
    } finally {
      setReviewModalLoading(false);
    }
  }, []);

  const handleCloseReviewModal = useCallback(() => {
    setIsReviewModalOpen(false);
    setCurrentReservationForReview(null);
    setPendingReviewInfo(null);
    setReviewModalLoading(false);
    setReviewModalError(null);
    setCurrentReviewFormDisplay(null);
    fetchReservations();
  }, [fetchReservations]);

  const onReviewSubmitSuccess = useCallback(() => {
    handleCloseReviewModal();
  }, [handleCloseReviewModal]);

  const renderReservationsList = (reservationsToList: Reservation[], type: 'current' | 'past') => {
    if (reservationsLoading && !reservationsToList.length) {
      return <div className="flex justify-center py-8"><LoadingSpinner /></div>;
    }
    if (reservationsError && !reservationsToList.length) {
      return <div className="p-4 text-red-500 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">{reservationsError}</div>;
    }
    if (reservationsToList.length === 0) {
      return (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No {type} reservations found.</p>
          {type === 'current' && (
            <Button onClick={() => navigate('/search')} variant="outline" className="mt-4">
              Find Tools to Rent
            </Button>
          )}
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {reservationsToList.map(reservation => (
          <div key={reservation.id} className="tn-card bg-card dark:bg-gray-800 p-4 shadow rounded-lg border dark:border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="flex space-x-4 flex-grow">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                  {reservation.listing?.image_url && (
                    <img
                      src={reservation.listing.image_url}
                      alt={reservation.listing?.title || "Tool"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-card-foreground dark:text-gray-100">{reservation.listing?.title || "Tool Reservation"}</h3>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">{reservation.listing?.address || "No location available"}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-muted-foreground dark:text-gray-400">
                      {new Date(reservation.start_date).toLocaleDateString()} - {new Date(reservation.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' :
                        reservation.status === 'confirmed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300' :
                        reservation.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' :
                        'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'}`}>
                      {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-stretch sm:items-end space-y-2 w-full sm:w-auto sm:flex-shrink-0">
                <Button onClick={() => navigate(`/tools/${reservation.listing_id}`)} variant="outline" className="w-full">
                  View Details
                </Button>
                {type === 'past' && reservation.status === 'completed' && (
                  <Button onClick={() => handleOpenReviewModal(reservation)} variant="outline" className="w-full">
                    <MessageSquare size={16} className="mr-2" />
                    Leave a Review
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    if (loading && !authLoading) {
        return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
    }

    switch (selectedSection) {
      case 'dashboard':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="flex space-x-2 sm:space-x-4 mb-6 border-b dark:border-gray-700">
                <button
                  onClick={() => setSelectedTab('current')}
                  className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base rounded-t-md transition-colors ${selectedTab === 'current' ? 'border-b-2 border-primary text-primary dark:text-primary-400 dark:border-primary-400' : 'text-muted-foreground hover:text-foreground dark:hover:text-gray-200'}`}
                >
                  Current Reservations
                </button>
                <button
                  onClick={() => setSelectedTab('past')}
                  className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base rounded-t-md transition-colors ${selectedTab === 'past' ? 'border-b-2 border-primary text-primary dark:text-primary-400 dark:border-primary-400' : 'text-muted-foreground hover:text-foreground dark:hover:text-gray-200'}`}
                >
                  Past Reservations
                </button>
              </div>
              {selectedTab === 'current' ? renderReservationsList(currentReservations, 'current') : renderReservationsList(pastReservations, 'past')}
            </div>
            <div className="lg:col-span-1 space-y-6">
              {user?.role === 'client' && !upgradeSuccess && renderPartnerUpgradeCard()}
              
              {upgradeSuccess && (
                <Alert variant="default" className="bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700 text-green-700 dark:text-green-300">
                  <Check className="h-5 w-5 text-green-500" />
                  <AlertTitle className="font-semibold">Upgrade Successful!</AlertTitle>
                  <AlertDescription>
                    Congratulations! You're now a partner. Redirecting...
                  </AlertDescription>
                </Alert>
              )}
              <div className="tn-card bg-card dark:bg-gray-800 p-4 shadow rounded-lg border dark:border-gray-700">
                <h2 className="font-semibold mb-4 text-card-foreground dark:text-gray-100">Notifications</h2>
                <div className="space-y-3">
                  {notificationsSampleData.map(notification => (
                    <div key={notification.id} className="p-3 bg-background dark:bg-gray-700/50 rounded-lg border dark:border-gray-600">
                      <h3 className="text-sm font-medium text-foreground dark:text-gray-200">{notification.title}</h3>
                      <p className="text-xs text-muted-foreground dark:text-gray-400 mt-0.5">{notification.message}</p>
                      <span className="text-xs text-gray-400 dark:text-gray-500 mt-1.5 block">{notification.time}</span>
                    </div>
                  ))}
                   {notificationsSampleData.length === 0 && <p className="text-sm text-muted-foreground dark:text-gray-400">No new notifications.</p>}
                </div>
                {notificationsSampleData.length > 0 && (
                  <div className="mt-4 text-center">
                    <Button variant="link" className="text-sm text-primary hover:text-primary/80 h-auto p-0">
                      View All Notifications
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'profile':
        return <EditProfile />;
      case 'reservations':
         return (
          <div>
            <div className="flex space-x-2 sm:space-x-4 mb-6 border-b dark:border-gray-700">
              <button
                onClick={() => setSelectedTab('current')}
                className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base rounded-t-md transition-colors ${selectedTab === 'current' ? 'border-b-2 border-primary text-primary dark:text-primary-400 dark:border-primary-400' : 'text-muted-foreground hover:text-foreground dark:hover:text-gray-200'}`}
              >
                Current Reservations
              </button>
              <button
                onClick={() => setSelectedTab('past')}
                className={`py-2 px-3 sm:px-4 font-medium text-sm sm:text-base rounded-t-md transition-colors ${selectedTab === 'past' ? 'border-b-2 border-primary text-primary dark:text-primary-400 dark:border-primary-400' : 'text-muted-foreground hover:text-foreground dark:hover:text-gray-200'}`}
              >
                Past Reservations
              </button>
            </div>
            {selectedTab === 'current' ? renderReservationsList(currentReservations, 'current') : renderReservationsList(pastReservations, 'past')}
          </div>
        );
      case 'favorites':
        return (
          <div>
            <h2 className="text-xl font-bold mb-6 text-card-foreground dark:text-gray-100">Your Favorite Listings</h2>
            {likedLoading ? (
              <div className="flex justify-center py-8"><LoadingSpinner /></div>
            ) : likedError ? (
              <Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{likedError}</AlertDescription></Alert>
            ) : likedListings.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">You have no favorite listings yet.</p>
                 <Button onClick={() => navigate('/search')} variant="outline" className="mt-4">
                    Discover Tools
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {likedListings.map(listing => (
                  <ToolCard
                    key={listing.id}
                    tool={{
                      id: listing.id.toString(),
                      name: listing.title,
                      price: listing.price_per_day,
                      rating: listing.avg_rating,
                      reviewCount: listing.review_count,
                      location: listing.city?.name || 'Unknown',
                      image: listing.images && listing.images.length > 0 ? listing.images[0].url : '/placeholder-tool.svg',
                      isPremium: listing.is_premium,
                      owner: {
                        id: listing.partner?.id.toString() || '0',
                        name: listing.partner?.name || 'Unknown',
                        avatar: listing.partner?.avatar_url || '/placeholder-avatar.svg', // Partner avatar can be avatar_url
                        rating: listing.partner?.avg_rating_as_partner || 0
                      }
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'notifications':
        return <div className="text-center p-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg"><p className="text-gray-500 dark:text-gray-400">Notification center coming soon.</p></div>;
      default:
        return <div className="text-center p-8"><p>Section not found.</p></div>;
    }
  };

  if (authLoading) {
    return <div className="flex justify-center items-center min-h-screen"><LoadingSpinner /></div>;
  }
  if (!isAuthenticated) {
    return <div className="flex justify-center items-center min-h-screen"><p>Redirecting to login...</p></div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <div className="w-full lg:w-64 lg:shrink-0">
          <div className="bg-card dark:bg-gray-800 rounded-lg shadow p-4 border dark:border-gray-700">
            <div className="text-center p-4 border-b border-border dark:border-gray-700 mb-4">
              <img
                src={user?.avatar || '/placeholder-avatar.svg'} // Corrected to user?.avatar
                alt={user?.name || 'User Avatar'}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover border-2 border-primary"
              />
              <h3 className="font-semibold text-card-foreground dark:text-white mt-2">{user?.name || 'User'}</h3>
              <span className="text-sm text-muted-foreground dark:text-gray-400 capitalize">{user?.role || 'Client'} Account</span>
            </div>
            <nav className="space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedSection(item.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-md transition-colors text-sm font-medium
                    ${selectedSection === item.id
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground dark:hover:bg-gray-700/50 dark:hover:text-gray-100'}`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground dark:text-white">
                {menuItems.find(item => item.id === selectedSection)?.label || 'Dashboard'}
              </h1>
              <p className="text-muted-foreground dark:text-gray-400 mt-1 text-sm">
                {selectedSection === 'dashboard' ? 'Overview of your rental activity.' :
                 selectedSection === 'profile' ? 'Manage your personal information.' :
                 selectedSection === 'reservations' ? 'View and manage your tool rentals.' :
                 selectedSection === 'favorites' ? 'Your saved tools and listings.' :
                 'Manage your account notifications.'}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              {user?.role === 'client' && !upgradeSuccess && (
                <Button onClick={handleStartPartnerUpgrade} disabled={isUpgrading} variant="outline">
                  <ToolIcon size={16} className="mr-2" />
                  {isUpgrading ? 'Processing...' : 'Become a Partner'}
                </Button>
              )}
              <Button asChild>
                <Link to="/search">Find Tools</Link>
              </Button>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>

      {isReviewModalOpen && currentReservationForReview && (
        <Dialog open={isReviewModalOpen} onOpenChange={(isOpen) => { if (!isOpen) handleCloseReviewModal(); }}>
          <DialogContent className="sm:max-w-lg w-[95vw] bg-card dark:bg-gray-850 rounded-lg">
            <DialogHeader className="pb-3 border-b dark:border-gray-700">
              <DialogTitle className="text-card-foreground dark:text-gray-100 text-xl">
                Leave Reviews for Reservation #{currentReservationForReview.id}
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400 text-sm">
                Your feedback helps our community. Please share your experience with the tool and the partner.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-5 px-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {reviewModalLoading && (
                <div className="flex flex-col justify-center items-center py-10 space-y-3">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  <p className="dark:text-gray-300 text-lg">Loading review status...</p>
                </div>
              )}
              {reviewModalError && !reviewModalLoading && (
                <Alert variant="destructive" className="my-4">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{reviewModalError}</AlertDescription>
                </Alert>
              )}
              {!reviewModalLoading && !reviewModalError && pendingReviewInfo && currentReservationForReview && (
                <>
                  {currentReviewFormDisplay === 'selection' && pendingReviewInfo.canReviewListing && pendingReviewInfo.canReviewPartner && (
                    <div className="text-center space-y-4 p-4">
                      <p className="text-lg font-medium text-card-foreground dark:text-gray-200">What would you like to review?</p>
                      <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={() => setCurrentReviewFormDisplay('listing')} className="w-full sm:w-auto">
                          <ToolIcon size={18} className="mr-2" /> Review the Tool
                        </Button>
                        <Button onClick={() => setCurrentReviewFormDisplay('partner')} className="w-full sm:w-auto">
                          <UserIcon size={18} className="mr-2" /> Review the Partner
                        </Button>
                      </div>
                    </div>
                  )}
                  {(currentReviewFormDisplay === 'listing' && pendingReviewInfo.canReviewListing && pendingReviewInfo.listingId) && (
                    <div className="p-1">
                      {pendingReviewInfo.canReviewListing && pendingReviewInfo.canReviewPartner && (
                        <Button variant="link" onClick={() => setCurrentReviewFormDisplay('selection')} className="mb-2 text-sm pl-0 text-primary hover:text-primary/80 h-auto">
                          &larr; Choose review type
                        </Button>
                      )}
                      <h3 className="text-lg font-semibold mb-3 text-card-foreground dark:text-gray-200 flex items-center">
                        <ToolIcon size={20} className="mr-2 text-primary-500"/>
                        Review Tool: <span className="font-normal ml-1">{pendingReviewInfo.listingTitle || currentReservationForReview.listing?.title || 'Listing'}</span>
                      </h3>
                      <ReviewForm
                        type="listing"
                        targetId={pendingReviewInfo.listingId}
                        reservationId={currentReservationForReview.id}
                        onSubmit={async (rating, comment) => {
                          try {
                            const reviewData: ReviewSubmission = { rating, comment, reservation_id: currentReservationForReview.id, type: 'forObject', listing_id: pendingReviewInfo.listingId };
                            const apiResponse = await submitReview(reviewData);
                            if (apiResponse.status === 'success') {
                              toast.success('Tool review submitted successfully!');
                              onReviewSubmitSuccess();
                            } else {
                              toast.error(apiResponse.message || 'Failed to submit tool review.');
                            }
                          } catch (error) {
                            toast.error('An error occurred while submitting the tool review.');
                          }
                        }}
                        onCancel={handleCloseReviewModal}
                      />
                    </div>
                  )}
                  {(currentReviewFormDisplay === 'partner' && pendingReviewInfo.canReviewPartner && pendingReviewInfo.partnerId) && (
                     <div className={`p-1 ${pendingReviewInfo.canReviewListing ? "mt-6 pt-6 border-t border-border dark:border-gray-700" : ""}`}>
                      {pendingReviewInfo.canReviewListing && pendingReviewInfo.canReviewPartner && (
                        <Button variant="link" onClick={() => setCurrentReviewFormDisplay('selection')} className="mb-2 text-sm pl-0 text-primary hover:text-primary/80 h-auto">
                          &larr; Choose review type
                        </Button>
                      )}
                      <h3 className="text-lg font-semibold mb-3 text-card-foreground dark:text-gray-200 flex items-center">
                        <UserIcon size={20} className="mr-2 text-primary-500"/>
                        Review Partner: <span className="font-normal ml-1">{pendingReviewInfo.partnerName || currentReservationForReview.partner?.name || 'Partner'}</span>
                      </h3>
                      <ReviewForm
                        type="partner"
                        targetId={pendingReviewInfo.partnerId}
                        reservationId={currentReservationForReview.id}
                        onSubmit={async (rating, comment) => {
                          try {
                            const reviewData: ReviewSubmission = { rating, comment, reservation_id: currentReservationForReview.id, type: 'forPartner', reviewee_id: pendingReviewInfo.partnerId };
                            const apiResponse = await submitReview(reviewData);
                            if (apiResponse.status === 'success') {
                              toast.success('Partner review submitted successfully!');
                              onReviewSubmitSuccess();
                            } else {
                              toast.error(apiResponse.message || 'Failed to submit partner review.');
                            }
                          } catch (error) {
                            toast.error('An error occurred while submitting the partner review.');
                          }
                        }}
                        onCancel={handleCloseReviewModal}
                      />
                    </div>
                  )}
                  {currentReviewFormDisplay === 'none' && !reviewModalLoading && (!pendingReviewInfo || (!pendingReviewInfo.canReviewListing && !pendingReviewInfo.canReviewPartner)) && (
                    <div className="text-center text-muted-foreground dark:text-gray-400 py-8 px-4 bg-muted/50 dark:bg-gray-800/30 rounded-md">
                       <Check size={32} className="mx-auto mb-3 text-green-500"/>
                      <p className="text-lg">All reviews for this reservation have been submitted, or no reviews are currently pending.</p>
                      <p className="text-sm mt-1">Thank you for your feedback!</p>
                    </div>
                  )}
                </>
              )}
            </div>
            <DialogFooter className="pt-4 border-t dark:border-gray-700">
              <Button variant="outline" onClick={handleCloseReviewModal}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {showContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-card dark:bg-gray-850 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl border dark:border-gray-700">
            <DialogHeader className="pb-3 mb-4 border-b dark:border-gray-700">
                <DialogTitle className="text-card-foreground dark:text-gray-100 text-xl">Partner Agreement</DialogTitle>
                <DialogDescription className="dark:text-gray-400 text-sm">
                    Please review and accept the terms to become a partner.
                </DialogDescription>
            </DialogHeader>
            {contractError && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{contractError}</AlertDescription>
                </Alert>
            )}
            <div className="prose dark:prose-invert max-w-none mb-6 text-sm text-muted-foreground dark:text-gray-300">
              <h3 className="text-base font-semibold text-card-foreground dark:text-gray-200">Terms and Conditions:</h3>
              <ol className="list-decimal pl-5 space-y-1 mt-2">
                <li>You agree to maintain high-quality standards for your tools and equipment.</li>
                <li>You must provide accurate descriptions and images of your tools.</li>
                <li>You are responsible for the maintenance and safety of your tools.</li>
                <li>You must respond to rental requests within 24 hours.</li>
                <li>Service fees of 10% will be applied to each successful rental.</li>
                <li>You must comply with all local laws and regulations.</li>
                <li>You must maintain appropriate insurance coverage.</li>
                <li>ToolNest reserves the right to suspend partner accounts for violations.</li>
              </ol>
              <h3 className="mt-3 text-base font-semibold text-card-foreground dark:text-gray-200">Partner Responsibilities:</h3>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Keep your tools well-maintained and safe for use.</li>
                <li>Provide clear pickup/delivery instructions.</li>
                <li>Respond promptly to customer inquiries.</li>
                <li>Handle disputes professionally.</li>
                <li>Maintain accurate calendar availability.</li>
              </ul>
            </div>
            <div className="flex items-center space-x-2 mb-6">
              <input
                type="checkbox"
                id="contract-agreement"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-offset-gray-800"
              />
              <label htmlFor="contract-agreement" className="text-sm text-muted-foreground dark:text-gray-300">
                I have read and agree to the Partner Agreement.
              </label>
            </div>
            <DialogFooter className="pt-4 border-t dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => {
                  setShowContractModal(false);
                  setContractError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAcceptContract}
                disabled={isUpgrading || !agreementChecked}
              >
                {isUpgrading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Accept & Become Partner"
                )}
              </Button>
            </DialogFooter>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;