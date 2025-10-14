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

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseURL}${endpoint}`;
    if (!params) return url;

    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    return `${url}?${queryString}`;
  }

  private getHeaders(token?: string, isFormData = false) {
    const headers: Record<string, string> = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';
    if (token) headers['Authorization'] = `${token}`;
    return headers;
  }

  private async parseResponse<T>(res: Response): Promise<T> {
    const text = await res.text(); // lire body une seule fois

    let json: ApiResponse<T> | null = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // ignore, on gardera text
    }

    if (!res.ok) {
      const message =
        json?.message ||
        `HTTP ${res.status}: ${res.statusText}` +
          (text ? ` - ${text.substring(0, 100)}` : '');
      throw new Error(message);
    }

    if (json && json.success === false) {
      throw new Error(json.message || 'Request failed');
    }

    return json?.data ?? ({} as T); // renvoyer data si présent, sinon {}
  }

  async request<T>(config: RequestConfig): Promise<T> {
    const {method, endpoint, data, params, token} = config;
    const url = this.buildURL(endpoint, params);
    const headers = this.getHeaders(token, data instanceof FormData);
    console.log('[ApiClient] Request', {method, url, headers, body: data});

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

      const response = await fetch(url, {
        method,
        headers,
        body:
          data instanceof FormData
            ? data
            : data
              ? JSON.stringify(data)
              : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return this.parseResponse<T>(response);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw err;
    }
  }

  get<T>(endpoint: string, params?: Record<string, any>, token?: string) {
    return this.request<T>({method: 'GET', endpoint, params, token});
  }

  post<T>(endpoint: string, data?: any, token?: string) {
    return this.request<T>({method: 'POST', endpoint, data, token});
  }

  put<T>(endpoint: string, data: any, token?: string) {
    return this.request<T>({method: 'PUT', endpoint, data, token});
  }

  patch<T>(endpoint: string, data: any, token?: string) {
    return this.request<T>({method: 'PATCH', endpoint, data, token});
  }

  delete<T>(endpoint: string, token?: string) {
    return this.request<T>({method: 'DELETE', endpoint, token});
  }
}

export default ApiClient;
