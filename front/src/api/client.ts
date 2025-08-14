const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
import type { ApiResponse, TResponse, ApiError } from './types'




// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  console.log('clients.ts getAuthHeaders')
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};




async function apiRequest<TResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<TResponse>> {
  try {
    console.log(' 🔗 apiRequest endpoint:', endpoint);
    console.log(' 🔗 apiRequest options:', options);
    const config: RequestInit = {
      'credentials': 'include',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...(options.headers ?? {}),
      },
      ...options,
    };

    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, config);
    const json = (await response.json()) as unknown;

    console.log('apiRequest url:', url);
    console.log('apiRequest response > json:', json);

    if (!response.ok) {
      const message =
        (json as any)?.message ||
        (json as any)?.error?.message ||
        `Request failed with status ${response.status}`;
      return { success: false, error: { message } };
    }

    return json as ApiResponse<TResponse>;
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) message = error.message;
      return { success: false, error: { message } };
  }
}






// HTTP method functions
export const get = <T>(endpoint: string): Promise<T> =>
  apiRequest<T>(endpoint, { method: 'GET' });

// working for register

// export const post = <ApiResponse, TData = Record<string, unknown>>(
//   endpoint: string,
//   data: TData
// ): Promise<ApiResponse> => {
//   console.log(' 🔗 client.ts post endpoint:', endpoint)
//   console.log(' 🔗 client.ts post data:', data)
//   return apiRequest<ApiResponse>(endpoint, {
//     method: 'POST',
//     body: data ? JSON.stringify(data) : undefined,
//   });
// }



export const post = async <TReq, TRes>(
  endpoint: string,
  data: TReq
): Promise<ApiResponse<TRes>> => {
  return apiRequest<TRes>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};


//export const post = <TResponse, TData = Record<string, unknown>>(
//  endpoint: string,
//  data: TData
//): Promise<TResponse> =>
//  apiRequest<TResponse>(endpoint, {
//    method: 'POST',
//    body: data ? JSON.stringify(data) : undefined,
//  });


//export const post = <T>(endpoint: string, data: any): Promise<T> =>
//  apiRequest<T>(endpoint, {
//    method: 'POST',
//    body: data ? JSON.stringify(data) : undefined,
//  });

export const put = <T>(endpoint: string, data?: any): Promise<T> =>
  apiRequest<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

export const del = <T>(endpoint: string): Promise<T> =>
  apiRequest<T>(endpoint, { method: 'DELETE' });

export const patch = <T>(endpoint: string, data?: any): Promise<T> =>
  apiRequest<T>(endpoint, {
    method: 'PATCH',
    body: data ? JSON.stringify(data) : undefined,
  });

