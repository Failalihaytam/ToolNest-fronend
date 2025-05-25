import api from "./api";

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  username?: string;
  phone_number?: string;
  address?: string;
  city_id?: number;
  role?: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data?: {
    user: any;
    token: string;
  };
  errors?: any;
}

const safeSetLocalStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

const safeRemoveLocalStorage = (key: string) => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(key);
  }
};
const handleAxiosError = (error: unknown): AuthResponse => {
  // Check if error has a response property (characteristic of Axios errors)
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as any;
    return (
      (axiosError.response?.data as AuthResponse) || {
        status: "error",
        message: axiosError.message || "Request failed",
      }
    );
  }

  return {
    status: "error",
    message:
      error instanceof Error ? error.message : "An unknown error occurred",
  };
};
export const registerUser = async (
  userData: RegisterData
): Promise<AuthResponse> => {
  try {
    // If username is not provided, use name as username
    if (!userData.username) {
      userData.username = userData.name;
    }

    // Set default role based on accountType if provided
    if (userData.role === "partner") {
      userData.role = "partner";
    } else {
      userData.role = "client";
    }

    const response = await api.post<AuthResponse>("/register", userData);

    if (response.data?.status === "success" && response.data?.data?.token) {
      // Store token in localStorage safely
      safeSetLocalStorage("auth_token", response.data.data.token);
    }

    return response.data;
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/login", {
      email,
      password,
    });

    if (response.data?.status === "success" && response.data?.data?.token) {
      safeSetLocalStorage("auth_token", response.data.data.token);
    }

    return response.data;
  } catch (error: unknown) {
    return handleAxiosError(error);
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post("/logout");
    safeRemoveLocalStorage("auth_token");
  } catch (error) {
    console.error("Logout failed:", error);
    // Still remove the token even if API call fails
    safeRemoveLocalStorage("auth_token");
  }
};

export const getProfile = () => api.get('/user');
export const updateProfile = (data: any) => api.put('/profile', data);
