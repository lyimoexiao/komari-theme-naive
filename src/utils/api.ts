interface LoginRequest {
  'username': string
  'password': string
  '2fa_code'?: string
}

interface LoginResult {
  'set-cookie': {
    session_token: string
  }
}

interface ApiClientOptions {
  baseUrl?: string
  timeout?: number
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export class ApiError extends Error {
  status: string
  code?: number

  constructor(message: string, status = 'error', code?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

export class KomariApi {
  private baseUrl: string
  private timeout: number

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? (import.meta.env.VITE_API_BASE || '/api')).replace(/\/$/, '')
    this.timeout = options.timeout ?? 30000
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(body),
        signal: controller.signal,
      })
      const result: unknown = await response.json()

      if (!isRecord(result) || (result.status !== 'success' && result.status !== 'error') || typeof result.message !== 'string') {
        throw new ApiError('Invalid API response', 'error', response.status)
      }

      if (!response.ok || result.status === 'error') {
        throw new ApiError(result.message || `HTTP error: ${response.status}`, 'error', response.status)
      }

      return result.data as T
    }
    catch (error) {
      if (error instanceof ApiError)
        throw error
      throw new ApiError(`Network error: ${error instanceof Error ? error.message : String(error)}`)
    }
    finally {
      clearTimeout(timeoutId)
    }
  }

  async login(username: string, password: string, twoFactorCode?: string): Promise<void> {
    const body: LoginRequest = { username, password }
    if (twoFactorCode) {
      body['2fa_code'] = twoFactorCode
    }
    await this.post<LoginResult>('/login', body)
  }

  logout(): void {
    window.location.href = `${this.baseUrl}/logout`
  }

  oauthLogin(): void {
    window.location.href = `${this.baseUrl}/oauth`
  }
}

let sharedApi: KomariApi | null = null

export function getSharedApi(): KomariApi {
  if (!sharedApi) {
    sharedApi = new KomariApi()
  }
  return sharedApi
}

export function resetSharedApi(): void {
  sharedApi = null
}
