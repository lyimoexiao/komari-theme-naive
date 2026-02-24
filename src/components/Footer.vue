<script setup lang="ts">
import { NButton, NLayoutFooter, NText } from 'naive-ui'
</script>

<template>
  <footer>
    <NLayoutFooter class="mx-auto p-4 flex flex-col gap-4">
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
      </div>
    </NLayoutFooter>
  </footer>
</template>
