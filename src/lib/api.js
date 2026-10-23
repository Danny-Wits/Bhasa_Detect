// Centralized API configuration for Bahasa Detect
// When running in Vite, client-facing environment variables must be prefixed with VITE_
let baseUrl = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://bhasa-detect-api.onrender.com' : 'http://localhost:8000')
).trim().replace(/\/+$/, '');

// If Render Blueprint injects internal private hostname like 'bhasa-detect-api' (no dot/domain)
if (baseUrl && !baseUrl.includes('.') && !baseUrl.includes('localhost')) {
  baseUrl = `${baseUrl}.onrender.com`;
}

// If an API host is provided without protocol, prepend https://
if (baseUrl && !baseUrl.startsWith('http://') && !baseUrl.startsWith('https://')) {
  baseUrl = `https://${baseUrl}`;
}

export const API_BASE_URL = baseUrl;
