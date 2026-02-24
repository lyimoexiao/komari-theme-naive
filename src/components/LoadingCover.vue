<script setup lang="ts">
import { NSpin } from 'naive-ui'
</script>

<template>
  <div class="loading-cover bg-black bg-opacity-50 flex h-screen w-screen items-center left-0 top-0 justify-center absolute z-20 backdrop-blur-sm">
    <NSpin>
      <template #description>
        Loading...
      </template>
    </NSpin>
  </div>
</template>
