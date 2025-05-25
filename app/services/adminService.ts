import api from './api';

export interface DashboardStats {
  totalClients: number;
  totalPartners: number;
  totalListings: number;
  clientGrowth: Array<{
    month: string;
    clients: number;
  }>;
  clientManagement: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export interface AdminLoginResponse {
  status: 'success' | 'error';
  message: string;
  data?: {
    admin: {
      id: number;
      email: string;
      username: string;
    };
    token: string;
  };
}

const handleToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

export const adminService = {
  login: async (credentials: { email: string; password: string }): Promise<AdminLoginResponse> => {
    try {
      const response = await api.post<AdminLoginResponse>('/admin/login', credentials);
      
      if (response.data.status === 'success' && response.data.data?.token) {
        handleToken(response.data.data.token);
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Authentication failed');
    }
  },

  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get<{ status: string; data: DashboardStats }>('/admin/dashboard/stats');
      return response.data.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch dashboard stats');
    }
  }
};

export default adminService;