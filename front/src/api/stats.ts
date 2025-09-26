import * as apiClient from './client';
import type { ApiResponse, Stats } from './types';

export const statsApi = {
  getStats: async (): Promise<ApiResponse<Stats>> => {
    return apiClient.get<Stats>('/stats');
  },
};

