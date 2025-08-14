<template>
  <div class="p-6 bg-white rounded-lg shadow-lg">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">Tailwind CSS 测试</h2>

    <div class="space-y-4">
      <!-- 颜色测试 -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          class="h-20 bg-blue-500 rounded flex items-center justify-center text-white font-semibold"
        >
          Blue
        </div>
        <div
          class="h-20 bg-green-500 rounded flex items-center justify-center text-white font-semibold"
        >
          Green
        </div>
        <div
          class="h-20 bg-red-500 rounded flex items-center justify-center text-white font-semibold"
        >
          Red
        </div>
        <div
          class="h-20 bg-yellow-500 rounded flex items-center justify-center text-white font-semibold"
        >
          Yellow
        </div>
      </div>

      <!-- 响应式测试 -->
      <div class="bg-gray-100 p-4 rounded">
        <p class="text-sm md:text-base lg:text-lg text-gray-700">
          这是一个响应式文本示例。在小屏幕上字体较小，在大屏幕上字体较大。
        </p>
      </div>

      <!-- 悬停效果测试 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          悬停按钮
        </button>
        <button
          class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          另一个按钮
        </button>
        <button
          class="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200"
        >
          第三个按钮
        </button>
      </div>

      <!-- 间距和布局测试 -->
      <div class="border border-gray-300 rounded-lg p-4">
        <h3 class="text-lg font-semibold mb-2">布局测试</h3>
        <div class="flex flex-col md:flex-row gap-4">
          <div class="flex-1 bg-gray-200 p-3 rounded">
            <p class="text-sm">左侧内容区域</p>
          </div>
          <div class="flex-1 bg-gray-200 p-3 rounded">
            <p class="text-sm">右侧内容区域</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 组件逻辑可以在这里添加
</script>
