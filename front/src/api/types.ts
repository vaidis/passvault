export type ApiResponse<T = never> =
  | { success: true; data: T }
  | { success: false; message: string };

export interface ApiError {
    message: string;
    status: number;
    errors?: Record<string, string[]>;
}

export interface RegisterRequest {
  email: string;
  username: string;
  authSalt: string;
  authProof: string;
  encryptSalt: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}



export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface DataItem {
  id: string;
  title: string;
  description: string;
  value: number;
  createdAt: string;
}
