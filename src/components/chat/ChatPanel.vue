<template>
  <div class="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden min-h-[600px]">
    <!-- 聊天记录框 -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div v-if="chatHistory.length === 0" class="text-center text-gray-500 mt-20">
        <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
          <svg class="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
        </div>
        <p class="text-xl font-medium text-gray-600 mb-2">开始您的对话吧！</p>
        <p class="text-sm text-gray-400">AI助手随时为您服务</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="(message, index) in chatHistory"
          :key="index"
          class="flex gap-3 animate-fade-in"
        >
          <!-- 用户消息 -->
          <div v-if="message.type === 'user'" class="flex-1 flex justify-end">
            <div class="flex items-start gap-3 max-w-[80%]">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl px-4 py-2 shadow-lg">
                <p class="text-white">{{ message.content }}</p>
              </div>
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg">
                我
              </div>
            </div>
          </div>

          <!-- 机器人消息 -->
          <div v-else class="flex-1 flex justify-start">
            <div class="flex items-start gap-3 max-w-[80%]">
              <div class="bg-gradient-to-r from-green-500 to-green-600 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-lg">
                AI
              </div>
              <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-2 shadow-lg border border-gray-200">
                <p class="text-gray-800">{{ message.content }}</p>
                <!-- 流式加载指示器 -->
                <div v-if="message.isStreaming && !message.content" class="flex items-center mt-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                  <span class="text-xs text-green-600 ml-2">正在生成...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入框区域 -->
    <div class="p-6 bg-gray-50/50">
      <!-- 输入框和按钮的包裹框 -->
      <div class="border border-gray-200 rounded-xl bg-white shadow-lg">
        <!-- 输入框 -->
        <div class="p-4">
          <textarea
            v-model="inputMessage"
            placeholder="请输入您的问题..."
            class="input-field-no-border"
            :style="{ height: '80px' }"
            @keydown.enter="handleKeyDown"
          ></textarea>
        </div>

        <!-- 按钮区域 -->
        <div class="flex justify-between items-center pl-4 pr-4 pb-4">
          <!-- 左侧功能按钮 -->
          <div class="flex gap-3">
            <!-- 联网搜索开关 -->
            <button
              @click="toggleSearchWeb"
              :class="[
                'btn-compact',
                isSearchWebEnabled ? 'btn-primary' : 'btn-secondary',
                'flex items-center gap-1'
              ]"
            >
              <img src="../../assets/chat/web_open.svg" alt="联网搜索" class="w-5 h-5" />
              {{ isSearchWebEnabled ? '联网' : '联网' }}
            </button>

            <button
              @click="clearChat"
              :disabled="chatHistory.length === 0"
              class="btn-compact btn-gray flex items-center gap-1"
            >
              <img src="../../assets/chat/clear_open.svg" alt="记录" class="w-5 h-5" />
              记录
            </button>
            <button
              @click="generateWebpage"
              :disabled="chatHistory.length === 0"
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

          <!-- 右侧发送按钮 -->
          <button
            @click="sendMessage"
            :disabled="!inputMessage.trim() || isStreaming"
            class="send-btn-large"
          >
            <!-- 发送图标 -->
            <img v-if="!isStreaming && inputMessage.trim()" src="../../assets/chat/send_open.svg" alt="发送" class="w-5 h-5" />
            <img v-else-if="!isStreaming && !inputMessage.trim()" src="../../assets/chat/send_close.svg" alt="发送" class="w-5 h-5" />
            <!-- 加载动画 -->
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { difyApi } from '../../api/modules/dify'

// 组件名称
defineOptions({
  name: 'ChatPanel'
})

// 聊天记录类型
interface ChatMessage {
  type: 'user' | 'bot'
  content: string
  isStreaming?: boolean
}

// 定义事件
const emit = defineEmits<{
  generateWebpage: []
  clearChat: []
}>()

// 响应式数据
const inputMessage = ref('介绍一下科锐 200字')
const chatHistory = ref<ChatMessage[]>([])
const isStreaming = ref(false)
const isSearchWebEnabled = ref(false) // 是否开启联网搜索

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isStreaming.value) return

  // 添加用户消息
  const userMessage: ChatMessage = {
    type: 'user',
    content: inputMessage.value.trim(),
  }
  chatHistory.value.push(userMessage)

  // 清空输入框
  const messageContent = inputMessage.value.trim()
  inputMessage.value = ''

  // 添加机器人消息（流式显示）
  const botMessage: ChatMessage = {
    type: 'bot',
    content: '',
    isStreaming: true
  }
  chatHistory.value.push(botMessage)

  // 设置流式状态
  isStreaming.value = true

  // 设置超时机制，防止API无响应
  const timeoutId = setTimeout(() => {
    if (botMessage.isStreaming) {
      botMessage.content = '抱歉，请求超时，请稍后重试。'
      botMessage.isStreaming = false
      isStreaming.value = false
    }
  }, 120000) // 2分钟超时

  try {
    // 调用Dify API进行流式对话
    await difyApi.quick.stream(
      {
        inputs: {
          question: messageContent,
          history_message: JSON.stringify(chatHistory.value.map(msg => ({
            type: msg.type,
            content: msg.content
          }))),
          is_search_web: isSearchWebEnabled.value ? 1 : 0,
        },
        response_mode: "streaming",
        user: "abc-123",
      },
      {
        onTextChunk: (text: string) => {
          // 实现真正的流式展示效果 - 逐步追加文本
          if (!botMessage.content) {
            botMessage.content = text
          } else {
            // 追加新的文本块，实现真正的流式效果
            botMessage.content += text
          }

          // 强制触发Vue响应式更新
          chatHistory.value = [...chatHistory.value]

          // 使用nextTick确保DOM更新
          nextTick(() => {
            // 滚动到最新消息
            const chatContainer = document.querySelector('.overflow-y-auto')
            if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight
            }
          })
        },
        onError: (error) => {
          console.error('Dify API error:', error)
          let errorMessage = '抱歉，发生了错误，请稍后重试。'

          if (error.message.includes('HTTP error')) {
            if (error.message.includes('401')) {
              errorMessage = '认证失败，请检查API配置。'
            } else if (error.message.includes('403')) {
              errorMessage = '权限不足，请检查API权限。'
            } else if (error.message.includes('404')) {
              errorMessage = '接口不存在，请检查API地址。'
            } else if (error.message.includes('500')) {
              errorMessage = '服务器内部错误，请稍后重试。'
            } else if (error.message.includes('timeout')) {
              errorMessage = '请求超时，请检查网络连接。'
            }
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = '网络连接失败，请检查网络设置。'
          }

          botMessage.content = errorMessage
          botMessage.isStreaming = false
          isStreaming.value = false
          clearTimeout(timeoutId)
        },
        onComplete: () => {
          // 流式响应完成
          botMessage.isStreaming = false
          isStreaming.value = false
          clearTimeout(timeoutId)

          // 打印AI返回的完整数据
          console.log('AI返回数据完成:', {
            message: botMessage.content,
            timestamp: new Date().toISOString(),
            messageLength: botMessage.content?.length || 0
          })
        }
      }
    )
  } catch (error) {
    console.error('Failed to call Dify API:', error)
    let errorMessage = '抱歉，网络连接失败，请检查网络后重试。'

    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = '请求超时，请检查网络连接。'
      } else if (error.message.includes('network')) {
        errorMessage = '网络连接失败，请检查网络设置。'
      } else if (error.message.includes('abort')) {
        errorMessage = '请求被取消，请重试。'
      }
    }

    botMessage.content = errorMessage
    botMessage.isStreaming = false
    isStreaming.value = false
    clearTimeout(timeoutId)
  }
}

// 清空聊天记录
const clearChat = () => {
  chatHistory.value = []
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
  if (chatHistory.value.length === 0) return
  emit('generateWebpage')
}

// 切换联网搜索状态
const toggleSearchWeb = () => {
  isSearchWebEnabled.value = !isSearchWebEnabled.value
}

// 模拟测试：使用固定模板聊天记录生成网页（不写入左侧聊天记录）
const runMockTest = async () => {
  // 这里可以添加模拟测试逻辑
  console.log('运行模拟测试')
}
</script>

<style scoped>
/* 可复用的按钮基础样式 */
.btn-base {
  @apply px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2;
}

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
  @apply bg-gradient-to-r from-gray-500 to-gray-600 text-white hover:from-gray-600 hover:to-gray-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg;
}

/* 输入框样式 */
.input-field {
  @apply w-full border-0 bg-white rounded-xl px-4 py-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-400 text-lg shadow-lg transition-all duration-200;
}

/* 无边框输入框样式 */
.input-field-no-border {
  @apply w-full border-0 bg-transparent resize-none focus:outline-none focus:ring-0 text-gray-900 placeholder-gray-400 text-lg transition-all duration-200;
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* 防止输入框边框闪烁的额外规则 */
.input-field-no-border:focus,
.input-field-no-border:active,
.input-field-no-border:hover {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
  background: transparent !important;
}

/* 发送按钮样式 */
.send-btn {
  @apply absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center;
}

/* 大号发送按钮样式 */
.send-btn-large {
  @apply w-12 h-12 text-blue-500 disabled:text-gray-300 disabled:cursor-not-allowed hover:text-blue-600 transition-all duration-200 flex items-center justify-center;
}

/* 自定义滚动条样式 */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 动画效果 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* 玻璃态效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}

/* 流式加载动画 */
@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.animate-bounce {
  animation: bounce 1.4s ease-in-out infinite both;
}
</style>
