import type { ApiResponse } from "./types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
const pathRefreshToken = `${API_BASE_URL}/auth/refresh`;

async function apiRequest<TResponse>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<TResponse>> {
  console.log(" 🔗  apiRequest endpoint:", endpoint);
  console.log(" 🔗  apiRequest options:", options);

  const config: RequestInit = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    ...options,
  };

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, config);
  const json = (await response.json()) as ApiResponse<TResponse>;

  console.log(" 🔗  apiRequest url:", url);
  console.log(" 🔗  apiRequest response > json:", JSON.stringify(json));
  console.log(" 🔗  apiRequest response > json.message:", json.message);
  console.log(" 🔗  apiRequest response > typeof(json.message):", typeof json.message );

  if (json.success === false) {
    // try to refresh the access token
    const responseRefresh = await fetch(pathRefreshToken, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    const json = (await responseRefresh.json()) as ApiResponse<TResponse>;
    // repeat the last fetch with new tokens
    if (json.success === true) {
      console.log(" 🔗  fetch with fresh tokens");
      const response = await fetch(url, config);
      const json = (await response.json()) as ApiResponse<TResponse>;
      return json as ApiResponse<TResponse>;
    } else {
      return {
        success: false,
        message: `Request failed with status ${response.status}`,
      };
    }
  }
  // no refresh token needed
  return json as ApiResponse<TResponse>;
}

//
// HTTP method functions
//
export const get = <TRes>(
  endpoint: string
): Promise<ApiResponse<TRes>> => {
  return apiRequest<TRes>(endpoint, {
    method: "GET",
  });
};

export const post = async <TReq, TRes>(
  endpoint: string,
  data: TReq,
): Promise<ApiResponse<TRes>> => {
  return apiRequest<TRes>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const put = async <TReq, TRes>(
  endpoint: string,
  data: TReq,
): Promise<ApiResponse<TRes>> => {
  return apiRequest<TRes>(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

export const del = async <TRes>(
  endpoint: string
): Promise<ApiResponse<TRes>> => {
  return apiRequest<TRes>(endpoint, {
    method: "DELETE"
  });
};

// export function delete<T>(arg0: number): ApiResponse<null> | PromiseLike<ApiResponse<null>> {
//   throw new Error('Function not implemented.');
// }
