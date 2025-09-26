import * as apiClient from './client';
import type { ApiResponse, Stats } from './types';

export const statsApi = {
  getStats: async (): Promise<ApiResponse<Stats>> => {
    console.log('api/stats.ts')
    return apiClient.get<Stats>('/stats');
  },
};

