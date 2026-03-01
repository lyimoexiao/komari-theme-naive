<script setup lang="ts">
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

// 计算背景样式
const backgroundStyle = computed(() => {
  if (!appStore.backgroundEnabled || !appStore.currentBackgroundUrl) {
    return {}
  }

  return {
    backgroundImage: appStore.backgroundType === 'image' ? `url(${appStore.currentBackgroundUrl})` : 'none',
    filter: `blur(${appStore.backgroundBlur}px)`,
  }
})

// 计算遮罩样式
const overlayStyle = computed(() => {
  if (!appStore.backgroundEnabled || appStore.backgroundOverlay <= 0) {
    return {}
  }

  return {
    backgroundColor: `rgba(0, 0, 0, ${appStore.backgroundOverlay / 100})`,
  }
})

// 是否显示背景
const showBackground = computed(() => {
  return appStore.backgroundEnabled && appStore.currentBackgroundUrl
})
</script>

<template>
  <div v-if="showBackground" class="background-container">
    <!-- 背景媒体层 -->
    <div class="background-media" :style="backgroundStyle">
      <!-- 视频背景 -->
      <video
        v-if="appStore.backgroundType === 'video'"
        class="background-video"
        :src="appStore.currentBackgroundUrl"
        autoplay
        loop
        muted
        playsinline
      />
    </div>
    <!-- 遮罩层 -->
    <div class="background-overlay" :style="overlayStyle" />
  </div>
</template>

<style scoped lang="scss">
.background-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
  overflow: hidden;
}

.background-media {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1.1); // 防止模糊边缘露出白边
}

.background-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
