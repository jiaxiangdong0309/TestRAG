<template>
  <div class="api-test-page">
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-8 text-center">JSONPlaceholder API 测试</h1>

      <!-- API 测试按钮 -->
      <div class="mb-8 text-center">
        <button @click="testApi" :disabled="loading" class="btn-primary text-lg px-8 py-4">
          {{ loading ? '获取中...' : '获取文章列表' }}
        </button>
      </div>

      <!-- 测试结果展示 -->
      <div class="mt-8">
        <h2 class="text-2xl font-semibold mb-4 text-purple-600">接口返回数据</h2>
        <div class="bg-gray-100 p-4 rounded-lg">
          <div v-if="testResult?.data" class="bg-white p-4 rounded border overflow-auto max-h-96">
            <pre class="text-sm text-gray-800">{{ JSON.stringify(testResult.data, null, 2) }}</pre>
          </div>
          <div v-else class="text-gray-500">点击上方按钮获取数据</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 定义文章类型
interface Post {
  userId: number
  id: number
  title: string
  body: string
}

// 响应式数据
const loading = ref(false)
const testResult = ref<{
  data?: Post[]
} | null>(null)

// 测试 JSONPlaceholder API 接口
const testApi = async () => {
  loading.value = true

  try {
    const response = await fetch('/api/posts')

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: Post[] = await response.json()

    testResult.value = {
      data: data.slice(0, 5), // 只显示前5篇文章
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : '未知错误'
    console.error('API 请求失败:', errorMessage)

    testResult.value = {
      data: undefined,
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.api-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.btn-primary {
  @apply bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed;
}

.container {
  max-width: 1200px;
}

h1,
h2 {
  @apply text-gray-800;
}

.grid {
  @apply gap-4;
}

@media (max-width: 768px) {
  .grid {
    @apply grid-cols-1;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .grid {
    @apply grid-cols-2;
  }
}

@media (min-width: 1025px) {
  .grid {
    @apply grid-cols-3;
  }
}
</style>
