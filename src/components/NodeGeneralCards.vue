<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { NCard, NText } from 'naive-ui'
import { computed } from 'vue'
import { useAppStore } from '@/stores/app'
import { useNodesStore } from '@/stores/nodes'
import { formatBytesPerSecondSplit, formatBytesSplit } from '@/utils/helper'

const appStore = useAppStore()
const nodesStore = useNodesStore()

// 使用 VueUse 的 useNow 自动管理定时器，每秒更新
const now = useNow({ interval: 1000 })
const currentTime = computed(() => now.value.toLocaleString())

/** 计算所有在线节点的实时速率总和 */
const totalSpeed = computed(() => {
  const onlineNodes = nodesStore.nodes.filter(node => node.online)
  const up = onlineNodes.reduce((sum, node) => sum + (node.net_out || 0), 0)
  const down = onlineNodes.reduce((sum, node) => sum + (node.net_in || 0), 0)
  return { up, down }
})

/** 计算所有节点的累积流量总和 */
const totalTraffic = computed(() => {
  const up = nodesStore.nodes.reduce((sum, node) => sum + (node.net_total_up || 0), 0)
  const down = nodesStore.nodes.reduce((sum, node) => sum + (node.net_total_down || 0), 0)
  return { up, down }
})

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

// 格式化流量（使用配置，返回分离的数值和单位）
const formattedTrafficUp = computed(() => formatBytesSplit(totalTraffic.value.up, appStore.byteDecimals))
const formattedTrafficDown = computed(() => formatBytesSplit(totalTraffic.value.down, appStore.byteDecimals))

// 格式化速率（使用配置，返回分离的数值和单位）
const formattedSpeedUp = computed(() => formatBytesPerSecondSplit(totalSpeed.value.up, appStore.byteDecimals))
const formattedSpeedDown = computed(() => formatBytesPerSecondSplit(totalSpeed.value.down, appStore.byteDecimals))
</script>

<template>
  <div class="general-info p-2 flex flex-col gap-2 sm:p-4 sm:gap-4 lg:grid lg:grid-cols-5" :class="{ 'light-general-contrast': appStore.lightCardContrast && !appStore.isDark }">
    <!-- 当前时间 -->
    <NCard hoverable class="sm:min-h-32" content-class="h-full">
      <!-- 移动端：单行显示 -->
      <div class="flex gap-2 items-center justify-between sm:hidden" :style="{ fontFamily: appStore.numberFontFamily }">
        <NText :depth="3" class="text-xs flex shrink-0 gap-1 items-center">
          <div class="i-icon-park-outline-time" />
          当前时间
        </NText>
        <NText class="text-base font-bold m-0">
          {{ currentTime }}
        </NText>
      </div>
      <!-- 桌面端：垂直布局 -->
      <div class="flex-col h-full hidden justify-between sm:flex">
        <div :style="{ fontFamily: appStore.numberFontFamily }">
          <NText class="text-2xl font-bold m-0">
            {{ currentTime }}
          </NText>
        </div>
        <NText :depth="3" class="text-xs flex gap-1 items-center">
          <div class="i-icon-park-outline-time" />
          当前时间
        </NText>
      </div>
    </NCard>

    <!-- 在线节点 -->
    <NCard hoverable class="sm:min-h-32" content-class="h-full">
      <!-- 移动端：单行显示 -->
      <div class="flex gap-2 items-center justify-between sm:hidden" :style="{ fontFamily: appStore.numberFontFamily }">
        <NText :depth="3" class="text-xs flex shrink-0 gap-1 items-center">
          <div class="i-icon-park-outline-heartbeat" />
          在线节点
        </NText>
        <div class="flex items-baseline">
          <NText class="text-base font-bold m-0">
            {{ onlineNodeCount }}
          </NText>
          <NText :depth="3" class="text-xs m-0">
            / {{ nodesStore.nodes.length }}
          </NText>
        </div>
      </div>
      <!-- 桌面端：垂直布局 -->
      <div class="flex-col h-full hidden justify-between sm:flex">
        <div :style="{ fontFamily: appStore.numberFontFamily }">
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
      </div>
    </NCard>

    <!-- 点亮区域 -->
    <NCard hoverable class="sm:min-h-32" content-class="h-full">
      <!-- 移动端：单行显示 -->
      <div class="flex gap-2 items-center justify-between sm:hidden" :style="{ fontFamily: appStore.numberFontFamily }">
        <NText :depth="3" class="text-xs flex shrink-0 gap-1 items-center">
          <div class="i-icon-park-outline-world" />
          点亮区域
        </NText>
        <NText class="text-base font-bold m-0">
          {{ onlineRegionCount }}
        </NText>
      </div>
      <!-- 桌面端：垂直布局 -->
      <div class="flex-col h-full hidden justify-between sm:flex">
        <div :style="{ fontFamily: appStore.numberFontFamily }">
          <NText class="text-2xl font-bold m-0">
            {{ onlineRegionCount }}
          </NText>
        </div>
        <NText :depth="3" class="text-xs flex gap-1 items-center">
          <div class="i-icon-park-outline-world" />
          点亮区域
        </NText>
      </div>
    </NCard>

    <!-- 流量总览 -->
    <NCard hoverable class="sm:min-h-32" content-class="h-full">
      <!-- 移动端：单行显示 -->
      <div class="flex gap-2 items-center justify-between sm:hidden" :style="{ fontFamily: appStore.numberFontFamily }">
        <NText :depth="3" class="text-xs flex shrink-0 gap-1 items-center">
          <div class="i-icon-park-outline-transfer-data" />
          流量总览
        </NText>
        <div class="flex gap-3">
          <div class="flex gap-0.5 items-baseline">
            <div class="i-icon-park-outline-upload text-xs self-center" />
            <span class="text-sm font-bold">{{ formattedTrafficUp.value }}</span>
            <span class="text-[10px] text-[--n-text-color-3]">{{ formattedTrafficUp.unit }}</span>
          </div>
          <div class="flex gap-0.5 items-baseline">
            <div class="i-icon-park-outline-download text-xs self-center" />
            <span class="text-sm font-bold">{{ formattedTrafficDown.value }}</span>
            <span class="text-[10px] text-[--n-text-color-3]">{{ formattedTrafficDown.unit }}</span>
          </div>
        </div>
      </div>
      <!-- 桌面端：垂直布局 -->
      <div class="flex-col h-full hidden justify-between sm:flex">
        <div class="flex flex-col gap-1" :style="{ fontFamily: appStore.numberFontFamily }">
          <div class="flex gap-1 items-baseline">
            <div class="i-icon-park-outline-upload text-base shrink-0 self-center" />
            <span class="text-xl font-bold">{{ formattedTrafficUp.value }}</span>
            <span class="text-xs text-[--n-text-color-3]">{{ formattedTrafficUp.unit }}</span>
          </div>
          <div class="flex gap-1 items-baseline">
            <div class="i-icon-park-outline-download text-base shrink-0 self-center" />
            <span class="text-xl font-bold">{{ formattedTrafficDown.value }}</span>
            <span class="text-xs text-[--n-text-color-3]">{{ formattedTrafficDown.unit }}</span>
          </div>
        </div>
        <NText :depth="3" class="text-xs flex gap-1 items-center">
          <div class="i-icon-park-outline-transfer-data" />
          流量总览
        </NText>
      </div>
    </NCard>

    <!-- 网络速率 -->
    <NCard hoverable class="sm:min-h-32" content-class="h-full">
      <!-- 移动端：单行显示 -->
      <div class="flex gap-2 items-center justify-between sm:hidden" :style="{ fontFamily: appStore.numberFontFamily }">
        <NText :depth="3" class="text-xs flex shrink-0 gap-1 items-center">
          <div class="i-icon-park-outline-lightning" />
          网络速率
        </NText>
        <div class="flex gap-3">
          <div class="flex gap-0.5 items-baseline">
            <div class="i-icon-park-outline-up text-xs self-center" />
            <span class="text-sm font-bold">{{ formattedSpeedUp.value }}</span>
            <span class="text-[10px] text-[--n-text-color-3]">{{ formattedSpeedUp.unit }}</span>
          </div>
          <div class="flex gap-0.5 items-baseline">
            <div class="i-icon-park-outline-down text-xs self-center" />
            <span class="text-sm font-bold">{{ formattedSpeedDown.value }}</span>
            <span class="text-[10px] text-[--n-text-color-3]">{{ formattedSpeedDown.unit }}</span>
          </div>
        </div>
      </div>
      <!-- 桌面端：垂直布局 -->
      <div class="flex-col h-full hidden justify-between sm:flex">
        <div class="flex flex-col gap-1" :style="{ fontFamily: appStore.numberFontFamily }">
          <div class="flex gap-1 items-baseline">
            <div class="i-icon-park-outline-up text-base shrink-0 self-center" />
            <span class="text-xl font-bold">{{ formattedSpeedUp.value }}</span>
            <span class="text-xs text-[--n-text-color-3]">{{ formattedSpeedUp.unit }}</span>
          </div>
          <div class="flex gap-1 items-baseline">
            <div class="i-icon-park-outline-down text-base shrink-0 self-center" />
            <span class="text-xl font-bold">{{ formattedSpeedDown.value }}</span>
            <span class="text-xs text-[--n-text-color-3]">{{ formattedSpeedDown.unit }}</span>
          </div>
        </div>
        <NText :depth="3" class="text-xs flex gap-1 items-center">
          <div class="i-icon-park-outline-lightning" />
          网络速率
        </NText>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.light-general-contrast :deep(.n-card) {
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.12);
}
</style>
