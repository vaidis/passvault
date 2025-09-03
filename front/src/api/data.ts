import * as apiClient from './client';
import type { DataItem, DataItems, ApiResponse } from './types';

export const dataApi = {
  getDataItems: async (): Promise<ApiResponse<DataItems>> => {
    return apiClient.get<DataItems>('/data');
  },

  getDataItem: async (id: string): Promise<ApiResponse<DataItem>> => {
    return apiClient.get<DataItem>(`/data/${id}`);
  },

  create: async (data: Omit<DataItem, 'id' | 'created' | 'edited'>): Promise<ApiResponse<DataItem>> => {
    console.log('data.ts > create > data:', data)
    return apiClient.post('/data/add', data);
  },

  update: async (id: string, data: Partial<DataItems>): Promise<ApiResponse<DataItems>> => {
    return apiClient.put<DataItem>(`/data/${id}`, data);
  },

  delete: async (id: number): Promise<ApiResponse<DataItems>> => {
    return apiClient.del<DataItems>(`/data/delete/${id}`);
  },
};

