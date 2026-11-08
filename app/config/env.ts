function parseApiBaseUrl(value: unknown): string {
  const rawValue = typeof value === 'string' ? value.trim() : ''

  if (!rawValue) return 'http://localhost:8080'

  try {
    return new URL(rawValue).origin
  } catch {
    throw new Error('VITE_API_BASE_URL must be a valid URL, for example: http://localhost:8080')
  }
}

function parseBooleanEnv(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === '') return defaultValue
  if (value === true || value === 'true' || value === '1') return true
  if (value === false || value === 'false' || value === '0') return false

  throw new Error('VITE_USE_MOCK must be one of: true, false, 1, 0')
}

const apiServerUrl = new URL(parseApiBaseUrl(import.meta.env.VITE_API_BASE_URL))
const apiOrigin = apiServerUrl.origin
const apiBasePath = '/api/v1'

export const env = {
  useMock: parseBooleanEnv(import.meta.env.VITE_USE_MOCK, true),
  apiOrigin,
  apiBasePath,
  apiBaseUrl: `${apiOrigin}${apiBasePath}/`
}
