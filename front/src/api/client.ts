const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
//import type { ApiResponse, ApiError } from './types'

// Helper function to get auth headers
const getAuthHeaders = (): Record<string, string> => {
  console.log('clients.ts getAuthHeaders')
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    console.log(' 🔗 apiRequest endpoint:', endpoint);
    console.log(' 🔗 apiRequest options:', options);

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    const url = `${API_BASE_URL}${endpoint}`;
    console.log('apiRequest url:', url);

    const response = await fetch(url, config);
    const json = await response.json();
    console.log('apiRequest response > json:', json);

    if (!response.success) {
      throw new Error(json?.message || 'API request failed');
    }

    return json as T;
  } catch (error) {
    let message = 'Unknown error';
    if (error instanceof Error) {
      message = error.message;
    }

    return {
      success: false,
      message,
    } as T;
  }
}




// HTTP method functions
export const get = <T>(endpoint: string): Promise<T> =>
  apiRequest<T>(endpoint, { method: 'GET' });

export const post = <ApiResponse, TData = Record<string, unknown>>(
  endpoint: string,
  data: TData
): Promise<ApiResponse> => {
  console.log(' 🔗 client.ts post endpoint:', endpoint)
  console.log(' 🔗 client.ts post data:', data)
  return apiRequest<ApiResponse>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

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

