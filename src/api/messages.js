import { request } from './client';

export const getReceivedMessages = (token) => request('/messages/received', { token });
export const getSentMessages = (token) => request('/messages/sent', { token });
export const sendMessage = (details, token) => request('/messages', { method: 'POST', body: details, token });
export const markMessageRead = (id, token) => request(`/messages/${id}/read`, { method: 'PATCH', token });
