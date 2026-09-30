import { request } from './client';

export async function getProperties(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  });
  return request(`/properties${query.size ? `?${query}` : ''}`);
}

export const getProperty = (id) => request(`/properties/${id}`);
export const getMyProperties = (token) => request('/properties/my-properties', { token });
export const createProperty = (formData, token) => request('/properties', { method: 'POST', body: formData, token });
export const updateProperty = (id, formData, token) => request(`/properties/${id}`, { method: 'PUT', body: formData, token });
export const deleteProperty = (id, token) => request(`/properties/${id}`, { method: 'DELETE', token });
