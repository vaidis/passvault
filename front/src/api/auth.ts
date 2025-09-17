import * as apiClient from './client';
import * as CryptoJS from "crypto-js";
import type {
  ApiResponse,
  LoginCredentials,
  LoginStartRequest,
  LoginStartResponse,
  LoginFinishRequest,
  LoginFinishResponse,
  LogoutResponse,
  RegisterData,
  RegisterResponse,
} from "./types";

import { getLastUrlSegment } from '../utils/getLastUrlSegment';

const registerId = getLastUrlSegment();

const endpoint = {
  register: `/auth/register/${registerId}`,
  login: '/auth/login',
  loginStart: "/auth/login/start",
  loginFinish: "/auth/login/finish",
  logout: '/auth/logout',
  refresh: '/auth/refresh',
  user: '/auth/user'
}


export const authApi = {
  //
  // Get User
  //
  getUser: async (): Promise<ApiResponse<{username:string;id:number}>> => {
    console.log(' 🍓 auth.ts > getUser');
    return apiClient.get<{username:string;id:number}>(endpoint.user);
  },

  //
  // Register
  //
  register: async (userData: RegisterData): Promise<ApiResponse<RegisterResponse>> => {
    return apiClient.post<RegisterData, RegisterResponse >(endpoint.register, userData);
  },

  //
  // Login
  //
  login: async (credentials: LoginCredentials): Promise<ApiResponse<LoginFinishResponse>> => {
    // send username to get authSalt, challengeId, challenge
    const startRequest = {username: credentials.username};
    const startResponse = await apiClient.post<LoginStartRequest,LoginStartResponse>(
      endpoint.loginStart, startRequest
    );
    console.log(' 🍓 authApi > login > startRequest:', startRequest);
    console.log(' 🍓 authApi > login > startResponse:', startResponse);

    // check if username exist
    if (!startResponse.success) {
      return startResponse;
    }

    // repare the final request
    if (startResponse.data) {
    const { authSalt, challengeId, challenge } = startResponse.data;
    const authSaltWA = CryptoJS.enc.Hex.parse(authSalt);
    const Khex = CryptoJS.PBKDF2(credentials.password, authSaltWA, {
      keySize: 512 / 32,
      iterations: 10000,
    }).toString(CryptoJS.enc.Hex);
    const challengeWA = CryptoJS.enc.Hex.parse(challenge);
    const Kwa = CryptoJS.enc.Hex.parse(Khex);
    const proofHex = CryptoJS.HmacSHA256(challengeWA, Kwa).toString(CryptoJS.enc.Hex);
    const finishRequest = {
      challengeId: challengeId,
      proof: proofHex,
      username: credentials.username,
    }

    // send proof to get encrypt salt
    const finishResponse = await apiClient.post<LoginFinishRequest, LoginFinishResponse>(
      endpoint.loginFinish, finishRequest
    );
    console.log(' 🍓 auth.ts > login > finishRequest:', finishRequest);
    console.log(' 🍓 auth.ts > login > finishResponse:', finishResponse);
    return finishResponse;

    } else {
      return {
        success: false,
        message: 'fail to create salts'
      }
    }
  },

  //
  // Logout
  //
  logout: async (): Promise<ApiResponse<LogoutResponse>> => {
    return apiClient.get<LogoutResponse>(endpoint.logout);
  },
};


// export type ApiResponse<TData> =
//   | { success: true; message?: string; data?: TData }
//   | { success: false; message?: string };

// export type LogoutResponse = null


// export const authApi = {
//   logout: async (): Promise<ApiResponse<LogoutResponse>> => {
//     return apiClient.get<ApiResponse<LogoutResponse>>(endpoint.logout);
//   },
// };


// export const get = <TRes>(endpoint: string): Promise<ApiResponse<TRes>> => {
//   return apiRequest<TRes>(endpoint, {
//     method: "GET",
//   });
// };

// async function apiRequest<TResponse>(
//   endpoint: string,
//   options: RequestInit = {},
// ): Promise<ApiResponse<TResponse>> {
//   const config: RequestInit = {
//     credentials: "include",
//     headers: {
//       "Content-Type": "application/json",
//       "Accept": "application/json"
//     },
//     ...options,
//   };
//   const url = `${API_BASE_URL}${endpoint}`;
//   const response = await fetch(url, config);
//   const json = (await response.json()) as ApiResponse<null>;
//   if (json.success === false) {
//     // try to refresh the access token
//     const responseRefresh = await fetch(pathRefreshToken, {
//       credentials: "include",
//       headers: { "Content-Type": "application/json" },
//       method: "POST",
//     });
//     const json = (await responseRefresh.json()) as ApiResponse<null>;
//     // repeat the last fetch with new tokens
//     if (json.success === true) {
//       const response = await fetch(url, config);
//       const json = (await response.json()) as ApiResponse<null>;
//       return json as ApiResponse<TResponse>;
//     } else {
//       return {
//         success: false,
//         message: `Request failed with status ${response.status}`,
//       };
//     }
//   }
//   // no refresh token needed
//   return json as ApiResponse<TResponse>;
// }
