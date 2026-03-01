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
const DEFAULT_LIST_VIEW_COLUMNS = ['status', 'region', 'name', 'tags', 'uptime', 'os', 'cpu', 'mem', 'disk', 'traffic'] as const
type ListViewColumn = typeof DEFAULT_LIST_VIEW_COLUMNS[number]

/** 默认的 List 视图列宽度配置 */
const DEFAULT_LIST_COLUMN_WIDTHS: Record<string, string> = {
  status: '76px',
  region: '32px',
  name: 'minmax(200px, 1fr)',
  tags: '200px',
  uptime: 'minmax(180px, 0.6fr)',
  os: '120px',
  cpu: '180px',
  mem: '180px',
  disk: '180px',
  traffic: '180px',
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
  const requireLogin = ref<boolean>(false)

  // 首页滚动位置记忆
  const homeScrollPosition = ref<number>(0)

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

  // 校验视图模式是否为合法值
  function isValidViewMode(value: string | null): value is NodeViewMode {
    return value === 'card' || value === 'list'
  }

  // 当前实际使用的视图模式
  const nodeViewMode = computed<NodeViewMode>({
    get: () => {
      // 校验 storedViewMode 是否为合法值，非法值时使用默认值
      if (storedViewMode.value !== null && isValidViewMode(storedViewMode.value)) {
        return storedViewMode.value
      }
      return defaultViewMode.value
    },
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

  // 计算属性：卡片进度条布局配置
  const cardProgressLayout = computed<'1col' | '2col'>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.cardProgressLayout === 'string') {
      const layout = settings.cardProgressLayout
      if (layout === '1col' || layout === '2col') {
        return layout
      }
    }
    return '2col'
  })

  // 计算属性：数字字体配置
  const numberFontFamily = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.numberFontFamily === 'string' && settings.numberFontFamily.trim()) {
      return settings.numberFontFamily.trim()
    }
    return '"TCloud Number VF", "MiSans VF", sans-serif'
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

  // 计算属性：List 视图列间距配置
  const listColumnGap = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.listColumnGap === 'string' && settings.listColumnGap.trim()) {
      return settings.listColumnGap.trim()
    }
    return '12px'
  })

  // 计算属性：List 视图列内边距配置
  const listColumnPadding = computed<Record<string, string>>(() => {
    const settings = publicSettings.value?.theme_settings
    const defaultPadding: Record<string, string> = {}

    if (!settings || typeof settings.listColumnPadding !== 'string') {
      return defaultPadding
    }

    try {
      const parsed = JSON.parse(settings.listColumnPadding)
      if (typeof parsed !== 'object' || parsed === null) {
        return defaultPadding
      }

      // 提取有效的内边距配置
      const validPadding: Record<string, string> = {}
      for (const col of DEFAULT_LIST_VIEW_COLUMNS) {
        if (typeof parsed[col] === 'string' && parsed[col].trim()) {
          validPadding[col] = parsed[col].trim()
        }
      }

      return validPadding
    }
    catch {
      return defaultPadding
    }
  })

  // 计算属性：List 视图列外边距配置
  const listColumnMargin = computed<Record<string, string>>(() => {
    const settings = publicSettings.value?.theme_settings
    const defaultMargin: Record<string, string> = {}

    if (!settings || typeof settings.listColumnMargin !== 'string') {
      return defaultMargin
    }

    try {
      const parsed = JSON.parse(settings.listColumnMargin)
      if (typeof parsed !== 'object' || parsed === null) {
        return defaultMargin
      }

      // 提取有效的外边距配置
      const validMargin: Record<string, string> = {}
      for (const col of DEFAULT_LIST_VIEW_COLUMNS) {
        if (typeof parsed[col] === 'string' && parsed[col].trim()) {
          validMargin[col] = parsed[col].trim()
        }
      }

      return validMargin
    }
    catch {
      return defaultMargin
    }
  })

  // 计算属性：List 视图行高度配置
  const listRowHeight = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.listRowHeight === 'string' && settings.listRowHeight.trim()) {
      return settings.listRowHeight.trim()
    }
    return ''
  })

  // 计算属性：List 视图状态显示样式（tag 或 badge）
  const listStatusStyle = computed<'tag' | 'badge'>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.listStatusStyle === 'string') {
      const style = settings.listStatusStyle
      if (style === 'tag' || style === 'badge') {
        return style
      }
    }
    return 'tag'
  })

  // 计算属性：List 视图标签显示样式（tag 或 badge）
  const listTagsStyle = computed<'tag' | 'badge'>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.listTagsStyle === 'string') {
      const style = settings.listTagsStyle
      if (style === 'tag' || style === 'badge') {
        return style
      }
    }
    return 'tag'
  })

  // 计算属性：是否显示延迟图表按钮
  const showPingChartButton = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.showPingChartButton === 'boolean') {
      return settings.showPingChartButton
    }
    return true
  })

  // 计算属性：是否将标签设置为单独一行显示
  const tagsInSeparateRow = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.tagsInSeparateRow === 'boolean') {
      return settings.tagsInSeparateRow
    }
    return false
  })

  // 计算属性：是否使用 Tag 组件包裹运行时间
  const uptimeTagWrap = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.uptimeTagWrap === 'boolean') {
      return settings.uptimeTagWrap
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

  // 计算属性：亮色模式卡片高对比度
  const lightCardContrast = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.lightCardContrast === 'boolean') {
      return settings.lightCardContrast
    }
    return false
  })

  // 计算属性：Card 视图流量统计上下行分离颜色
  const trafficSplitColor = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.trafficSplitColor === 'boolean') {
      return settings.trafficSplitColor
    }
    return true
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

  // 计算属性：ICP 备案配置
  const icpEnabled = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.icpEnabled === 'boolean') {
      return settings.icpEnabled
    }
    return false
  })

  const icpNumber = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.icpNumber === 'string') {
      return settings.icpNumber
    }
    return ''
  })

  const icpUrl = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.icpUrl === 'string' && settings.icpUrl.trim()) {
      return settings.icpUrl.trim()
    }
    return 'https://beian.miit.gov.cn/'
  })

  // 计算属性：公安备案配置
  const policeEnabled = computed<boolean>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.policeEnabled === 'boolean') {
      return settings.policeEnabled
    }
    return false
  })

  const policeNumber = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.policeNumber === 'string') {
      return settings.policeNumber
    }
    return ''
  })

  const policeUrl = computed<string>(() => {
    const settings = publicSettings.value?.theme_settings
    if (settings && typeof settings.policeUrl === 'string' && settings.policeUrl.trim()) {
      return settings.policeUrl.trim()
    }
    return ''
  })

  // 当 publicSettings 加载后，如果 localStorage 没有保存过视图模式或值为非法值，使用默认值
  watch(publicSettings, (settings) => {
    if (settings && !isValidViewMode(storedViewMode.value)) {
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
    cardProgressLayout,
    numberFontFamily,
    listViewColumns,
    hideSingleGroupTab,
    listColumnWidths,
    listColumnGap,
    listColumnPadding,
    listColumnMargin,
    listRowHeight,
    listStatusStyle,
    listTagsStyle,
    showPingChartButton,
    tagsInSeparateRow,
    uptimeTagWrap,
    uptimeFormat,
    lightCardContrast,
    trafficSplitColor,
    byteDecimals,
    alertEnabled,
    alertType,
    alertTitle,
    alertContent,
    icpEnabled,
    icpNumber,
    icpUrl,
    policeEnabled,
    policeNumber,
    policeUrl,
    isLoggedIn,
    userInfo,
    publicSettings,
    connectionError,
    requireLogin,
    homeScrollPosition,
    updateThemeMode,
    updateLang,
    setUserInfo,
    clearUserInfo,
  }
})

export { useAppStore }
