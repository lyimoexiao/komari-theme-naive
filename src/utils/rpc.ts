import type {
  Client,
  GetRecordsParams,
  LoadRecordsResult,
  LoadType,
  MeInfo,
  MethodMeta,
  NodeStatus,
  PingRecordsResult,
  PublicInfo,
  RecentStatusResult,
  VersionInfo,
} from '@/types/komari'

// ==================== 类型定义 ====================

/** JSON-RPC 2.0 请求结构 */
interface JsonRpcRequest {
  jsonrpc: '2.0'
  method: string
  params?: Record<string, unknown> | unknown[]
  id: number | string
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
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
    const apiBase = import.meta.env.VITE_API_BASE || '/api'
    this.baseUrl = options.baseUrl ?? `${apiBase.replace(/\/$/, '')}/rpc2`
    this.timeout = options.timeout ?? 30000
    this.useWebSocket = options.useWebSocket ?? false
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
        credentials: 'include',
        body: JSON.stringify(request),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new RpcError(response.status, `HTTP error: ${response.status}`)
      }

      const data: unknown = await response.json()
      return this.handleResponse<T>(data)
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
      const wsUrl = new URL(this.baseUrl, window.location.href)
      wsUrl.protocol = wsUrl.protocol === 'https:' ? 'wss:' : 'ws:'

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
          const data: unknown = JSON.parse(event.data)
          if (!isRecord(data) || (typeof data.id !== 'number' && typeof data.id !== 'string'))
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
  private handleResponse<T>(response: unknown): T {
    if (!isRecord(response) || response.jsonrpc !== '2.0') {
      throw new RpcError(-32603, 'Invalid JSON-RPC response')
    }

    if ('error' in response) {
      const error = response.error
      if (!isRecord(error) || typeof error.code !== 'number' || typeof error.message !== 'string') {
        throw new RpcError(-32603, 'Invalid JSON-RPC error response')
      }
      throw new RpcError(error.code, error.message, error.data)
    }

    if (!('result' in response)) {
      throw new RpcError(-32603, 'Missing JSON-RPC result')
    }

    return response.result as T
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

    let timeoutId: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new RpcError(-32001, 'WebSocket ping timeout')), timeoutMs)
    })

    try {
      await Promise.race([this.callWebSocket<string>('rpc.ping'), timeout])
    }
    finally {
      clearTimeout(timeoutId)
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
  async getMethods(internal = false): Promise<string[]> {
    return this.client.call<string[]>('rpc.methods', { internal })
  }

  /**
   * 获取帮助信息
   */
  async getHelp(method: string): Promise<MethodMeta> {
    return this.client.call<MethodMeta>('rpc.help', { method })
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
  async getVersion(): Promise<string> {
    return this.client.call<string>('rpc.version')
  }

  // ==================== 通用方法 ====================

  /**
   * 获取所有节点信息
   */
  async getNodes(): Promise<Record<string, Client>>
  async getNodes(uuid: string): Promise<Client>
  async getNodes(uuid?: string): Promise<Client | Record<string, Client>> {
    return this.client.call<Client | Record<string, Client>>('common:getNodes', uuid ? { uuid } : undefined)
  }

  /**
   * 获取所有节点最新状态
   */
  async getNodesLatestStatus(uuid?: string, uuids?: string[]): Promise<Record<string, NodeStatus>> {
    const params = uuid
      ? { uuid }
      : uuids
        ? { uuids }
        : undefined
    return this.client.call<Record<string, NodeStatus>>('common:getNodesLatestStatus', params)
  }

  /**
   * 获取节点最近状态记录
   */
  async getNodeRecentStatus(uuid: string): Promise<RecentStatusResult> {
    return this.client.call<RecentStatusResult>('common:getNodeRecentStatus', { uuid })
  }

  /**
   * 获取公开的站点信息
   */
  async getPublicInfo(): Promise<PublicInfo> {
    return this.client.call<PublicInfo>('public:getPublicSettings')
  }

  async getMe(): Promise<MeInfo> {
    return this.client.call<MeInfo>('public:getMe')
  }

  /**
   * 获取后端版本
   */
  async getBackendVersion(): Promise<VersionInfo> {
    return this.client.call<VersionInfo>('public:getVersion')
  }

  // ==================== 历史记录方法 ====================

  /**
   * 获取历史记录（通用方法）
   */
  async getRecords<T>(params: GetRecordsParams): Promise<T> {
    return this.client.call<T>('common:getRecords', { ...params })
  }

  /**
   * 获取负载记录
   */
  async getLoadRecords(uuid: string, hours = 4, loadType: LoadType = 'all', maxCount = 4000): Promise<LoadRecordsResult> {
    return this.client.call<LoadRecordsResult>('common:getRecords', {
      type: 'load',
      uuid,
      hours,
      load_type: loadType,
      maxCount,
    })
  }

  /**
   * 获取 Ping 记录
   */
  async getPingRecords(uuid: string, hours = 4): Promise<PingRecordsResult> {
    return this.client.call<PingRecordsResult>('public:getPingRecords', {
      uuid,
      hours: String(hours),
    })
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

/**
 * 重置共享实例
 */
export function resetSharedRpc(): void {
  if (sharedRpc) {
    sharedRpc.close()
    sharedRpc = null
  }
}
