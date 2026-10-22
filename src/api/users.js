import { request } from './client';

export const getProfile = (token) => request('/users/profile', { token });
export const updateProfile = (details, token) => request('/users/profile', { method: 'PUT', body: details, token });
export const changePassword = (details, token) => request('/users/change-password', { method: 'PUT', body: details, token });
export const getUsers = (token) => request('/users', { token });
export const getUser = (id, token) => request(`/users/${encodeURIComponent(id)}`, { token });
export const deleteUser = (id, token) => request(`/users/${encodeURIComponent(id)}`, { method: 'DELETE', token });
export const updateUserStatus = (id, isActive, token) => request(`/users/${encodeURIComponent(id)}/status`, { method: 'PATCH', body: { isActive }, token });
