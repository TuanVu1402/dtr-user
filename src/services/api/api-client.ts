import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import type { ApiResponse } from './types';

export const apiClient = axios.create({
  baseURL: config.api.baseUrl,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Token storage helpers
const TOKEN_KEY = 'dtr_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY),
};

// Request interceptor - attach token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.get();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - unwrap data & handle errors
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap API response if it follows the standard format
    const data = response.data as ApiResponse<unknown>;
    if (data && 'data' in response.data) {
      response.data = data.data;
    }
    return response;
  },
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 - attempt token refresh once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt refresh (if refresh endpoint exists)
        await apiClient.post('/auth/refresh');
        // Retry original request
        const token = tokenStorage.get();
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }
        return apiClient(originalRequest);
      } catch {
        // Refresh failed - clear token and redirect to login
        tokenStorage.remove();
        window.location.href = '/auth';
        return Promise.reject(error);
      }
    }

    // Global error handling
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    // Log in development
    if (config.app.environment === 'development') {
      console.error('[API Error]', {
        url: error.config?.url,
        status: error.response?.status,
        message,
      });
    }

    return Promise.reject(error);
  }
);

// Export types for use in services
export type { AxiosError, InternalAxiosRequestConfig as AxiosRequestConfig };
