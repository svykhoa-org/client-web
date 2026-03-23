export const AppConfig = {
  isLocal: true,
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  API_FILE_URL: import.meta.env.VITE_API_FILE_URL || 'http://localhost:3000/files/',
  API_KEY: import.meta.env.VITE_API_KEY || 'default-api-key',
}
