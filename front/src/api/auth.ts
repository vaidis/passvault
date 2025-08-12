import * as apiClient from './client';
import * as CryptoJS from "crypto-js";
import type {
  ApiResponse,
  LoginCredentials,
  LoginUsernameRequest,
  LoginUsernameResponse,
  LoginAuthproofRequest,
  LoginFinalResponse,
  RegisterData,
  RegisterResponse,
} from "./types";

// import type {
//   TCredentials,
//   ILoginUsernameRequest,
//   ILoginUsernameResponse,
//   ILoginAuthproofRequest,
//   ILoginAuthproofResponse,
//   RegisterRequest,
//   RegisterResponse,
//   ApiResponse,
//   TAuthLoginRequest,
//   TSendUsernameResponse,
//   TSendUsernameRequest
// } from './types';
import { getLastUrlSegment } from '../utils/getLastUrlSegment';

const registerId = getLastUrlSegment();

const endpoint = {
  register: `/auth/register/${registerId}`,
  login: '/auth/login',
  loginUsername: "/auth/login/username",
  loginAuthproof: "/auth/login/authproof",
  logout: '/auth/logout',
  refresh: '/auth/refresh'
}

  // Send username - Get salt
  //const sendUsername = async (
  //  username: ISendUsernameRequest
  //): Promise<ApiResponse<ISendUsernameResponse>> => {
  //    const response = await authApi.sendUsername(username);
  //    return response || null;
  //}

export const authApi = {
  register: async (userData: RegisterData): Promise<ApiResponse<RegisterResponse>> => {
    return apiClient.post<RegisterData, RegisterResponse >(endpoint.register, userData);
  },
  // console.log('auth.ts > username:', credentials.username);
  // console.log('auth.ts > password:', credentials.password);

  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginFinalResponse>> => {
    const authSaltResponse = await apiClient.post<
      LoginUsernameRequest,
      LoginUsernameResponse
    >(endpoint.loginUsername, { username: credentials.username });

    if (!authSaltResponse.success) {
      return authSaltResponse; // propagate failure
    }

    const authProof = CryptoJS.PBKDF2(
      credentials.password,
      authSaltResponse.data.authSalt,
      { keySize: 512 / 32, iterations: 10000 }
    ).toString(CryptoJS.enc.Hex);

    console.log('auth.ts > password:', credentials.password);
    console.log('auth.ts > username:', credentials.username);
    console.log('auth.ts > authSaltResponse.data.authSalt:', authSaltResponse.data.authSalt);
    console.log('auth.ts > authProof:', authProof);

    const authProofResponse = await apiClient.post<
      LoginAuthproofRequest,
      LoginFinalResponse
    >(endpoint.loginAuthproof, { username:credentials.username, authProof:authProof });

    return authProofResponse; // μπορεί να είναι success ή failure
  },

  //logout: async (): Promise<ApiResponse<null>> => {
  //  return apiClient.post<ApiResponse<null>>(endpoint.logout);
  //},
  //
  //refreshToken: async (): Promise<ApiResponse<{ token: string }>> => {
  //  return apiClient.post<ApiResponse<{ token: string }>>(endpoint.refresh);
  //},
};
