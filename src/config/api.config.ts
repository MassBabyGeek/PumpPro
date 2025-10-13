import {API_URL} from '@env';

export const API_CONFIG = {
  BASE_URL: API_URL || 'http://localhost:8080',
  ENDPOINTS: {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/signup',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',

    // User
    USER_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',

    // Challenges
    CHALLENGES: '/challenges',
    CHALLENGE_BY_ID: (id: string) => `/challenges/${id}`,
    CHALLENGE_PROGRESS: (id: string) => `/challenges/${id}/progress`,

    // Workouts
    WORKOUTS: '/workouts',
    WORKOUT_BY_ID: (id: string) => `/workouts/${id}`,
  },
  TIMEOUT: 10000,
};

export const getUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
