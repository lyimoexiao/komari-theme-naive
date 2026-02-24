<script setup lang="ts">
import { onMounted } from 'vue'
import Footer from './components/Footer.vue'
import Header from './components/Header.vue'
import LoadingCover from './components/LoadingCover.vue'
import Provider from './components/Provider.vue'
import { useAppStore } from './stores/app'
import { initApp } from './utils/init'

const appStore = useAppStore()

onMounted(async () => {
  await initApp()
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
    <main v-if="!appStore.loading" class="min-h-screen">
      <RouterView />
    </main>
    <Footer v-if="!appStore.loading" />
  </Provider>
</template>

<style scoped></style>
