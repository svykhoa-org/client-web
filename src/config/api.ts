export const apiConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  apiKey: import.meta.env.VITE_API_KEY,
  apiVersion: 'v1',
  timeout: 10000,

  // Build full API URL
  get apiBaseURL() {
    const normalizedBaseURL = this.baseURL.replace(/\/+$/, '')
    const apiPath = `/api/${this.apiVersion}`

    // Avoid duplicating /api/v1 when env already includes the API prefix.
    if (normalizedBaseURL.endsWith(apiPath)) {
      return normalizedBaseURL
    }

    return `${normalizedBaseURL}${apiPath}`
  },
}
