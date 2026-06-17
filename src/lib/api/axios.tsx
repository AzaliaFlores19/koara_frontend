import { getAuthToken, clearAuth } from "@/lib/api/auth.api";
import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL: BASE_URL.endsWith('/') ? BASE_URL : `${BASE_URL}/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    if (config.url?.startsWith('/')) {
      config.url = config.url.slice(1);
    }

    if (typeof window !== 'undefined') {
      const token = getAuthToken();

      if (token) {
        const authHeader = `Bearer ${token}`;
        config.headers = config.headers || {};

        // @ts-ignore
        if (config.headers.set) {
          // @ts-ignore
          config.headers.set('Authorization', authHeader);
        } else {
          (config.headers as any)['Authorization'] = authHeader;
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        clearAuth();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);