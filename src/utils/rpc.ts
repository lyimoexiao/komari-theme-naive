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
  uptime: number
}

/** 最近状态响应 */
export interface RecentStatusResp {
  count: number
  records: StatusRecord[]
}

/** 当前用户信息 */
export interface MeInfo {
  '2fa_enabled': boolean
  'logged_in': boolean
  'sso_id': string
  'sso_type': string
  'username': string
  'uuid': string
}

/** Ping 基本信息 */
export interface BasicInfo {
  client: string
  loss: number
  min: number
  max: number
}

/** Ping 记录 */
export interface PingRecord {
  task_id: number
  time: string
  value: number
  client: string
}

/** 负载记录查询结果（指定 uuid） */
export interface LoadRecordsResult {
  count: number
  records: StatusRecord[]
  from: string
  to: string
}

/** 负载记录查询结果（未指定 uuid） */
export interface LoadRecordsMapResult {
  count: number
  records: Record<string, StatusRecord[]>
  from: string
  to: string
}

/** Ping 记录查询结果 */
export interface PingRecordsResult {
  count: number
  basic_info: BasicInfo[]
  records: PingRecord[]
  from: string
  to: string
}

/** 负载记录查询参数 */
export interface GetRecordsParams {
  type?: 'load' | 'ping'
  uuid?: string
  hours?: number
  start?: string
  end?: string
  load_type?: 'cpu' | 'gpu' | 'ram' | 'swap' | 'load' | 'temp' | 'disk' | 'network' | 'process' | 'connections' | 'all'
  task_id?: number
  maxCount?: number
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

/** RPC 客户端配置 */
export interface RpcClientOptions {
  /** 基础路径，默认 '/api/rpc2' */
  baseUrl?: string
  /** 超时时间（毫秒），默认 30000 */
  timeout?: number
  /** 是否使用 WebSocket，默认 false */
  useWebSocket?: boolean
}

// ==================== RPC 客户端 ====================

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
  private wsReady = false
  private wsReadyResolvers: (() => void)[] = []

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
        headers: {
          'Content-Type': 'application/json',
        },
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
   * 初始化 WebSocket 连接
   */
  private initWebSocket(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve()
    }

    return new Promise((resolve, reject) => {
      const wsUrl = this.baseUrl.replace(/^http/, 'ws').replace(/^https/, 'wss')
      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = () => {
        this.wsReady = true
        this.wsReadyResolvers.forEach(r => r())
        this.wsReadyResolvers = []
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
        this.wsReady = false
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
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.initWebSocket()
    }

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

      this.ws!.send(JSON.stringify(request))
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
        this.wsReady = false
      }
    }
  }

  /**
   * 确保 WebSocket 连接已建立
   */
  async ensureWebSocketConnected(): Promise<void> {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return
    }
    await this.initWebSocket()
  }

  /**
   * 确保 WebSocket 连接已建立并通过 ping 验证
   * 连接成功后发送 ping，等待 pong 响应，超时时间 10 秒
   */
  async ensureWebSocketConnectedWithPing(timeoutMs = 10000): Promise<void> {
    // 如果已经有可用的连接，直接返回
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return
    }

    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new RpcError(-32000, 'WebSocket connection timeout'))
      }, timeoutMs)

      // 建立 WebSocket 连接
      this.initWebSocket()
        .then(() => {
          // 连接成功后发送 ping 验证
          return this.callWebSocket<string>('rpc.ping')
        })
        .then((result) => {
          clearTimeout(timeoutId)
          if (result === 'pong') {
            resolve()
          }
          else {
            reject(new RpcError(-32000, 'Invalid ping response'))
          }
        })
        .catch((error) => {
          clearTimeout(timeoutId)
          reject(error)
        })
    })
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

  /**
   * 关闭连接
   */
  close(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.pendingRequests.forEach((pending) => {
      clearTimeout(pending.timer)
      pending.reject(new RpcError(-32000, 'Client closed'))
    })
    this.pendingRequests.clear()
  }
}

// ==================== Komari RPC 客户端 ====================

/** Komari RPC2 API 客户端 */
export class KomariRpc {
  private client: RpcClient

  constructor(options: RpcClientOptions = {}) {
    this.client = new RpcClient(options)
  }

  // ===== RPC 内置方法 =====

  /**
   * 查看所有可用的 RPC 方法
   * @param internal 是否显示 RPC 内置方法
   */
  async getMethods(internal?: boolean): Promise<string[]> {
    return this.client.call<string[]>('rpc.methods', internal !== undefined ? { internal } : undefined)
  }

  /**
   * 获取指定 RPC 方法的帮助信息
   * @param method 方法名
   */
  async getHelp(method: string): Promise<MethodMeta> {
    return this.client.call<MethodMeta>('rpc.help', { method })
  }

  /**
   * 健康检查
   */
  async ping(): Promise<string> {
    return this.client.call<string>('rpc.ping')
  }

  /**
   * 获取 RPC 接口版本号
   */
  async getVersion(): Promise<string> {
    return this.client.call<string>('rpc.version')
  }

  // ===== 通用方法 =====

  /**
   * 获取节点信息
   * @param uuid 节点 UUID，留空返回全部
   */
  async getNodes(uuid?: string): Promise<Client | Record<string, Client>> {
    return this.client.call<Client | Record<string, Client>>('common:getNodes', uuid ? { uuid } : undefined)
  }

  /**
   * 获取公开的站点与运行配置信息
   */
  async getPublicInfo(): Promise<PublicInfo> {
    return this.client.call<PublicInfo>('common:getPublicInfo')
  }

  /**
   * 获取后端版本与构建哈希
   */
  async getBackendVersion(): Promise<VersionInfo> {
    return this.client.call<VersionInfo>('common:getVersion')
  }

  /**
   * 获取节点最新运行状态
   * @param uuid 单个节点 UUID
   * @param uuids 多个节点 UUID 列表
   */
  async getNodesLatestStatus(uuid?: string, uuids?: string[]): Promise<Record<string, NodeStatus>> {
    const params: Record<string, unknown> = {}
    if (uuid)
      params.uuid = uuid
    if (uuids)
      params.uuids = uuids
    return this.client.call<Record<string, NodeStatus>>('common:getNodesLatestStatus', Object.keys(params).length > 0 ? params : undefined)
  }

  /**
   * 获取当前登录用户信息
   */
  async getMe(): Promise<MeInfo> {
    return this.client.call<MeInfo>('common:getMe')
  }

  /**
   * 获取指定节点的最近状态记录列表
   * @param uuid 节点 UUID
   */
  async getNodeRecentStatus(uuid: string): Promise<RecentStatusResp> {
    return this.client.call<RecentStatusResp>('common:getNodeRecentStatus', { uuid })
  }

  /**
   * 获取历史记录（负载或 Ping）
   * @param params 查询参数
   */
  async getRecords(params: GetRecordsParams = {}): Promise<LoadRecordsResult | LoadRecordsMapResult | PingRecordsResult> {
    const filteredParams: Record<string, unknown> = {}
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined)
        filteredParams[key] = value
    })
    return this.client.call<LoadRecordsResult | LoadRecordsMapResult | PingRecordsResult>(
      'common:getRecords',
      Object.keys(filteredParams).length > 0 ? filteredParams : undefined,
    )
  }

  /**
   * 获取负载历史记录
   * @param uuid 节点 UUID，留空表示所有节点
   * @param hours 时间窗口（小时），默认 1
   * @param loadType 指标筛选
   * @param maxCount 返回数据点上限，默认 4000
   */
  async getLoadRecords(
    uuid?: string,
    hours?: number,
    loadType?: GetRecordsParams['load_type'],
    maxCount?: number,
  ): Promise<LoadRecordsResult | LoadRecordsMapResult> {
    return this.getRecords({
      type: 'load',
      uuid,
      hours,
      load_type: loadType,
      maxCount,
    }) as Promise<LoadRecordsResult | LoadRecordsMapResult>
  }

  /**
   * 获取 Ping 历史记录
   * @param taskId 任务 ID，-1 表示所有任务
   * @param hours 时间窗口（小时），默认 1
   * @param maxCount 返回数据点上限，默认 4000
   */
  async getPingRecords(
    taskId?: number,
    hours?: number,
    maxCount?: number,
  ): Promise<PingRecordsResult> {
    return this.getRecords({
      type: 'ping',
      task_id: taskId,
      hours,
      maxCount,
    }) as Promise<PingRecordsResult>
  }

  /**
   * 获取底层 RPC 客户端
   */
  getClient(): RpcClient {
    return this.client
  }

  /**
   * 关闭连接
   */
  close(): void {
    this.client.close()
  }
}

// ==================== 单例实例 ====================

let sharedInstance: KomariRpc | null = null

/**
 * 获取共享的 KomariRpc 实例
 */
export function getSharedRpc(options?: RpcClientOptions): KomariRpc {
  if (!sharedInstance) {
    sharedInstance = new KomariRpc(options)
  }
  return sharedInstance
}

/**
 * 重置共享实例
 */
export function resetSharedRpc(): void {
  if (sharedInstance) {
    sharedInstance.close()
    sharedInstance = null
  }
}

// 默认导出
export default KomariRpc
