import type { MeInfo, PublicSettings } from '@/utils/api'
import type { ByteDecimalsConfig, UptimeFormat } from '@/utils/helper'
import { usePreferredDark, useStorageAsync } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

type ThemeMode = 'auto' | 'light' | 'dark'
type Lang = 'zh-CN' | 'en-US'
type NodeViewMode = 'card' | 'list'
type RpcTransportMode = 'websocket' | 'http'
type AlertType = 'default' | 'info' | 'success' | 'warning' | 'error'

/** 默认的 List 视图列配置 */
const DEFAULT_LIST_VIEW_COLUMNS = ['status', 'region', 'name', 'uptime', 'os', 'cpu', 'mem', 'disk', 'traffic'] as const
type ListViewColumn = typeof DEFAULT_LIST_VIEW_COLUMNS[number]

/** 默认的 List 视图列宽度配置 */
const DEFAULT_LIST_COLUMN_WIDTHS: Record<string, string> = {
  status: '76px',
  region: '32px',
  name: 'minmax(200px, 1fr)',
  uptime: 'minmax(180px, 0.6fr)',
  os: '120px',
  cpu: '180px',
  mem: '180px',
  disk: '180px',
  traffic: 'minmax(180px, 0.5fr)',
}

/** 默认的字节精度配置 */
const DEFAULT_BYTE_DECIMALS: ByteDecimalsConfig = {
  B: 0,
  KB: 0,
  MB: 1,
  GB: 1,
  TB: 2,
}

const useAppStore = defineStore('app', () => {
  const loading = ref<boolean>(true)

  // 使用 VueUse 的 useStorageAsync 实现自动持久化
  const themeMode = useStorageAsync<ThemeMode>('themeMode', 'auto', localStorage)
  const lang = ref<Lang>('zh-CN')
  const publicSettings = ref<PublicSettings>()
  const userInfo = ref<MeInfo>()
  const nodeSelectedGroup = useStorageAsync<string>('nodeSelectedGroup', 'all', localStorage)
  const isLoggedIn = ref<boolean>(false)
  const connectionError = ref<boolean>(false)

  // 使用 null 表示未设置，等待主题配置加载后决定
  const storedViewMode = useStorageAsync<NodeViewMode | null>('nodeViewMode', null, localStorage)

  // 计算属性：从主题配置获取默认视图模式
  const defaultViewMode = computed<NodeViewMode>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.defaultViewMode === 'string') {
      const mode = settings.defaultViewMode
      if (mode === 'card' || mode === 'list') {
        return mode
      }
    }
    return 'card'
  })

  // 当前实际使用的视图模式
  const nodeViewMode = computed<NodeViewMode>({
    get: () => storedViewMode.value ?? defaultViewMode.value,
    set: (val) => {
      storedViewMode.value = val
    },
  })

  // 计算属性：从主题配置获取 RPC 连接模式
  const rpcTransportMode = computed<RpcTransportMode>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.rpcTransportMode === 'string') {
      const mode = settings.rpcTransportMode
      if (mode === 'websocket' || mode === 'http') {
        return mode
      }
    }
    return 'websocket'
  })

  // 计算属性：从主题配置获取是否显示登录按钮
  const showLoginButton = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.showLoginButton === 'boolean') {
      return settings.showLoginButton
    }
    return true
  })

  // 计算属性：页面布局配置
  const fullWidth = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.fullWidth === 'boolean') {
      return settings.fullWidth
    }
    return false
  })

  const maxPageWidth = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.maxPageWidth === 'string' && settings.maxPageWidth.trim()) {
      return settings.maxPageWidth.trim()
    }
    return '1800px'
  })

  // 计算属性：List 视图显示列配置
  const listViewColumns = computed<ListViewColumn[]>(() => {
    const settings = publicSettings.value?.theme_settings
    const defaultColumns = [...DEFAULT_LIST_VIEW_COLUMNS]

    if (!settings || typeof settings.listViewColumns !== 'string') {
      return defaultColumns
    }

    try {
      const parsed = JSON.parse(settings.listViewColumns)
      if (!Array.isArray(parsed) || parsed.length === 0) {
        return defaultColumns
      }

      // 验证每个列名是否有效
      const validColumns: ListViewColumn[] = []
      for (const col of parsed) {
        if (typeof col === 'string' && DEFAULT_LIST_VIEW_COLUMNS.includes(col as ListViewColumn)) {
          validColumns.push(col as ListViewColumn)
        }
      }

      return validColumns.length > 0 ? validColumns : defaultColumns
    }
    catch {
      return defaultColumns
    }
  })

  // 计算属性：单分组时是否隐藏 Tab
  const hideSingleGroupTab = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.hideSingleGroupTab === 'boolean') {
      return settings.hideSingleGroupTab
    }
    return true
  })

  // 计算属性：List 视图列宽度配置
  const listColumnWidths = computed<Record<string, string>>(() => {
    const settings = publicSettings.value?.theme_settings
    const defaultWidths = { ...DEFAULT_LIST_COLUMN_WIDTHS }

    if (!settings || typeof settings.listColumnWidths !== 'string') {
      return defaultWidths
    }

    try {
      const parsed = JSON.parse(settings.listColumnWidths)
      if (typeof parsed !== 'object' || parsed === null) {
        return defaultWidths
      }

      // 合并配置，保留有效列的宽度
      const mergedWidths = { ...defaultWidths }
      for (const col of DEFAULT_LIST_VIEW_COLUMNS) {
        if (typeof parsed[col] === 'string' && parsed[col].trim()) {
          mergedWidths[col] = parsed[col].trim()
        }
      }

      return mergedWidths
    }
    catch {
      return defaultWidths
    }
  })

  // 计算属性：List 视图宽松样式
  const listRelaxedStyle = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.listRelaxedStyle === 'boolean') {
      return settings.listRelaxedStyle
    }
    return false
  })

  // 计算属性：运行时间格式配置
  const uptimeFormat = computed<UptimeFormat>(() => {
    const settings = publicSettings.value?.theme_settings
    const validFormats: UptimeFormat[] = ['day', 'hour', 'minute', 'second']

    if (settings && typeof settings.uptimeFormat === 'string') {
      const format = settings.uptimeFormat as UptimeFormat
      if (validFormats.includes(format)) {
        return format
      }
    }
    return 'day'
  })

  // 计算属性：字节格式化精度配置
  const byteDecimals = computed<ByteDecimalsConfig>(() => {
    const settings = publicSettings.value?.theme_settings
    const config: ByteDecimalsConfig = { ...DEFAULT_BYTE_DECIMALS }

    if (!settings) {
      return config
    }

    // 解析各个单位的精度配置
    const parseDecimal = (key: string): number | undefined => {
      const value = settings[key]
      if (typeof value === 'number' && Number.isInteger(value)) {
        return value
      }
      return undefined
    }

    config.B = parseDecimal('byteDecimalsB') ?? config.B
    config.KB = parseDecimal('byteDecimalsKB') ?? config.KB
    config.MB = parseDecimal('byteDecimalsMB') ?? config.MB
    config.GB = parseDecimal('byteDecimalsGB') ?? config.GB
    config.TB = parseDecimal('byteDecimalsTB') ?? config.TB

    return config
  })

  // 计算属性：公告配置
  const alertEnabled = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.alertEnabled === 'boolean') {
      return settings.alertEnabled
    }
    return false
  })

  const alertType = computed<AlertType>(() => {
    const settings = publicSettings.value?.theme_settings
    const validTypes: AlertType[] = ['default', 'info', 'success', 'warning', 'error']

    if (settings && typeof settings.alertType === 'string') {
      const type = settings.alertType as AlertType
      if (validTypes.includes(type)) {
        return type
      }
    }
    return 'info'
  })

  const alertTitle = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.alertTitle === 'string') {
      return settings.alertTitle
    }
    return ''
  })

  const alertContent = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.alertContent === 'string') {
      return settings.alertContent
    }
    return ''
  })

  // 当 publicSettings 加载后，如果 localStorage 没有保存过视图模式，使用默认值
  watch(publicSettings, (settings) => {
    if (settings && storedViewMode.value === null) {
      // 触发 computed setter，会自动保存到 localStorage
      storedViewMode.value = defaultViewMode.value
    }
  }, { immediate: true })

  // 使用 VueUse 的 usePreferredDark 检测系统主题偏好
  const prefersDark = usePreferredDark()

  // 计算当前是否为暗色模式
  const isDark = computed(() => {
    if (themeMode.value === 'auto') {
      return prefersDark.value
    }
    return themeMode.value === 'dark'
  })

  function updateThemeMode(mode?: ThemeMode) {
    if (mode) {
      themeMode.value = mode
      return
    }

    const nextMode: Record<ThemeMode, ThemeMode> = {
      auto: 'light',
      light: 'dark',
      dark: 'auto',
    }

    themeMode.value = nextMode[themeMode.value]
  }

  function updateLang(newLang: Lang) {
    lang.value = newLang
  }

  function setUserInfo(info: MeInfo) {
    userInfo.value = info
    isLoggedIn.value = info.logged_in
  }

  function clearUserInfo() {
    userInfo.value = undefined
    isLoggedIn.value = false
  }

  return {
    loading,
    themeMode,
    isDark,
    lang,
    nodeSelectedGroup,
    nodeViewMode,
    defaultViewMode,
    rpcTransportMode,
    showLoginButton,
    fullWidth,
    maxPageWidth,
    listViewColumns,
    hideSingleGroupTab,
    listColumnWidths,
    listRelaxedStyle,
    uptimeFormat,
    byteDecimals,
    alertEnabled,
    alertType,
    alertTitle,
    alertContent,
    isLoggedIn,
    userInfo,
    publicSettings,
    connectionError,
    updateThemeMode,
    updateLang,
    setUserInfo,
    clearUserInfo,
  }
})

export { useAppStore }
