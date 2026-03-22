export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  apiKey: import.meta.env.VITE_API_KEY,
  apiVersion: 'v1',
  timeout: 10000,

  // Build full API URL
  get apiBaseURL() {
    return `${this.baseURL}/api/${this.apiVersion}`;
  },
};
