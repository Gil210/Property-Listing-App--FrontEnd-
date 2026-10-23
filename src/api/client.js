const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');
const API_BASE_URL = baseUrl.endsWith('/api/v1') ? baseUrl : `${baseUrl}/api/v1`;

export async function request(path, options = {}) {
  const { token, headers = {}, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);
  if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

  if (requestOptions.body && !(requestOptions.body instanceof FormData)) {
    requestHeaders.set('Content-Type', 'application/json');
    requestOptions.body = JSON.stringify(requestOptions.body);
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...requestOptions, headers: requestHeaders });
  } catch (error) {
    throw new Error(`Could not reach the API at ${API_BASE_URL}. Check that the backend is running and try again.`);
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.message || `Request failed with status ${response.status}`);
  }
  return payload || {};
}

export { API_BASE_URL };
