import api from './api';

export interface City {
  id: number;
  name: string;
}

interface CityApiResponse {
    status: string;
    data: City[];
  }

  export const getCities = async (): Promise<City[]> => {
    try {
      const response = await api.get<CityApiResponse>('/cities');
      // This will now be properly typed
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      return [];
    }
  };