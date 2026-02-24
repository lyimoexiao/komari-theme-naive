<script setup lang="ts">
import type { GlobalTheme, GlobalThemeOverrides } from 'naive-ui'
import {
  darkTheme,
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
  useOsTheme,
} from 'naive-ui'

import { computed, defineComponent, h } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()
const osTheme = useOsTheme()

const isDark = computed(() => {
  if (appStore.themeMode === 'auto') {
    return osTheme.value === 'dark'
  }
  return appStore.themeMode === 'dark'
})

const theme = computed<GlobalTheme | null>(() => {
  return isDark.value ? darkTheme : lightTheme
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

const themeOverride: GlobalThemeOverrides = {
  common: {
    fontFamily: 'MiSans, sans-serif',
  },
}
</script>

<template>
  <NConfigProvider :theme="theme" :theme-overrides="themeOverride">
    <NBackTop :visibility-height="80" />
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
