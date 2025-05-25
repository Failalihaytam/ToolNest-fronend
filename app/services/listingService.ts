import { ReactNode } from "react";
import api from "./api";

// Define TypeScript interfaces for the Listing data structure
export interface Listing {
  availabilities: boolean;
  total_rentals: number;
  security_deposit: any;
  features: any;
  id: number;
  title: string;
  description: string;
  price_per_day: number;
  status: "active" | "archived" | "inactive";
  is_premium: boolean;
  premium_start_date?: string;
  premium_end_date?: string;
  longitude?: number;
  latitude?: number;
  avg_rating: number;
  review_count: number;
  created_at: string;
  delivery_option: boolean;
  category_id: number;
  city_id: number;
  partner_id: number;
  category?: {
    id: number;
    name: string;
  };
  city?: {
    name: string;
  };
  partner?: {
    review_count_as_partner: any;
    response_rate: any;
    member_since: any;
    id: number;
    name: string;
    username: string;
    avatar_url?: string;
    avg_rating_as_partner: number;
  };
  images?: Array<{
    id: number;
    url: string;
  }>;
}

// Define search parameters interface
export interface ListingSearchParams {
  city_id?: number;
  category_id?: number;
  min_rating?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  query?: string;
  page?: number;
  per_page?: number;
}

// Define API response structure
export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
  meta?: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
  errors?: Record<string, string[]>;
}

// Get all listings with optional filters
export async function getListings(
  params?: ListingSearchParams
): Promise<ApiResponse<Listing[]>> {
  try {
    const response = await api.get<ApiResponse<Listing[]>>("/listings", {
      params,
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching listings:", error);
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch listings",
    };
  }
}

// Search listings with specific search parameters
export async function searchListings(
  params: ListingSearchParams
): Promise<ApiResponse<Listing[]>> {
  try {
    const response = await api.get<ApiResponse<Listing[]>>("/listings/search", {
      params,
    });

    // Normalize the response to ensure data is always an array
    if (response.data.status === "success" && response.data.data) {
      // Check if data is nested (Laravel pagination format)
      if (
        !Array.isArray(response.data.data) &&
        typeof response.data.data === "object" &&
        response.data.data !== null &&
        "data" in response.data.data
      ) {
        // Extract the nested array and preserve pagination metadata
        const paginationData = response.data.data as {
          current_page: number;
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
          data: Listing[];
        };
        response.data.meta = {
          current_page: paginationData.current_page,
          from: paginationData.from,
          last_page: paginationData.last_page,
          per_page: paginationData.per_page,
          to: paginationData.to,
          total: paginationData.total,
        };
        response.data.data = paginationData.data;
      }
    }

    return response.data;
  } catch (error: any) {
    console.error("Error searching listings:", error);
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to search listings",
    };
  }
}

// Get a single listing by ID
export async function getListing(id: number): Promise<ApiResponse<Listing>> {
  try {
    const response = await api.get<ApiResponse<Listing>>(`/listings/${id}`);
    return response.data;
  } catch (error: any) {
    console.error(`Error fetching listing #${id}:`, error);
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch listing",
    };
  }
}

// Get categories for filtering
export async function getCategories(): Promise<
  ApiResponse<{ id: number; name: string }[]>
> {
  try {
    const response = await api.get<ApiResponse<{ id: number; name: string }[]>>(
      "/categories"
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch categories",
    };
  }
}

// Get cities for filtering
export async function getCities(): Promise<
  ApiResponse<{ id: number; name: string }[]>
> {
  try {
    const response = await api.get<ApiResponse<{ id: number; name: string }[]>>(
      "/cities"
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching cities:", error);
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch cities",
    };
  }
}

export async function getPartnerListings(): Promise<ApiResponse<Listing[]>> {
  try {
    const response = await api.get<ApiResponse<Listing[]>>("/listings", {
      params: { partner: "self" },
    });

    // Normalize the response like in searchListings
    if (response.data.status === "success" && response.data.data) {
      // Check if data is nested (Laravel pagination format)
      if (
        !Array.isArray(response.data.data) &&
        typeof response.data.data === "object" &&
        response.data.data !== null &&
        "data" in response.data.data
      ) {
        // Extract the nested array and preserve pagination metadata
        const paginationData = response.data.data as {
          current_page: number;
          from: number;
          last_page: number;
          per_page: number;
          to: number;
          total: number;
          data: Listing[];
        };
        response.data.meta = {
          current_page: paginationData.current_page,
          from: paginationData.from,
          last_page: paginationData.last_page,
          per_page: paginationData.per_page,
          to: paginationData.to,
          total: paginationData.total,
        };
        response.data.data = paginationData.data;
      }
    }

    return response.data;
  } catch (error: any) {
    console.error("Error fetching partner listings:", error);
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch your listings",
    };
  }
}

export async function createListing(
  formData: FormData
): Promise<ApiResponse<Listing>> {
  try {
    const response = await api.post<ApiResponse<Listing>>(
      "/listings",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to create listing",
    };
  }
}

export const likeListing = (listingId: number) =>
  api.post(`/listings/${listingId}/like`);

export const unlikeListing = (listingId: number) =>
  api.delete(`/listings/${listingId}/like`);

export const isListingLiked = (listingId: number) =>
  api.get(`/listings/${listingId}/liked`);

export async function getUserLikedListings(): Promise<ApiResponse<Listing[]>> {
  try {
    const response = await api.get<ApiResponse<Listing[]>>(
      "/user/liked-listings"
    );
    return response.data;
  } catch (error: any) {
    return {
      status: "error",
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch liked listings",
    };
  }
}
