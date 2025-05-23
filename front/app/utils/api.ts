import { ApiResponse, SuccessResponse, ErrorResponse } from './api.types';
import { redirect } from 'next/navigation'

const apiBaseURL = 'http://localhost:3001';
const apiAuthRefresh = `${apiBaseURL}/auth/refresh`;

export async function apiFetch<T>(input: RequestInfo, init?: RequestInit): Promise<ApiResponse<T>> {
  console.log('🏁 api.ts > apiFetch > input:', input);
  console.log('🏁 api.ts > apiFetch > init:', init);
  const res = await fetch(input, {
    ...init,
    credentials: 'include',
  });
  return res.json() as Promise<ApiResponse<T>>;
}

export async function apiFetchWithRefresh<T>(input: RequestInfo, init?: RequestInit): Promise<ApiResponse<T>> {
  console.log('🏁 api.ts > apiFetchWithRefresh > input:', input);
  console.log('🏁 api.ts > apiFetchWithRefresh > init:', init);

  let response = await apiFetch<T>(input, init);
  console.log('🏁 api.ts > apiFetchWithRefresh > apiFetch >  response:', response)

  // refresh token
  if (!response.success && response.message === 'jwt expired') {
    console.log('🏁 api.ts > apiFetchWithRefresh > refresh token');
    const refresh = await apiFetch<{ message: string }>(apiAuthRefresh, { method: 'POST' });

    if (!refresh.success) {
      console.log('🏁 api.ts > apiFetchWithRefresh > refresh failed.');
      redirect('/login')
    }

    response = await apiFetch<T>(input, init);
  }

  if (!response.success) {
    redirect('/login');
  }

  return response;
}

