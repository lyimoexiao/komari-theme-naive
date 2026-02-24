<script setup lang="ts">
import type { RecordFormat } from '@/utils/recordHelper'
import type { StatusRecord } from '@/utils/rpc'
import { LineChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { NButton, NCard, NEmpty, NSpin, NText } from 'naive-ui'
import { computed, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue'
import VChart from 'vue-echarts'
import { useAppStore } from '@/stores/app'
import { useNodesStore } from '@/stores/nodes'
import { formatBytes } from '@/utils/helper'
import { fillMissingTimePoints } from '@/utils/recordHelper'
import { getSharedRpc } from '@/utils/rpc'

const props = defineProps<{
  uuid: string
}>()

// 注册 ECharts 组件
use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
])

const appStore = useAppStore()
const nodesStore = useNodesStore()

// 从 publicSettings 获取记录保留时间
const maxRecordPreserveTime = computed(() => appStore.publicSettings?.record_preserve_time || 720)

// 从 publicSettings 获取数据更新间隔（秒），默认 3 秒
const dataUpdateInterval = computed(() => {
  const interval = appStore.publicSettings?.dataUpdateInterval
  // 确保值在合理范围内（1-60秒）
  if (interval && interval >= 1 && interval <= 60) {
    return interval * 1000 // 转换为毫秒
  }
  return 3000 // 默认 3 秒
})

// 判断是否为暗色模式
const isDark = computed(() => {
  if (appStore.themeMode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return appStore.themeMode === 'dark'
})

// 优化后的图表配色方案（基于 Material Design 色彩）
const chartColors = {
  // 主色调 - 珊瑚红
  primary: '#FF6B6B',
  primaryArea: 'rgba(255, 107, 107, 0.15)',
  // 次要色 - 琥珀黄
  secondary: '#FFB347',
  // 第三色 - 青绿色
  tertiary: '#4ECDC4',
  // 第四色 - 紫罗兰
  quaternary: '#A78BFA',
  // 第五色 - 天蓝色
  quinary: '#60A5FA',
}

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

// 图表边距配置
const chartMargin = { top: 12, right: 24, bottom: 32, left: 56 }
const chartMarginWithLegend = { top: 12, right: 24, bottom: 52, left: 56 }

// 视图选项
const presetViews = [
  { label: '4 小时', hours: 4 },
  { label: '1 天', hours: 24 },
  { label: '7 天', hours: 168 },
  { label: '30 天', hours: 720 },
]

// 可用视图列表
const availableViews = computed(() => {
  const views: { label: string, hours?: number }[] = [{ label: '实时' }]
  const maxHours = maxRecordPreserveTime.value

  for (const v of presetViews) {
    if (maxHours >= v.hours) {
      views.push({ label: v.label, hours: v.hours })
    }
  }

  const maxPreset = presetViews[presetViews.length - 1]
  if (maxPreset && maxHours > maxPreset.hours) {
    const label = maxHours % 24 === 0
      ? `${Math.floor(maxHours / 24)} 天`
      : `${maxHours} 小时`
    views.push({ label, hours: maxHours })
  }
  else if (maxHours > 4 && !presetViews.some(v => v.hours === maxHours)) {
    const label = maxHours % 24 === 0
      ? `${Math.floor(maxHours / 24)} 天`
      : `${maxHours} 小时`
    views.push({ label, hours: maxHours })
  }

  return views
})

// 当前选中的视图
const selectedView = ref<string>('实时')
const selectedHours = computed(() => {
  const view = availableViews.value.find(v => v.label === selectedView.value)
  return view?.hours
})
const isRealtime = computed(() => selectedView.value === '实时')

// 数据状态
const remoteData = shallowRef<StatusRecord[]>([])
const loading = ref(false)
const isInitialLoad = ref(true) // 是否为首次加载（用于控制实时模式下的 NSpin 显示）
const error = ref<string | null>(null)

// 实时更新定时器
let realtimeTimer: ReturnType<typeof setInterval> | null = null

// 节点信息
const nodeInfo = computed(() => nodesStore.nodesByUuid.get(props.uuid))

// RPC 客户端
const rpc = getSharedRpc()

// ==================== 数据获取 ====================

function statusToRecordFormat(records: StatusRecord[]): RecordFormat[] {
  return records.map(r => ({
    client: r.client,
    time: r.time,
    cpu: r.cpu ?? null,
    gpu: r.gpu ?? null,
    gpu_usage: null,
    gpu_memory: null,
    ram: r.ram ?? null,
    ram_total: r.ram_total ?? null,
    swap: r.swap ?? null,
    swap_total: r.swap_total ?? null,
    load: r.load ?? null,
    temp: r.temp ?? null,
    disk: r.disk ?? null,
    disk_total: r.disk_total ?? null,
    net_in: r.net_in ?? null,
    net_out: r.net_out ?? null,
    net_total_up: r.net_total_up ?? null,
    net_total_down: r.net_total_down ?? null,
    process: r.process ?? null,
    connections: r.connections ?? null,
    connections_udp: r.connections_udp ?? null,
  }))
}

async function fetchRecentData() {
  if (!props.uuid)
    return

  // 只在首次加载时显示 loading
  if (isInitialLoad.value) {
    loading.value = true
  }
  error.value = null

  try {
    const result = await rpc.getNodeRecentStatus(props.uuid)
    const records = result?.records || []
    records.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
    const maxLength = 150
    remoteData.value = records.slice(-maxLength)
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '获取数据失败'
    remoteData.value = []
  }
  finally {
    loading.value = false
    isInitialLoad.value = false
  }
}

async function fetchHistoryData() {
  if (!props.uuid)
    return

  const hours = selectedHours.value || 4

  loading.value = true
  error.value = null

  try {
    const apiBase = import.meta.env.VITE_API_BASE
    const response = await fetch(`${apiBase}/records/load?uuid=${props.uuid}&hours=${hours}`)

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }

    const resp = await response.json()
    const records = resp.data?.records || []

    // 按时间排序
    records.sort((a: StatusRecord, b: StatusRecord) =>
      new Date(a.time).getTime() - new Date(b.time).getTime(),
    )

    remoteData.value = records
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '获取数据失败'
    remoteData.value = []
  }
  finally {
    loading.value = false
  }
}

async function fetchData() {
  if (isRealtime.value) {
    await fetchRecentData()
  }
  else {
    await fetchHistoryData()
  }
}

// ==================== 数据处理 ====================

const chartData = computed(() => {
  const data = statusToRecordFormat(remoteData.value)
  if (!data.length)
    return []

  if (isRealtime.value) {
    return data
  }

  const hours = selectedHours.value || 4
  const minute = 60
  const hour = minute * 60
  let intervalSec: number
  let maxGap: number

  if (hours <= 4) {
    intervalSec = minute
    maxGap = minute * 2
  }
  else if (hours > 120) {
    intervalSec = hour
    maxGap = hour * 2
  }
  else {
    intervalSec = minute * 15
    maxGap = minute * 30
  }

  return fillMissingTimePoints(data, intervalSec, hours * 3600, maxGap)
})

const latestStatus = computed(() => {
  const data = remoteData.value
  if (!data.length)
    return null
  return data[data.length - 1]
})

// ==================== 工具函数 ====================

function formatTime(time: string, showDate: boolean): string {
  const date = new Date(time)
  if (showDate) {
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

function formatTimeForTooltip(time: string, hours: number): string {
  const date = new Date(time)
  if (hours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }
  return date.toLocaleString([], { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

const showDateInAxis = computed(() => (selectedHours.value || 1) >= 24)

// 通用 X 轴配置
const baseXAxisConfig = computed(() => ({
  type: 'category' as const,
  data: chartData.value.map(r => formatTime(r.time, showDateInAxis.value)),
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
}))

// 通用 Y 轴配置
const baseYAxisConfig = computed(() => ({
  type: 'value' as const,
  axisLabel: {
    fontSize: 11,
    color: chartThemeColors.value.textSecondary,
  },
  axisLine: { show: false },
  axisTick: { show: false },
  splitLine: {
    lineStyle: {
      color: chartThemeColors.value.splitLineColor,
      type: 'dashed' as const,
    },
  },
}))

// ==================== 图表配置 ====================

// CPU 图表
const cpuChartOption = computed(() => ({
  animation: false,
  // 全局颜色配置（确保 Tooltip 圆点颜色与线条一致）
  color: [chartColors.primary, chartColors.secondary],
  tooltip: {
    ...baseTooltipConfig.value,
    formatter: (params: unknown) => {
      const p = params as Array<{ dataIndex: number, seriesName: string, value: number, color: string }>
      if (!p.length)
        return ''
      const firstParam = p[0]
      if (!firstParam)
        return ''
      const record = chartData.value[firstParam.dataIndex]
      if (!record)
        return ''

      const timeStr = formatTimeForTooltip(record.time, selectedHours.value || 1)
      let html = `<div style="font-weight:600;margin-bottom:6px;color:${chartThemeColors.value.textSecondary}">${timeStr}</div>`
      html += '<div style="display:flex;flex-direction:column;gap:4px">'

      for (const item of p) {
        const colorDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:8px;flex-shrink:0"></span>`
        if (item.seriesName === 'CPU') {
          html += `<div style="display:flex;align-items:center">${colorDot}<span>CPU</span><span style="margin-left:auto;font-weight:600;margin-left:16px">${item.value?.toFixed(1) ?? '-'}%</span></div>`
        }
        else if (item.seriesName === '负载') {
          html += `<div style="display:flex;align-items:center">${colorDot}<span>系统负载</span><span style="margin-left:auto;font-weight:600;margin-left:16px">${item.value?.toFixed(2) ?? '-'}</span></div>`
        }
      }
      html += '</div>'
      return html
    },
  },
  grid: chartMargin,
  xAxis: baseXAxisConfig.value,
  yAxis: [
    {
      ...baseYAxisConfig.value,
      name: 'CPU %',
      nameTextStyle: { color: chartThemeColors.value.textSecondary, padding: [0, 40, 0, 0] },
      min: 0,
      max: 100,
      axisLabel: { ...baseYAxisConfig.value.axisLabel, formatter: '{value}%' },
    },
    {
      ...baseYAxisConfig.value,
      name: '负载',
      nameTextStyle: { color: chartThemeColors.value.textSecondary, padding: [0, 0, 0, 40] },
      min: 0,
      splitLine: { show: false },
    },
  ],
  series: [
    {
      name: 'CPU',
      type: 'line',
      data: chartData.value.map(r => r.cpu),
      smooth: 0.6,
      showSymbol: false,
      yAxisIndex: 0,
      lineStyle: { width: 2.5, color: chartColors.primary, cap: 'round' as const },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 107, 107, 0.25)' },
            { offset: 1, color: 'rgba(255, 107, 107, 0.02)' },
          ],
        },
      },
    },
    {
      name: '负载',
      type: 'line',
      data: chartData.value.map(r => r.load),
      smooth: 0.6,
      showSymbol: false,
      yAxisIndex: 1,
      lineStyle: { width: 2.5, color: chartColors.secondary, cap: 'round' as const },
    },
  ],
}))

// 内存图表
const memoryChartOption = computed(() => ({
  animation: false,
  color: [chartColors.primary, chartColors.secondary],
  tooltip: {
    ...baseTooltipConfig.value,
    formatter: (params: unknown) => {
      const p = params as Array<{ dataIndex: number, seriesName: string, value: number, color: string }>
      if (!p.length)
        return ''
      const firstParam = p[0]
      if (!firstParam)
        return ''
      const record = chartData.value[firstParam.dataIndex]
      if (!record)
        return ''

      const ramUsed = record.ram ?? 0
      const ramTotal = record.ram_total ?? nodeInfo.value?.mem_total ?? 0
      const swapUsed = record.swap ?? 0
      const swapTotal = record.swap_total ?? nodeInfo.value?.swap_total ?? 0
      const ramPercent = ramTotal > 0 ? ((ramUsed / ramTotal) * 100).toFixed(1) : '0'
      const swapPercent = swapTotal > 0 ? ((swapUsed / swapTotal) * 100).toFixed(1) : '0'

      const timeStr = formatTimeForTooltip(record.time, selectedHours.value || 1)
      let html = `<div style="font-weight:600;margin-bottom:6px;color:${chartThemeColors.value.textSecondary}">${timeStr}</div>`
      html += '<div style="display:flex;flex-direction:column;gap:4px">'

      for (const item of p) {
        const colorDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:8px;flex-shrink:0"></span>`
        if (item.seriesName === 'RAM') {
          html += `<div style="display:flex;align-items:center">${colorDot}<span>RAM</span><span style="margin-left:auto;font-weight:600;margin-left:16px">${formatBytes(ramUsed)} (${ramPercent}%)</span></div>`
        }
        else if (item.seriesName === 'Swap') {
          html += `<div style="display:flex;align-items:center">${colorDot}<span>Swap</span><span style="margin-left:auto;font-weight:600;margin-left:16px">${formatBytes(swapUsed)} (${swapPercent}%)</span></div>`
        }
      }
      html += '</div>'
      return html
    },
  },
  grid: chartMargin,
  xAxis: baseXAxisConfig.value,
  yAxis: {
    ...baseYAxisConfig.value,
    name: '内存',
    nameTextStyle: { color: chartThemeColors.value.textSecondary, padding: [0, 40, 0, 0] },
    axisLabel: {
      ...baseYAxisConfig.value.axisLabel,
      formatter: (val: number) => formatBytes(val),
    },
  },
  series: [
    {
      name: 'RAM',
      type: 'line',
      data: chartData.value.map(r => r.ram ?? 0),
      smooth: 0.6,
      showSymbol: false,
      lineStyle: { width: 2.5, color: chartColors.primary, cap: 'round' as const },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(255, 107, 107, 0.25)' },
            { offset: 1, color: 'rgba(255, 107, 107, 0.02)' },
          ],
        },
      },
    },
    {
      name: 'Swap',
      type: 'line',
      data: chartData.value.map(r => r.swap ?? 0),
      smooth: 0.6,
      showSymbol: false,
      lineStyle: { width: 2.5, color: chartColors.secondary, cap: 'round' as const },
    },
  ],
}))

// 磁盘图表
const diskChartOption = computed(() => ({
  animation: false,
  color: [chartColors.tertiary],
  tooltip: {
    ...baseTooltipConfig.value,
    formatter: (params: unknown) => {
      const p = params as Array<{ dataIndex: number, value: number, color: string }>
      if (!p.length)
        return ''
      const firstParam = p[0]
      if (!firstParam)
        return ''
      const record = chartData.value[firstParam.dataIndex]
      if (!record)
        return ''

      const diskUsed = record.disk ?? 0
      const diskTotal = record.disk_total ?? nodeInfo.value?.disk_total ?? 0
      const diskPercent = diskTotal > 0 ? ((diskUsed / diskTotal) * 100).toFixed(1) : '0'

      const timeStr = formatTimeForTooltip(record.time, selectedHours.value || 1)
      const colorDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${firstParam.color};margin-right:8px;flex-shrink:0"></span>`

      let html = `<div style="font-weight:600;margin-bottom:6px;color:${chartThemeColors.value.textSecondary}">${timeStr}</div>`
      html += '<div style="display:flex;flex-direction:column;gap:4px">'
      html += `<div style="display:flex;align-items:center">${colorDot}<span>磁盘已用</span><span style="margin-left:auto;font-weight:600;margin-left:16px">${formatBytes(diskUsed)} (${diskPercent}%)</span></div>`
      html += '</div>'
      return html
    },
  },
  grid: chartMargin,
  xAxis: baseXAxisConfig.value,
  yAxis: {
    ...baseYAxisConfig.value,
    name: '磁盘',
    nameTextStyle: { color: chartThemeColors.value.textSecondary, padding: [0, 40, 0, 0] },
    axisLabel: {
      ...baseYAxisConfig.value.axisLabel,
      formatter: (val: number) => formatBytes(val),
    },
  },
  series: [
    {
      name: '磁盘已用',
      type: 'line',
      data: chartData.value.map(r => r.disk ?? 0),
      smooth: 0.6,
      showSymbol: false,
      lineStyle: { width: 2.5, color: chartColors.tertiary, cap: 'round' as const },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(78, 205, 196, 0.25)' },
            { offset: 1, color: 'rgba(78, 205, 196, 0.02)' },
          ],
        },
      },
    },
  ],
}))

// 网络图表
const networkChartOption = computed(() => ({
  animation: false,
  color: [chartColors.quinary, chartColors.quaternary],
  tooltip: {
    ...baseTooltipConfig.value,
    formatter: (params: unknown) => {
      const p = params as Array<{ dataIndex: number, seriesName: string, value: number, color: string }>
      if (!p.length)
        return ''
      const firstParam = p[0]
      if (!firstParam)
        return ''
      const record = chartData.value[firstParam.dataIndex]
      if (!record)
        return ''

      const timeStr = formatTimeForTooltip(record.time, selectedHours.value || 1)
      let html = `<div style="font-weight:600;margin-bottom:6px;color:${chartThemeColors.value.textSecondary}">${timeStr}</div>`
      html += '<div style="display:flex;flex-direction:column;gap:4px">'

      for (const item of p) {
        const colorDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:8px;flex-shrink:0"></span>`
        const label = item.seriesName === '下载' ? '↓ 下载' : '↑ 上传'
        html += `<div style="display:flex;align-items:center">${colorDot}<span>${label}</span><span style="margin-left:auto;font-weight:600;margin-left:16px">${formatBytes(item.value)}/s</span></div>`
      }
      html += '</div>'
      return html
    },
  },
  legend: {
    data: ['下载', '上传'],
    bottom: 4,
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 20,
    icon: 'roundRect',
    textStyle: { fontSize: 11, color: chartThemeColors.value.textSecondary },
  },
  grid: chartMarginWithLegend,
  xAxis: baseXAxisConfig.value,
  yAxis: {
    ...baseYAxisConfig.value,
    name: '速度',
    nameTextStyle: { color: chartThemeColors.value.textSecondary, padding: [0, 40, 0, 0] },
    axisLabel: {
      ...baseYAxisConfig.value.axisLabel,
      formatter: (val: number) => formatBytes(val),
    },
  },
  series: [
    {
      name: '下载',
      type: 'line',
      data: chartData.value.map(r => r.net_in ?? 0),
      smooth: 0.6,
      showSymbol: false,
      lineStyle: { width: 2.5, color: chartColors.quinary, cap: 'round' as const },
    },
    {
      name: '上传',
      type: 'line',
      data: chartData.value.map(r => r.net_out ?? 0),
      smooth: 0.6,
      showSymbol: false,
      lineStyle: { width: 2.5, color: chartColors.quaternary, cap: 'round' as const },
    },
  ],
}))

// 连接数图表
const connectionsChartOption = computed(() => ({
  animation: false,
  color: [chartColors.primary, chartColors.tertiary],
  tooltip: {
    ...baseTooltipConfig.value,
    formatter: (params: unknown) => {
      const p = params as Array<{ dataIndex: number, seriesName: string, value: number, color: string }>
      if (!p.length)
        return ''
      const firstParam = p[0]
      if (!firstParam)
        return ''
      const record = chartData.value[firstParam.dataIndex]
      if (!record)
        return ''

      const timeStr = formatTimeForTooltip(record.time, selectedHours.value || 1)
      let html = `<div style="font-weight:600;margin-bottom:6px;color:${chartThemeColors.value.textSecondary}">${timeStr}</div>`
      html += '<div style="display:flex;flex-direction:column;gap:4px">'

      for (const item of p) {
        const colorDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${item.color};margin-right:8px;flex-shrink:0"></span>`
        const displayValue = item.value != null ? Math.round(item.value) : '-'
        html += `<div style="display:flex;align-items:center">${colorDot}<span>${item.seriesName}</span><span style="margin-left:auto;font-weight:600;margin-left:16px">${displayValue}</span></div>`
      }
      html += '</div>'
      return html
    },
  },
  legend: {
    data: ['TCP', 'UDP'],
    bottom: 4,
    itemWidth: 12,
    itemHeight: 12,
    itemGap: 20,
    icon: 'roundRect',
    textStyle: { fontSize: 11, color: chartThemeColors.value.textSecondary },
  },
  grid: chartMarginWithLegend,
  xAxis: baseXAxisConfig.value,
  yAxis: {
    ...baseYAxisConfig.value,
    name: '连接数',
    nameTextStyle: { color: chartThemeColors.value.textSecondary, padding: [0, 40, 0, 0] },
    min: 0,
    axisLabel: {
      ...baseYAxisConfig.value.axisLabel,
      formatter: (val: number) => Math.round(val).toString(),
    },
  },
  series: [
    {
      name: 'TCP',
      type: 'line',
      data: chartData.value.map(r => r.connections ?? 0),
      smooth: 0.6,
      showSymbol: false,
      lineStyle: { width: 2.5, color: chartColors.primary, cap: 'round' as const },
    },
    {
      name: 'UDP',
      type: 'line',
      data: chartData.value.map(r => r.connections_udp ?? 0),
      smooth: 0.6,
      showSymbol: false,
      lineStyle: { width: 2.5, color: chartColors.tertiary, cap: 'round' as const },
    },
  ],
}))

// 进程数图表
const processChartOption = computed(() => ({
  animation: false,
  color: [chartColors.quaternary],
  tooltip: {
    ...baseTooltipConfig.value,
    formatter: (params: unknown) => {
      const p = params as Array<{ dataIndex: number, value: number, color: string }>
      if (!p.length)
        return ''
      const firstParam = p[0]
      if (!firstParam)
        return ''
      const record = chartData.value[firstParam.dataIndex]
      if (!record)
        return ''

      const timeStr = formatTimeForTooltip(record.time, selectedHours.value || 1)
      const colorDot = `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${firstParam.color};margin-right:8px;flex-shrink:0"></span>`
      const displayValue = firstParam.value != null ? Math.round(firstParam.value) : '-'

      let html = `<div style="font-weight:600;margin-bottom:6px;color:${chartThemeColors.value.textSecondary}">${timeStr}</div>`
      html += '<div style="display:flex;flex-direction:column;gap:4px">'
      html += `<div style="display:flex;align-items:center">${colorDot}<span>进程数</span><span style="margin-left:auto;font-weight:600;margin-left:16px">${displayValue}</span></div>`
      html += '</div>'
      return html
    },
  },
  grid: chartMargin,
  xAxis: baseXAxisConfig.value,
  yAxis: {
    ...baseYAxisConfig.value,
    name: '进程',
    nameTextStyle: { color: chartThemeColors.value.textSecondary, padding: [0, 40, 0, 0] },
    min: 0,
    axisLabel: {
      ...baseYAxisConfig.value.axisLabel,
      formatter: (val: number) => Math.round(val).toString(),
    },
  },
  series: [
    {
      name: '进程数',
      type: 'line',
      data: chartData.value.map(r => r.process ?? 0),
      smooth: 0.6,
      showSymbol: false,
      lineStyle: { width: 2.5, color: chartColors.quaternary, cap: 'round' as const },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(167, 139, 250, 0.25)' },
            { offset: 1, color: 'rgba(167, 139, 250, 0.02)' },
          ],
        },
      },
    },
  ],
}))

// ==================== 实时更新 ====================

function startRealtimeUpdate() {
  stopRealtimeUpdate()
  if (isRealtime.value) {
    realtimeTimer = setInterval(() => {
      fetchData()
    }, dataUpdateInterval.value)
  }
}

function stopRealtimeUpdate() {
  if (realtimeTimer) {
    clearInterval(realtimeTimer)
    realtimeTimer = null
  }
}

// ==================== 生命周期 ====================

watch(selectedView, () => {
  isInitialLoad.value = true // 切换视图时重置首次加载状态
  fetchData()
  if (isRealtime.value) {
    startRealtimeUpdate()
  }
  else {
    stopRealtimeUpdate()
  }
})

watch(() => props.uuid, () => {
  remoteData.value = []
  isInitialLoad.value = true // 切换节点时重置首次加载状态
  fetchData()
})

onMounted(() => {
  fetchData()
  if (isRealtime.value) {
    startRealtimeUpdate()
  }
})

onUnmounted(() => {
  stopRealtimeUpdate()
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- 时间选择器 -->
    <div class="flex flex-wrap gap-2 justify-center">
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

    <!-- 内容区域 -->
    <NSpin :show="loading">
      <div v-if="error" class="text-red-500 py-8 text-center">
        {{ error }}
      </div>
      <div v-else-if="remoteData.length === 0 && !loading" class="py-8">
        <NEmpty description="暂无负载数据" />
      </div>

      <!-- 图表网格 -->
      <div v-else class="gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        <!-- CPU 卡片 -->
        <NCard size="small" class="chart-card">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold">CPU</span>
              <NText :depth="3" class="text-sm font-mono">
                {{ latestStatus?.cpu?.toFixed(1) ?? '-' }}%
              </NText>
            </div>
          </template>
          <div class="h-48">
            <VChart :option="cpuChartOption" autoresize />
          </div>
        </NCard>

        <!-- 内存卡片 -->
        <NCard size="small" class="chart-card">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold">内存</span>
              <div class="text-sm font-mono text-right" style="color: var(--n-text-color-3)">
                <div>{{ latestStatus?.ram ? formatBytes(latestStatus.ram) : '-' }} / {{ nodeInfo?.mem_total ? formatBytes(nodeInfo.mem_total) : '-' }}</div>
              </div>
            </div>
          </template>
          <div class="h-48">
            <VChart :option="memoryChartOption" autoresize />
          </div>
        </NCard>

        <!-- 磁盘卡片 -->
        <NCard size="small" class="chart-card">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold">磁盘</span>
              <NText :depth="3" class="text-sm font-mono">
                {{ latestStatus?.disk ? formatBytes(latestStatus.disk) : '-' }} / {{ nodeInfo?.disk_total ? formatBytes(nodeInfo.disk_total) : '-' }}
              </NText>
            </div>
          </template>
          <div class="h-48">
            <VChart :option="diskChartOption" autoresize />
          </div>
        </NCard>

        <!-- 网络卡片 -->
        <NCard size="small" class="chart-card">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold">网络</span>
              <div class="text-sm font-mono text-right" style="color: var(--n-text-color-3)">
                <div>↑ {{ latestStatus?.net_out ? formatBytes(latestStatus.net_out) : '-' }}/s</div>
                <div>↓ {{ latestStatus?.net_in ? formatBytes(latestStatus.net_in) : '-' }}/s</div>
              </div>
            </div>
          </template>
          <div class="h-48">
            <VChart :option="networkChartOption" autoresize />
          </div>
        </NCard>

        <!-- 连接数卡片 -->
        <NCard size="small" class="chart-card">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold">连接</span>
              <div class="text-sm font-mono text-right" style="color: var(--n-text-color-3)">
                <div>TCP: {{ latestStatus?.connections ?? '-' }}</div>
                <div>UDP: {{ latestStatus?.connections_udp ?? '-' }}</div>
              </div>
            </div>
          </template>
          <div class="h-48">
            <VChart :option="connectionsChartOption" autoresize />
          </div>
        </NCard>

        <!-- 进程卡片 -->
        <NCard size="small" class="chart-card">
          <template #header>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold">进程</span>
              <NText :depth="3" class="text-sm font-mono">
                {{ latestStatus?.process ?? '-' }}
              </NText>
            </div>
          </template>
          <div class="h-48">
            <VChart :option="processChartOption" autoresize />
          </div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>

<style scoped>
.chart-card {
  --n-padding-bottom: 8px;
  --n-padding-left: 8px;
  --n-padding-right: 8px;
  --n-padding-top: 8px;
}
</style>
