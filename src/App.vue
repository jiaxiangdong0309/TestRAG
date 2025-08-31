<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div id="app" class="h-screen flex flex-col">
    <!-- 固定导航栏 -->
    <nav class="bg-white shadow-lg flex-shrink-0 sticky top-0 z-50">
      <div class="container w-1280px px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <h1 class="text-xl font-bold text-gray-900">TestRAG</h1>

            <div class="hidden md:flex space-x-6">
              <!-- <button
                @click="navigateTo('/search')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                搜索
              </button> -->
              <!-- <button
                @click="navigateTo('/knowledge')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                知识库
              </button> -->
              <!-- <button
                @click="navigateTo('/local')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                本地
              </button> -->

              <!-- <button
                @click="navigateTo('/profile')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                个人资料
              </button> -->
              <!-- <button
                @click="navigateTo('/style-guide')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                样式指南
              </button> -->
              <!-- <button
                @click="navigateTo('/about')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                关于
              </button> -->
              <!-- <button
                @click="navigateTo('/api-test')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🧪 API 测试
              </button> -->
              <!-- <button
                @click="navigateTo('/dify-sse')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Dify SSE
              </button> -->
              <button
                @click="navigateTo('/chat')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                💬 Chat
              </button>
              <button
                @click="navigateTo('/webpage-preview')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🌐 网页预览
              </button>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <div class="md:hidden">
            <button class="text-gray-600 hover:text-blue-600 p-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 可滚动的主内容区域 -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>
  </div>
</template>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止页面整体滚动 */
}

/* 确保主内容区域可以正常滚动 */
main {
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
}
</style>
