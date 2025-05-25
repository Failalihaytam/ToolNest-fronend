import api from './api';

export interface ReviewSubmission {
  rating: number;
  comment: string;
  reservation_id: number;
  type: 'forObject' | 'forClient' | 'forPartner';
  listing_id?: number;
  reviewee_id?: number;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  type: 'forObject' | 'forClient' | 'forPartner';
  is_visible: boolean;
  created_at: string;
  reviewer_id: number;
  reviewee_id?: number;
  reservation_id: number;
  listing_id?: number;
  reviewer?: {
    id: number;
    name: string;
    avatar_url?: string;
  };
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
}

export async function submitReview(reviewData: ReviewSubmission): Promise<ApiResponse<Review>> {
  try {
    const response = await api.post<ApiResponse<Review>>('/reviews', reviewData);
    return response.data;
  } catch (error: any) {
    console.error('Error submitting review:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to submit review'
    };
  }
}

export async function getReviewsForReservation(reservationId: number): Promise<ApiResponse<Review[]>> {
  try {
    const response = await api.get<ApiResponse<Review[]>>(`/reviews`, {
      params: { reservation_id: reservationId }
    });
    return response.data;
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to fetch reviews'
    };
  }
}

export async function checkPendingReviews(reservationId: number): Promise<ApiResponse<{
  pendingReviews: {
    forListing: boolean;
    forPartner: boolean;
    forClient: boolean;
  }
}>> {
  try {
    const response = await api.get<ApiResponse<{
      pendingReviews: {
        forListing: boolean;
        forPartner: boolean;
        forClient: boolean;
      }
    }>>(`/reviews/pending/${reservationId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error checking pending reviews:', error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to check pending reviews'
    };
  }
}