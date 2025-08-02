import { apiClient } from './client';
import { LoginRequest, LoginResponse, RegisterRequest, ApiResponse } from './types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
  },

  register: async (userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<ApiResponse<LoginResponse>>('/auth/register', userData);
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>('/auth/logout');
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh');
  },
};
