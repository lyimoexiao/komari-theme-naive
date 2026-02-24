<script setup lang="ts">
import { NCard, NIcon, NProgress, NTag, NText } from 'naive-ui'
import { computed } from 'vue'
import { calcPercentage, formatBytes, formatBytesPerSecond, formatUptime, getStatus } from '@/utils/helper'
import { getOSImage, getOSName } from '@/utils/osImageHelper'
import { getRegionCode, getRegionDisplayName } from '@/utils/regionHelper'

const props = defineProps({
  node: {
    type: Object,
    default: () => {},
  },
})

const cpuStatus = computed(() => getStatus(props.node.cpu ?? 0))
const memPercentage = computed(() => calcPercentage(props.node.ram ?? 0, props.node.mem_total ?? 0))
const memStatus = computed(() => getStatus(memPercentage.value))
const diskPercentage = computed(() => calcPercentage(props.node.disk ?? 0, props.node.disk_total ?? 0))
const diskStatus = computed(() => getStatus(diskPercentage.value))
</script>

<template>
  <NCard hoverable class="w-full cursor-pointer">
    <template #header>
      <div class="flex gap-2 items-center">
        <NIcon>
          <img :src="`/images/flags/${getRegionCode(props.node.region)}.svg`" :alt="getRegionDisplayName(props.node.region)">
        </NIcon>
        <NText class="text-lg font-bold m-0">
          {{ props.node.name }}
        </NText>
      </div>
    </template>
    <template #header-extra>
      <div>
        <NTag :type="props.node.online ? 'success' : 'error'" class="ml-2">
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

        <!-- 总流量 -->
        <div class="flex-between">
          <NText :depth="3" class="">
            总流量
          </NText>
          <NText class="">
            ↑ {{ formatBytes(props.node.net_total_up ?? 0) }} ｜ ↓ {{ formatBytes(props.node.net_total_down ?? 0) }}
          </NText>
        </div>

        <!-- 网络速率 -->
        <div class="flex-between">
          <NText :depth="3" class="">
            网络速率
          </NText>
          <NText class="">
            ↑ {{ formatBytesPerSecond(props.node.net_out ?? 0) }} ｜ ↓ {{ formatBytesPerSecond(props.node.net_in ?? 0) }}
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
</template>
