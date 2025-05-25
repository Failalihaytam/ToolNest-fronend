export interface Listing {
  id: number;
  title: string;
  price_per_day: number;
  latitude?: number;
  longitude?: number;
  is_premium?: boolean;
  avg_rating?: number;
} 