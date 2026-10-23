// Centralized API configuration for Bahasa Detect
// When running in Vite, client-facing environment variables must be prefixed with VITE_
let baseUrl = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:8000')
).trim().replace(/\/+$/, '');

// If an API host is provided without protocol (e.g. Render Blueprint property: host), prepend https://
if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
  baseUrl = `https://${baseUrl}`;
}

export const API_BASE_URL = baseUrl;
