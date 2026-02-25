import type { MeInfo, PublicSettings } from '@/utils/api'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

type ThemeMode = 'auto' | 'light' | 'dark'
type Lang = 'zh-CN' | 'en-US'
type NodeViewMode = 'card' | 'list'

const useAppStore = defineStore('app', () => {
  const loading = ref<boolean>(true)
  const themeMode = ref<ThemeMode>((localStorage.getItem('themeMode') as ThemeMode) || 'auto')
  const lang = ref<Lang>('zh-CN')
  const publicSettings = ref<PublicSettings>()
  const userInfo = ref<MeInfo>()
  const nodeSelectedGroup = ref<string>(localStorage.getItem('nodeSelectedGroup') || 'all')
  const isLoggedIn = ref<boolean>(false)
  const connectionError = ref<boolean>(false)

  // 从 localStorage 读取视图模式，若无则为 undefined，等待主题配置加载后设置
  const getStoredViewMode = (): NodeViewMode | undefined => {
    const stored = localStorage.getItem('nodeViewMode')
    if (stored === 'card' || stored === 'list') {
      return stored
    }
    return undefined
  }

  const nodeViewMode = ref<NodeViewMode>(getStoredViewMode() || 'card')

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

  // 当 publicSettings 加载后，如果 localStorage 没有保存过视图模式，则使用主题配置的默认值
  watch(publicSettings, (settings) => {
    if (settings && !getStoredViewMode()) {
      nodeViewMode.value = defaultViewMode.value
    }
  }, { immediate: true })

  // 监听主题模式变化，自动保存到 localStorage
  watch(themeMode, (newValue) => {
    localStorage.setItem('themeMode', newValue)
  })

  // 监听分组选择变化，自动保存到 localStorage
  watch(nodeSelectedGroup, (newValue) => {
    if (newValue) {
      localStorage.setItem('nodeSelectedGroup', newValue)
    }
    else {
      localStorage.removeItem('nodeSelectedGroup')
    }
  })

  // 监听视图模式变化，自动保存到 localStorage
  watch(nodeViewMode, (newValue) => {
    localStorage.setItem('nodeViewMode', newValue)
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
    lang,
    nodeSelectedGroup,
    nodeViewMode,
    defaultViewMode,
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
