<script setup lang="ts">
import type { PingRecord, PingTaskSummary } from '@/types/komari'
import dayjs from 'dayjs'
import { NButton, NEmpty, NSpin, NSwitch, NTooltip, useThemeVars } from 'naive-ui'
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import VChart from 'vue-echarts'
import { useGlassSurface } from '@/composables/useGlassSurface'
import { useAppStore } from '@/stores/app'
import { cutPeakValues, interpolateNullsLinear } from '@/utils/recordHelper'
import { getSharedRpc } from '@/utils/rpc'
import '@/utils/echarts' // 共享 ECharts 配置

const props = defineProps<{
  uuid: string
  displayMode?: 'page' | 'modal'
}>()

const appStore = useAppStore()
const { glassSurfaceStyle, isGlassEnabled } = useGlassSurface()
const themeVars = useThemeVars()
const isDark = computed(() => appStore.isDark)
// 使用共享的 RPC 实例，避免重复创建连接
const rpc = getSharedRpc()

// 图表主题相关颜色
const chartThemeColors = computed(() => ({
  text: isDark.value ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
  textSecondary: isDark.value ? 'rgba(255, 255, 255, 0.55)' : 'rgba(0, 0, 0, 0.55)',
  textTertiary: isDark.value ? 'rgba(255, 255, 255, 0.35)' : 'rgba(0, 0, 0, 0.35)',
  borderColor: isDark.value ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  splitLineColor: isDark.value ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)',
  tooltipBg: isDark.value ? 'rgba(40, 40, 40, 0.95)' : 'rgba(255, 255, 255, 0.98)',
  tooltipShadow: isDark.value ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.12)',
  crosshairColor: isDark.value ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)',
}))

// 优化后的图表配色方案（多任务时使用）
const chartColors = [
  '#FF6B6B', // 珊瑚红
  '#4ECDC4', // 青绿色
  '#A78BFA', // 紫罗兰
  '#60A5FA', // 天蓝色
  '#FFB347', // 琥珀黄
  '#F472B6', // 粉红色
  '#34D399', // 翠绿色
  '#FB923C', // 橙色
]

// 从 publicSettings 获取记录保留时间
const maxPingRecordPreserveTime = computed(() => appStore.publicSettings?.ping_record_preserve_time || 168)

// 视图选项
const presetViews = [
  { label: '1 小时', hours: 1 },
  { label: '6 小时', hours: 6 },
  { label: '12 小时', hours: 12 },
  { label: '1 天', hours: 24 },
]

// 可用视图列表
const availableViews = computed(() => {
  const views: { label: string, hours: number }[] = []
  const maxHours = maxPingRecordPreserveTime.value

  for (const v of presetViews) {
    if (maxHours >= v.hours) {
      views.push(v)
    }
  }

  const maxPreset = presetViews[presetViews.length - 1]
  if (maxPreset && maxHours > maxPreset.hours) {
    const label = maxHours % 24 === 0
      ? `${Math.floor(maxHours / 24)} 天`
      : `${maxHours} 小时`
    views.push({ label, hours: maxHours })
  }
  else if (maxHours > 1 && !presetViews.some(v => v.hours === maxHours)) {
    const label = maxHours % 24 === 0
      ? `${Math.floor(maxHours / 24)} 天`
      : `${maxHours} 小时`
    views.push({ label, hours: maxHours })
  }

  return views
})

// 当前选中的视图
const selectedView = ref<string>('')
const selectedHours = computed(() => {
  const view = availableViews.value.find(v => v.label === selectedView.value)
  return view?.hours || 1
})

// 初始化默认视图
watch(availableViews, (views) => {
  const firstView = views[0]
  if (firstView && !selectedView.value) {
    selectedView.value = firstView.label
  }
}, { immediate: true })

// 数据状态
const remoteData = shallowRef<PingRecord[]>([])
const tasks = shallowRef<PingTaskSummary[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// 任务选择
const selectedTaskIds = ref<number[]>([])
const cutPeak = ref(false)

const isModal = computed(() => props.displayMode === 'modal')

// ==================== 数据获取 ====================

async function fetchRecords() {
  if (!props.uuid)
    return

  loading.value = true
  error.value = null

  try {
    const result = await rpc.getPingRecords(props.uuid, selectedHours.value)

    const records = result?.records || []
    records.sort((a, b) => dayjs(a.time).valueOf() - dayjs(b.time).valueOf())

    remoteData.value = records
    tasks.value = result?.tasks || []

    if (tasks.value.length > 0 && selectedTaskIds.value.length === 0) {
      selectedTaskIds.value = tasks.value.map(t => t.id)
    }
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '获取数据失败'
    remoteData.value = []
    tasks.value = []
  }
  finally {
    loading.value = false
  }
}

// ==================== 数据处理 ====================

const mergedData = computed(() => {
  const data = remoteData.value
  if (!data.length)
    return []

  const taskList = tasks.value

  const taskIntervals = taskList
    .map(t => t.interval)
    .filter((v): v is number => typeof v === 'number' && v > 0)

  const fallbackIntervalSec = taskIntervals.length ? Math.min(...taskIntervals) : 60
  const toleranceMs = Math.min(
    6000,
    Math.max(800, Math.floor(fallbackIntervalSec * 1000 * 0.25)),
  )

  const grouped: Map<number, Record<string, unknown>> = new Map()
  const anchors: number[] = []

  for (const rec of data) {
    const ts = dayjs(rec.time).valueOf()
    let anchor: number | null = null

    for (const a of anchors) {
      if (Math.abs(a - ts) <= toleranceMs) {
        anchor = a
        break
      }
    }

    const useTs = anchor ?? ts
    if (!grouped.has(useTs)) {
      grouped.set(useTs, { time: dayjs(useTs).toISOString() })
      if (anchor === null) {
        anchors.push(useTs)
      }
    }

    const group = grouped.get(useTs)!
    group[rec.task_id] = rec.value < 0 ? null : rec.value
  }

  const merged = Array.from(grouped.values()).sort(
    (a, b) => dayjs(a.time as string).valueOf() - dayjs(b.time as string).valueOf(),
  )

  const hours = selectedHours.value
  const lastItem = merged[merged.length - 1]
  const lastTs = lastItem ? dayjs(lastItem.time as string).valueOf() : dayjs().valueOf()
  const fromTs = lastTs - hours * 3600_000

  let startIdx = 0
  for (let i = 0; i < merged.length; i++) {
    const item = merged[i]
    if (!item)
      continue
    const ts = dayjs(item.time as string).valueOf()
    if (ts >= fromTs) {
      startIdx = Math.max(0, i - 1)
      break
    }
  }

  return merged.slice(startIdx)
})

const chartData = computed(() => {
  let data = mergedData.value
  const selectedKeys = selectedTaskIds.value.map(String)

  if (selectedKeys.length === 0)
    return []

  if (cutPeak.value) {
    data = cutPeakValues(data, selectedKeys)
  }

  if (selectedKeys.length > 0 && data.length > 0) {
    data = interpolateNullsLinear(data, selectedKeys, {
      maxGapMultiplier: 6,
      minCapMs: 2 * 60_000,
      maxCapMs: 30 * 60_000,
    })
  }

  return data
})

// ==================== 工具函数 ====================

function formatTime(time: string, showDate: boolean): string {
  const date = dayjs(time)
  if (showDate) {
    return date.format('M/D HH:mm')
  }
  return date.format('HH:mm')
}

function formatTimeForTooltip(time: string, hours: number): string {
  const date = dayjs(time)
  if (hours < 24) {
    return date.format('HH:mm:ss')
  }
  return date.format('MM/DD HH:mm')
}

const showDateInAxis = computed(() => selectedHours.value >= 24)

// ==================== 任务选择 ====================

// 获取任务颜色（根据任务在完整列表中的索引）
function getTaskColor(taskId: number): string {
  const taskIndex = tasks.value.findIndex(t => t.id === taskId)
  const safeIndex = Math.max(0, taskIndex % chartColors.length)
  return chartColors[safeIndex]!
}

function percentile(values: number[], value: number): number | undefined {
  if (!values.length)
    return undefined
  const index = Math.max(0, Math.ceil(value * values.length) - 1)
  return values[index]
}

// 最新值统计（从服务端 tasks 获取，保持颜色顺序）
const latestValues = computed(() => {
  if (!tasks.value.length)
    return []

  return tasks.value.map((task, idx) => {
    const records = remoteData.value.filter(record => record.task_id === task.id)
    const values = records
      .filter(record => record.value >= 0)
      .map(record => record.value)
      .sort((a, b) => a - b)
    let latestValue: number | null = null
    for (let i = records.length - 1; i >= 0; i--) {
      const record = records[i]
      if (record && record.value >= 0) {
        latestValue = record.value
        break
      }
    }
    const p50 = percentile(values, 0.5)
    const p99 = percentile(values, 0.99)
    const safeIdx = Math.max(0, idx % chartColors.length)
    return {
      ...task,
      min: task.min ?? values[0],
      max: task.max ?? values.at(-1),
      avg: task.avg ?? (values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : undefined),
      latest: latestValue ?? undefined,
      p50,
      p99,
      p99_p50_ratio: p50 && p99 ? p99 / p50 : undefined,
      loss: task.loss ?? (records.length ? records.filter(record => record.value < 0).length / records.length * 100 : 0),
      latestValue,
      color: chartColors[safeIdx]!,
    }
  })
})

const selectedTasks = computed(() => {
  return tasks.value.filter(t => selectedTaskIds.value.includes(t.id))
})

// 切换任务选中状态
function toggleTask(taskId: number) {
  if (selectedTaskIds.value.includes(taskId)) {
    selectedTaskIds.value = selectedTaskIds.value.filter(id => id !== taskId)
  }
  else {
    selectedTaskIds.value = [...selectedTaskIds.value, taskId]
  }
}

function showAllTasks() {
  selectedTaskIds.value = tasks.value.map(t => t.id)
}

function hideAllTasks() {
  selectedTaskIds.value = []
}

// ==================== 图表配置 ====================

// 通用 Tooltip 配置
const baseTooltipConfig = computed(() => ({
  trigger: 'axis' as const,
  confine: false,
  backgroundColor: chartThemeColors.value.tooltipBg,
  borderColor: 'transparent',
  borderWidth: 0,
  borderRadius: 8,
  padding: [10, 14],
  boxShadow: `0 4px 16px ${chartThemeColors.value.tooltipShadow}`,
  textStyle: {
    color: chartThemeColors.value.text,
    fontSize: 13,
    lineHeight: 20,
  },
  extraCssText: 'box-shadow: none; backdrop-filter: blur(8px);',
  position: (point: number[], _params: unknown, _element: HTMLElement, _rect: unknown, size: { contentSize: number[], viewSize: number[] }) => {
    const gap = 12
    const [pointX = 0, pointY = 0] = point
    const [contentWidth = 0, contentHeight = 0] = size.contentSize
    const [viewWidth = 0] = size.viewSize
    const x = Math.min(pointX + gap, viewWidth - contentWidth - gap)
    const y = Math.max(gap, pointY - contentHeight - gap)
    return [Math.max(gap, x), y]
  },
  axisPointer: {
    type: 'cross' as const,
    crossStyle: {
      color: chartThemeColors.value.textTertiary,
    },
    lineStyle: {
      color: chartThemeColors.value.crosshairColor,
      width: 1,
      type: 'dashed' as const,
    },
    shadowStyle: {
      color: chartThemeColors.value.crosshairColor,
    },
  },
}))

const pingChartOption = computed(() => {
  const taskList = selectedTasks.value
  const data = chartData.value
  const hours = selectedHours.value

  // 构建 series，确保颜色与卡片一致
  const series = taskList.map((task) => {
    const color = getTaskColor(task.id)
    return {
      name: task.name,
      type: 'line' as const,
      data: data.map(d => d[task.id] as number | null ?? null),
      smooth: cutPeak.value ? 0.6 : 0.4,
      showSymbol: false,
      connectNulls: false,
      lineStyle: { width: 2, color, cap: 'round' as const },
      itemStyle: { color }, // 确保 symbol 颜色一致
    }
  })

  // 颜色映射表（用于 Tooltip）
  const colorMap = new Map<number, string>()
  tasks.value.forEach((task, idx) => {
    const safeIdx = Math.max(0, idx % chartColors.length)
    colorMap.set(task.id, chartColors[safeIdx]!)
  })

  return {
    animation: false,
    // 全局颜色设置（用于图例等）
    color: tasks.value.map((_, idx) => {
      const safeIdx = Math.max(0, idx % chartColors.length)
      return chartColors[safeIdx]!
    }),
    tooltip: {
      ...baseTooltipConfig.value,
      formatter: (params: unknown) => {
        const p = params as Array<{ seriesName: string, value: number | null, dataIndex: number }>
        if (!p.length)
          return ''
        const firstParam = p[0]
        if (!firstParam)
          return ''
        const rowData = data[firstParam.dataIndex]
        if (!rowData)
          return ''

        const time = rowData.time as string
        const timeStr = formatTimeForTooltip(time, hours)
        let html = `<div style="font-weight:600;margin-bottom:6px;color:${chartThemeColors.value.textSecondary}">${timeStr}</div>`
        html += '<div style="display:flex;flex-direction:column;gap:4px">'

        // 按延迟值排序显示
        const sortedParams = [...p].sort((a, b) => (a.value ?? 0) - (b.value ?? 0))

        for (const item of sortedParams) {
          if (item.value !== null && item.value !== undefined) {
            // 通过任务名找到对应的任务ID，再获取颜色
            const task = tasks.value.find(t => t.name === item.seriesName)
            const color = task ? colorMap.get(task.id) || chartColors[0] : chartColors[0]
            const colorDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${color};margin-right:8px;flex-shrink:0"></span>`
            html += `<div style="display:flex;align-items:center">${colorDot}<span style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${item.seriesName}</span><span style="margin-left:auto;font-weight:600;margin-left:16px;font-variant-numeric:tabular-nums">${Math.round(item.value)} ms</span></div>`
          }
        }
        html += '</div>'
        return html
      },
    },
    legend: {
      show: taskList.length > 1,
      type: 'scroll',
      bottom: 4,
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
      icon: 'roundRect',
      textStyle: { fontSize: 11, color: chartThemeColors.value.textSecondary },
      data: taskList.map(t => t.name),
    },
    grid: {
      top: 16,
      right: 24,
      bottom: taskList.length > 1 ? 52 : 28,
      left: 56,
    },
    xAxis: {
      type: 'category',
      data: data.map(d => formatTime(d.time as string, showDateInAxis.value)),
      axisLabel: {
        fontSize: 11,
        color: chartThemeColors.value.textSecondary,
        margin: 12,
      },
      axisLine: {
        show: true,
        lineStyle: { color: chartThemeColors.value.borderColor, width: 1 },
      },
      axisTick: { show: false },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      axisLabel: { fontSize: 11, color: chartThemeColors.value.textSecondary, formatter: '{value} ms' },
      axisLine: { show: false },
      axisTick: { show: false },
      axisPointer: {
        lineStyle: { opacity: 0 },
        crossStyle: { opacity: 0 },
        label: { show: false },
      },
      splitLine: {
        lineStyle: {
          color: chartThemeColors.value.splitLineColor,
          type: 'dashed' as const,
        },
      },
    },
    series,
  }
})

// ==================== 生命周期 ====================

watch(selectedView, () => {
  selectedTaskIds.value = []
  fetchRecords()
})

watch(() => props.uuid, () => {
  remoteData.value = []
  tasks.value = []
  selectedTaskIds.value = []
  fetchRecords()
})

onMounted(() => {
  const firstView = availableViews.value[0]
  if (firstView && !selectedView.value) {
    selectedView.value = firstView.label
  }
  fetchRecords()
})
</script>

<template>
  <div
    class="ping-chart flex flex-col gap-4"
    :class="isModal ? 'ping-chart--modal' : 'ping-chart--page'"
    :style="{
      '--ping-border': themeVars.borderColor,
      '--ping-radius': themeVars.borderRadius,
      '--ping-surface': themeVars.cardColor,
      '--ping-surface-hover': themeVars.hoverColor,
    }"
  >
    <div class="ping-toolbar">
      <div class="text-sm font-semibold">
        延迟监控
      </div>
      <div class="ping-toolbar__views flex flex-wrap gap-1.5">
        <NButton
          v-for="view in availableViews"
          :key="view.label"
          :type="selectedView === view.label ? 'primary' : 'default'"
          size="small"
          @click="selectedView = view.label"
        >
          {{ view.label }}
        </NButton>
      </div>
    </div>

    <!-- 内容区域 -->
    <NSpin :show="loading" content-class="flex flex-col gap-4">
      <div v-if="error" class="text-red-500 py-8 text-center">
        {{ error }}
      </div>
      <div v-else-if="tasks.length === 0 && !loading" class="py-8">
        <NEmpty description="暂无延迟数据" />
      </div>

      <template v-else>
        <!-- 最新值统计卡片（可点击切换选中状态） -->
        <div v-if="latestValues.length > 0" class="ping-task-grid">
          <button
            v-for="task in latestValues"
            :key="task.id"
            type="button"
            class="ping-task-card p-3 border flex gap-3 cursor-pointer select-none transition-colors items-center"
            :aria-pressed="selectedTaskIds.includes(task.id)"
            :class="[
              selectedTaskIds.includes(task.id)
                ? 'ping-task-card--selected'
                : 'ping-task-card--muted',
              isGlassEnabled ? 'glass-surface-enabled glass-task-enabled' : 'task-card-default',
            ]"
            :style="[{ '--task-color': task.color }, glassSurfaceStyle]"
            @click="toggleTask(task.id)"
          >
            <div
              class="rounded-md flex-shrink-0 h-10 w-1.5"
              :style="{ backgroundColor: task.color }"
            />
            <div class="flex-1 min-w-0">
              <div class="flex gap-2 items-center">
                <span class="text-base font-semibold truncate">{{ task.name }}</span>
                <NTooltip placement="top">
                  <template #trigger>
                    <span class="i-carbon-information text-sm opacity-50 cursor-help transition-opacity hover:opacity-100" style="color: var(--n-text-color-2)" tabindex="0" aria-label="查看任务统计详情" @click.stop />
                  </template>
                  <div class="text-sm gap-x-4 gap-y-1.5 grid grid-cols-2">
                    <template v-if="task.min !== undefined">
                      <span style="color: var(--n-text-color-3)">最小</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ Math.round(task.min) }} ms</span>
                    </template>
                    <template v-if="task.max !== undefined">
                      <span style="color: var(--n-text-color-3)">最大</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ Math.round(task.max) }} ms</span>
                    </template>
                    <template v-if="task.avg !== undefined">
                      <span style="color: var(--n-text-color-3)">平均</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ Math.round(task.avg) }} ms</span>
                    </template>
                    <template v-if="task.latest !== undefined">
                      <span style="color: var(--n-text-color-3)">最新</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ Math.round(task.latest) }} ms</span>
                    </template>
                    <template v-if="task.p50 !== undefined">
                      <span style="color: var(--n-text-color-3)">P50</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ Math.round(task.p50) }} ms</span>
                    </template>
                    <template v-if="task.p99 !== undefined">
                      <span style="color: var(--n-text-color-3)">P99</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ Math.round(task.p99) }} ms</span>
                    </template>
                    <template v-if="task.p99_p50_ratio !== undefined">
                      <span style="color: var(--n-text-color-3)">波动率</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ task.p99_p50_ratio.toFixed(2) }}</span>
                    </template>
                    <template v-if="task.interval !== undefined">
                      <span style="color: var(--n-text-color-3)">间隔</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ task.interval }}s</span>
                    </template>
                    <template v-if="task.type">
                      <span style="color: var(--n-text-color-3)">类型</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ task.type.toUpperCase() }}</span>
                    </template>
                    <template v-if="task.total !== undefined">
                      <span style="color: var(--n-text-color-3)">总数</span>
                      <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily }">{{ task.total }}</span>
                    </template>
                  </div>
                </NTooltip>
              </div>
              <div class="ping-task-card__metrics text-sm mt-1 flex gap-3 items-center" style="color: var(--n-text-color-3)">
                <span class="font-medium" :style="{ fontFamily: appStore.numberFontFamily, color: 'var(--n-text-color-1)' }">{{ task.latestValue !== null ? `${Math.round(task.latestValue)} ms` : '-' }}</span>
                <span class="opacity-60">•</span>
                <span :style="{ fontFamily: appStore.numberFontFamily }">{{ task.loss.toFixed(1) }}% 丢包</span>
                <template v-if="task.p99_p50_ratio !== undefined">
                  <span class="opacity-60">•</span>
                  <span :style="{ fontFamily: appStore.numberFontFamily }" title="波动率 p99/p50">{{ task.p99_p50_ratio.toFixed(1) }} 波动</span>
                </template>
              </div>
            </div>
          </button>
        </div>

        <div class="ping-actions flex flex-wrap gap-4 items-center justify-between">
          <div class="flex gap-2 items-center">
            <NSwitch v-model:value="cutPeak" size="small" aria-label="裁剪延迟峰值" />
            <span class="text-sm">裁剪峰值</span>
            <NTooltip>
              <template #trigger>
                <span class="i-carbon-information text-sm opacity-50 cursor-help transition-opacity hover:opacity-100" style="color: var(--n-text-color-3)" />
              </template>
              <span>使用 EWMA 算法平滑数据并过滤突变值</span>
            </NTooltip>
          </div>
          <div class="flex gap-2 items-center">
            <NButton size="small" tertiary @click="showAllTasks">
              全选
            </NButton>
            <NButton size="small" tertiary @click="hideAllTasks">
              全不选
            </NButton>
          </div>
        </div>

        <div class="ping-trend-panel">
          <div class="ping-trend-panel__header">
            <div class="text-sm font-semibold">
              延迟趋势
            </div>
            <span class="text-xs" style="color: var(--n-text-color-3)">{{ selectedTasks.length }} / {{ tasks.length }}</span>
          </div>
          <div class="ping-chart__canvas" role="img" :aria-label="`延迟趋势图，已选择 ${selectedTasks.length} 个监测任务`">
            <VChart :option="pingChartOption" autoresize />
          </div>
        </div>
      </template>
    </NSpin>
  </div>
</template>

<style scoped>
.ping-chart {
  --ping-control-height: 32px;
}

.ping-toolbar,
.ping-actions,
.ping-trend-panel {
  border: 1px solid var(--ping-border);
  border-radius: var(--ping-radius);
  background: color-mix(in srgb, var(--ping-surface) 96%, var(--ping-surface-hover));
}

.ping-toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
}

.ping-toolbar__views :deep(.n-button) {
  min-height: var(--ping-control-height);
}

.ping-task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.ping-chart--page .ping-task-grid {
  grid-template-columns: repeat(auto-fill, minmax(240px, 320px));
}

.ping-task-card {
  position: relative;
  min-width: 0;
  overflow: hidden;
  color: var(--n-text-color);
  text-align: left;
  border-color: var(--ping-border);
  border-radius: var(--ping-radius);
  font: inherit;
  transition:
    border-color 180ms ease,
    opacity 180ms ease;
}

.ping-task-card--selected {
  border-color: color-mix(in srgb, var(--task-color) 38%, var(--ping-border));
}

.ping-task-card--muted {
  opacity: 0.48;
}

.ping-task-card:hover,
.ping-task-card:focus-visible {
  border-color: var(--task-color) !important;
  outline: none;
  opacity: 1;
}

.ping-task-card__metrics {
  flex-wrap: wrap;
  row-gap: 4px;
}

.ping-task-card__metrics > span {
  white-space: nowrap;
}

.ping-task-card:focus-visible {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--task-color) 28%, transparent);
}

.ping-actions {
  min-height: 46px;
  padding: 8px 12px;
}

.ping-trend-panel {
  overflow: hidden;
}

.ping-trend-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid color-mix(in srgb, var(--ping-border) 70%, transparent);
}

.ping-chart__canvas {
  height: 320px;
  padding: 2px 4px 0;
}

.ping-chart--modal .ping-task-grid {
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
}

.ping-chart--modal .ping-chart__canvas {
  height: min(42vh, 360px);
  min-height: 260px;
}

@media (max-width: 640px) {
  .ping-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .ping-toolbar__views {
    width: 100%;
  }

  .ping-task-grid,
  .ping-chart--page .ping-task-grid,
  .ping-chart--modal .ping-task-grid {
    grid-template-columns: 1fr;
  }

  .ping-toolbar__views {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ping-toolbar__views :deep(.n-button) {
    width: 100%;
  }

  .ping-actions {
    gap: 10px;
  }

  .ping-chart__canvas {
    height: 280px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ping-task-card {
    transition: none;
  }
}

@media (min-width: 641px) and (max-width: 900px) {
  .ping-chart--modal .ping-task-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 默认任务卡片样式 */
.task-card-default {
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: var(--ping-radius);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

html.dark .task-card-default {
  background-color: rgba(30, 30, 35, 0.95);
  border-color: rgba(255, 255, 255, 0.08);
}

/* 毛玻璃任务卡片样式 */
.glass-task-enabled {
  border-radius: var(--ping-radius);
}
</style>
