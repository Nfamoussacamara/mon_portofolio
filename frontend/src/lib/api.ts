/**
 * Central API configuration.
 * All URLs are driven by environment variables so they work both
 * in development (localhost) and in production (Render).
 *
 * Set VITE_API_URL and VITE_BACKEND_BASE in your .env (local) or
 * in the Render dashboard (production).
 */

export const API_BASE =
  import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

export const BACKEND_BASE =
  import.meta.env.VITE_BACKEND_BASE ?? 'http://localhost:8000';
