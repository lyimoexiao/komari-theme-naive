<script setup lang="ts">
import type { VersionInfo } from '@/utils/api'
import { NLayoutFooter, NText } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import { getSharedApi } from '@/utils/api'

const appStore = useAppStore()
const api = getSharedApi()

// 构建时注入的版本信息
const buildVersion = __BUILD_VERSION__
const buildGitHash = __BUILD_GIT_HASH__

// Komari Monitor 服务端版本信息
const serverVersion = ref<VersionInfo | null>(null)

// 获取服务端版本信息
onMounted(async () => {
  try {
    serverVersion.value = await api.getVersion()
  }
  catch {
    // 静默失败
  }
})

// 格式化版本号显示
const formattedServerVersion = computed(() => serverVersion.value?.version ?? null)

// 计算页面容器的样式
const containerStyle = computed(() =>
  appStore.fullWidth
    ? {}
    : { maxWidth: appStore.maxPageWidth, marginInline: 'auto' },
)

// 是否显示备案信息
const showIcp = computed(() => appStore.icpEnabled && appStore.icpNumber)
const showPolice = computed(() => appStore.policeEnabled && appStore.policeNumber)
const showFiling = computed(() => showIcp.value || showPolice.value)

// 是否启用模糊背景
const hasBackgroundBlur = computed(() => appStore.backgroundEnabled && appStore.backgroundBlur > 0)

// 计算模糊半径类
const blurClass = computed(() => {
  if (!hasBackgroundBlur.value)
    return ''
  const radius = appStore.cardBlurRadius
  if (radius <= 8)
    return 'glass-8'
  if (radius <= 12)
    return 'glass-12'
  if (radius <= 16)
    return 'glass-16'
  if (radius <= 20)
    return 'glass-20'
  return `glass-${radius}`
})
</script>

<template>
  <NLayoutFooter
    class="px-4 py-4 w-full"
    :class="[{ 'glass-footer-enabled': hasBackgroundBlur }, blurClass]"
  >
    <div
      class="flex flex-col gap-3 w-full sm:flex-row sm:gap-4 sm:items-center sm:justify-between"
      :style="containerStyle"
    >
      <!-- 主信息区域 -->
      <div class="flex flex-col gap-2 sm:flex-row sm:gap-6">
        <!-- Komari Monitor 信息 -->
        <div class="flex flex-wrap gap-1 items-center">
          <NText :depth="3" class="text-sm">
            Powered by
          </NText>
          <a
            href="https://github.com/komari-monitor/komari"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none transition-opacity hover:opacity-80"
          >
            <NText type="primary" class="text-sm font-medium">
              Komari Monitor
            </NText>
          </a>
          <NText v-if="formattedServerVersion" :depth="3" class="text-xs font-mono ml-1">
            v{{ formattedServerVersion }}
          </NText>
        </div>

        <!-- 主题信息 -->
        <div class="flex flex-wrap gap-1 items-center">
          <NText :depth="3" class="text-sm">
            Theme by
          </NText>
          <a
            href="https://github.com/lyimoexiao/komari-theme-naive"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none transition-opacity hover:opacity-80"
          >
            <NText type="primary" class="text-sm font-medium">
              Komari Naive
            </NText>
          </a>
          <NText :depth="3" class="text-xs font-mono ml-1">
            v{{ buildVersion }} ({{ buildGitHash }})
          </NText>
        </div>
      </div>

      <!-- 备案信息区域 -->
      <div v-if="showFiling" class="flex flex-wrap gap-2 items-center sm:flex-shrink-0">
        <!-- ICP 备案 -->
        <a
          v-if="showIcp"
          :href="appStore.icpUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none transition-opacity hover:opacity-70"
        >
          <NText :depth="3" class="text-xs">
            {{ appStore.icpNumber }}
          </NText>
        </a>

        <!-- 分隔符 -->
        <span v-if="showIcp && showPolice" class="opacity-50">
          <NText :depth="3" class="text-xs">|</NText>
        </span>

        <!-- 公安备案 -->
        <template v-if="showPolice">
          <a
            v-if="appStore.policeUrl"
            :href="appStore.policeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="text-decoration-none transition-opacity hover:opacity-70"
          >
            <NText :depth="3" class="text-xs">
              {{ appStore.policeNumber }}
            </NText>
          </a>
          <NText v-else :depth="3" class="text-xs">
            {{ appStore.policeNumber }}
          </NText>
        </template>
      </div>
    </div>
  </NLayoutFooter>
</template>

<style scoped>
/* 毛玻璃 Footer 样式 */
.glass-footer-enabled {
  background-color: rgba(255, 255, 255, 0.7) !important;
}

:global(html.dark) .glass-footer-enabled {
  background-color: rgba(24, 24, 28, 0.85) !important;
}
</style>
