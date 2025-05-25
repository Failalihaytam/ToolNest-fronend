export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  priceUnit: 'hour' | 'day' | 'week' | 'month';
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  available: boolean;
  availability?: string;
  location: string;
  distance?: string;
  rating: number;
  reviewCount: number;
  ownerId: string;
  ownerName?: string;
  ownerAvatar?: string;
  image: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ToolSearchParams {
  query?: string;
  category?: string[];
  priceRange?: [number, number];
  condition?: string[];
  availability?: string[];
  rating?: number;
  distance?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
} 