import { useState, useEffect } from 'react';
import { Reservation } from '../../../app/services/reservationService';
import { checkPendingReviews, submitReview } from '../../../app/services/reviewService';
import ReviewForm from './ReviewForm';
import { toast } from 'react-hot-toast';

interface PartnerReviewSectionProps {
  reservation: Reservation;
  onReviewSubmitted: () => void;
}

const PartnerReviewSection: React.FC<PartnerReviewSectionProps> = ({ 
  reservation, 
  onReviewSubmitted 
}) => {
  const [showClientReview, setShowClientReview] = useState(false);
  const [pendingClientReview, setPendingClientReview] = useState(false);
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
          setPendingClientReview(response.data.pendingReviews.forClient);
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

  const handleSubmitClientReview = async (rating: number, comment: string) => {
    try {
      const response = await submitReview({
        rating,
        comment,
        reservation_id: reservation.id,
        type: 'forClient',
        reviewee_id: reservation.client_id
      });

      if (response.status === 'success') {
        toast.success('Client review submitted successfully!');
        setShowClientReview(false);
        setPendingClientReview(false);
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
  if (!pendingClientReview) {
    return <div className="py-2 text-green-600">All reviews have been submitted. Thank you!</div>;
  }

  return (
    <div className="mt-4 space-y-4">
      <h4 className="font-semibold text-lg">Share Your Experience</h4>
      
      {pendingClientReview && (
        <div className="mb-4">
          {!showClientReview ? (
            <button
              onClick={() => setShowClientReview(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Review the Renter
            </button>
          ) : (
            <ReviewForm
              type="client"
              targetId={reservation.client_id}
              reservationId={reservation.id}
              onSubmit={handleSubmitClientReview}
              onCancel={() => setShowClientReview(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PartnerReviewSection;