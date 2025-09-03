// Api
export type ApiResponse<TData> =
  | { success: true; message?: string; data?: TData }
  | { success: false; message?: string };

// Login
export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginStartRequest = {
  username: string;
};

export type LoginStartResponse = {
  authSalt: string;
  challengeId: string;
  challenge: string;
};

export type LoginFinishRequest = {
  username: string;
  proof: string;
  challengeId: string;
};

export type LoginFinishResponse = {
  encryptSalt: string;
};

// Register
export interface RegisterData {
  email: string;
  username: string;
  authSalt: string;
  verifierK: string;
  encryptSalt: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

// Data
export type DataItems = DataItem[];

export type DataItem = {
  id: number;
  title: string;
  username: string;
  password: string;
  notes: string;
  created: number;
  edited: number;
  category: string;
};

// User
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}
