import { request } from './client';

export const getProfile = (token) => request('/users/profile', { token });
export const updateProfile = (details, token) => request('/users/profile', { method: 'PUT', body: details, token });
export const changePassword = (details, token) => request('/users/change-password', { method: 'PUT', body: details, token });
