export const AppConfig = {
  isLocal: true,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  API_FILE_URL: import.meta.env.VITE_API_FILE_URL || 'http://localhost:3000/files/',
  API_KEY: import.meta.env.VITE_API_KEY || 'default-api-key',
  // Google OAuth Client ID (Web application). Must match the server's GOOGLE_CLIENT_ID.
  // Empty → Google sign-in button is hidden (feature disabled until configured).
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
}
