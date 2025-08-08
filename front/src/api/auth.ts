import * as apiClient from './client';
import type {
  LoginResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ApiResponse
} from './types';
import { getLastUrlSegment } from '../utils/getLastUrlSegment';

const registerId = getLastUrlSegment();

const endpoint = {
  register: `/auth/register/${registerId}`,
  login: '/auth/login',
  logout: '/auth/logout',
  refresh: '/auth/refresh'
}

export const authApi = {
  register: async (userData: RegisterRequest): Promise<ApiResponse> => {
    return apiClient.post<ApiResponse<RegisterResponse>, RegisterRequest>(endpoint.register, userData);
  },

  //register: async (userData: RegisterRequest): Promise<ApiResponse<RegisterResponse>> => {
  //  return apiClient.post<ApiResponse<RegisterResponse>, RegisterRequest>(endpoint.register, userData);
  //},

  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post<ApiResponse<LoginResponse>, LoginRequest>(endpoint.login, credentials);
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return apiClient.post<ApiResponse<null>>(endpoint.logout);
  },

  refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
    return apiClient.post<ApiResponse<{ token: string }>>(endpoint.refresh);
  },
};
