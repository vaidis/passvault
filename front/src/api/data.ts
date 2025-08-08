import { apiClient } from './client';
import { DataItem, ApiResponse } from './types';

export const dataApi = {
  getAll: async (): Promise<ApiResponse<DataItem[]>> => {
    return apiClient.get<ApiResponse<DataItem[]>>('/data');
  },

  getById: async (id: string): Promise<ApiResponse<DataItem>> => {
    return apiClient.get<ApiResponse<DataItem>>(`/data/${id}`);
  },

  create: async (data: Omit<DataItem, 'id' | 'createdAt'>): Promise<ApiResponse<DataItem>> => {
    return apiClient.post<ApiResponse<DataItem>>('/data', data);
  },

  update: async (id: string, data: Partial<DataItem>): Promise<ApiResponse<DataItem>> => {
    return apiClient.put<ApiResponse<DataItem>>(`/data/${id}`, data);
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    return apiClient.delete<ApiResponse<null>>(`/data/${id}`);
  },
};

