<script setup lang="ts">
import { NButton, NLayoutFooter, NText } from 'naive-ui'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 构建时注入的版本信息
const buildVersion = __BUILD_VERSION__
const buildGitHash = __BUILD_GIT_HASH__

// 计算页面容器的样式
const containerStyle = computed(() => {
  if (appStore.fullWidth) {
    return {}
  }
  return {
    maxWidth: appStore.maxPageWidth,
    marginInline: 'auto',
  }
})
</script>

<template>
  <footer>
    <NLayoutFooter class="p-4 flex flex-col gap-4">
      <div class="flex flex-col gap-4 w-full" :style="containerStyle">
        <div>
          <NText>
            Powered by
          </NText>
          <NButton text tag="a" href="https://github.com/komari-monitor/komari" target="_blank">
            <NText type="primary">
              Komari Monitor
            </NText>
          </NButton>
        </div>
        <div>
          <NText>
            Theme by
          </NText>
          <NButton text tag="a" href="https://github.com/lyimoexiao/komari-theme-naive" target="_blank">
            <NText type="primary">
              Komari Naive
            </NText>
          </NButton>
          <NText :depth="3" class="text-xs font-mono ml-2">
            v{{ buildVersion }} ({{ buildGitHash }})
          </NText>
        </div>
      </div>
    </NLayoutFooter>
  </footer>
</template>
