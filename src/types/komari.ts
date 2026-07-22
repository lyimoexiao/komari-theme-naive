export interface MethodMeta {
  name: string
  summary: string
  description: string
  params: ParamMeta[]
  returns: string
}

export interface ParamMeta {
  name: string
  type: string
  description: string
}

export interface Client {
  uuid: string
  token?: string
  name: string
  cpu_name: string
  virtualization: string
  arch: string
  cpu_cores: number
  cpu_physical_cores: number
  os: string
  kernel_version: string
  gpu_name: string
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
  expired_at: string | null
  group: string
  tags: string
  hidden: boolean
  traffic_limit: number
  traffic_limit_type: 'sum' | 'max' | 'min' | 'up' | 'down'
  created_at: string
  updated_at: string
}

export interface PublicInfo {
  cors_origin_check_enabled: boolean
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
  theme_settings: Record<string, unknown> | null
}

export interface MeInfo {
  'logged_in': boolean
  'username': string
  '2fa_enabled'?: boolean
  'sso_id'?: string
  'sso_type'?: string
  'uuid'?: string
}

export interface VersionInfo {
  version: string
  hash: string
}

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

export interface StatusRecord {
  client: string
  time: string
  cpu?: number
  gpu?: number
  ram?: number
  ram_total?: number
  swap?: number
  swap_total?: number
  load?: number
  load5?: number
  load15?: number
  temp?: number
  disk?: number
  disk_total?: number
  net_in?: number
  net_out?: number
  net_total_up?: number
  net_total_down?: number
  traffic_up?: number
  traffic_down?: number
  process?: number
  connections?: number
  connections_udp?: number
}

export interface RecentStatusResult {
  count: number
  records: StatusRecord[]
}

export type LoadType = 'cpu' | 'gpu' | 'ram' | 'swap' | 'load' | 'temp' | 'disk' | 'network' | 'process' | 'connections' | 'all'

export interface GetRecordsParams {
  type?: 'load' | 'ping'
  uuid?: string
  hours?: number
  start?: string
  end?: string
  load_type?: LoadType
  task_id?: number
  maxCount?: number
}

export interface LoadRecordsResult {
  count: number
  records: Record<string, StatusRecord[]>
  from?: string
  to?: string
  load_type?: LoadType
  has_gpu_data?: boolean
}

export interface PingRecord {
  client: string
  task_id: number
  time: string
  value: number
}

export interface PingTaskSummary {
  id: number
  name: string
  type: string
  interval: number
  default_on: boolean
  clients?: string[]
  loss?: number
  min?: number
  max?: number
  avg?: number
  total?: number
}

export interface PingRecordsResult {
  count: number
  records: PingRecord[]
  tasks?: PingTaskSummary[]
  from?: string
  to?: string
}
