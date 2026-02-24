<script setup lang="ts">
import { NDivider, NEmpty, NInput, NTabPane, NTabs } from 'naive-ui'
import { computed, ref } from 'vue'
import NodeCard from '@/components/NodeCard.vue'
import NodeGeneralCards from '@/components/NodeGeneralCards.vue'
import { useAppStore } from '@/stores/app'
import { useNodesStore } from '@/stores/nodes'
import { isRegionMatch } from '@/utils/regionHelper'

const appStore = useAppStore()
const nodesStore = useNodesStore()

const searchText = ref('')

const groups = computed(() => {
  return [
    {
      tab: '全部节点',
      name: 'all',
    },
    ...nodesStore.groups.map(group => ({
      tab: group,
      name: group,
    })),
  ]
})

/**
 * 检查节点是否匹配搜索词
 */
function isNodeMatchSearch(node: typeof nodesStore.nodes[number], search: string): boolean {
  if (!search.trim())
    return true

  const lowerSearch = search.toLowerCase().trim()

  // 搜索节点名称
  if (node.name.toLowerCase().includes(lowerSearch))
    return true

  // 搜索地区（使用 regionHelper 支持国家名称搜索）
  if (node.region && isRegionMatch(node.region, search))
    return true

  // 搜索操作系统
  if (node.os && node.os.toLowerCase().includes(lowerSearch))
    return true

  // 搜索分组
  if (node.group && node.group.toLowerCase().includes(lowerSearch))
    return true

  // 搜索标签
  if (node.tags && node.tags.toLowerCase().includes(lowerSearch))
    return true

  // 搜索备注
  if (node.remark && node.remark.toLowerCase().includes(lowerSearch))
    return true

  return false
}

const nodeList = computed(() => {
  // 先按分组筛选
  let filteredNodes = appStore.nodeSelectedGroup === 'all'
    ? nodesStore.nodes
    : nodesStore.nodes.filter(node => node.group === appStore.nodeSelectedGroup)

  // 再按搜索词筛选
  if (searchText.value.trim()) {
    filteredNodes = filteredNodes.filter(node => isNodeMatchSearch(node, searchText.value))
  }

  return filteredNodes
})
</script>

<template>
  <NodeGeneralCards />
  <NDivider class="my-0! px-4!" dashed />
  <div class="node-info p-4 flex flex-col gap-4">
    <div class="search">
      <NInput v-model:value="searchText" placeholder="搜索节点名称、地区、系统">
        <template #prefix>
          <div class="i-icon-park-outline-search" />
        </template>
      </NInput>
    </div>
    <div class="nodes">
      <NTabs v-model:value="appStore.nodeSelectedGroup" animated>
        <NTabPane v-for="group in groups" :key="group.name" :tab="group.tab" :name="group.name">
          <div v-if="nodeList.length !== 0" class="gap-4 grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-4">
            <NodeCard v-for="node in nodeList" :key="node.uuid" :node="node" />
          </div>
          <div v-else class="text-gray-500 text-center">
            <NEmpty description="暂无节点" />
          </div>
        </NTabPane>
      </NTabs>
    </div>
  </div>
</template>
