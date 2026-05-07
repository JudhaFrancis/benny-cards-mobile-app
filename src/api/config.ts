const api_url = (import.meta.env.API_URL || 'http://127.0.0.1:8000/api/v1') as string;

export const API_BASE = api_url;
export const API_URL = api_url;
export const BASE_URL = api_url ? api_url.replace(/\/api\/v1\/?$/, '') : '';
