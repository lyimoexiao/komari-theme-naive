/**
 * Komari API 客户端 SDK
 * 基于 REST API 的 Komari 客户端
 * @see https://www.komari.wiki/dev/api.html
 */

// ==================== 类型定义 ====================

/** API 响应基础结构 */
interface ApiResponse<T = unknown> {
  status: 'success' | 'error'
  message: string
  data: T
}

/** 用户信息 */
export interface MeInfo {
  'logged_in': boolean
  'username': string
  '2fa_enabled'?: boolean
  'sso_id'?: string
  'sso_type'?: string
  'uuid'?: string
}

/** 公开站点属性 */
export interface PublicSettings {
  allow_cors: boolean
  custom_body: string
  custom_head: string
  description: string
  disable_password_login: boolean
  oauth_enable: boolean
  oauth_provider: string | null
  ping_record_preserve_time: number
  private_site: boolean
  record_enabled: boolean
  record_preserve_time: number
  sitename: string
  theme: string
  theme_settings?: Record<string, unknown> | null
}

/** 版本信息 */
export interface VersionInfo {
  hash: string
  version: string
}

/** 节点信息 */
export interface NodeInfo {
  uuid: string
  name: string
  cpu_name: string
  virtualization: string
  arch: string
  cpu_cores: number
  os: string
  kernel_version: string
  gpu_name: string
  region: string
  mem_total: number
  swap_total: number
  disk_total: number
  weight: number
  price: number
  billing_cycle: number
  auto_renewal: boolean
  currency: string
  expired_at: string | null
  group: string
  tags: string
  public_remark: string
  hidden: boolean
  traffic_limit: number
  traffic_limit_type: string
  created_at: string
  updated_at: string
}

/** 实时状态数据（嵌套结构） */
export interface RealtimeStatus {
  cpu: {
    usage: number
  }
  ram: {
    total: number
    used: number
  }
  swap: {
    total: number
    used: number
  }
  load: {
    load1: number
    load5: number
    load15: number
  }
  disk: {
    total: number
    used: number
  }
  network: {
    up: number
    down: number
    totalUp: number
    totalDown: number
  }
  connections: {
    tcp: number
    udp: number
  }
  uptime: number
  process: number
  message: string
  updated_at: string
}

/** WebSocket 实时状态响应 */
export interface WebSocketRealtimeResponse {
  status: 'success' | 'error'
  data: {
    online: string[]
    data: Record<string, RealtimeStatus>
  }
}

/** 负载历史记录（扁平结构） */
export interface LoadRecord {
  client: string
  time: string
  cpu: number
  gpu: number
  ram: number
  ram_total: number
  swap: number
  swap_total: number
  load: number
  temp: number
  disk: number
  disk_total: number
  net_in: number
  net_out: number
  net_total_up: number
  net_total_down: number
  process: number
  connections: number
  connections_udp: number
}

/** 负载历史记录响应 */
export interface LoadRecordsResponse {
  count: number
  records: LoadRecord[]
}

/** Ping 历史记录 */
export interface PingRecord {
  task_id: number
  time: string
  value: number
}

/** Ping 任务信息 */
export interface PingTask {
  id: number
  interval: number
  name: string
  loss: number
}

/** Ping 历史记录响应 */
export interface PingRecordsResponse {
  count: number
  records: PingRecord[]
  tasks: PingTask[]
}

/** 登录请求 */
export interface LoginRequest {
  'username': string
  'password': string
  '2fa_code'?: string
}

/** API 客户端配置 */
export interface ApiClientOptions {
  /** 基础路径，默认 '/api' */
  baseUrl?: string
  /** 超时时间（毫秒），默认 30000 */
  timeout?: number
}

/** API 错误 */
export class ApiError extends Error {
  status: string
  code?: number

  constructor(message: string, status: string = 'error', code?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

// ==================== API 客户端 ====================

/** Komari API 客户端 */
export class KomariApi {
  private baseUrl: string
  private timeout: number

  constructor(options: ApiClientOptions = {}) {
    this.baseUrl = options.baseUrl || import.meta.env.VITE_API_BASE || '/api'
    this.timeout = options.timeout || 30000
  }

  /**
   * 发送 GET 请求
   */
  private async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    let url = `${this.baseUrl}${path}`
    if (params) {
      const searchParams = new URLSearchParams()
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value))
        }
      })
      const queryString = searchParams.toString()
      if (queryString) {
        url += `?${queryString}`
      }
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // 携带 Cookie
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const result: ApiResponse<T> = await response.json()

      if (result.status === 'error') {
        throw new ApiError(result.message || 'Unknown error', 'error', response.status)
      }

      return result.data
    }
    catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof ApiError)
        throw error
      throw new ApiError(`Network error: ${error instanceof Error ? error.message : String(error)}`, 'error')
    }
  }

  /**
   * 发送 GET 请求（直接返回响应，不解析 ApiResponse 结构）
   */
  private async getRaw<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new ApiError(`HTTP error: ${response.status}`, 'error', response.status)
      }

      return await response.json()
    }
    catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof ApiError)
        throw error
      throw new ApiError(`Network error: ${error instanceof Error ? error.message : String(error)}`, 'error')
    }
  }

  /**
   * 发送 POST 请求
   */
  private async post<T>(path: string, body?: unknown): Promise<T> {
    const url = `${this.baseUrl}${path}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      const result = await response.json()

      // 登录接口返回 set-cookie 特殊结构
      if (result['set-cookie']) {
        return result as T
      }

      // 检查 API 响应状态
      const apiResult: ApiResponse<T> = result
      if (apiResult.status === 'error') {
        throw new ApiError(apiResult.message || 'Unknown error', 'error', response.status)
      }

      return apiResult.data
    }
    catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof ApiError)
        throw error
      throw new ApiError(`Network error: ${error instanceof Error ? error.message : String(error)}`, 'error')
    }
  }

  // ===== 用户信息接口 =====

  /**
   * 获取当前用户信息
   * 注意：此接口返回的是直接的 MeInfo 对象，不是包裹在 { status, message, data } 中
   */
  async getMe(): Promise<MeInfo> {
    return this.getRaw<MeInfo>('/me')
  }

  // ===== 服务端公开属性 =====

  /**
   * 获取站点的公开设置属性
   */
  async getPublicSettings(): Promise<PublicSettings> {
    return this.get<PublicSettings>('/public')
  }

  /**
   * 获取服务端版本信息
   */
  async getVersion(): Promise<VersionInfo> {
    return this.get<VersionInfo>('/version')
  }

  // ===== 登录/登出 =====

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @param twoFactorCode 两步验证码（可选）
   */
  async login(username: string, password: string, twoFactorCode?: string): Promise<{ 'set-cookie': { session_token: string } }> {
    const body: LoginRequest = { username, password }
    if (twoFactorCode) {
      body['2fa_code'] = twoFactorCode
    }
    return this.post<{ 'set-cookie': { session_token: string } }>('/login', body)
  }

  /**
   * 用户登出
   * 会重定向到首页
   */
  logout(): void {
    window.location.href = `${this.baseUrl}/logout`
  }

  /**
   * OAuth 登录
   * 会重定向到 OAuth 提供商
   */
  oauthLogin(): void {
    window.location.href = `${this.baseUrl}/oauth`
  }

  // ===== 节点信息 =====

  /**
   * 获取所有节点的基本信息列表
   */
  async getNodes(): Promise<NodeInfo[]> {
    return this.get<NodeInfo[]>('/nodes')
  }

  /**
   * 获取指定节点最近1分钟的历史数据
   * @param uuid 节点 UUID
   */
  async getNodeRecentStatus(uuid: string): Promise<RealtimeStatus[]> {
    return this.get<RealtimeStatus[]>(`/recent/${uuid}`)
  }

  // ===== 历史记录 =====

  /**
   * 获取指定节点的负载历史记录
   * @param uuid 节点 UUID
   * @param hours 查询时间范围（小时）
   */
  async getLoadRecords(uuid: string, hours: number): Promise<LoadRecordsResponse> {
    return this.get<LoadRecordsResponse>('/records/load', { uuid, hours })
  }

  /**
   * 获取指定节点的 Ping 历史记录
   * @param uuid 节点 UUID
   * @param hours 查询时间范围（小时）
   */
  async getPingRecords(uuid: string, hours: number): Promise<PingRecordsResponse> {
    return this.get<PingRecordsResponse>('/records/ping', { uuid, hours })
  }
}

// ==================== WebSocket 实时状态客户端 ====================

/** WebSocket 实时状态客户端 */
export class RealtimeWebSocket {
  private ws: WebSocket | null = null
  private url: string
  private reconnectInterval: number
  private maxReconnectAttempts: number
  private reconnectAttempts = 0
  private listeners: Set<(data: WebSocketRealtimeResponse) => void> = new Set()
  private errorListeners: Set<(error: Event) => void> = new Set()
  private isOpen = false

  constructor(options: {
    baseUrl?: string
    reconnectInterval?: number
    maxReconnectAttempts?: number
  } = {}) {
    const baseUrl = options.baseUrl || '/api/clients'
    this.url = baseUrl.replace(/^http/, 'ws').replace(/^https/, 'wss')
    this.reconnectInterval = options.reconnectInterval || 3000
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5
  }

  /**
   * 连接 WebSocket
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url)

        this.ws.onopen = () => {
          this.isOpen = true
          this.reconnectAttempts = 0
          // 发送获取数据请求
          this.ws!.send('get')
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const data: WebSocketRealtimeResponse = JSON.parse(event.data)
            this.listeners.forEach(listener => listener(data))
          }
          catch {
            // Ignore parse errors
          }
        }

        this.ws.onerror = (error) => {
          this.errorListeners.forEach(listener => listener(error))
          if (!this.isOpen) {
            reject(new ApiError('WebSocket connection failed', 'error'))
          }
        }

        this.ws.onclose = () => {
          this.isOpen = false
          this.attemptReconnect()
        }
      }
      catch (error) {
        reject(new ApiError(`WebSocket error: ${error instanceof Error ? error.message : String(error)}`, 'error'))
      }
    })
  }

  /**
   * 尝试重连
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++
      setTimeout(() => {
        this.connect().catch(() => {
          // Ignore reconnect errors
        })
      }, this.reconnectInterval)
    }
  }

  /**
   * 请求数据
   */
  requestData(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send('get')
    }
  }

  /**
   * 订阅实时数据
   */
  subscribe(callback: (data: WebSocketRealtimeResponse) => void): () => void {
    this.listeners.add(callback)
    return () => {
      this.listeners.delete(callback)
    }
  }

  /**
   * 订阅错误事件
   */
  onError(callback: (error: Event) => void): () => void {
    this.errorListeners.add(callback)
    return () => {
      this.errorListeners.delete(callback)
    }
  }

  /**
   * 关闭连接
   */
  close(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.isOpen = false
    this.listeners.clear()
    this.errorListeners.clear()
  }

  /**
   * 获取连接状态
   */
  get connected(): boolean {
    return this.isOpen && this.ws?.readyState === WebSocket.OPEN
  }
}

// ==================== 单例实例 ====================

let sharedApiInstance: KomariApi | null = null

/**
 * 获取共享的 KomariApi 实例
 */
export function getSharedApi(options?: ApiClientOptions): KomariApi {
  if (!sharedApiInstance) {
    sharedApiInstance = new KomariApi(options)
  }
  return sharedApiInstance
}

/**
 * 重置共享实例
 */
export function resetSharedApi(): void {
  sharedApiInstance = null
}

// 默认导出
export default KomariApi
