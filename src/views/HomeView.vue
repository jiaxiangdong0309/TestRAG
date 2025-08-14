<script setup lang="ts">
// 组件使用 <script setup> 语法，无需显式导入
</script>

<template>
  <main class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-8">
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">TestRAG 项目</h1>
        <p class="text-xl text-gray-600">使用 Vue 3 + Vite + Tailwind CSS 构建</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Vue 3</h3>
          <p class="text-gray-600">使用最新的 Vue 3 Composition API</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Vite</h3>
          <p class="text-gray-600">快速的开发服务器和构建工具</p>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 class="text-xl font-semibold text-gray-800 mb-3">Tailwind CSS</h3>
          <p class="text-gray-600">实用优先的 CSS 框架</p>
        </div>
      </div>

      <div class="mb-8">
        <TailwindTest />
      </div>

      <div class="bg-white rounded-lg shadow-md p-6">
        <TheWelcome />
      </div>
    </div>
  </main>
</template>
