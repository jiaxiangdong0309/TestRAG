<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="container mx-auto px-6 py-8">
      <!-- 主要内容区域 -->
      <div class="flex justify-center h-[calc(100vh-200px)] min-h-[600px]">
        <!-- 聊天功能区域 -->
        <div class="w-full max-w-5xl">
          <ChatPanel
            @generate-webpage="handleGenerateWebpage"
            @clear-chat="handleClearChat"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ChatPanel from '../../components/chat/ChatPanel.vue'

// 组件名称
defineOptions({
  name: 'ChatPage'
})

// 响应式数据
const isGeneratingWebpage = ref(false) // 是否正在生成网页

// 处理生成网页
const handleGenerateWebpage = () => {
  // 直接跳转到网页预览页面，在那里生成网页
  console.log('生成网页功能')
}

// 处理清空聊天记录
const handleClearChat = () => {
  // 这里可以添加清空逻辑
  console.log('清空聊天记录')
}
</script>

<style scoped>
/* 渐变文字效果 */
.bg-clip-text {
  -webkit-background-clip: text;
  background-clip: text;
}

/* 悬停效果 */
.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 按钮悬停动画 */
button:hover {
  transition: all 0.2s ease-in-out;
}
</style>
