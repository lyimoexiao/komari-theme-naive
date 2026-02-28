<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import LoadingCover from './components/LoadingCover.vue'
import Provider from './components/Provider.vue'
import { useAppStore } from './stores/app'
import { destroyInitManager, initApp } from './utils/init'

const appStore = useAppStore()

// 组件就绪状态：用于确保 DOM 完全渲染后再隐藏 loading
const isReady = ref(false)

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

// 初始化应用
onMounted(async () => {
  try {
    await initApp()
    // 确保 DOM 更新完成后再标记为就绪
    await nextTick()
    isReady.value = true
  }
  catch (error) {
    console.error('[App] Initialization failed:', error)
    // 即使失败也要标记为就绪，显示错误状态
    isReady.value = true
  }
})

// 组件卸载时销毁 InitManager，防止内存泄漏
onUnmounted(() => {
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
            <KeepAlive :include="['HomeView']">
              <component :is="Component" />
            </KeepAlive>
          </Transition>
        </RouterView>
      </div>
    </main>
    <Footer v-if="!appStore.loading" />
  </Provider>
</template>

<style scoped></style>
