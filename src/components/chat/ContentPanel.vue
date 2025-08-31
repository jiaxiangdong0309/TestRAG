<template>
  <div class="w-1/2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden min-h-[600px]">
    <div class="flex-1 p-4">
      <!-- 仅在生成且尚无任何内容时，显示纯等待 -->
      <div v-if="isGeneratingWebpage && !webpageContent" class="w-full h-full flex items-center justify-center">
        <div class="text-center">
          <div class="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p class="text-gray-600">正在生成网页...</p>
          <p class="text-sm text-gray-400 mt-2">请稍候，AI正在为您创建网页内容</p>
        </div>
      </div>

      <!-- 网页内容展示（生成中也增量展示） -->
      <div v-else-if="webpageContent" class="w-full h-full">
        <div class="mb-4 p-3 rounded-lg" :class="isGeneratingWebpage ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'">
          <div class="flex items-center gap-2" :class="isGeneratingWebpage ? 'text-blue-700' : 'text-green-700'">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!isGeneratingWebpage" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            <span class="font-medium">{{ isGeneratingWebpage ? '正在生成（内容将持续更新）' : '网页内容已生成' }}</span>
          </div>
        </div>
        <div class="bg-white border border-gray-200 rounded-lg p-4 h-[calc(100%-80px)] overflow-y-auto">
          <div v-html="webpageContent" class="prose max-w-none"></div>
        </div>
      </div>

      <!-- 默认状态 -->
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="text-center text-gray-500">
          <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2"></path>
            </svg>
          </div>
          <p class="text-xl font-medium text-gray-600 mb-2">点击"生成网页"开始创建</p>
          <p class="text-sm text-gray-400">AI将为您生成个性化的网页内容</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件名称
defineOptions({
  name: 'ContentPanel'
})

// 定义 props
interface Props {
  webpageContent: string
  isGeneratingWebpage: boolean
}

const props = defineProps<Props>()
</script>

<style scoped>
/* 网页内容样式 */
.prose {
  @apply text-gray-900 leading-relaxed;
}

.prose h1 {
  @apply text-2xl font-bold mb-4 text-gray-900;
}

.prose h2 {
  @apply text-xl font-semibold mb-3 text-gray-800;
}

.prose h3 {
  @apply text-lg font-medium mb-2 text-gray-800;
}

.prose p {
  @apply mb-4 text-gray-700;
}

.prose ul, .prose ol {
  @apply mb-4 pl-6;
}

.prose li {
  @apply mb-2 text-gray-700;
}

.prose ul li {
  @apply list-disc;
}

.prose ol li {
  @apply list-decimal;
}

.prose a {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.prose blockquote {
  @apply border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4;
}

.prose code {
  @apply bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800;
}

.prose pre {
  @apply bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4;
}

.prose pre code {
  @apply bg-transparent p-0;
}

.prose table {
  @apply w-full border-collapse border border-gray-300 mb-4;
}

.prose th, .prose td {
  @apply border border-gray-300 px-3 py-2 text-left;
}

.prose th {
  @apply bg-gray-100 font-semibold;
}

/* 玻璃态效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style>
