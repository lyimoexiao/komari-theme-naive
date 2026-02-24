<script setup lang="ts">
import { NAvatar, NButton, NFlex, NH3, NPopover } from 'naive-ui'
import { computed, h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import LoginDialog from './LoginDialog.vue'

const router = useRouter()
const appStore = useAppStore()

const siteFavicon = ref('/favicon.ico')

const actionButtons = computed(() => {
  return [
    {
      title: appStore.themeMode === 'auto' ? '自动主题' : appStore.themeMode === 'light' ? '浅色主题' : '深色主题',
      icon: appStore.themeMode === 'auto' ? 'i-icon-park-outline-dark-mode' : appStore.themeMode === 'light' ? 'i-icon-park-outline-sun-one' : 'i-icon-park-outline-moon',
      action: 'toggleTheme',
      disabled: false,
    },
    {
      title: '切换语言',
      icon: 'i-icon-park-outline-translate',
      action: 'openLanguageSelector',
      disabled: true,

    },
    {
      title: appStore.isLoggedIn ? '后台管理' : '登录',
      icon: appStore.isLoggedIn ? 'i-icon-park-outline-setting' : 'i-icon-park-outline-login',
      action: appStore.isLoggedIn ? 'jumpToSetting' : 'openLoginDialog',
      disabled: false,
    },
  ]
})

function handleButtonClick(action: string) {
  switch (action) {
    case 'toggleTheme':
      appStore.updateThemeMode()
      break
    case 'jumpToSetting':
      // 设置页由 Server 提供，不能使用无极路由
      location.href = '/admin'
      break
    case 'openLoginDialog':
      window.$modal.create({
        title: '登录',
        preset: 'dialog',
        showIcon: false,
        content: () => h(LoginDialog),
      })
      break
  }
}
</script>

<template>
  <div class="mx-auto px-4 flex-between h-16 shadow-sm top-0 position-sticky z-10 backdrop-blur-md">
    <NFlex class="flex-center cursor-pointer" @click="router.push('/')">
      <NAvatar :src="siteFavicon" round />
      <NH3 class="m-0">
        {{ appStore.publicSettings?.sitename || 'Komari Monitor' }}
      </NH3>
    </NFlex>
    <NFlex class="flex gap-4">
      <NPopover v-for="button in actionButtons" :key="button.action" :disabled="button.disabled">
        <template #trigger>
          <NButton :disabled="button.disabled" class="p-2 h-8 w-8" text @click="handleButtonClick(button.action)">
            <div :class="button.icon" />
          </NButton>
        </template>
        <template #default>
          {{ button.title }}
        </template>
      </NPopover>
    </NFlex>
  </div>
</template>
