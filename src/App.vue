<script setup lang="ts">
import { tryOnMounted, tryOnUnmounted } from '@vueuse/core'
import { computed } from 'vue'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import LoadingCover from './components/LoadingCover.vue'
import Provider from './components/Provider.vue'
import { useAppStore } from './stores/app'
import { destroyInitManager, initApp } from './utils/init'

const appStore = useAppStore()

// 计算页面容器的样式
const pageContainerStyle = computed(() => {
  if (appStore.fullWidth) {
    return {}
  }
  return {
    maxWidth: appStore.maxPageWidth,
    marginInline: 'auto',
  }
})

// 使用 VueUse 的 tryOnMounted，在组件卸载后自动忽略异步操作结果
tryOnMounted(async () => {
  await initApp()
})

// 使用 VueUse 的 tryOnUnmounted，在组件卸载时销毁 InitManager，防止内存泄漏
tryOnUnmounted(() => {
  destroyInitManager()
})
</script>

<template>
  <Provider>
    <Transition
      enter-active-class="transition-all duration-100 ease-out"
      enter-from-class="opacity-0 backdrop-blur-0"
      enter-to-class="opacity-100 backdrop-blur-sm"
      leave-active-class="transition-all duration-100 ease-in"
      leave-from-class="opacity-100 backdrop-blur-sm"
      leave-to-class="opacity-0 backdrop-blur-0"
    >
      <LoadingCover v-if="appStore.loading" />
    </Transition>

    <Header />
    <main v-if="!appStore.loading" class="min-h-screen overflow-hidden">
      <div :style="pageContainerStyle">
        <RouterView v-slot="{ Component }">
          <Transition
            enter-active-class="transition-all duration-200 ease-out"
            enter-from-class="opacity-0 translate-x-4 blur-sm"
            enter-to-class="opacity-100 translate-x-0 blur-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-x-0 blur-0"
            leave-to-class="opacity-0 -translate-x-4 blur-sm"
            mode="out-in"
          >
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>
    <Footer v-if="!appStore.loading" />
  </Provider>
</template>

<style scoped></style>
