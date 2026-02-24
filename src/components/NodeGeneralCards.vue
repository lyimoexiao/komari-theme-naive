<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useNodesStore } from '@/stores/nodes'

const nodesStore = useNodesStore()

const currentTime = ref(new Date().toLocaleString())

const currentTimeInterval = setInterval(() => {
  currentTime.value = new Date().toLocaleString()
}, 1000)

/** 计算所有在线节点的实时速率总和 */
const totalSpeed = computed(() => {
  const onlineNodes = nodesStore.nodes.filter(node => node.online)
  const up = onlineNodes.reduce((sum, node) => sum + (node.net_in || 0), 0)
  const down = onlineNodes.reduce((sum, node) => sum + (node.net_out || 0), 0)
  return { up, down }
})

/** 计算所有节点的累积流量总和 */
const totalTraffic = computed(() => {
  const up = nodesStore.nodes.reduce((sum, node) => sum + (node.net_total_up || 0), 0)
  const down = nodesStore.nodes.reduce((sum, node) => sum + (node.net_total_down || 0), 0)
  return { up, down }
})

/** 格式化速率 */
function formatSpeed(bytesPerSec: number): string {
  if (bytesPerSec >= 1024 * 1024 * 1024) {
    return `${(bytesPerSec / 1024 / 1024 / 1024).toFixed(2)} GB/s`
  }
  if (bytesPerSec >= 1024 * 1024) {
    return `${(bytesPerSec / 1024 / 1024).toFixed(2)} MB/s`
  }
  if (bytesPerSec >= 1024) {
    return `${(bytesPerSec / 1024).toFixed(2)} KB/s`
  }
  return `${bytesPerSec} B/s`
}

/** 格式化流量 */
function formatBytes(bytes: number): string {
  if (bytes >= 1024 * 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB`
  }
  if (bytes >= 1024 * 1024 * 1024) {
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`
  }
  if (bytes >= 1024 * 1024) {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  }
  if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  }
  return `${bytes} B`
}

/** 在线区域数量 */
const onlineRegionCount = computed(() => {
  return new Set(
    nodesStore.nodes
      .filter(node => node.online && node.region !== '')
      .map(node => node.region),
  ).size
})

/** 在线节点数量 */
const onlineNodeCount = computed(() => nodesStore.nodes.filter(node => node.online).length)

onUnmounted(() => {
  clearInterval(currentTimeInterval)
})
</script>

<template>
  <div class="general-info p-4 flex flex-wrap gap-4">
    <NCard class="flex-1 min-h-32 min-w-48" content-class="flex flex-col justify-between h-full">
      <div class="font-tcloud-number">
        <NText class="text-2xl font-bold m-0">
          {{ currentTime }}
        </NText>
      </div>
      <NText :depth="3" class="text-xs flex gap-1 items-center">
        <div class="i-icon-park-outline-time" />
        当前时间
      </NText>
    </NCard>
    <NCard class="flex-1 min-h-32 min-w-48" content-class="flex flex-col justify-between h-full">
      <div class="font-tcloud-number">
        <NText class="text-2xl font-bold m-0">
          {{ onlineNodeCount }}
        </NText>
        <NText :depth="3" class="text-xs m-0">
          / {{ nodesStore.nodes.length }}
        </NText>
      </div>
      <NText :depth="3" class="text-xs flex gap-1 items-center">
        <div class="i-icon-park-outline-heartbeat" />
        在线节点
      </NText>
    </NCard>
    <NCard class="flex-1 min-h-32 min-w-48" content-class="flex flex-col justify-between h-full">
      <div class="font-tcloud-number">
        <NText class="text-2xl font-bold m-0">
          {{ onlineRegionCount }}
        </NText>
      </div>
      <NText :depth="3" class="text-xs flex gap-1 items-center">
        <div class="i-icon-park-outline-world" />
        点亮区域
      </NText>
    </NCard>
    <NCard class="flex-1 min-h-32 min-w-48" content-class="flex flex-col justify-between h-full">
      <div class="font-tcloud-number">
        <div class="traffic-item text-xl flex flex-row gap-2 items-center">
          <div class="i-icon-park-outline-up" />
          <div class="traffic-item-value font-bold">
            {{ formatBytes(totalTraffic.up) }}
          </div>
        </div>
        <div class="traffic-item text-xl flex flex-row gap-2 items-center">
          <div class="i-icon-park-outline-down" />
          <div class="traffic-item-value font-bold">
            {{ formatBytes(totalTraffic.down) }}
          </div>
        </div>
      </div>
      <NText :depth="3" class="text-xs flex gap-1 items-center">
        <div class="i-icon-park-outline-transfer-data" />
        流量总览
      </NText>
    </NCard>
    <NCard class="flex-1 min-h-32 min-w-48" content-class="flex flex-col justify-between h-full">
      <div class="font-tcloud-number">
        <div class="traffic-item text-xl flex flex-row gap-2 items-center">
          <div class="i-icon-park-outline-up" />
          <div class="traffic-item-value font-bold">
            {{ formatSpeed(totalSpeed.up) }}
          </div>
        </div>
        <div class="traffic-item text-xl flex flex-row gap-2 items-center">
          <div class="i-icon-park-outline-down" />
          <div class="traffic-item-value font-bold">
            {{ formatSpeed(totalSpeed.down) }}
          </div>
        </div>
      </div>
      <NText :depth="3" class="text-xs flex gap-1 items-center">
        <div class="i-icon-park-outline-lightning" />
        网络速率
      </NText>
    </NCard>
  </div>
</template>
