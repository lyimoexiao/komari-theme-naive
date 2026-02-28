<script setup lang="ts">
import { NA, NCode, NImage, NText } from 'naive-ui'
import { computed } from 'vue'

const props = defineProps<{
  content: string
}>()

/**
 * 解析 Markdown 文本为 token 数组
 */
interface Token {
  type: 'text' | 'bold' | 'italic' | 'link' | 'image' | 'code' | 'br'
  content?: string
  url?: string
  alt?: string
  children?: Token[]
}

function parseMarkdown(text: string): Token[] {
  if (!text)
    return []

  const tokens: Token[] = []
  let remaining = text

  while (remaining.length > 0) {
    // 图片：![alt](url)
    const imageMatch = remaining.match(/^!\[([^\]]*)\]\(([^)]+)\)/)
    if (imageMatch) {
      tokens.push({ type: 'image', alt: imageMatch[1], url: imageMatch[2] })
      remaining = remaining.slice(imageMatch[0].length)
      continue
    }

    // 链接：[text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/)
    if (linkMatch) {
      tokens.push({ type: 'link', content: linkMatch[1], url: linkMatch[2] })
      remaining = remaining.slice(linkMatch[0].length)
      continue
    }

    // 加粗：**text** 或 __text__
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/) || remaining.match(/^__([^_]+)__/)
    if (boldMatch) {
      tokens.push({ type: 'bold', content: boldMatch[1] })
      remaining = remaining.slice(boldMatch[0].length)
      continue
    }

    // 斜体：*text* 或 _text_
    const italicMatch = remaining.match(/^\*([^*]+)\*/) || remaining.match(/^_([^_]+)_/)
    if (italicMatch) {
      tokens.push({ type: 'italic', content: italicMatch[1] })
      remaining = remaining.slice(italicMatch[0].length)
      continue
    }

    // 行内代码：`code`
    const codeMatch = remaining.match(/^`([^`]+)`/)
    if (codeMatch) {
      tokens.push({ type: 'code', content: codeMatch[1] })
      remaining = remaining.slice(codeMatch[0].length)
      continue
    }

    // 换行符
    if (remaining[0] === '\n') {
      tokens.push({ type: 'br' })
      remaining = remaining.slice(1)
      continue
    }

    // 普通文本：找到下一个特殊字符
    const nextSpecial = remaining.search(/[![*_`\n]/)
    if (nextSpecial === -1) {
      // 转义 HTML
      tokens.push({ type: 'text', content: escapeHtml(remaining) })
      break
    }
    else if (nextSpecial === 0) {
      // 特殊字符但未匹配，作为普通文本处理
      tokens.push({ type: 'text', content: escapeHtml(remaining[0]!) })
      remaining = remaining.slice(1)
    }
    else {
      tokens.push({ type: 'text', content: escapeHtml(remaining.slice(0, nextSpecial)) })
      remaining = remaining.slice(nextSpecial)
    }
  }

  return tokens
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const tokens = computed(() => parseMarkdown(props.content))
</script>

<template>
  <span class="markdown-content">
    <template v-for="(token, index) in tokens" :key="index">
      <!-- 图片 -->
      <NImage
        v-if="token.type === 'image'"
        :src="token.url"
        :alt="token.alt"
        :img-props="{ loading: 'lazy' }"
        preview-disabled
        class="align-middle h-auto max-w-full inline-block"
        style="max-height: 200px; border-radius: var(--n-border-radius)"
      />
      <!-- 链接 -->
      <NA
        v-else-if="token.type === 'link'"
        :href="token.url"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ token.content }}
      </NA>
      <!-- 加粗 -->
      <NText v-else-if="token.type === 'bold'" strong>
        {{ token.content }}
      </NText>
      <!-- 斜体 -->
      <NText v-else-if="token.type === 'italic'" italic>
        {{ token.content }}
      </NText>
      <!-- 行内代码 -->
      <NCode v-else-if="token.type === 'code'" :code="token.content" inline />
      <!-- 换行 -->
      <br v-else-if="token.type === 'br'">
      <!-- 普通文本 -->
      <span v-else-if="token.type === 'text'">{{ token.content }}</span>
    </template>
  </span>
</template>

<style scoped>
.markdown-content {
  line-height: 1.6;
}
</style>
