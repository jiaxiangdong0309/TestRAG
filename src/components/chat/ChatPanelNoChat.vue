<template>
  <div class="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden min-h-[600px]">
    <!-- 聊天记录框 - 隐藏状态 -->
    <div class="flex-1 p-6 overflow-y-auto border-b border-gray-100">
      <div class="text-center text-gray-500 mt-20">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2"></path>
          </svg>
        </div>
        <p class="text-xl font-medium text-gray-600 mb-2">网页生成模式</p>
        <p class="text-sm text-gray-400">聊天界面已隐藏，专注于网页生成功能</p>
      </div>
    </div>

    <!-- 功能按钮 -->
    <div class="pl-4 pr-4 pt-4 bg-gray-50/50">
      <div class="flex gap-3">
        <!-- 联网搜索开关 -->
        <button
          @click="toggleSearchWeb"
          :class="[
            'btn-compact',
            isSearchWebEnabled ? 'btn-primary' : 'btn-secondary'
          ]"
        >
          {{ isSearchWebEnabled ? '联网搜索' : '联网搜索' }}
        </button>

        <button
          @click="clearChat"
          class="btn-compact btn-gray"
        >
          记录
        </button>
        <button
          @click="generateWebpage"
          class="btn-compact btn-primary"
        >
          生成网页
        </button>
        <button
          @click="runMockTest"
          class="btn-compact btn-secondary"
        >
          模拟测试
        </button>
      </div>
    </div>

    <!-- 输入框区域 -->
    <div class="p-6 bg-gray-50/50">
      <div class="relative">
        <textarea
          v-model="inputMessage"
          placeholder="请输入您的问题..."
          class="input-field"
          :style="{ height: '80px' }"
          @keydown.enter="handleKeyDown"
        ></textarea>
        <button
          @click="sendMessage"
          :disabled="!inputMessage.trim() || isStreaming"
          class="send-btn"
        >
          <!-- 发送图标 -->
          <svg v-if="!isStreaming" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
          <!-- 加载动画 -->
          <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { difyApi } from '../../api/modules/dify'

// 组件名称
defineOptions({
  name: 'ChatPanelNoChat'
})

// 定义事件
const emit = defineEmits<{
  generateWebpage: []
  clearChat: []
}>()

// 响应式数据
const inputMessage = ref('介绍一下科锐 200字')
const isStreaming = ref(false)
const isSearchWebEnabled = ref(false) // 是否开启联网搜索

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isStreaming.value) return

  // 清空输入框
  const messageContent = inputMessage.value.trim()
  inputMessage.value = ''

  // 设置流式状态
  isStreaming.value = true

  // 设置超时机制，防止API无响应
  const timeoutId = setTimeout(() => {
    isStreaming.value = false
  }, 120000) // 2分钟超时

  try {
    // 调用Dify API进行流式对话
    await difyApi.stream.invoke(
      {
        inputs: {
          question: messageContent,
          history_message: JSON.stringify([]),
          is_search_web: isSearchWebEnabled.value ? 1 : 0,
        },
        response_mode: "streaming",
        user: "abc-123",
      },
      {
        onTextChunk: (text: string) => {
          // 这里可以处理流式响应，但不显示在界面上
          console.log('收到流式响应:', text)
        },
        onError: (error) => {
          console.error('Dify API error:', error)
          isStreaming.value = false
          clearTimeout(timeoutId)
        },
        onComplete: () => {
          // 流式响应完成
          isStreaming.value = false
          clearTimeout(timeoutId)
          console.log('流式响应完成')
        }
      }
    )
  } catch (error) {
    console.error('Failed to call Dify API:', error)
    isStreaming.value = false
    clearTimeout(timeoutId)
  }
}

// 清空聊天记录
const clearChat = () => {
  emit('clearChat')
}

// 处理键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault() // 阻止默认的换行行为
    sendMessage()
  }
}

// 生成网页
const generateWebpage = () => {
  emit('generateWebpage')
}

// 切换联网搜索状态
const toggleSearchWeb = () => {
  isSearchWebEnabled.value = !isSearchWebEnabled.value
}

// 模拟测试：使用固定模板聊天记录生成网页
const runMockTest = async () => {
  console.log('运行模拟测试')
}
</script>

<style scoped>
/* 紧凑按钮样式 */
.btn-compact {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm;
}

/* 主要按钮样式 */
.btn-primary {
  @apply bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700;
}

/* 次要按钮样式 */
.btn-secondary {
  @apply bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600;
}

/* 灰色按钮样式 */
.btn-gray {
  @apply bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700;
}

/* 输入框样式 */
.input-field {
  @apply w-full border-0 bg-white rounded-xl px-4 py-4 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-400 text-lg shadow-lg transition-all duration-200;
}

/* 发送按钮样式 */
.send-btn {
  @apply absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center;
}

/* 玻璃态效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style>
