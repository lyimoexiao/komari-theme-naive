<script setup lang="ts">
import type { NodeData } from '@/stores/nodes'
import { NBadge, NButton, NIcon, NList, NListItem, NModal, NProgress, NText, NTooltip, useThemeVars } from 'naive-ui'
import { computed, ref } from 'vue'
import PingChart from '@/components/PingChart.vue'
import TrafficProgress from '@/components/TrafficProgress.vue'
import { useAppStore } from '@/stores/app'
import { formatBytesPerSecondWithConfig, formatBytesWithConfig, formatUptimeWithFormat, getStatus } from '@/utils/helper'
import { getOSImage, getOSName } from '@/utils/osImageHelper'
import { getRegionCode, getRegionDisplayName } from '@/utils/regionHelper'

const props = defineProps<{
  nodes: NodeData[]
}>()

const emit = defineEmits<{
  click: [node: NodeData]
}>()

const appStore = useAppStore()

// 获取 Naive UI 主题变量
const themeVars = useThemeVars()

// 延迟图表弹窗状态
const showPingChart = ref(false)
const selectedNode = ref<NodeData | null>(null)

// 列可见性计算
const columns = computed(() => appStore.listViewColumns)
const showColumn = (col: string) => columns.value.includes(col as typeof columns.value[number])

// 格式化函数
const formatBytes = (bytes: number) => formatBytesWithConfig(bytes, appStore.byteDecimals)
const formatBytesPerSecond = (bytes: number) => formatBytesPerSecondWithConfig(bytes, appStore.byteDecimals)
const formatUptime = (seconds: number) => formatUptimeWithFormat(seconds, appStore.uptimeFormat)

// 动态生成 grid 样式，使用配置的列宽度
const gridStyle = computed(() => {
  const visibleColumns = columns.value
  const columnWidths = appStore.listColumnWidths
  const templateColumns = visibleColumns.map(col => columnWidths[col] || 'auto')
  return {
    gridTemplateColumns: templateColumns.join(' '),
  }
})

// 计算国旗图标路径
function getFlagSrc(region: string): string {
  const code = getRegionCode(region)
  return `/images/flags/${code}.svg`
}

function handleClick(node: NodeData) {
  emit('click', node)
}

function openPingChart(node: NodeData) {
  selectedNode.value = node
  showPingChart.value = true
}

// 计算节点是否显示流量进度条
function showTrafficProgress(node: NodeData): boolean {
  return node.traffic_limit > 0
}

// 计算流量使用百分比
function getTrafficUsedPercentage(node: NodeData): number {
  if (node.traffic_limit <= 0)
    return 0

  const { net_total_up = 0, net_total_down = 0, traffic_limit_type } = node
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

  return Math.min((used / node.traffic_limit) * 100, 100)
}

// 计算已用流量
function getTrafficUsed(node: NodeData): number {
  const { net_total_up = 0, net_total_down = 0, traffic_limit_type } = node
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
}
</script>

<template>
  <div class="node-list-wrapper">
    <NList hoverable clickable bordered class="min-w-fit w-full" :class="{ 'node-list--relaxed': appStore.listRelaxedStyle }">
      <template #header>
        <div class="node-list-header" :style="gridStyle">
          <div v-if="showColumn('status')" class="node-list-header__status">
            <NText :depth="3" class="text-xs">
              状态
            </NText>
          </div>
          <div v-if="showColumn('region')" class="node-list-header__region">
            <NText :depth="3" class="text-xs">
              地区
            </NText>
          </div>
          <div v-if="showColumn('name')" class="node-list-header__name">
            <NText :depth="3" class="text-xs">
              节点
            </NText>
          </div>
          <div v-if="showColumn('uptime')" class="node-list-header__uptime">
            <NText :depth="3" class="text-xs">
              运行时间
            </NText>
          </div>
          <div v-if="showColumn('os')" class="node-list-header__os">
            <NText :depth="3" class="text-xs">
              系统
            </NText>
          </div>
          <div v-if="showColumn('cpu')" class="node-list-header__cpu">
            <NText :depth="3" class="text-xs">
              CPU
            </NText>
          </div>
          <div v-if="showColumn('mem')" class="node-list-header__mem">
            <NText :depth="3" class="text-xs">
              内存
            </NText>
          </div>
          <div v-if="showColumn('disk')" class="node-list-header__disk">
            <NText :depth="3" class="text-xs">
              硬盘
            </NText>
          </div>
          <div v-if="showColumn('traffic')" class="node-list-header__traffic">
            <NText :depth="3" class="text-xs">
              流量
            </NText>
          </div>
        </div>
      </template>
      <NListItem v-for="node in props.nodes" :key="node.uuid" :class="{ 'opacity-50 pointer-events-none': !node.online }" @click="handleClick(node)">
        <div class="node-list-item" :style="gridStyle">
          <!-- 在线状态指示器 -->
          <div v-if="showColumn('status')" class="node-list-item__status">
            <div class="flex gap-1 items-center">
              <NTooltip>
                <template #trigger>
                  <NButton
                    quaternary
                    circle
                    size="tiny"
                    class="p-1!"
                    @click.stop="openPingChart(node)"
                  >
                    <template #icon>
                      <div class="i-icon-park-outline-area-map text-sm" />
                    </template>
                  </NButton>
                </template>
                查看延迟图表
              </NTooltip>
              <NBadge :type="node.online ? 'success' : 'error'" :value="node.online ? '在线' : '离线'" />
            </div>
          </div>

          <!-- 国旗 -->
          <div v-if="showColumn('region')" class="node-list-item__region">
            <NIcon size="20">
              <img :src="getFlagSrc(node.region)" :alt="getRegionDisplayName(node.region)" class="rounded-sm">
            </NIcon>
          </div>

          <!-- 节点名称 -->
          <div v-if="showColumn('name')" class="node-list-item__name">
            <NText class="text-sm font-semibold">
              {{ node.name }}
            </NText>
          </div>

          <!-- 运行时间 -->
          <div v-if="showColumn('uptime')" class="node-list-item__uptime">
            <NText :depth="3" class="text-xs">
              {{ formatUptime(node.uptime ?? 0) }}
            </NText>
          </div>

          <!-- 操作系统 -->
          <div v-if="showColumn('os')" class="node-list-item__os">
            <div class="flex gap-1 items-center">
              <NIcon size="16">
                <img :src="getOSImage(node.os)" :alt="getOSName(node.os)">
              </NIcon>
              <NText :depth="3" class="text-xs">
                {{ getOSName(node.os) }}
              </NText>
            </div>
          </div>

          <!-- CPU -->
          <div v-if="showColumn('cpu')" class="node-list-item__cpu">
            <div class="flex flex-col gap-0.5">
              <div class="text-xs flex gap-1 items-center">
                <NText>{{ (node.cpu ?? 0).toFixed(1) }}%</NText>
              </div>
              <NProgress :show-indicator="false" :percentage="node.cpu ?? 0" :status="getStatus(node.cpu ?? 0)" :height="4" />
            </div>
          </div>

          <!-- 内存 -->
          <div v-if="showColumn('mem')" class="node-list-item__mem">
            <div class="flex flex-col gap-0.5">
              <div class="text-xs flex gap-1 items-center">
                <NText>{{ ((node.ram ?? 0) / (node.mem_total || 1) * 100).toFixed(1) }}%</NText>
                <NText :depth="3">
                  ({{ formatBytes(node.ram ?? 0) }}/{{ formatBytes(node.mem_total ?? 0) }})
                </NText>
              </div>
              <NProgress :show-indicator="false" :percentage="(node.ram ?? 0) / (node.mem_total || 1) * 100" :status="getStatus((node.ram ?? 0) / (node.mem_total || 1) * 100)" :height="4" />
            </div>
          </div>

          <!-- 硬盘 -->
          <div v-if="showColumn('disk')" class="node-list-item__disk">
            <div class="flex flex-col gap-0.5">
              <div class="text-xs flex gap-1 items-center">
                <NText>{{ ((node.disk ?? 0) / (node.disk_total || 1) * 100).toFixed(1) }}%</NText>
                <NText :depth="3">
                  ({{ formatBytes(node.disk ?? 0) }}/{{ formatBytes(node.disk_total ?? 0) }})
                </NText>
              </div>
              <NProgress :show-indicator="false" :percentage="(node.disk ?? 0) / (node.disk_total || 1) * 100" :status="getStatus((node.disk ?? 0) / (node.disk_total || 1) * 100)" :height="4" />
            </div>
          </div>

          <!-- 流量 -->
          <div v-if="showColumn('traffic')" class="node-list-item__traffic">
            <div class="traffic-cell">
              <!-- 有流量限制时显示进度条版式 -->
              <template v-if="showTrafficProgress(node)">
                <NTooltip>
                  <template #trigger>
                    <div class="flex flex-col gap-0.5 w-full cursor-help">
                      <div class="text-xs flex gap-1 items-center">
                        <NText>{{ getTrafficUsedPercentage(node).toFixed(1) }}%</NText>
                        <NText :depth="3">
                          ({{ formatBytes(getTrafficUsed(node)) }}/{{ formatBytes(node.traffic_limit) }})
                        </NText>
                      </div>
                      <!-- sum 类型使用双颜色进度条 -->
                      <TrafficProgress
                        v-if="node.traffic_limit_type === 'sum'"
                        :upload="node.net_total_up ?? 0"
                        :download="node.net_total_down ?? 0"
                        :traffic-limit="node.traffic_limit"
                        traffic-limit-type="sum"
                        height="4px"
                      />
                      <!-- 其他类型使用单色进度条 -->
                      <NProgress
                        v-else
                        :show-indicator="false"
                        :percentage="getTrafficUsedPercentage(node)"
                        :status="getStatus(getTrafficUsedPercentage(node))"
                        :height="4"
                      />
                    </div>
                  </template>
                  <div class="text-xs flex flex-col gap-1">
                    <span><span :style="{ color: themeVars.successColor }">↑{{ formatBytesPerSecond(node.net_out ?? 0) }}</span> <span style="opacity: 0.6;">({{ formatBytes(node.net_total_up ?? 0) }})</span></span>
                    <span><span :style="{ color: themeVars.infoColor }">↓{{ formatBytesPerSecond(node.net_in ?? 0) }}</span> <span style="opacity: 0.6;">({{ formatBytes(node.net_total_down ?? 0) }})</span></span>
                  </div>
                </NTooltip>
              </template>
              <!-- 无流量限制时保持现有版式 -->
              <template v-else>
                <div class="text-xs flex flex-col gap-1">
                  <NText>
                    <span :style="{ color: themeVars.successColor }">↑{{ formatBytesPerSecond(node.net_out ?? 0) }}</span> <NText :depth="3">
                      ({{ formatBytes(node.net_total_up ?? 0) }})
                    </NText>
                  </NText>
                  <NText>
                    <span :style="{ color: themeVars.infoColor }">↓{{ formatBytesPerSecond(node.net_in ?? 0) }}</span><NText :depth="3">
                      ({{ formatBytes(node.net_total_down ?? 0) }})
                    </NText>
                  </NText>
                </div>
              </template>
            </div>
          </div>
        </div>
      </NListItem>
    </NList>

    <!-- 延迟图表弹窗 -->
    <NModal
      v-model:show="showPingChart"
      preset="card"
      :title="selectedNode ? `${selectedNode.name} - 延迟监控` : '延迟监控'"
      class="w-full sm:w-3/4"
      :bordered="false"
      :segmented="{ content: true, footer: 'soft' }"
    >
      <PingChart v-if="selectedNode" :uuid="selectedNode.uuid" />
    </NModal>
  </div>
</template>

<style scoped>
.node-list-wrapper {
  overflow-x: auto;
  min-width: 0;
}

:deep(.n-list__header) {
  padding: 0px !important;
}

:deep(.n-list-item) {
  padding: 8px 16px !important;
}

.node-list-header,
.node-list-item {
  display: grid;
  align-items: center;
  gap: 12px;
}

.node-list-header {
  padding: 8px 16px;
  background-color: var(--n-color-hover);
  border-radius: var(--n-border-radius);
}

.node-list-header__status,
.node-list-item__status {
  display: flex;
  justify-content: center;
  align-items: center;
}

.node-list-header__region,
.node-list-item__region {
  display: flex;
  justify-content: center;
  align-items: center;
}

.node-list-header__name,
.node-list-item__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-list-header__uptime,
.node-list-item__uptime {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: left;
}

.node-list-header__os,
.node-list-item__os {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.node-list-header__cpu,
.node-list-item__cpu,
.node-list-header__mem,
.node-list-item__mem,
.node-list-header__disk,
.node-list-item__disk {
  min-width: 0;
}

.node-list-header__traffic,
.node-list-item__traffic {
  min-width: 0;
}

.traffic-cell {
  min-height: 38px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* 宽松样式 */
.node-list--relaxed :deep(.n-list-item) {
  padding: 14px 16px !important;
}

.node-list--relaxed .node-list-header {
  padding: 12px 16px;
  gap: 24px;
}

.node-list--relaxed .node-list-item {
  gap: 24px;
}

.node-list--relaxed .traffic-cell {
  min-height: 46px;
}
</style>
