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
import { formatPriceWithCycle, getDaysUntilExpired, getExpireStatus, getExpireStatusHexColor, parseTags } from '@/utils/tagHelper'

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

// 计算节点的价格相关标签（剩余天数 + 价格）
const priceTags = computed(() => {
  const tags: Array<{ text: string, color: string }> = []
  const lang = appStore.lang
  const node = props.node

  // price > 0 时显示
  if (node.price !== 0) {
    // 剩余天数标签
    const days = getDaysUntilExpired(node.expired_at)
    const status = getExpireStatus(node.expired_at)
    const color = getExpireStatusHexColor(status)

    if (status === 'expired') {
      tags.push({ text: lang === 'zh-CN' ? '已过期' : 'Expired', color })
    }
    else if (status === 'long_term') {
      tags.push({ text: lang === 'zh-CN' ? '长期' : 'Long-term', color })
    }
    else {
      tags.push({ text: lang === 'zh-CN' ? `剩余 ${days} 天` : `${days} days left`, color })
    }

    // 价格标签
    const priceText = formatPriceWithCycle(node.price, node.billing_cycle, node.currency, lang)
    tags.push({ text: priceText, color: themeVars.value.infoColor }) // purple
  }

  return tags
})

// 计算节点的自定义标签
const customTags = computed(() => {
  return parseTags(props.node.tags).map(tag => ({ text: tag.text, color: tag.hex }))
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
        <div class="flex gap-2 min-w-0 items-center">
          <NIcon class="shrink-0">
            <img :src="`/images/flags/${getRegionCode(props.node.region)}.svg`" :alt="getRegionDisplayName(props.node.region)">
          </NIcon>
          <NEllipsis class="text-lg font-bold m-0 flex-1 min-w-0">
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
        <div class="flex flex-col gap-4">
          <!-- 操作系统 -->
          <div class="flex-between">
            <NText :depth="3" class="text-[13px]">
              操作系统
            </NText>
            <div class="flex gap-2 items-center">
              <NIcon>
                <img :src="getOSImage(props.node.os)" :alt="getOSName(props.node.os)">
              </NIcon>
              <NText class="text-[13px]">
                {{ getOSName(props.node.os) }} / {{ props.node.arch }}
              </NText>
            </div>
          </div>

          <!-- 进度条区域：支持一行一列或一行两列布局 -->
          <div class="gap-x-6 gap-y-4 grid" :class="appStore.cardProgressLayout === '1col' ? 'grid-cols-1' : 'grid-cols-2'">
            <!-- CPU -->
            <div class="flex flex-col gap-1.5">
              <div class="flex-between">
                <NText :depth="3" class="text-[13px]">
                  CPU
                </NText>
                <NText class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
                  {{ (props.node.cpu ?? 0).toFixed(1) }}%
                </NText>
              </div>
              <NProgress :show-indicator="false" :percentage="props.node.cpu ?? 0" :status="cpuStatus" />
              <NText :depth="3" class="text-[11px]" :style="{ fontFamily: appStore.numberFontFamily }">
                {{ node.load.toFixed(2) ?? 0 }} | {{ node.load5.toFixed(2) ?? 0 }} | {{ node.load15.toFixed(2) ?? 0 }}
              </NText>
            </div>

            <!-- 内存 -->
            <div class="flex flex-col gap-1.5">
              <div class="flex-between">
                <NText :depth="3" class="text-[13px]">
                  内存
                </NText>
                <NText class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
                  {{ memPercentage.toFixed(1) }}%
                </NText>
              </div>
              <NProgress :show-indicator="false" :percentage="memPercentage" :status="memStatus" />
              <NText :depth="3" class="text-[11px]" :style="{ fontFamily: appStore.numberFontFamily }">
                {{ formatBytes(props.node.ram ?? 0) }} / {{ formatBytes(props.node.mem_total ?? 0) }}
              </NText>
            </div>

            <!-- 硬盘 -->
            <div class="flex flex-col gap-1.5">
              <div class="flex-between">
                <NText :depth="3" class="text-[13px]">
                  硬盘
                </NText>
                <NText class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
                  {{ diskPercentage.toFixed(1) }}%
                </NText>
              </div>
              <NProgress :show-indicator="false" :percentage="diskPercentage" :status="diskStatus" />
              <NText :depth="3" class="text-[11px]" :style="{ fontFamily: appStore.numberFontFamily }">
                {{ formatBytes(props.node.disk ?? 0) }} / {{ formatBytes(props.node.disk_total ?? 0) }}
              </NText>
            </div>

            <!-- 流量进度条 -->
            <div class="flex flex-col gap-1.5">
              <div class="flex-between">
                <NText :depth="3" class="text-[13px]">
                  流量
                </NText>
                <NText class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
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
              <NTooltip v-if="showTrafficProgress">
                <template #trigger>
                  <NText :depth="3" class="text-[11px] cursor-help" :style="{ fontFamily: appStore.numberFontFamily }">
                    {{ formatBytes(trafficUsed) }} / {{ formatBytes(props.node.traffic_limit) }}
                  </NText>
                </template>
                <NText class="text-[11px]" :style="{ fontFamily: appStore.numberFontFamily }">
                  <span :style="{ color: themeVars.successColor }">↑ {{ formatBytes(props.node.net_total_up ?? 0) }}</span> ｜ <span :style="{ color: themeVars.infoColor }">↓ {{ formatBytes(props.node.net_total_down ?? 0) }}</span>
                </NText>
              </NTooltip>
              <NText v-else :depth="3" class="text-[11px]" :style="{ fontFamily: appStore.numberFontFamily }">
                <span :style="{ color: themeVars.successColor }">↑ {{ formatBytes(props.node.net_total_up ?? 0) }}</span> ｜ <span :style="{ color: themeVars.infoColor }">↓ {{ formatBytes(props.node.net_total_down ?? 0) }}</span>
              </NText>
            </div>
          </div>

          <!-- 网络速率 -->
          <div class="flex-between">
            <NText :depth="3" class="text-[13px]">
              网络速率
            </NText>
            <NText class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
              <span :style="{ color: themeVars.successColor }">↑ {{ formatBytesPerSecond(props.node.net_out ?? 0) }}</span> ｜ <span :style="{ color: themeVars.infoColor }">↓ {{ formatBytesPerSecond(props.node.net_in ?? 0) }}</span>
            </NText>
          </div>

          <!-- 运行时间 -->
          <div class="flex-between">
            <NText :depth="3" class="text-[13px]">
              运行时间
            </NText>
            <div class="flex gap-2 items-center">
              <NText class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
                {{ formatUptime(props.node.uptime ?? 0) }}
              </NText>
            </div>
          </div>

          <!-- 标签、剩余时间及价格信息 -->
          <div class="flex-between">
            <div class="flex gap-2 items-center">
              <!-- 剩余时间及价格信息 -->
              <NTag
                v-for="(tag, index) in priceTags"
                :key="index"
                size="small"
                :color="{ color: `${tag.color}20`, textColor: tag.color, borderColor: `${tag.color}40` }"
              >
                {{ tag.text }}
              </NTag>
              <!-- 自定义标签 -->
              <div v-if="customTags.length > 0">
                <NTag
                  v-for="(tag, index) in customTags"
                  :key="index"
                  size="small"
                  :color="{ color: `${tag.color}20`, textColor: tag.color, borderColor: `${tag.color}40` }"
                >
                  {{ tag.text }}
                </NTag>
              </div>
            </div>
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
