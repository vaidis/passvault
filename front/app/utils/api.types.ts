export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ErrorResponse {
  success: false;
  message: string;
  data?: never;
}

export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;

export interface Item {
  id: number;
  title: string;
  username: string;
  password: string;
  notes: string;
  order: number;
}

export interface Items {
  items: Item[];
}
