/**
 * Standard API response wrapper format from backend
 */
export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp?: string;
  path?: string;
  data: T;
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total?: number;
  page?: number;
  limit?: number;
}

/**
 * API Error response format
 */
export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  message: string | string[];
  error?: string;
  timestamp?: string;
  path?: string;
}
