/**
 * API Configuration
 * Central configuration for API endpoints, timeouts, and headers
 */

import {API_URL} from '@env';

// Configuration de l'API depuis .env
const API_BASE_URL = API_URL || 'http://localhost:8080';

const API_TIMEOUT = 10000; // 10 secondes

/**
 * Headers par défaut pour toutes les requêtes
 */
const getDefaultHeaders = () => ({
  'Content-Type': 'application/json',
  Accept: 'application/json',
});

/**
 * Headers avec authentification
 * @param token - JWT token pour l'authentification
 */
const getAuthHeaders = (token?: string) => ({
  ...getDefaultHeaders(),
  ...(token && {Authorization: `${token}`}),
});

export {API_BASE_URL, API_TIMEOUT, getDefaultHeaders, getAuthHeaders};
