<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="container mx-auto px-6 py-8">


      <!-- 主要内容区域 -->
      <div class="flex gap-8 h-[calc(100vh-200px)] min-h-[600px]">
        <!-- 左边聊天框 -->
        <div class="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden min-h-[600px]">
          <!-- 聊天记录框 -->
          <div class="flex-1 p-6 overflow-y-auto border-b border-gray-100">
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
                    <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl px-4 py-3 shadow-lg">
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
                    <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl px-4 py-3 shadow-lg border border-gray-200">
                      <p class="text-gray-800">{{ message.content }}</p>
                      <!-- 流式加载指示器 -->
                      <div v-if="message.isStreaming" class="flex items-center mt-2">
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
                {{ isSearchWebEnabled ? '联网搜索已开启' : '联网搜索已关闭' }}
              </button>

              <button
                @click="clearChat"
                :disabled="chatHistory.length === 0"
                class="btn-compact btn-gray"
              >
                清空聊天记录
              </button>
              <button
                @click="generateWebpage"
                :disabled="chatHistory.length === 0"
                class="btn-compact btn-primary"
              >
                {{ showContentArea ? '隐藏网页' : '生成网页' }}
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

        <!-- 右边展示框 -->
        <div v-if="showContentArea || true" class="w-1/2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 flex flex-col overflow-hidden min-h-[600px]">

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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { difyApi } from '../../api/modules/dify'

// 组件名称
defineOptions({
  name: 'SearchPage'
})

// 聊天记录类型
interface ChatMessage {
  type: 'user' | 'bot'
  content: string
  isStreaming?: boolean
}

// 响应式数据
const inputMessage = ref('介绍一下科锐 200字')
const chatHistory = ref<ChatMessage[]>([])
const showContentArea = ref(false) // 默认隐藏右侧内容区域
const isStreaming = ref(false)
const isSearchWebEnabled = ref(false) // 是否开启联网搜索
const isGeneratingWebpage = ref(false) // 是否正在生成网页
const webpageContent = ref('') // 生成的网页内容
// 流式渲染：增量缓冲与每秒节流刷新
const chunkBuffer = ref('')
let flushTimer: number | undefined

const startFlushTimer = () => {
  if (flushTimer) {
    clearInterval(flushTimer)
    flushTimer = undefined
  }
  flushTimer = window.setInterval(() => {
    if (chunkBuffer.value) {
      webpageContent.value += chunkBuffer.value
      chunkBuffer.value = ''
    }
  }, 1000)
}

const stopFlushTimer = (flushRemaining = true) => {
  if (flushTimer) {
    clearInterval(flushTimer)
    flushTimer = undefined
  }
  if (flushRemaining && chunkBuffer.value) {
    webpageContent.value += chunkBuffer.value
    chunkBuffer.value = ''
  }
}

// 模拟测试用固定聊天记录（不写入左侧真实聊天框）
const mockChatHistory: ChatMessage[] = [
  { type: 'user', content: '我想做一个把聊天内容自动生成网页的工具，给我一个产品着陆页的大纲。' },
  { type: 'bot', content: '可以。建议包含：主视觉（价值主张）、核心功能、使用流程、示例代码、对比表、FAQ、CTA 按钮。', isStreaming: false },

  { type: 'user', content: '这个产品叫 Talk2Page，目标用户是非技术和轻量技术用户，比如产品经理、内容运营、独立开发者。' },
  { type: 'bot', content: '了解。目标受众：产品经理、内容运营、独立开发者与前端工程师。定位：把对话快速转成可分享网页。', isStreaming: false },

  { type: 'user', content: '核心卖点有：结构化输出稳定、单文件 HTML 可离线分享、严格内容安全清洗、内置现代风格主题、支持一键下载。' },
  { type: 'bot', content: '已记录核心卖点：1) 结构化输出稳定；2) 单文件可离线分享；3) 安全清洗防注入；4) 现代风格主题；5) 一键下载与分享。', isStreaming: false },

  { type: 'user', content: '简单说下使用流程：第一步从聊天生成 PageData；第二步把 PageData 渲染成 HTML；最后下载或复制即可。' },
  { type: 'bot', content: '使用流程：① 对话→PageData（结构化 JSON）；② PageData→现代风格 HTML；③ 下载/复制单文件分享。', isStreaming: false },

  { type: 'user', content: '最好有个示例代码，展示如何通过 HTTP 接口提交 PageData 并拿回 HTML。' },
  { type: 'bot', content: '示例（伪接口）：POST /render { pageData } → 返回 text/html。可给出 fetch 的 JavaScript 片段。', isStreaming: false },

  { type: 'user', content: '做一个对比表：结构化→模板渲染 VS 模型直出 HTML，列出优点和注意点。' },
  { type: 'bot', content: '对比建议：结构化→模板渲染：可控一致、安全、可维护；注意需定义 Schema。模型直出：一次性快但结构漂移风险大、需强清洗。', isStreaming: false },

  { type: 'user', content: '风格希望偏技术冷色，Hero 可以用 centered 或 visual，按钮文案是“立即生成”。' },
  { type: 'bot', content: '风格记录：技术冷色（蓝/青），Hero 使用 centered/visual，主按钮文案：立即生成。', isStreaming: false },

  { type: 'user', content: '给我 3 个 FAQ：是否离线可用？是否安全？是否支持自定义样式？' },
  { type: 'bot', content: 'FAQ 草案：1) 离线：是，单文件内联；2) 安全：严格白名单清洗；3) 样式：支持替换主题变量与组件变体。', isStreaming: false },

  { type: 'user', content: '能否给个基础价格信息？先占位：Free、Pro、Team，价格以后确定。' },
  { type: 'bot', content: '可在表格中列 Free/Pro/Team 三档，功能递增，价格暂用 TBD 占位，避免臆造。', isStreaming: false },

  { type: 'user', content: '最终页面要有 CTA 区块和一个下载按钮占位（没有真实链接也行）。' },
  { type: 'bot', content: '会在底部加入 CTA 卡片，主按钮“立即生成”，次按钮“下载示例”（href 可先设为 #）。', isStreaming: false },
]

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

          // 保持流式状态，直到onComplete被调用
          // 注意：不要在这里清除超时，让超时机制正常工作
        },


        onError: (error) => {
          console.error('Dify API error:', error)

          // 根据错误类型提供更友好的错误信息
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
          clearTimeout(timeoutId) // 清除超时
        },
        onComplete: () => {
          // 流式响应完成
          botMessage.isStreaming = false
          isStreaming.value = false
          clearTimeout(timeoutId) // 清除超时

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

    // 根据错误类型提供更友好的错误信息
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
    clearTimeout(timeoutId) // 清除超时
  }
}

// 清空聊天记录
const clearChat = () => {
  chatHistory.value = []
  showContentArea.value = false
  isGeneratingWebpage.value = false
  webpageContent.value = ''
}

// 处理键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault() // 阻止默认的换行行为
    sendMessage()
  }
}

// 生成网页
const generateWebpage = async () => {
  if (chatHistory.value.length === 0) return

  // 如果已经显示内容区域，则隐藏
  if (showContentArea.value) {
    showContentArea.value = false
    return
  }

  // 显示内容区域
  showContentArea.value = true

  // 添加用户消息到聊天记录
  const userMessage: ChatMessage = {
    type: 'user',
    content: '请生成一个网页',
  }
  chatHistory.value.push(userMessage)

  // 添加正在生成的卡片到聊天记录
  const generatingMessage: ChatMessage = {
    type: 'bot',
    content: '正在生成网页，请稍候...',
  }
  chatHistory.value.push(generatingMessage)

  // 设置生成状态
  isGeneratingWebpage.value = true
  webpageContent.value = ''
  chunkBuffer.value = ''
  startFlushTimer()

  // 设置超时机制
  const timeoutId = setTimeout(() => {
    if (isGeneratingWebpage.value) {
      isGeneratingWebpage.value = false
      // 更新聊天记录中的消息
      generatingMessage.content = '抱歉，请求超时，请稍后重试。'
    }
  }, 120000) // 2分钟超时

  try {
    // 调用Dify API进行流式对话，设置is_create_html为1
    await difyApi.quick.stream(
      {
        inputs: {
          question: '请生成一个网页',
          history_message: JSON.stringify(chatHistory.value.map(msg => ({
            type: msg.type,
            content: msg.content
          }))),
          is_search_web: isSearchWebEnabled.value ? 1 : 0,
          is_create_html: 1, // 新增参数，设置为1表示生成网页
        },
        response_mode: "streaming",
        user: "abc-123",
      },
      {
        onTextChunk: (text: string) => {
          // 在缓冲区累积，由定时器合并到展示区域（1秒节流）
          chunkBuffer.value += text
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

          // 更新聊天记录中的消息
          generatingMessage.content = errorMessage
          isGeneratingWebpage.value = false
          stopFlushTimer(true)
          clearTimeout(timeoutId)
        },
                onComplete: () => {
          // 生成完成
          isGeneratingWebpage.value = false
          stopFlushTimer(true)
          clearTimeout(timeoutId)

          // 更新聊天记录中的消息
          generatingMessage.content = '网页已生成，请在右侧查看'

          // 打印AI返回的网页数据完成
          console.log('AI网页生成完成:', {
            message: '网页已生成，请在右侧查看',
            timestamp: new Date().toISOString(),
            webpageContent: webpageContent.value
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

    // 更新聊天记录中的消息
    generatingMessage.content = errorMessage
    isGeneratingWebpage.value = false
    stopFlushTimer(true)
    clearTimeout(timeoutId)
  }
}

// 切换联网搜索状态
const toggleSearchWeb = () => {
  isSearchWebEnabled.value = !isSearchWebEnabled.value
}

// 模拟测试：使用固定模板聊天记录生成网页（不写入左侧聊天记录）
const runMockTest = async () => {
  // 显示右侧内容区域
  showContentArea.value = true

  // 设置生成状态
  isGeneratingWebpage.value = true
  webpageContent.value = ''
  chunkBuffer.value = ''
  startFlushTimer()

  // 超时处理（2分钟）
  const timeoutId = setTimeout(() => {
    if (isGeneratingWebpage.value) {
      isGeneratingWebpage.value = false
      webpageContent.value = '<div class="text-red-600">请求超时，请稍后重试。</div>'
    }
  }, 120000)

  try {
    await difyApi.quick.stream(
      {
        inputs: {
          question: '请生成一个网页',
          history_message: JSON.stringify(
            mockChatHistory.map(msg => ({ type: msg.type, content: msg.content }))
          ),
          is_search_web: isSearchWebEnabled.value ? 1 : 0,
          is_create_html: 1,
        },
        response_mode: 'streaming',
        user: 'abc-123',
      },
      {
        onTextChunk: (text: string) => {
          // 在缓冲区累积，由定时器合并到展示区域（1秒节流）
          chunkBuffer.value += text
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

          webpageContent.value = `<div class="text-red-600">${errorMessage}</div>`
          isGeneratingWebpage.value = false
          stopFlushTimer(true)
          clearTimeout(timeoutId)
        },
        onComplete: () => {
          isGeneratingWebpage.value = false
          stopFlushTimer(true)
          clearTimeout(timeoutId)

          // 打印AI返回的模拟测试数据完成
          console.log('AI模拟测试数据完成:', {
            timestamp: new Date().toISOString(),
            webpageContent: webpageContent.value,
            messageLength: webpageContent.value?.length || 0
          })
        },
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

    webpageContent.value = `<div class="text-red-600">${errorMessage}</div>`
    isGeneratingWebpage.value = false
    stopFlushTimer(true)
    clearTimeout(timeoutId)
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

/* 小按钮基础样式 */
.btn-small {
  @apply px-3 py-1 text-sm rounded transition-colors;
}

/* 蓝色小按钮 */
.btn-blue {
  @apply bg-blue-500 text-white hover:bg-blue-600;
}

/* 红色小按钮 */
.btn-red {
  @apply bg-red-500 text-white hover:bg-red-600;
}

/* 输入框样式 */
.input-field {
  @apply w-full border-0 bg-white rounded-xl px-4 py-4 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-gray-900 placeholder-gray-400 text-lg shadow-lg transition-all duration-200;
}

/* 发送按钮样式 */
.send-btn {
  @apply absolute bottom-3 right-3 w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center;
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

/* 输入框焦点效果 */
textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

/* 流式文本打字机效果 */
.typing-effect {
  overflow: hidden;
  border-right: 2px solid #10b981;
  white-space: nowrap;
  animation: typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite;
}

@keyframes typing {
  from { width: 0; }
  to { width: 100%; }
}

@keyframes blink-caret {
  from, to { border-color: transparent; }
  50% { border-color: #10b981; }
}

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
</style>
