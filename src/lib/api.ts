import { LoginResponse } from "@/app/services/api";
import axios from "axios";

const API_URL = "https://tool-nest-backend-glfb9n7sf-failalihaytams-projects.vercel.app/api/api"; // Adjust this to match your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface User {
  id: number;
  username: string;
  email: string;
  phone_number?: string;
  address?: string;
  role: "client" | "partner";
  avatar_url?: string;
  join_date: string;
  avg_rating_as_client: number;
  avg_rating_as_partner: number;
  review_count: number;
  longitude?: number;
  latitude?: number;
  city_id: number;
}

interface AuthResponse {
  data: any;
  user: User;
  token: string;
}

export const authApi = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    phone_number?: string;
    address?: string;
    city_id: number;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/register", userData);
    return response.data;
  },

  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/logout");
  },
};

export default api;
