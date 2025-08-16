// Ενιαίο σχήμα για ApiResponse: success | failure με error.message
export type ApiResponse<TData> =
  | { success: true; message?: string; data?: TData }
  | { success: false; message?: string; error: { message: string } };

// --- Login Types ---
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




// register
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



// data
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
