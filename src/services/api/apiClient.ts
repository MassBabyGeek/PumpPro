/**
 * Generic HTTP Client
 * Handles all HTTP requests with proper error handling, timeout, and authentication
 */

import {API_TIMEOUT, getAuthHeaders} from './api.config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestConfig {
  method: HttpMethod;
  endpoint: string;
  data?: any;
  params?: Record<string, any>;
  token?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/**
 * ApiClient class for making HTTP requests
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Build URL with query parameters
   * @param endpoint - API endpoint
   * @param params - Query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseURL}${endpoint}`;
    if (!params) return url;

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    return `${url}?${queryString}`;
  }

  /**
   * Make HTTP request
   * @param config - Request configuration
   */
  async request<T>(config: RequestConfig): Promise<T> {
    const {method, endpoint, data, params, token} = config;
    const url = this.buildURL(endpoint, params);
    const headers = getAuthHeaders(token);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(url, {
        method,
        headers,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Parse JSON response
      const jsonResponse: ApiResponse<T> = await response.json();

      // Check if request was successful
      if (!response.ok) {
        throw new Error(
          jsonResponse.message ||
            `HTTP ${response.status}: ${response.statusText}`,
        );
      }

      // Check success flag from API
      if (!jsonResponse.success) {
        throw new Error(jsonResponse.message || 'Request failed');
      }

      // Return the data field from the API response
      return jsonResponse.data;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.error(`[ApiClient] ${method} ${endpoint} timeout`);
          throw new Error('Request timeout');
        }
        console.error(
          `[ApiClient] ${method} ${endpoint} failed:`,
          error.message,
        );
      }
      throw error;
    }
  }

  /**
   * GET request
   * @param endpoint - API endpoint
   * @param params - Query parameters
   * @param token - Authentication token
   */
  get<T>(
    endpoint: string,
    params?: Record<string, any>,
    token?: string,
  ): Promise<T> {
    return this.request<T>({method: 'GET', endpoint, params, token});
  }

  /**
   * POST request
   * @param endpoint - API endpoint
   * @param data - Request body
   * @param token - Authentication token
   */
  post<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>({method: 'POST', endpoint, data, token});
  }

  /**
   * PUT request
   * @param endpoint - API endpoint
   * @param data - Request body
   * @param token - Authentication token
   */
  put<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>({method: 'PUT', endpoint, data, token});
  }

  /**
   * PATCH request
   * @param endpoint - API endpoint
   * @param data - Request body
   * @param token - Authentication token
   */
  patch<T>(endpoint: string, data: any, token?: string): Promise<T> {
    return this.request<T>({method: 'PATCH', endpoint, data, token});
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint
   * @param token - Authentication token
   */
  delete<T>(endpoint: string, token?: string): Promise<T> {
    return this.request<T>({method: 'DELETE', endpoint, token});
  }
}

export default ApiClient;
