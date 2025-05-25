import api from './api';

// Interfaces for API responses and request data
export interface Reservation {
  user: any;
  total_price: number;
  id: number;
  listing_id: number;
  client_id: number;
  partner_id: number;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'ongoing' | 'canceled' | 'completed';
  contract_url?: string;
  delivery_option: boolean;
  created_at?: string;
  updated_at?: string;
  listing?: any;
  client?: any;
  partner?: any;
}

export interface ClientDetails {
  username: string;
  rating: number;
  review_count: number;
  avatar_url?: string;
  reservation_details: {
    start_date: string;
    end_date: string;
    delivery_option: boolean;
    created_at: string;
  };
}

interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  errors?: Record<string, string[]>;
}

// Create a reservation
export async function createReservation(
  listingId: number, 
  startDate: string, 
  endDate: string, 
  deliveryOption: boolean = false
): Promise<ApiResponse<Reservation>> {
  try {
    const response = await api.post<ApiResponse<Reservation>>('/reservations', {
      listing_id: listingId,
      start_date: startDate,
      end_date: endDate,
      delivery_option: deliveryOption
    });
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: 'error',
      message: error.message || 'Failed to create reservation'
    };
  }
}

// Check if a listing is available for specific dates
export async function checkAvailability(
  listingId: number, 
  startDate: string, 
  endDate: string
): Promise<{available: boolean, message?: string}> {
  try {
    const response = await api.get<ApiResponse<{available: boolean}>>('/reservations/check-availability', {
      params: {
        listing_id: listingId,
        start_date: startDate,
        end_date: endDate
      }
    });
    
    if (response.data.status === 'success') {
      return { available: response.data.data?.available || false };
    } else {
      return { 
        available: false, 
        message: response.data.message || 'Failed to check availability' 
      };
    }
  } catch (error: any) {
    return { 
      available: false, 
      message: error.response?.data?.message || error.message || 'Error checking availability' 
    };
  }
}

// Update the getUserReservations function

export async function getUserReservations(
  status?: 'pending' | 'confirmed' | 'ongoing' | 'canceled' | 'completed'
): Promise<ApiResponse<Reservation[]>> {
  try {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    
    // No need to manually set headers - api instance already has the interceptor
    const response = await api.get<ApiResponse<Reservation[]>>('/reservations/user', { params });
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching reservations:', error);
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: 'error',
      message: error.message || 'Failed to fetch your reservations'
    };
  }
}

// Get pending reservations (for partners)
export async function getPendingReservations(
  startDate?: string, 
  endDate?: string
): Promise<ApiResponse<Reservation[]>> {
  try {
    const params: Record<string, string> = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;
    
    const response = await api.get<ApiResponse<Reservation[]>>('/reservations/pending', { params });
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: 'error',
      message: error.message || 'Failed to fetch pending reservations'
    };
  }
}

export async function getPartnerReservations(
  status?: 'pending' | 'confirmed' | 'ongoing' | 'canceled' | 'completed'
): Promise<ApiResponse<Reservation[]>> {
  try {
    const params: Record<string, string> = {};
    if (status) params.status = status;
    
    const response = await api.get<ApiResponse<Reservation[]>>('/reservations/partner', { params });
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching partner reservations:', error);
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: 'error',
      message: error.message || 'Failed to fetch your partner reservations'
    };
  }
}

// Get client details for a specific reservation
export async function getClientDetails(
  reservationId: number
): Promise<ApiResponse<ClientDetails>> {
  try {
    const response = await api.get<ApiResponse<ClientDetails>>(
      `/reservations/${reservationId}/client-details`
    );
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: 'error',
      message: error.message || 'Failed to fetch client details'
    };
  }
}

// Accept a reservation
export async function acceptReservation(
  reservationId: number
): Promise<ApiResponse<{
  reservation: Reservation,
  payment_deadline: string,
  total_amount: number
}>> {
  try {
    const response = await api.post<ApiResponse<{
      reservation: Reservation,
      payment_deadline: string,
      total_amount: number
    }>>(`/reservations/${reservationId}/accept`);
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: 'error',
      message: error.message || 'Failed to accept reservation'
    };
  }
}

// Add after the acceptReservation function
export async function declineReservation(
  reservationId: number
): Promise<ApiResponse<Reservation>> {
  try {
    const response = await api.post<ApiResponse<Reservation>>(`/reservations/${reservationId}/decline`);
    
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      status: 'error',
      message: error.message || 'Failed to decline reservation'
    };
  }
}

// Usage example in a component:
/*
import { getPendingReservations, acceptReservation } from '@/app/services/reservationService';

// In your component:
const [reservations, setReservations] = useState<Reservation[]>([]);

async function loadReservations() {
  const response = await getPendingReservations();
  if (response.status === 'success' && response.data) {
    setReservations(response.data);
  }
}

async function handleAcceptReservation(id: number) {
  const response = await acceptReservation(id);
  if (response.status === 'success') {
    // Update UI or show success message
    loadReservations(); // Refresh the list
  }
}
*/