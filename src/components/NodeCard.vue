<script setup lang="ts">
import type { NodeData } from '@/stores/nodes'
import { NButton, NCard, NEllipsis, NIcon, NModal, NProgress, NTag, NText, NTooltip, useThemeVars } from 'naive-ui'
import { computed, ref } from 'vue'
import PingChart from '@/components/PingChart.vue'
import TrafficProgress from '@/components/TrafficProgress.vue'
import { useGlassSurface } from '@/composables/useGlassSurface'
import { useAppStore } from '@/stores/app'
import { formatBytesPerSecondWithConfig, formatBytesWithConfig, formatDateTime, formatUptimeWithFormat, getStatus } from '@/utils/helper'
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
const { glassSurfaceStyle, isGlassEnabled } = useGlassSurface()

// 获取 Naive UI 主题变量
const themeVars = useThemeVars()

// 延迟图表弹窗状态
const showPingChart = ref(false)

// 格式化函数
const formatBytes = (bytes: number) => formatBytesWithConfig(bytes, appStore.byteDecimals)
const formatBytesPerSecond = (bytes: number) => formatBytesPerSecondWithConfig(bytes, appStore.byteDecimals)
const formatUptime = (seconds: number) => formatUptimeWithFormat(seconds, appStore.uptimeFormat)
const offlineTime = computed(() => formatDateTime(props.node.time))

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

// 计算合并后的标签（自定义标签 + 价格标签）
const mergedTags = computed(() => {
  return [...customTags.value, ...priceTags.value]
})

// 是否在单独一行显示标签
const shouldShowTagsInSeparateRow = computed(() => {
  return appStore.tagsInSeparateRow && mergedTags.value.length > 0
})

const visibleMetrics = computed(() => new Set(appStore.cardMetrics))

function handleCardKeydown(event: KeyboardEvent): void {
  if (event.key !== 'Enter' || event.target !== event.currentTarget)
    return
  event.preventDefault()
  emit('click')
}
</script>

<template>
  <div
    class="node-card-shell"
    role="link"
    tabindex="0"
    :aria-label="`查看 ${props.node.name} 详情，当前${props.node.online ? '在线' : '离线'}`"
    @keydown="handleCardKeydown"
  >
    <NCard
      hoverable
      class="node-card w-full cursor-pointer transition-all duration-200" :class="[
        `node-card--${appStore.cardSize}`,
        props.node.online ? 'node-card--online hover:border-primary' : 'node-card--offline',
        { 'light-card-contrast': appStore.lightCardContrast && !appStore.isDark && !isGlassEnabled },
        { 'glass-surface-enabled glass-card-enabled': isGlassEnabled },
      ]"
      :style="[{ '--offline-color': themeVars.errorColor, '--online-color': themeVars.successColor }, glassSurfaceStyle]"
      @click="emit('click')"
    >
      <template #header>
        <div class="flex gap-2 min-w-0 items-center">
          <NIcon class="shrink-0">
            <img :src="`/images/flags/${getRegionCode(props.node.region)}.svg`" :alt="getRegionDisplayName(props.node.region)">
          </NIcon>
          <!-- 自定义标签显示在节点名前（仅当 tagsInSeparateRow 为 false 时） -->
          <div v-if="customTags.length > 0 && !appStore.tagsInSeparateRow" class="has-tags flex shrink-0 flex-wrap gap-1 items-center">
            <NTag
              v-for="(tag, index) in customTags"
              :key="index"
              size="small"
              :color="{ color: `${tag.color}20`, textColor: tag.color, borderColor: `${tag.color}40` }"
            >
              {{ tag.text }}
            </NTag>
          </div>
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
                :aria-label="`查看 ${props.node.name} 延迟图表`"
                @keydown.enter.stop
                @keydown.space.stop
                @click.stop="showPingChart = true"
              >
                <template #icon>
                  <div class="i-icon-park-outline-area-map text-base" />
                </template>
              </NButton>
            </template>
            查看延迟图表
          </NTooltip>
          <!-- <NTag :type="props.node.online ? 'success' : 'error'">
            {{ props.node.online ? '在线' : '离线' }}
          </NTag> -->
          <!-- <NBadge :type="props.node.online ? 'success' : 'error'" size="small" dot /> -->
          <div
            class="online-badge"
            role="status"
            :aria-label="props.node.online ? '节点在线' : '节点离线'"
            :class="{ 'online-badge--online': props.node.online }"
            :style="{ backgroundColor: props.node.online ? themeVars.successColor : themeVars.errorColor }"
          >
            <div v-if="props.node.online" class="online-badge__wave" :style="{ backgroundColor: themeVars.successColor }" />
          </div>
        </div>
      </template>
      <template #default>
        <div class="node-card__content-wrap">
          <div class="node-card__metrics flex flex-col gap-4">
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
            <div class="metric-grid grid" :class="appStore.cardProgressLayout === '1col' ? 'grid-cols-1' : 'grid-cols-2'">
              <!-- CPU -->
              <div v-if="visibleMetrics.has('cpu')" class="flex flex-col gap-1.5">
                <div class="flex-between">
                  <NText :depth="3" class="text-[13px]">
                    CPU
                  </NText>
                  <NText class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
                    {{ (props.node.cpu ?? 0).toFixed(1) }}%
                  </NText>
                </div>
                <NProgress :show-indicator="false" :percentage="props.node.cpu ?? 0" :status="cpuStatus" :height="4" />
                <NText :depth="3" class="text-[10px]" :style="{ fontFamily: appStore.numberFontFamily }">
                  {{ node.load.toFixed(2) ?? 0 }}, {{ node.load5.toFixed(2) ?? 0 }}, {{ node.load15.toFixed(2) ?? 0 }}
                </NText>
              </div>

              <!-- 内存 -->
              <div v-if="visibleMetrics.has('memory')" class="flex flex-col gap-1.5">
                <div class="flex-between">
                  <NText :depth="3" class="text-[13px]">
                    内存
                  </NText>
                  <NText class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
                    {{ memPercentage.toFixed(1) }}%
                  </NText>
                </div>
                <NProgress :show-indicator="false" :percentage="memPercentage" :status="memStatus" :height="4" />
                <NText :depth="3" class="text-[10px]" :style="{ fontFamily: appStore.numberFontFamily }">
                  {{ formatBytes(props.node.ram ?? 0) }} / {{ formatBytes(props.node.mem_total ?? 0) }}
                </NText>
              </div>

              <!-- 硬盘 -->
              <div v-if="visibleMetrics.has('disk')" class="flex flex-col gap-1.5">
                <div class="flex-between">
                  <NText :depth="3" class="text-[13px]">
                    硬盘
                  </NText>
                  <NText class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
                    {{ diskPercentage.toFixed(1) }}%
                  </NText>
                </div>
                <NProgress :show-indicator="false" :percentage="diskPercentage" :status="diskStatus" :height="4" />
                <NText :depth="3" class="text-[10px]" :style="{ fontFamily: appStore.numberFontFamily }">
                  {{ formatBytes(props.node.disk ?? 0) }} / {{ formatBytes(props.node.disk_total ?? 0) }}
                </NText>
              </div>

              <!-- 流量进度条 -->
              <div v-if="visibleMetrics.has('traffic')" class="flex flex-col gap-1.5">
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
                  :height="4"
                  :upload="props.node.net_total_up ?? 0"
                  :download="props.node.net_total_down ?? 0"
                  :traffic-limit="props.node.traffic_limit"
                  :traffic-limit-type="(props.node.traffic_limit_type || 'sum')"
                />
                <NTooltip v-if="showTrafficProgress">
                  <template #trigger>
                    <NText :depth="3" class="text-[10px] cursor-help" :style="{ fontFamily: appStore.numberFontFamily }">
                      {{ formatBytes(trafficUsed) }} / {{ formatBytes(props.node.traffic_limit) }}
                    </NText>
                  </template>
                  <NText class="text-[10px]" :style="{ fontFamily: appStore.numberFontFamily }">
                    <span :style="{ color: appStore.trafficSplitColor ? themeVars.successColor : themeVars.textColorBase }">↑ {{ formatBytes(props.node.net_total_up ?? 0) }}</span><span class="p-1" /><span :style="{ color: appStore.trafficSplitColor ? themeVars.infoColor : themeVars.textColorBase }">↓ {{ formatBytes(props.node.net_total_down ?? 0) }}</span>
                  </NText>
                </NTooltip>
                <NText v-else :depth="3" class="text-[10px]" :style="{ fontFamily: appStore.numberFontFamily }">
                  <span :style="{ color: appStore.trafficSplitColor ? themeVars.successColor : themeVars.textColor3 }">↑ {{ formatBytes(props.node.net_total_up ?? 0) }}</span><span class="p-1" /><span :style="{ color: appStore.trafficSplitColor ? themeVars.infoColor : themeVars.textColor3 }">↓ {{ formatBytes(props.node.net_total_down ?? 0) }}</span>
                </NText>
              </div>
            </div>

            <!-- 网络速率 -->
            <div class="flex-between">
              <NText :depth="3" class="text-[13px]">
                网络速率
              </NText>
              <div class="text-[13px] flex gap-1" :style="{ fontFamily: appStore.numberFontFamily }">
                <span :style="{ color: themeVars.successColor }">↑ {{ formatBytesPerSecond(props.node.net_out ?? 0) }}</span><span class="" /><span :style="{ color: themeVars.infoColor }">↓ {{ formatBytesPerSecond(props.node.net_in ?? 0) }}</span>
              </div>
            </div>

            <!-- 运行时间 -->
            <div class="uptime-row flex-between">
              <NText :depth="3" class="text-[13px]">
                运行时间
              </NText>
              <div class="flex gap-2 items-center">
                <!-- 当标签不在单独一行显示时，价格标签显示在运行时间行 -->
                <template v-if="!shouldShowTagsInSeparateRow">
                  <NTag
                    v-for="(tag, index) in priceTags"
                    :key="index"
                    size="small"
                    :color="{ color: `${tag.color}20`, textColor: tag.color, borderColor: `${tag.color}40` }"
                  >
                    {{ tag.text }}
                  </NTag>
                </template>
                <!-- 根据 uptimeTagWrap 配置选择显示方式 -->
                <NTag v-if="appStore.uptimeTagWrap" size="small" :color="{ color: `#8b5cf620`, textColor: '#8b5cf6', borderColor: `#8b5cf640` }">
                  {{ formatUptime(props.node.uptime ?? 0) }}
                </NTag>
                <NText v-else class="text-[13px]" :style="{ fontFamily: appStore.numberFontFamily }">
                  {{ formatUptime(props.node.uptime ?? 0) }}
                </NText>
              </div>
            </div>

            <!-- 标签单独一行显示（当 tagsInSeparateRow 为 true 时） -->
            <div v-if="shouldShowTagsInSeparateRow" class="tags-separate-row flex-between">
              <NText :depth="3" class="text-[13px]">
                标签
              </NText>
              <div class="flex flex-wrap gap-1 items-center justify-end">
                <NTag
                  v-for="(tag, index) in mergedTags"
                  :key="index"
                  size="small"
                  :color="{ color: `${tag.color}20`, textColor: tag.color, borderColor: `${tag.color}40` }"
                >
                  {{ tag.text }}
                </NTag>
              </div>
            </div>
          </div>
          <div v-if="!props.node.online" class="offline-mask" :style="{ '--offline-color': themeVars.errorColor }" aria-hidden="true">
            <div class="offline-mask__status">
              <span class="offline-mask__dot" />
              <span>节点已离线</span>
            </div>
            <NText :depth="3" class="offline-mask__time text-xs" :style="{ fontFamily: appStore.numberFontFamily }">
              最后在线 {{ offlineTime }}
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
      :style="{ width: 'min(1100px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 32px)' }"
      content-style="overflow-y: auto;"
      :bordered="false"
      :segmented="{ content: true, footer: 'soft' }"
    >
      <PingChart :uuid="props.node.uuid" display-mode="modal" />
    </NModal>
  </div>
</template>

<style scoped lang="scss">
.node-card {
  position: relative;
  overflow: hidden;
}

.node-card-shell:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 3px;
  border-radius: var(--n-border-radius);
}

.node-card :deep(.n-card-header),
.node-card :deep(.n-card__content) {
  transition: padding 200ms ease;
}

.node-card--compact :deep(.n-card-header),
.node-card--compact :deep(.n-card__content) {
  padding: 12px 14px;
}

.node-card--spacious :deep(.n-card-header),
.node-card--spacious :deep(.n-card__content) {
  padding: 20px 22px;
}

.node-card--compact :deep(.n-card__content) > .flex {
  gap: 12px;
}

.node-card--spacious :deep(.n-card__content) > .flex {
  gap: 20px;
}

.metric-grid {
  column-gap: 24px;
  row-gap: 16px;
}

.node-card--compact .metric-grid {
  column-gap: 16px;
  row-gap: 12px;
}

.node-card--spacious .metric-grid {
  column-gap: 32px;
  row-gap: 20px;
}

.node-card--offline {
  border-color: color-mix(in srgb, var(--offline-color, #e88080) 42%, var(--n-border-color)) !important;
  box-shadow:
    0 0 0 1px color-mix(in srgb, #e88080 18%, transparent),
    0 0 22px color-mix(in srgb, #e88080 18%, transparent);
}

.node-card--online:hover {
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--online-color) 18%, transparent),
    0 8px 28px color-mix(in srgb, var(--online-color) 20%, transparent) !important;
}

.node-card__content-wrap {
  position: relative;
}

.node-card__metrics {
  transition:
    filter 200ms ease,
    opacity 200ms ease;
}

.node-card--offline .node-card__metrics {
  filter: blur(3px);
  opacity: 0.48;
}

.offline-mask {
  position: absolute;
  inset: -4px;
  display: flex;
  z-index: 2;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: center;
  border-radius: var(--n-border-radius);
  background: color-mix(in srgb, var(--n-color) 72%, transparent);
  backdrop-filter: blur(10px) saturate(0.72);
  -webkit-backdrop-filter: blur(10px) saturate(0.72);
}

.offline-mask__status {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--offline-color);
}

.offline-mask__dot {
  width: 6px;
  height: 6px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--offline-color);
  box-shadow: 0 0 8px color-mix(in srgb, var(--offline-color) 60%, transparent);
}

.offline-mask__time {
  text-align: center;
}

.n-card .shrink-0.n-icon ~ .flex.shrink-0.has-tags {
  position: absolute;
  backdrop-filter: blur(8px);
  padding: 12px 22px 19px;
  border-radius: 10px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  z-index: 9;
  transform: translateY(10%);
  opacity: 0;
  transition: 200ms;
}
.n-card:hover .shrink-0.n-icon ~ .flex.shrink-0.has-tags {
  transform: translateY(0);
  opacity: 1;
}
.n-card:has(.has-tags):hover .flex-between:last-child {
  opacity: 0.3;
}

// 亮色模式高对比度样式
.light-card-contrast {
  background-color: rgba(250, 250, 252, 1) !important;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.08);
  border-color: rgba(0, 0, 0, 0.12) !important;

  &:hover {
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12);
    border-color: var(--primary-color) !important;
  }
}

/* 毛玻璃卡片样式 */
.glass-card-enabled {
  border-radius: var(--n-border-radius);

  &:hover {
    filter: brightness(0.95);
  }
}

html.dark .glass-card-enabled {
  &:hover {
    filter: brightness(1.1);
  }
}

.online-badge {
  position: relative;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.online-badge__wave {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  opacity: 0.4;
  animation: online-badge-wave 1.5s infinite ease-out;
}

@keyframes online-badge-wave {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .node-card__metrics {
    transition: none;
  }

  .online-badge__wave {
    transition: none;
    animation: none;
  }
}
</style>
