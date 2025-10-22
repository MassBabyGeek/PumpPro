import {API_TIMEOUT} from './api.config';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestConfig {
  method: HttpMethod;
  endpoint: string;
  data?: any;
  params?: Record<string, any>;
  skipAuth?: boolean; // Pour les routes publiques (login, register)
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Global callbacks
let getTokenCallback: (() => Promise<string | null>) | null = null;
let tokenRefreshCallback: (() => Promise<string | undefined>) | null = null;
let forceLogoutCallback: (() => Promise<void>) | null = null;

/**
 * ✨ Configure le callback pour récupérer le token actuel
 * Ce callback sera appelé AUTOMATIQUEMENT avant chaque requête
 */
export function setGetTokenCallback(callback: () => Promise<string | null>) {
  getTokenCallback = callback;
}

/**
 * ✨ Configure le callback pour rafraîchir le token
 * Ce callback sera appelé AUTOMATIQUEMENT en cas de 401
 */
export function setTokenRefreshCallback(
  callback: () => Promise<string | undefined>,
) {
  tokenRefreshCallback = callback;
}

/**
 * ✨ Configure le callback pour forcer la déconnexion
 * Ce callback sera appelé si le refresh token échoue
 */
export function setForceLogoutCallback(callback: () => Promise<void>) {
  forceLogoutCallback = callback;
}

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;
  private failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = [];

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private processQueue(error: Error | null, token: string | null = null) {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve(token);
      }
    });

    this.failedQueue = [];
  }

  /**
   * 🔧 Construit l'URL complète avec les query params
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = `${this.baseURL}${endpoint}`;
    if (!params) return url;

    const queryString = Object.entries(params)
      .filter(([_, value]) => value !== undefined && value !== null)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    return queryString ? `${url}?${queryString}` : url;
  }

  /**
   * 🔧 Construit les headers avec le token AUTOMATIQUEMENT
   * Plus besoin de passer le token manuellement !
   */
  private async getHeaders(
    skipAuth: boolean,
    isFormData: boolean,
  ): Promise<Record<string, string>> {
    const headers: Record<string, string> = {};

    // Content-Type uniquement si ce n'est pas FormData
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    // ✨ Ajouter le token automatiquement sauf si skipAuth
    if (!skipAuth && getTokenCallback) {
      const token = await getTokenCallback();
      if (token) {
        headers['Authorization'] = `${token}`;
      }
    }

    return headers;
  }

  /**
   * 📝 Log les détails de la requête (dev only)
   * Affiche: méthode, URL, token (tronqué), et body
   */
  private logRequest(config: {
    method: string;
    url: string;
    headers: Record<string, string>;
    body?: any;
  }) {
    if (__DEV__) {
      const {method, url, headers, body} = config;
      const token = headers['Authorization']
        ? `${headers['Authorization'].substring(0, 20)}...`
        : '❌ No token';

      console.group(`📡 API ${method} ${url}`);
      console.log('🔑 Token:', token);
      if (body) {
        console.log('📦 Body:', body instanceof FormData ? '[FormData]' : body);
      }
      console.groupEnd();
    }
  }

  /**
   * 📝 Log la réponse (dev only)
   */
  private logResponse(config: {
    method: string;
    url: string;
    status: number;
    data?: any;
    error?: any;
  }) {
    if (__DEV__) {
      const {method, url, status, data, error} = config;
      const emoji = status >= 200 && status < 300 ? '✅' : '❌';

      console.group(`${emoji} API ${method} ${url} - ${status}`);
      if (error) {
        console.error('❌ Error:', error);
      } else if (data) {
        console.log('📥 Data:', data);
      }
      console.groupEnd();
    }
  }

  /**
   * 🔧 Parse la réponse et gère les erreurs + refresh token automatique
   */
  private async parseResponse<T>(
    res: Response,
    config: RequestConfig,
  ): Promise<T> {
    const text = await res.text();

    let json: ApiResponse<T> | null = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      // Si le parsing échoue, on garde le texte brut
    }

    // 🔄 Handle 401 Unauthorized - refresh token automatique
    if (res.status === 401 && !config.skipAuth) {
      // Si on est déjà en train de rafraîchir, on met la requête en queue
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.failedQueue.push({resolve, reject});
        }).then(() => {
          // Retry avec le nouveau token (récupéré automatiquement)
          return this.request<T>(config);
        });
      }

      this.isRefreshing = true;

      try {
        if (!tokenRefreshCallback) {
          throw new Error('Token refresh not configured');
        }

        const newToken = await tokenRefreshCallback();

        if (!newToken) {
          throw new Error('Token refresh failed');
        }

        this.processQueue(null, newToken);

        // Retry la requête originale (le token sera récupéré automatiquement)
        return this.request<T>(config);
      } catch (error) {
        this.processQueue(error as Error, null);

        // Force logout si le refresh échoue
        if (forceLogoutCallback) {
          await forceLogoutCallback();
        }

        throw new Error('Session expirée - veuillez vous reconnecter');
      } finally {
        this.isRefreshing = false;
      }
    }

    // Log la réponse
    this.logResponse({
      method: config.method,
      url: this.buildURL(config.endpoint, config.params),
      status: res.status,
      data: json?.data,
      error: !res.ok ? json?.message || text : undefined,
    });

    // Gestion des erreurs HTTP
    if (!res.ok) {
      const message =
        json?.message ||
        `HTTP ${res.status}: ${res.statusText}` +
          (text ? ` - ${text.substring(0, 100)}` : '');
      throw new Error(message);
    }

    // Gestion des erreurs métier
    if (json && json.success === false) {
      throw new Error(json.message || 'Request failed');
    }

    return json?.data ?? ({} as T);
  }

  /**
   * 🚀 Effectue une requête HTTP
   * ✨ Le token est automatiquement ajouté aux headers sauf si skipAuth = true
   */
  async request<T>(config: RequestConfig): Promise<T> {
    const {method, endpoint, data, params, skipAuth = false} = config;
    const url = this.buildURL(endpoint, params);
    const headers = await this.getHeaders(skipAuth, data instanceof FormData);

    // Log la requête
    this.logRequest({method, url, headers, body: data});

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
      return this.parseResponse<T>(response, config);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw err;
    }
  }

  /**
   * 📥 GET request - Le token est automatiquement ajouté
   * @param skipAuth - Passer à true pour les routes publiques (login, register)
   */
  get<T>(
    endpoint: string,
    params?: Record<string, any>,
    skipAuth?: boolean,
  ): Promise<T> {
    return this.request<T>({method: 'GET', endpoint, params, skipAuth});
  }

  /**
   * 📤 POST request - Le token est automatiquement ajouté
   * @param skipAuth - Passer à true pour les routes publiques (login, register)
   */
  post<T>(endpoint: string, data?: any, skipAuth?: boolean): Promise<T> {
    return this.request<T>({method: 'POST', endpoint, data, skipAuth});
  }

  /**
   * ✏️ PUT request - Le token est automatiquement ajouté
   */
  put<T>(endpoint: string, data: any, skipAuth?: boolean): Promise<T> {
    return this.request<T>({method: 'PUT', endpoint, data, skipAuth});
  }

  /**
   * 🔧 PATCH request - Le token est automatiquement ajouté
   */
  patch<T>(endpoint: string, data: any, skipAuth?: boolean): Promise<T> {
    return this.request<T>({method: 'PATCH', endpoint, data, skipAuth});
  }

  /**
   * 🗑️ DELETE request - Le token est automatiquement ajouté
   */
  delete<T>(endpoint: string, skipAuth?: boolean): Promise<T> {
    return this.request<T>({method: 'DELETE', endpoint, skipAuth});
  }
}

export default ApiClient;
