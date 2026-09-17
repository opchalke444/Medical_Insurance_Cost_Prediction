/**
 * Frontend API Service Layer
 * Handles communication with the FastAPI backend.
 * Uses VITE_API_BASE_URL environment variable with smart fallback:
 * - In local dev (localhost/127.0.0.1): defaults to http://127.0.0.1:8000
 * - In production deployment (e.g. Vercel/cloud): defaults to relative path "" (same origin)
 */

const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined') {
    const { hostname } = window.location;
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return '';
    }
  }
  return 'http://127.0.0.1:8000';
};

const API_BASE_URL = getBaseUrl();

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      return { status: 'degraded', model_loaded: false };
    }
    return await response.json();
  } catch (error) {
    return { status: 'offline', model_loaded: false, error: error.message };
  }
}

export async function predictInsurance(payload) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 422 && data.detail) {
        // Pydantic validation error parsing
        const errorMessages = Array.isArray(data.detail)
          ? data.detail.map(err => `${err.loc ? err.loc.join('.') : 'Field'}: ${err.msg}`).join(', ')
          : 'Validation failed on input data.';
        throw new Error(errorMessages);
      }
      throw new Error(data.detail || `Server error (${response.status})`);
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Could not connect to the backend server. Please ensure the FastAPI server is running on http://127.0.0.1:8000.');
    }
    throw error;
  }
}

export async function fetchModelMetadata() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/metadata`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Failed to load model metadata (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Metadata fetch failed, fallback will be used:', error.message);
    return null;
  }
}

export async function fetchModelInsights() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/insights`, {
      headers: { 'Accept': 'application/json' }
    });
    if (!response.ok) {
      throw new Error(`Failed to load model insights (${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Insights fetch failed:', error.message);
    return null;
  }
}
