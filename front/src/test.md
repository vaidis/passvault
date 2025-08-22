# step: 1
# file: Data.ts
# role: show the data by calling the api.getDataItems();
```ts
  React.useEffect(() => {
    (async () => {
      try {
        const response = await dataApi.getDataItems();
        // code that handle data or error
      } catch (error) {
        // code that error
      }
    })();
    return;
  }, []);
```

# step: 2
# file: data.ts 
# role: provides functions based on application needs to show, create, edit data
```ts
export const dataApi = {
  getDataItems: async (): Promise<ApiResponse<DataItems>> => {
    return apiClient.get<ApiResponse<DataItems>>('/data');
  },
  getDataItem: async (id: string): Promise<ApiResponse<DataItem>> => {
    return apiClient.get<ApiResponse<DataItem>>(`/data/${id}`);
  },
  create: async (data: Omit<DataItem, 'id' | 'createdAt'>): Promise<ApiResponse<DataItem>> => {
    return apiClient.post<ApiResponse<DataItem>>('/data', data);
  },
}
```

# step: 3
# file: client.ts 
# role: export functions based on http method and also do the actual http request for those http methods
```ts
async function apiRequest<TResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<TResponse>> {
  try {
    // fetch code here that returns data or fail
    return json as ApiResponse<TResponse>;
  } catch (error:Error) {
    return { success: false, message: error.message };
  }
}

export const get = <TRes>(
  endpoint: string
): Promise<ApiResponse<TRes>> => {
  return apiRequest<TRes>(endpoint, {
    method: 'GET'
  });
}

export const post = async <TReq, TRes>(
  endpoint: string,
  data: TReq
): Promise<ApiResponse<TRes>> => {
  return apiRequest<TRes>(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
};
```

# file: types.ts 
```ts 
export type ApiResponse<TData> =
  | { success: true; message?: string; data?: TData }
  | { success: false; message?: string; };
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
export type DataItems = DataItem[];
export type DataItem = {
  title: string;
  username: string;
  password: string;
  notes: string;
  created?: Date;
  edited?: Date;
}
```
