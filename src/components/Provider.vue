<script setup lang="ts">
import type { GlobalTheme, GlobalThemeOverrides } from 'naive-ui'
import {
  darkTheme,
  dateEnUS,
  dateZhCN,
  enUS,
  lightTheme,
  NBackTop,
  NConfigProvider,
  NDialogProvider,
  NGlobalStyle,
  NLoadingBarProvider,
  NMessageProvider,
  NModalProvider,
  NNotificationProvider,
  useDialog,
  useLoadingBar,
  useMessage,
  useModal,
  useNotification,
  zhCN,
} from 'naive-ui'

import { computed, defineComponent, h, provide, ref, watch } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 滚动状态：是否显示返回顶部按钮（即页面已滚动）
const isScrolled = ref(false)

// 提供给子组件使用
provide('isScrolled', isScrolled)

// 直接使用 store 中的 isDark computed
const isDark = computed(() => appStore.isDark)

const theme = computed<GlobalTheme | null>(() => {
  return isDark.value ? darkTheme : lightTheme
})

const locale = computed(() => {
  const langMap = {
    'zh-CN': zhCN,
    'en-US': enUS,
  }
  return langMap[appStore.lang] || zhCN
})

const dateLocale = computed(() => {
  const langMap = {
    'zh-CN': dateZhCN,
    'en-US': dateEnUS,
  }
  return langMap[appStore.lang] || dateZhCN
})

function setupNaiveTools() {
  window.$loadingBar = useLoadingBar()
  window.$notification = useNotification()
  window.$message = useMessage()
  window.$dialog = useDialog()
  window.$modal = useModal()
}

const NaiveProviderContent = defineComponent({
  setup() {
    setupNaiveTools()
  },
  render() {
    return h('div', { className: 'naive-tools' })
  },
})

// 从主题配置读取设置，支持亮色/暗色模式分别配置
const themeOverride = computed<GlobalThemeOverrides>(() => {
  const settings = appStore.publicSettings?.theme_settings as Record<string, unknown> | undefined

  // 通用默认值
  const borderRadius = (settings?.borderRadius as string) || '3px'
  const fontFamily = (settings?.fontFamily as string) || '"MiSans VF", sans-serif'

  // 根据当前主题模式选择颜色配置
  const primaryColor = isDark.value
    ? (settings?.darkPrimaryColor as string) || '#63e2b6'
    : (settings?.lightPrimaryColor as string) || '#18a058'

  const primaryColorHover = isDark.value
    ? (settings?.darkPrimaryColorHover as string) || '#7fe7c4'
    : (settings?.lightPrimaryColorHover as string) || '#36ad6a'

  const primaryColorPressed = isDark.value
    ? (settings?.darkPrimaryColorPressed as string) || '#5acea7'
    : (settings?.lightPrimaryColorPressed as string) || '#0c7a43'

  return {
    common: {
      primaryColor,
      primaryColorHover,
      primaryColorPressed,
      primaryColorSuppl: primaryColorHover,
      borderRadius,
      fontFamily,
    },
  }
})

// 将主题颜色同步到 CSS 变量，供 UnoCSS 和自定义样式使用
watch(
  themeOverride,
  (overrides) => {
    const root = document.documentElement
    if (overrides.common?.primaryColor) {
      root.style.setProperty('--primary-color', overrides.common.primaryColor)
    }
    if (overrides.common?.primaryColorHover) {
      root.style.setProperty('--primary-color-hover', overrides.common.primaryColorHover)
    }
    if (overrides.common?.primaryColorPressed) {
      root.style.setProperty('--primary-color-pressed', overrides.common.primaryColorPressed)
    }
  },
  { immediate: true },
)
</script>

<template>
  <NConfigProvider :theme="theme" :theme-overrides="themeOverride" :locale="locale" :date-locale="dateLocale">
    <NBackTop :visibility-height="1" @update:show="isScrolled = $event" />
    <NGlobalStyle />
    <NLoadingBarProvider>
      <NDialogProvider>
        <NNotificationProvider>
          <NMessageProvider>
            <NModalProvider>
              <slot />
              <NaiveProviderContent />
            </NModalProvider>
          </NMessageProvider>
        </NNotificationProvider>
      </NDialogProvider>
    </NLoadingBarProvider>
  </NConfigProvider>
</template>
