// Centralized API configuration for Bahasa Detect
// When running in Vite, client-facing environment variables must be prefixed with VITE_
export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '' : 'http://localhost:8000')
).replace(/\/+$/, '');
