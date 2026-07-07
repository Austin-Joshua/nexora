import axiosInstance from './axiosInstance';
import type { AuthResponse, UserRole } from '../types/User';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const authApi = {
  getGoogleAuthUrl: (): string => {
    const cleanBase = API_BASE.endsWith('/api') ? API_BASE.slice(0, -4) : API_BASE;
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: `${cleanBase}/api/auth/google/callback`,
      response_type: 'code',
      scope: [
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.metadata',
        'https://www.googleapis.com/auth/calendar.events',
        'openid', 'email', 'profile',
      ].join(' '),
      access_type: 'offline',
      prompt: 'consent',
    });
    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const { data } = await axiosInstance.get<AuthResponse>('/api/auth/me');
    return data;
  },

  updateProfile: async (userRole: UserRole): Promise<AuthResponse> => {
    const { data } = await axiosInstance.put<AuthResponse>('/api/auth/profile', { userRole });
    return data;
  },

  revokeAccess: async (): Promise<void> => {
    await axiosInstance.post('/api/auth/revoke');
  },
};
