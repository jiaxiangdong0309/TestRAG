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
                <!-- 使用Markdown渲染器显示内容 -->
                <div v-html="renderMarkdown(message.content)" class="markdown-message"></div>

                <!-- 文件列表 -->
                <FileList v-if="message.files && message.files.length > 0" :files="message.files" />

                <!-- 流式加载指示器 -->
                <div v-if="message.isStreaming && !message.content" class="flex items-center mt-2">
                  <div class="flex space-x-1">
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
                    <div class="w-2 h-2 bg-green-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
                  </div>
                  <span class="text-xs text-green-600 ml-2">正在生成...</span>
                </div>

                <!-- 生成网页按钮 - 只在AI回复完成后显示 -->
                <div v-if="!message.isStreaming && message.content && message.type === 'bot'" class="mt-3 pt-3 border-t border-gray-200">
                  <button
                    @click="generateWebpageFromMessage(message)"
                    class="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    生成网页
                  </button>
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
        <div class="flex justify-end items-center pl-4 pr-4 pb-4">
          <!-- 发送按钮 -->
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
import { ref, nextTick, onMounted } from 'vue'
import { difyApi, DifyStreamError } from '../../api/modules/dify'
import MarkdownIt from 'markdown-it'
import FileList from '../ui/FileList.vue'

// 组件名称
defineOptions({
  name: 'ChatPanel'
})

// 创建 MarkdownIt 实例
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

// Markdown 渲染函数
const renderMarkdown = (content: string): string => {
  if (!content) return ''
  try {
    return md.render(content)
  } catch (error) {
    console.error('Markdown rendering error:', error)
    return content // 如果渲染失败，返回原始内容
  }
}

// 聊天记录类型
interface ChatMessage {
  type: 'user' | 'bot'
  content: string
  isStreaming?: boolean
  files?: Array<{
    id: string
    type: string
    belongs_to: string
    url: string
    conversation_id: string
  }>
}

// 响应式数据
const inputMessage = ref('北京java')
const chatHistory = ref<ChatMessage[]>([])
const isStreaming = ref(false)
const currentUser = ref('')

// 获取当前用户
const getCurrentUser = () => {
  const savedUsername = localStorage.getItem('username')
  return savedUsername || 'anonymous'
}

// 初始化时获取用户信息
onMounted(() => {
  currentUser.value = getCurrentUser()
})

// 监听 localStorage 变化
window.addEventListener('storage', () => {
  currentUser.value = getCurrentUser()
})

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
    console.log('发送聊天请求，参数:', {
      inputs: {
        step: "岗位筛选"
      },
      query: messageContent,
      response_mode: "streaming",
      conversation_id: "",
      user: currentUser.value,
      files: []
    })

    // 调用Dify API进行流式对话
    await difyApi.chat.createMessage(
      {
        inputs: {
          step: "岗位筛选",
        },
        query: messageContent,
        step: "岗位筛选",
        response_mode: "streaming",
        conversation_id: "",
        user: currentUser.value,
        files: []
      },
      {
        onTextChunk: (text: string) => {
          console.log('收到文本块:', text, '长度:', text.length)

          // 实现真正的流式展示效果 - 逐步追加文本
          if (!botMessage.content) {
            botMessage.content = text
            console.log('初始化机器人消息:', botMessage.content)
          } else {
            // 追加新的文本块，实现真正的流式效果
            botMessage.content += text
            console.log('追加文本后机器人消息:', botMessage.content)
          }

          // 强制触发Vue响应式更新
          chatHistory.value = [...chatHistory.value]
          console.log('聊天历史已更新，当前长度:', chatHistory.value.length)

          // 使用nextTick确保DOM更新
          nextTick(() => {
            // 滚动到最新消息
            const chatContainer = document.querySelector('.overflow-y-auto')
            if (chatContainer) {
              chatContainer.scrollTop = chatContainer.scrollHeight
              console.log('已滚动到底部')
            }
          })
        },
        onError: (error: DifyStreamError) => {
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
          console.log('流式响应完成')
          // 流式响应完成
          botMessage.isStreaming = false
          isStreaming.value = false
          clearTimeout(timeoutId)

          // 打印AI返回的完整数据
          console.log('AI返回数据完成:', {
            message: botMessage.content,
            timestamp: new Date().toISOString(),
            messageLength: botMessage.content?.length || 0,
            files: botMessage.files || [],
            fileCount: botMessage.files?.length || 0
          })

          // 如果有文件，单独打印文件信息
          if (botMessage.files && botMessage.files.length > 0) {
            console.log('📎 返回的文件信息:')
            botMessage.files.forEach((file, index) => {
              console.log(`  文件 ${index + 1}:`, {
                id: file.id,
                type: file.type,
                belongs_to: file.belongs_to,
                url: file.url,
                conversation_id: file.conversation_id
              })
            })
          } else {
            console.log('📎 本次回复没有返回文件')
          }
        },
        onFileReceived: (fileInfo) => {
          console.log('收到文件:', fileInfo)
          // 初始化文件数组（如果不存在）
          if (!botMessage.files) {
            botMessage.files = []
          }
          // 添加文件到消息中
          botMessage.files.push(fileInfo)
          // 强制触发Vue响应式更新
          chatHistory.value = [...chatHistory.value]
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

// 处理键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault() // 阻止默认的换行行为
    sendMessage()
  }
}

// 生成网页功能
const generateWebpageFromMessage = (message: ChatMessage) => {
  const content = message.content
  if (!content) {
    alert('没有内容可以生成网页。')
    return
  }

  const newWindow = window.open('', '_blank')
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>网页预览</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f9f9f9;
              padding: 20px;
              margin: 0;
            }
            .markdown-content {
              max-width: 800px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            h1, h2, h3 {
              color: #2c3e50;
              margin-top: 20px;
              margin-bottom: 10px;
            }
            p {
              margin-bottom: 15px;
            }
            code {
              background-color: #f0f0f0;
              padding: 3px 6px;
              border-radius: 4px;
              font-size: 0.9em;
            }
            pre {
              background-color: #f8f8f8;
              padding: 15px;
              border-radius: 8px;
              overflow-x: auto;
              font-size: 0.9em;
            }
            ul, ol {
              margin-left: 20px;
              margin-bottom: 15px;
            }
            li {
              margin-bottom: 8px;
            }
            blockquote {
              border-left: 4px solid #eee;
              padding-left: 15px;
              margin-left: 10px;
              margin-bottom: 15px;
              background-color: #f9f9f9;
              color: #666;
              font-style: italic;
            }
            a {
              color: #3498db;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="markdown-content">
            ${renderMarkdown(content)}
          </div>
        </body>
      </html>
    `)
    newWindow.document.close()
  } else {
    alert('无法打开新窗口进行预览。')
  }
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

/* Markdown 内容样式优化 */
.markdown-message {
  @apply text-gray-800;
}

.markdown-message :deep(p) {
  @apply mb-2 last:mb-0;
}

.markdown-message :deep(code) {
  @apply bg-gray-200 px-1.5 py-0.5 rounded text-sm font-mono;
}

.markdown-message :deep(pre) {
  @apply bg-gray-100 p-3 rounded-lg overflow-x-auto my-2 text-sm;
}

.markdown-message :deep(ul), .markdown-message :deep(ol) {
  @apply pl-4 mb-2;
}

.markdown-message :deep(li) {
  @apply mb-1;
}

.markdown-message :deep(blockquote) {
  @apply border-l-4 border-gray-300 pl-3 py-1 my-2 bg-gray-50 text-gray-600 italic text-sm;
}

.markdown-message :deep(h1), .markdown-message :deep(h2), .markdown-message :deep(h3) {
  @apply font-bold text-gray-900 mb-2 mt-3;
}

.markdown-message :deep(h1) {
  @apply text-lg;
}

.markdown-message :deep(h2) {
  @apply text-base;
}

.markdown-message :deep(h3) {
  @apply text-sm;
}
</style>
