import { apiClient } from './client';
import { User, ApiResponse } from './types';

export const usersApi = {
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient.get<ApiResponse<User>>('/users/profile');
  },

  updateProfile: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put<ApiResponse<User>>('/users/profile', userData);
  },

  deleteAccount: async (): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>('/users/profile');
  },
};

