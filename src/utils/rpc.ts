/**
 * Komari RPC2 Client SDK
 * @see https://www.komari.wiki/dev/rpc.html
 */

// ==================== 类型定义 ====================

/** JSON-RPC 2.0 请求结构 */
interface JsonRpcRequest {
  jsonrpc: '2.0'
  method: string
  params?: Record<string, unknown> | unknown[]
  id: number | string
}

/** JSON-RPC 2.0 成功响应 */
interface JsonRpcSuccessResponse<T = unknown> {
  jsonrpc: '2.0'
  result: T
  id: number | string
}

/** JSON-RPC 2.0 错误响应 */
interface JsonRpcErrorResponse {
  jsonrpc: '2.0'
  error: {
    code: number
    message: string
    data?: unknown
  }
  id: number | string | null
}

/** JSON-RPC 2.0 响应 */
type JsonRpcResponse<T = unknown> = JsonRpcSuccessResponse<T> | JsonRpcErrorResponse

/** RPC 方法元数据 */
export interface MethodMeta {
  name: string
  summary: string
  description: string
  params: ParamMeta[]
  returns: string
}

/** 参数元数据 */
export interface ParamMeta {
  name: string
  type: string
  description: string
}

/** 节点客户端信息 */
export interface Client {
  uuid: string
  token?: string
  name: string
  cpu_name: string
  virtualization: string
  arch: string
  cpu_cores: number
  os: string
  kernel_version: string
  gpu_name?: string
  ipv4?: string
  ipv6?: string
  region: string
  remark?: string
  public_remark: string
  mem_total: number
  swap_total: number
  disk_total: number
  version?: string
  weight: number
  price: number
  billing_cycle: number
  auto_renewal: boolean
  currency: string
  expired_at: string
  group: string
  tags: string
  hidden: boolean
  traffic_limit: number
  traffic_limit_type: string
  created_at: string
  updated_at: string
}

/** 公开站点信息 */
export interface PublicInfo {
  allow_cors: boolean
  custom_body: string
  custom_head: string
  description: string
  disable_password_login: boolean
  oauth_enable: boolean
  oauth_provider: string
  ping_record_preserve_time: number
  private_site: boolean
  record_enabled: boolean
  record_preserve_time: number
  sitename: string
  theme: string
  theme_settings: Record<string, unknown>
}

/** 版本信息 */
export interface VersionInfo {
  version: string
  hash: string
}

/** 节点状态 */
export interface NodeStatus {
  client: string
  time: string
  cpu: number
  gpu: number
  ram: number
  ram_total: number
  swap: number
  swap_total: number
  load: number
  load5: number
  load15: number
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
  online: boolean
  uptime: number
}

/** 状态记录 */
export interface StatusRecord {
  client: string
  time: string
  cpu: number
  gpu: number
  ram: number
  ram_total: number
  swap: number
  swap_total: number
  load: number
  load5: number
  load15: number
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

/** Ping 记录 */
export interface PingRecord {
  client: string
  task_id: number
  time: string
  value: number
}

/** RPC 错误 */
export class RpcError extends Error {
  code: number
  data?: unknown

  constructor(code: number, message: string, data?: unknown) {
    super(message)
    this.name = 'RpcError'
    this.code = code
    this.data = data
  }
}

/** RpcClient 配置选项 */
interface RpcClientOptions {
  baseUrl?: string
  timeout?: number
  /** 是否使用 WebSocket，默认 false */
  useWebSocket?: boolean
}

/** JSON-RPC 2.0 客户端 */
export class RpcClient {
  private baseUrl: string
  private timeout: number
  private useWebSocket: boolean
  private ws: WebSocket | null = null
  private pendingRequests: Map<number | string, {
    resolve: (value: unknown) => void
    reject: (reason: unknown) => void
    timer: ReturnType<typeof setTimeout>
  }> = new Map()

  private requestId = 0
  /** WebSocket 连接 Promise（用于等待正在进行的连接） */
  private wsConnectPromise: Promise<void> | null = null

  constructor(options: RpcClientOptions = {}) {
    const apiBase = import.meta.env.VITE_API_BASE || ''
    this.baseUrl = options.baseUrl || `${apiBase}/rpc2`
    this.timeout = options.timeout || 30000
    this.useWebSocket = options.useWebSocket || false
  }

  /**
   * 调用 RPC 方法（HTTP POST）
   */
  private async callHttp<T>(method: string, params?: Record<string, unknown> | unknown[]): Promise<T> {
    const id = ++this.requestId
    const request: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      params,
      id,
    }

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new RpcError(-32000, `HTTP error: ${response.status}`)
      }

      const data: JsonRpcResponse<T> = await response.json()
      return this.handleResponse(data)
    }
    catch (error) {
      clearTimeout(timeoutId)
      if (error instanceof RpcError)
        throw error
      throw new RpcError(-32000, `Network error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * 确保 WebSocket 连接已建立并就绪
   * 如果已有连接正在建立中，等待其完成
   */
  private async ensureWebSocketReady(): Promise<void> {
    // 已连接，直接返回
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return
    }

    // 有正在进行的连接，等待它
    if (this.wsConnectPromise) {
      return this.wsConnectPromise
    }

    // 创建新连接
    this.wsConnectPromise = this.initWebSocket()
    try {
      await this.wsConnectPromise
    }
    finally {
      this.wsConnectPromise = null
    }
  }

  /**
   * 初始化 WebSocket 连接
   */
  private initWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = this.baseUrl.replace(/^http/, 'ws').replace(/^https/, 'wss')

      // 关闭现有连接（如果有）
      if (this.ws) {
        this.ws.onopen = null
        this.ws.onerror = null
        this.ws.onmessage = null
        this.ws.onclose = null
        if (this.ws.readyState !== WebSocket.CLOSED) {
          this.ws.close()
        }
      }

      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        resolve()
      }

      this.ws.onerror = () => {
        reject(new RpcError(-32000, 'WebSocket connection error'))
      }

      this.ws.onmessage = (event) => {
        try {
          const data: JsonRpcResponse = JSON.parse(event.data)
          if (data.id === null)
            return
          const pending = this.pendingRequests.get(data.id)
          if (pending) {
            clearTimeout(pending.timer)
            this.pendingRequests.delete(data.id)
            try {
              pending.resolve(this.handleResponse(data))
            }
            catch (error) {
              pending.reject(error)
            }
          }
        }
        catch {
          // Ignore parse errors
        }
      }

      this.ws.onclose = () => {
        this.ws = null
        // Reject all pending requests
        this.pendingRequests.forEach((pending, id) => {
          clearTimeout(pending.timer)
          pending.reject(new RpcError(-32000, 'WebSocket closed'))
          this.pendingRequests.delete(id)
        })
      }
    })
  }

  /**
   * 调用 RPC 方法（WebSocket）
   */
  private async callWebSocket<T>(method: string, params?: Record<string, unknown> | unknown[]): Promise<T> {
    await this.ensureWebSocketReady()

    return new Promise((resolve, reject) => {
      const id = ++this.requestId
      const request: JsonRpcRequest = {
        jsonrpc: '2.0',
        method,
        params,
        id,
      }

      const timer = setTimeout(() => {
        this.pendingRequests.delete(id)
        reject(new RpcError(-32001, 'Request timeout'))
      }, this.timeout)

      this.pendingRequests.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
        timer,
      })

      // 此时 WebSocket 应该已经打开
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify(request))
      }
      else {
        // 异常情况：连接断开了，拒绝请求
        this.pendingRequests.delete(id)
        clearTimeout(timer)
        reject(new RpcError(-32000, 'WebSocket not connected'))
      }
    })
  }

  /**
   * 处理响应
   */
  private handleResponse<T>(response: JsonRpcResponse<T>): T {
    if ('error' in response) {
      throw new RpcError(response.error.code, response.error.message, response.error.data)
    }
    return response.result
  }

  /**
   * 调用 RPC 方法
   */
  async call<T>(method: string, params?: Record<string, unknown> | unknown[]): Promise<T> {
    if (this.useWebSocket) {
      return this.callWebSocket<T>(method, params)
    }
    return this.callHttp<T>(method, params)
  }

  /**
   * 切换传输方式
   */
  setTransport(useWebSocket: boolean): void {
    if (this.useWebSocket !== useWebSocket) {
      this.useWebSocket = useWebSocket
      if (!useWebSocket && this.ws) {
        this.ws.close()
        this.ws = null
      }
    }
  }

  /**
   * 确保 WebSocket 连接已建立
   */
  async ensureWebSocketConnected(): Promise<void> {
    await this.ensureWebSocketReady()
  }

  /**
   * 确保 WebSocket 连接已建立并通过 ping 验证
   */
  async ensureWebSocketConnectedWithPing(timeoutMs = 10000): Promise<void> {
    await this.ensureWebSocketReady()

    // 使用 AbortController 实现超时
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
      await this.callWebSocket<string>('rpc.ping')
      clearTimeout(timeoutId)
    }
    catch (error) {
      clearTimeout(timeoutId)
      throw error
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
  }

  /**
   * 获取 WebSocket 连接状态
   */
  getWsReadyState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  /**
   * 获取 WebSocket 实例（用于状态监控）
   */
  getWebSocket(): WebSocket | null {
    return this.ws
  }
}

// ==================== KomariRpc 类 ====================

/**
 * Komari RPC 高级封装
 * 提供常用的 Komari API 方法
 */
export class KomariRpc {
  private client: RpcClient

  constructor(options: RpcClientOptions = {}) {
    this.client = new RpcClient(options)
  }

  /**
   * 获取底层 RpcClient 实例
   */
  getClient(): RpcClient {
    return this.client
  }

  // ==================== 内置方法 ====================

  /**
   * 获取所有可用方法
   */
  async getMethods(): Promise<string[]> {
    return this.client.call<string[]>('rpc.getMethods')
  }

  /**
   * 获取帮助信息
   */
  async getHelp(): Promise<MethodMeta[]> {
    return this.client.call<MethodMeta[]>('rpc.getHelp')
  }

  /**
   * Ping 测试
   */
  async ping(): Promise<string> {
    return this.client.call<string>('rpc.ping')
  }

  /**
   * 获取版本信息
   */
  async getVersion(): Promise<VersionInfo> {
    return this.client.call<VersionInfo>('rpc.getVersion')
  }

  // ==================== 节点方法 ====================

  /**
   * 获取所有节点信息
   */
  async getNodes(): Promise<Record<string, Client>> {
    return this.client.call<Record<string, Client>>('client.getNodes')
  }

  /**
   * 获取所有节点最新状态
   */
  async getNodesLatestStatus(): Promise<Record<string, NodeStatus>> {
    return this.client.call<Record<string, NodeStatus>>('nodeStatus.getLatest')
  }

  /**
   * 获取节点最近状态记录
   */
  async getNodeRecentStatus(uuid: string, limit?: number): Promise<{ records: StatusRecord[] }> {
    return this.client.call<{ records: StatusRecord[] }>('nodeStatus.getRecent', { uuid, limit })
  }

  // ==================== 历史记录方法 ====================

  /**
   * 获取负载记录
   */
  async getLoadRecords(uuid: string, hours?: number): Promise<{ records: StatusRecord[] }> {
    return this.client.call<{ records: StatusRecord[] }>('records.getLoadRecords', { uuid, hours })
  }

  /**
   * 获取 Ping 记录
   */
  async getPingRecords(uuid: string, hours?: number): Promise<{ records: PingRecord[] }> {
    return this.client.call<{ records: PingRecord[] }>('records.getPingRecords', { uuid, hours })
  }

  /**
   * 关闭连接
   */
  close(): void {
    this.client.close()
  }
}

// ==================== 单例 ====================

let sharedRpc: KomariRpc | null = null

/**
 * 获取共享的 KomariRpc 实例
 */
export function getSharedRpc(): KomariRpc {
  if (!sharedRpc) {
    sharedRpc = new KomariRpc()
  }
  return sharedRpc
}
