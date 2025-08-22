import * as apiClient from './client';
import * as CryptoJS from "crypto-js";
import type {
  ApiResponse,
  LoginCredentials,
  LoginStartRequest,
  LoginStartResponse,
  LoginFinishRequest,
  LoginFinishResponse,
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
  refresh: '/auth/refresh'
}


export const authApi = {
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
  logout: async (): Promise<ApiResponse<null>> => {
    console.log(' 🍓 auth.ts > logout');
    return apiClient.get<null>(endpoint.logout);
  },
};
