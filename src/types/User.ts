export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  role?: 'client' | 'partner';
  bio?: string;
  rating: number;
  memberSince: string;
  location?: string;
  phoneNumber?: string;
  verifiedEmail?: boolean;
  verifiedPhone?: boolean;
} 