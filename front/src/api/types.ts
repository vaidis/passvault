// Ενιαίο σχήμα για ApiResponse: success | failure με error.message
export type ApiResponse<TData> =
  | { success: true; data: TData }
  | { success: false; error: { message: string } };

// --- Login Types ---
export type LoginCredentials = {
  username: string;
  password: string;
};

export type LoginUsernameRequest = {
  username: string;
};

export type LoginUsernameResponse = {
  authSalt: string;
};

// Το σώμα που στέλνουμε στο /login/authproof
export type LoginAuthproofRequest = {
  username: string;
  authProof: string; // hex
};

// Τελικό επιτυχές response (όπως στο παράδειγμά σου)
export type LoginFinalResponse = {
  encryptSalt: string;
};


// export type ApiResponse<T = void> = ApiSuccess<T> | ApiFailure;

// export type ApiSuccess<T> = {
//     success: true;
//     data: T;
//     message?: string;
// };

// export type ApiFailure = {
//   success: false;
//   message: string;
//   status?: number;
//   errors?: Record<string, string[]>;
// };

// export interface ApiError extends Error {
//   status?: number;
//   details?: unknown;
// }


// // login flow
// export type TCredentials = {
//   username: string;
//   password: string;
// }

// export type TAuthLoginRequest = {
//   username: string;
//   password: string;
// }

// export type TLoginUsernameRequest = {
//   username: string;
// }

// export type TLoginUsernameResponse = {
//   authSalt: string;
// }

// export type TLoginAuthproofRequest = {
//   authproof: string;
// }

// export type TLoginAuthproofResponse = {
//   encryptSalt: string;
// }




// register
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


// login
export type TSendUsernameRequest = {
  username: string;
}

export type TSendUsernameResponse = {
  authSalt: string;
}

// encryptSalt: string;

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
