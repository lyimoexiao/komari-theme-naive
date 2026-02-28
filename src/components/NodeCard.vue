<script setup lang="ts">
import type { NodeData } from '@/stores/nodes'
import { NButton, NCard, NEllipsis, NIcon, NModal, NProgress, NTag, NText, NTooltip, useThemeVars } from 'naive-ui'
import { computed, ref } from 'vue'
import PingChart from '@/components/PingChart.vue'
import TrafficProgress from '@/components/TrafficProgress.vue'
import { useAppStore } from '@/stores/app'
import { formatBytesPerSecondWithConfig, formatBytesWithConfig, formatUptimeWithFormat, getStatus } from '@/utils/helper'
import { getOSImage, getOSName } from '@/utils/osImageHelper'
import { getRegionCode, getRegionDisplayName } from '@/utils/regionHelper'

const props = defineProps<{
  node: NodeData
}>()

const emit = defineEmits<{
  click: []
}>()

const appStore = useAppStore()

// 获取 Naive UI 主题变量
const themeVars = useThemeVars()

// 延迟图表弹窗状态
const showPingChart = ref(false)

// 格式化函数
const formatBytes = (bytes: number) => formatBytesWithConfig(bytes, appStore.byteDecimals)
const formatBytesPerSecond = (bytes: number) => formatBytesPerSecondWithConfig(bytes, appStore.byteDecimals)
const formatUptime = (seconds: number) => formatUptimeWithFormat(seconds, appStore.uptimeFormat)

// 计算统计信息
const cpuStatus = computed(() => getStatus(props.node.cpu ?? 0))
const memPercentage = computed(() => (props.node.ram ?? 0) / (props.node.mem_total || 1) * 100)
const memStatus = computed(() => getStatus(memPercentage.value))
const diskPercentage = computed(() => (props.node.disk ?? 0) / (props.node.disk_total || 1) * 100)
const diskStatus = computed(() => getStatus(diskPercentage.value))

// 流量进度条相关计算
const showTrafficProgress = computed(() => props.node.traffic_limit > 0)

// 根据流量类型计算已用流量和百分比
const trafficUsedPercentage = computed(() => {
  if (props.node.traffic_limit <= 0)
    return 0

  const { net_total_up = 0, net_total_down = 0, traffic_limit_type } = props.node
  let used = 0

  switch (traffic_limit_type) {
    case 'up':
      used = net_total_up
      break
    case 'down':
      used = net_total_down
      break
    case 'min':
      used = Math.min(net_total_up, net_total_down)
      break
    case 'max':
      used = Math.max(net_total_up, net_total_down)
      break
    case 'sum':
    default:
      used = net_total_up + net_total_down
      break
  }

  return Math.min((used / props.node.traffic_limit) * 100, 100)
})

// 已用流量（用于显示）
const trafficUsed = computed(() => {
  const { net_total_up = 0, net_total_down = 0, traffic_limit_type } = props.node
  switch (traffic_limit_type) {
    case 'up':
      return net_total_up
    case 'down':
      return net_total_down
    case 'min':
      return Math.min(net_total_up, net_total_down)
    case 'max':
      return Math.max(net_total_up, net_total_down)
    case 'sum':
    default:
      return net_total_up + net_total_down
  }
})
</script>

<template>
  <div>
    <NCard
      hoverable
      class="node-card w-full cursor-pointer transition-all duration-200" :class="[
        props.node.online ? 'hover:border-primary' : 'opacity-50 pointer-events-none',
      ]"
      @click="emit('click')"
    >
      <template #header>
        <div class="flex gap-2 items-center">
          <NIcon>
            <img :src="`/images/flags/${getRegionCode(props.node.region)}.svg`" :alt="getRegionDisplayName(props.node.region)">
          </NIcon>
          <NEllipsis class="text-lg font-bold m-0">
            {{ props.node.name }}
          </NEllipsis>
        </div>
      </template>
      <template #header-extra>
        <div class="flex gap-2 items-center">
          <NTooltip v-if="appStore.showPingChartButton">
            <template #trigger>
              <NButton
                quaternary
                circle
                size="small"
                class="p-1.5!"
                @click.stop="showPingChart = true"
              >
                <template #icon>
                  <div class="i-icon-park-outline-area-map text-base" />
                </template>
              </NButton>
            </template>
            查看延迟图表
          </NTooltip>
          <NTag :type="props.node.online ? 'success' : 'error'">
            {{ props.node.online ? '在线' : '离线' }}
          </NTag>
        </div>
      </template>
      <template #default>
        <div class="flex flex-col gap-3">
          <!-- 操作系统 -->
          <div class="flex-between">
            <NText :depth="3" class="">
              操作系统
            </NText>
            <div class="flex gap-2 items-center">
              <NIcon>
                <img :src="getOSImage(props.node.os)" :alt="getOSName(props.node.os)">
              </NIcon>
              <NText class="">
                {{ getOSName(props.node.os) }} / {{ props.node.arch }}
              </NText>
            </div>
          </div>

          <!-- CPU -->
          <div class="flex-col gap-1">
            <div class="flex-between">
              <NText :depth="3" class="">
                CPU
              </NText>
              <NText class="">
                {{ (props.node.cpu ?? 0).toFixed(1) }}%
              </NText>
            </div>
            <NProgress :show-indicator="false" :percentage="props.node.cpu ?? 0" :status="cpuStatus" />
          </div>

          <!-- 内存 -->
          <div class="flex-col gap-1">
            <div class="flex-between">
              <NText :depth="3" class="">
                内存
              </NText>
              <NText class="">
                {{ memPercentage.toFixed(1) }}%
              </NText>
            </div>
            <NProgress :show-indicator="false" :percentage="memPercentage" :status="memStatus" />
            <NText :depth="3" class="text-xs">
              {{ formatBytes(props.node.ram ?? 0) }} / {{ formatBytes(props.node.mem_total ?? 0) }}
            </NText>
          </div>

          <!-- 硬盘 -->
          <div class="flex-col gap-1">
            <div class="flex-between">
              <NText :depth="3" class="">
                硬盘
              </NText>
              <NText class="">
                {{ diskPercentage.toFixed(1) }}%
              </NText>
            </div>
            <NProgress :show-indicator="false" :percentage="diskPercentage" :status="diskStatus" />
            <NText :depth="3" class="text-xs">
              {{ formatBytes(props.node.disk ?? 0) }} / {{ formatBytes(props.node.disk_total ?? 0) }}
            </NText>
          </div>

          <!-- 流量进度条 -->
          <div class="flex-col gap-1">
            <div class="flex-between">
              <NText :depth="3" class="">
                流量
              </NText>
              <NText class="">
                <template v-if="showTrafficProgress">
                  {{ trafficUsedPercentage.toFixed(1) }}%
                </template>
                <template v-else>
                  ∞
                </template>
              </NText>
            </div>
            <!-- 统一使用 TrafficProgress 组件，自动根据类型选择颜色 -->
            <TrafficProgress
              :upload="props.node.net_total_up ?? 0"
              :download="props.node.net_total_down ?? 0"
              :traffic-limit="props.node.traffic_limit"
              :traffic-limit-type="(props.node.traffic_limit_type || 'sum')"
            />
            <NText :depth="3" class="text-xs">
              <template v-if="showTrafficProgress">
                {{ formatBytes(trafficUsed) }} / {{ formatBytes(props.node.traffic_limit) }}（<span :style="{ color: themeVars.successColor }">↑ {{ formatBytes(props.node.net_total_up ?? 0) }}</span> ｜ <span :style="{ color: themeVars.infoColor }">↓ {{ formatBytes(props.node.net_total_down ?? 0) }}</span>）
              </template>
              <template v-else>
                <span :style="{ color: themeVars.successColor }">↑ {{ formatBytes(props.node.net_total_up ?? 0) }}</span> ｜ <span :style="{ color: themeVars.infoColor }">↓ {{ formatBytes(props.node.net_total_down ?? 0) }}</span>
              </template>
            </NText>
          </div>

          <!-- 网络速率 -->
          <div class="flex-between">
            <NText :depth="3" class="">
              网络速率
            </NText>
            <NText class="">
              <span :style="{ color: themeVars.successColor }">↑ {{ formatBytesPerSecond(props.node.net_out ?? 0) }}</span> ｜ <span :style="{ color: themeVars.infoColor }">↓ {{ formatBytesPerSecond(props.node.net_in ?? 0) }}</span>
            </NText>
          </div>

          <!-- 运行时间 -->
          <div class="flex-between">
            <NText :depth="3" class="">
              运行时间
            </NText>
            <NText class="">
              {{ formatUptime(props.node.uptime ?? 0) }}
            </NText>
          </div>
        </div>
      </template>
    </NCard>

    <!-- 延迟图表弹窗 -->
    <NModal
      v-model:show="showPingChart"
      preset="card"
      :title="`${props.node.name} - 延迟监控`"
      class="w-full sm:w-3/4"
      :bordered="false"
      :segmented="{ content: true, footer: 'soft' }"
    >
      <PingChart :uuid="props.node.uuid" />
    </NModal>
  </div>
</template>
