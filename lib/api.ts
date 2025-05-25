import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://tool-nest-backend-8m7yzs9io-failalihaytams-projects.vercel.app/api/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authService = {
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    phone_number?: string;
    address?: string;
    city_id: number;
  }) => {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await api.post("/login", credentials);
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;
