import { request } from './client';

export const login = (credentials) => request('/auth/login', { method: 'POST', body: credentials });
export const register = (details) => request('/auth/register', { method: 'POST', body: details });
export const getCurrentUser = (token) => request('/auth/me', { token });
