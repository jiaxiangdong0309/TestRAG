<template>
  <div class="markdown-content" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MarkdownIt from 'markdown-it'
import type { Options } from 'markdown-it'

// 组件属性
interface Props {
  content: string
  options?: Options
}

const props = withDefaults(defineProps<Props>(), {
  options: () => ({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
  })
})

// 创建 MarkdownIt 实例
const md = new MarkdownIt(props.options)

// 渲染 Markdown 内容
const renderedContent = computed(() => {
  if (!props.content) return ''
  try {
    return md.render(props.content)
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return props.content // 如果渲染失败，返回原始内容
  }
})
</script>

<style scoped>
.markdown-content {
  @apply text-gray-800 leading-relaxed;
}

.markdown-content :deep(h1) {
  @apply text-2xl font-bold mb-4 mt-6 text-gray-900;
}

.markdown-content :deep(h2) {
  @apply text-xl font-bold mb-3 mt-5 text-gray-900;
}

.markdown-content :deep(h3) {
  @apply text-lg font-bold mb-2 mt-4 text-gray-900;
}

.markdown-content :deep(h4) {
  @apply text-base font-bold mb-2 mt-3 text-gray-900;
}

.markdown-content :deep(h5) {
  @apply text-sm font-bold mb-1 mt-2 text-gray-900;
}

.markdown-content :deep(h6) {
  @apply text-xs font-bold mb-1 mt-2 text-gray-900;
}

.markdown-content :deep(p) {
  @apply mb-3 text-gray-700;
}

.markdown-content :deep(ul) {
  @apply mb-3 pl-6 list-disc text-gray-700;
}

.markdown-content :deep(ol) {
  @apply mb-3 pl-6 list-decimal text-gray-700;
}

.markdown-content :deep(li) {
  @apply mb-1;
}

.markdown-content :deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-4 py-2 my-3 bg-gray-50 text-gray-600 italic;
}

.markdown-content :deep(code) {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800;
}

.markdown-content :deep(pre) {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto my-3;
}

.markdown-content :deep(pre code) {
  @apply bg-transparent p-0 text-gray-800;
}

.markdown-content :deep(a) {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.markdown-content :deep(strong) {
  @apply font-bold text-gray-900;
}

.markdown-content :deep(em) {
  @apply italic text-gray-700;
}

.markdown-content :deep(table) {
  @apply w-full border-collapse border border-gray-300 my-3;
}

.markdown-content :deep(th) {
  @apply border border-gray-300 px-3 py-2 bg-gray-100 font-bold text-gray-900;
}

.markdown-content :deep(td) {
  @apply border border-gray-300 px-3 py-2 text-gray-700;
}

.markdown-content :deep(hr) {
  @apply border-t border-gray-300 my-4;
}

.markdown-content :deep(img) {
  @apply max-w-full h-auto rounded-lg shadow-md my-3;
}

/* 代码高亮样式 */
.markdown-content :deep(.hljs) {
  @apply bg-gray-900 text-gray-100;
}

/* 行内代码样式 */
.markdown-content :deep(:not(pre) > code) {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800;
}
</style>
