<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { NAlert, NEmpty, NInput, NRadioButton, NRadioGroup, NTab, NTabs } from 'naive-ui'
import { computed, defineAsyncComponent, nextTick, onActivated, onDeactivated, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import MarkdownRenderer from '@/components/MarkdownRenderer.vue'
import { useGlassSurface } from '@/composables/useGlassSurface'
import { useAppStore } from '@/stores/app'
import { useNodesStore } from '@/stores/nodes'
import { isRegionMatch } from '@/utils/regionHelper'

// 定义组件名称，用于 KeepAlive 匹配
defineOptions({
  name: 'HomeView',
})

// 异步组件：按需加载，减少首屏体积
const NodeCard = defineAsyncComponent(() => import('@/components/NodeCard.vue'))
const NodeGeneralCards = defineAsyncComponent(() => import('@/components/NodeGeneralCards.vue'))
const NodeList = defineAsyncComponent(() => import('@/components/NodeList.vue'))

const appStore = useAppStore()
const { glassSurfaceStyle, isGlassEnabled } = useGlassSurface()
const nodesStore = useNodesStore()

const router = useRouter()

// 组件激活时恢复滚动位置
onActivated(() => {
  if (appStore.homeScrollPosition > 0) {
    // 使用 nextTick 确保 DOM 已渲染完成后再恢复滚动
    nextTick(() => {
      window.scrollTo({ top: appStore.homeScrollPosition, behavior: 'instant' })
    })
  }
})

// 组件失活时保存滚动位置
onDeactivated(() => {
  appStore.homeScrollPosition = window.scrollY
})

const searchText = ref('')
// 防抖后的搜索文本
const debouncedSearchText = ref('')

// 使用 VueUse 的 useDebounceFn 进行防抖，300ms 延迟
const updateDebouncedSearch = useDebounceFn((value: string) => {
  debouncedSearchText.value = value
}, 300)

// 监听原始搜索文本变化
watch(searchText, (value) => {
  updateDebouncedSearch(value)
})

const groupTabs = computed(() => {
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

// 计算是否应该显示分组 Tab
const showGroupTabs = computed(() => {
  // 如果配置为单分组时隐藏，且只有一个分组（不含"全部节点"），则隐藏
  if (appStore.hideSingleGroupTab && nodesStore.groups.length <= 1) {
    return false
  }
  return true
})

// 验证当前选中的分组是否有效，无效则重置为 'all'
watch(
  () => nodesStore.groups,
  (groups) => {
    const currentGroup = appStore.nodeSelectedGroup
    if (currentGroup !== 'all' && !groups.includes(currentGroup)) {
      appStore.nodeSelectedGroup = 'all'
    }
  },
  { immediate: true },
)

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

const groupNodeList = computed(() => {
  return appStore.nodeSelectedGroup === 'all'
    ? nodesStore.nodes
    : nodesStore.nodes.filter(node => node.group === appStore.nodeSelectedGroup)
})

const nodeList = computed(() => {
  let filteredNodes = groupNodeList.value

  // 再按防抖后的搜索词筛选
  if (debouncedSearchText.value.trim()) {
    filteredNodes = filteredNodes.filter(node => isNodeMatchSearch(node, debouncedSearchText.value))
  }

  return filteredNodes
})

function handleNodeClick(node: typeof nodesStore.nodes[number]) {
  router.push({ name: 'instance-detail', params: { id: node.uuid } })
}

const cardGridStyle = computed(() => ({
  '--card-min-width': `${appStore.cardMinWidth}px`,
  '--card-grid-gap': appStore.cardSize === 'compact' ? '12px' : appStore.cardSize === 'spacious' ? '20px' : '16px',
}))
</script>

<template>
  <div class="home-view">
    <div v-if="appStore.connectionError" class="alert px-4">
      <NAlert type="error" title="RPC 服务错误" show-icon>
        连接服务器失败，请检查网络设置<span class="whitespace-nowrap">或刷新页面后再试。</span>
      </NAlert>
    </div>
    <!-- 自定义公告 -->
    <div v-if="appStore.alertEnabled && appStore.alertContent" class="alert px-4">
      <NAlert :type="appStore.alertType" :title="appStore.alertTitle || undefined" show-icon>
        <MarkdownRenderer :content="appStore.alertContent" />
      </NAlert>
    </div>
    <NodeGeneralCards v-if="appStore.showGeneralCards" :nodes="groupNodeList" />
    <section class="node-info p-4 flex flex-col gap-4" aria-label="节点列表">
      <div class="node-toolbar">
        <NTabs
          v-if="showGroupTabs"
          v-model:value="appStore.nodeSelectedGroup"
          class="node-tabs"
          type="bar"
          :tabs-padding="0"
          aria-label="节点分组"
        >
          <NTab v-for="group in groupTabs" :key="group.name" :name="group.name" :tab="group.tab" />
        </NTabs>
        <div class="toolbar-actions">
          <NInput
            v-model:value="searchText"
            class="search-input"
            placeholder="搜索节点名称、地区、系统"
            aria-label="搜索节点名称、地区、系统"
            :class="{ 'glass-surface-enabled glass-input-enabled': isGlassEnabled }"
            :style="glassSurfaceStyle"
          >
            <template #prefix>
              <div class="i-icon-park-outline-search" />
            </template>
            <template #suffix>
              <span v-if="searchText" class="text-xs text-[--n-text-color-3]">{{ nodeList.length }} 项</span>
            </template>
          </NInput>
          <NRadioGroup v-model:value="appStore.nodeViewMode" class="view-selector" aria-label="节点视图模式">
            <NRadioButton value="card" class="view-selector-item" aria-label="卡片视图">
              <div class="i-icon-park-outline-view-grid-card" />
            </NRadioButton>
            <NRadioButton value="list" class="view-selector-item" aria-label="列表视图">
              <div class="i-icon-park-outline-view-list" />
            </NRadioButton>
          </NRadioGroup>
        </div>
      </div>
      <div class="nodes">
        <div v-if="nodeList.length !== 0 && appStore.nodeViewMode === 'card'" class="node-grid" :style="cardGridStyle">
          <NodeCard v-for="node in nodeList" :key="node.uuid" :node="node" @click="handleNodeClick(node)" />
        </div>
        <NodeList v-else-if="nodeList.length !== 0 && appStore.nodeViewMode === 'list'" :nodes="nodeList" @click="handleNodeClick" />
        <div v-else class="text-gray-500 text-center">
          <NEmpty description="暂无节点" />
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.view-selector :deep(.n-radio__label) {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.node-toolbar {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 34px;
  align-items: center;
  padding-bottom: 4px;
  border-bottom: 1px solid color-mix(in srgb, var(--n-border-color) 72%, transparent);
}

.node-tabs {
  min-width: 0;
  flex: 1;
  margin-right: 54px;
  overflow: hidden;
  transition: opacity 160ms ease;
}

.toolbar-actions {
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
  align-items: center;
  margin-left: 8px;
}

.search-input {
  position: absolute;
  z-index: 2;
  right: 100px;
  width: 46px;
  overflow: hidden;
  transition:
    width 220ms ease,
    box-shadow 220ms ease;
}

.search-input:focus-within {
  width: calc(100% - 100px);
  background-color: var(--n-color) !important;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--n-color) 72%, transparent);
}

.node-toolbar:has(.search-input:focus-within) .node-tabs {
  pointer-events: none;
  opacity: 0;
}

.search-input :deep(input::placeholder) {
  opacity: 0;
  transition: opacity 140ms ease;
}

.search-input:focus-within :deep(input::placeholder) {
  opacity: 1;
}

@media (min-width: 640px) {
  .node-toolbar {
    gap: 16px;
  }

  .search-input {
    position: relative;
    right: auto;
    width: 46px;
  }

  .node-tabs {
    margin-right: 0;
  }

  .search-input:focus-within {
    width: clamp(280px, 34vw, 500px);
  }

  .search-input:focus-within :deep(input::placeholder) {
    opacity: 1;
  }

  .node-toolbar:has(.search-input:focus-within) .node-tabs {
    pointer-events: auto;
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .search-input,
  .node-tabs,
  .search-input :deep(input::placeholder) {
    transition: none;
  }
}

.node-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(var(--card-min-width), 100%), 1fr));
  gap: var(--card-grid-gap);
}

/* 毛玻璃搜索框样式 */
.glass-input-enabled {
  border-radius: var(--n-border-radius);
}
</style>
