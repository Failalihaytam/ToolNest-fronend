import { useState, useEffect } from 'react';
import { Reservation } from '../../../app/services/reservationService';
import { checkPendingReviews, submitReview } from '../../../app/services/reviewService';
import ReviewForm from './ReviewForm';
import { toast } from 'react-hot-toast';

interface ClientReviewSectionProps {
  reservation: Reservation;
  onReviewSubmitted: () => void;
}

const ClientReviewSection: React.FC<ClientReviewSectionProps> = ({ 
  reservation, 
  onReviewSubmitted 
}) => {
  const [showListingReview, setShowListingReview] = useState(false);
  const [showPartnerReview, setShowPartnerReview] = useState(false);
  const [pendingListingReview, setPendingListingReview] = useState(false);
  const [pendingPartnerReview, setPendingPartnerReview] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only check for completed reservations
    if (reservation.status !== 'completed') {
      setCheckingStatus(false);
      return;
    }

    const checkReviewStatus = async () => {
      try {
        const response = await checkPendingReviews(reservation.id);
        if (response.status === 'success' && response.data) {
          setPendingListingReview(response.data.pendingReviews.forListing);
          setPendingPartnerReview(response.data.pendingReviews.forPartner);
        } else {
          setError('Could not check review status');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to check review status');
      } finally {
        setCheckingStatus(false);
      }
    };

    checkReviewStatus();
  }, [reservation.id, reservation.status]);

  const handleSubmitListingReview = async (rating: number, comment: string) => {
    try {
      const response = await submitReview({
        rating,
        comment,
        reservation_id: reservation.id,
        type: 'forObject',
        listing_id: reservation.listing_id
      });

      if (response.status === 'success') {
        toast.success('Tool review submitted successfully!');
        setShowListingReview(false);
        setPendingListingReview(false);
        onReviewSubmitted();
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred');
    }
  };

  const handleSubmitPartnerReview = async (rating: number, comment: string) => {
    try {
      const response = await submitReview({
        rating,
        comment,
        reservation_id: reservation.id,
        type: 'forPartner',
        reviewee_id: reservation.partner_id
      });

      if (response.status === 'success') {
        toast.success('Partner review submitted successfully!');
        setShowPartnerReview(false);
        setPendingPartnerReview(false);
        onReviewSubmitted();
      } else {
        toast.error(response.message || 'Failed to submit review');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred');
    }
  };

  if (checkingStatus) {
    return <div className="py-2 text-gray-500">Checking review status...</div>;
  }

  if (error) {
    return <div className="py-2 text-red-500">{error}</div>;
  }

  // Don't show anything for non-completed reservations
  if (reservation.status !== 'completed') {
    return null;
  }

  // If no reviews are pending, show a completed message
  if (!pendingListingReview && !pendingPartnerReview) {
    return <div className="py-2 text-green-600">All reviews have been submitted. Thank you!</div>;
  }

  return (
    <div className="mt-4 space-y-4">
      <h4 className="font-semibold text-lg">Share Your Experience</h4>
      
      {pendingListingReview && (
        <div className="mb-4">
          {!showListingReview ? (
            <button
              onClick={() => setShowListingReview(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Review the Tool
            </button>
          ) : (
            <ReviewForm
              type="listing"
              targetId={reservation.listing_id}
              reservationId={reservation.id}
              onSubmit={handleSubmitListingReview}
              onCancel={() => setShowListingReview(false)}
            />
          )}
        </div>
      )}
      
      {pendingPartnerReview && (
        <div className="mb-4">
          {!showPartnerReview ? (
            <button
              onClick={() => setShowPartnerReview(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Review the Tool Owner
            </button>
          ) : (
            <ReviewForm
              type="partner"
              targetId={reservation.partner_id}
              reservationId={reservation.id}
              onSubmit={handleSubmitPartnerReview}
              onCancel={() => setShowPartnerReview(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ClientReviewSection;