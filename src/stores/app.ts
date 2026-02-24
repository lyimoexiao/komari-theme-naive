import type { MeInfo, PublicSettings } from '@/utils/api'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

type ThemeMode = 'auto' | 'light' | 'dark'
type Lang = 'zh-CN' | 'en-US'
type NodeViewMode = 'grid' | 'table'

const useAppStore = defineStore('app', () => {
  const loading = ref<boolean>(true)
  const themeMode = ref<ThemeMode>('auto')
  const lang = ref<Lang>('zh-CN')
  const publicSettings = ref<PublicSettings>()
  const userInfo = ref<MeInfo>()
  const nodeSelectedGroup = ref<string>(localStorage.getItem('nodeSelectedGroup') || 'all')
  const nodeViewMode = ref<NodeViewMode>((localStorage.getItem('nodeViewMode') as NodeViewMode) || 'grid')
  const isLoggedIn = ref<boolean>(false)

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
    isLoggedIn,
    userInfo,
    publicSettings,
    updateThemeMode,
    updateLang,
    setUserInfo,
    clearUserInfo,
  }
})

export { useAppStore }
