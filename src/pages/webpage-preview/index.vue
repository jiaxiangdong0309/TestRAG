<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <div class="container mx-auto px-6 py-8">

      <!-- 主要内容区域 -->
      <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 min-h-[600px]">
        <div class="p-4">
          <!-- 仅在生成且尚无任何内容且未进入流式iframe时，显示纯等待 -->
          <div v-if="isGeneratingWebpage && !webpageContent && !isStreamingIframe" class="w-full h-full flex items-center justify-center min-h-[500px]">
            <div class="text-center">
              <div class="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p class="text-gray-600">正在生成网页...</p>
              <p class="text-sm text-gray-400 mt-2">请稍候，AI正在为您创建网页内容</p>
            </div>
          </div>

          <!-- 网页内容展示（生成中也增量展示） -->
          <div v-else-if="webpageContent || isStreamingIframe" class="w-full">
            <div class="mb-4 p-3 rounded-lg" :class="isGeneratingWebpage ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'">
              <div class="flex items-center gap-2" :class="isGeneratingWebpage ? 'text-blue-700' : 'text-green-700'">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!isGeneratingWebpage" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                <span class="font-medium">{{ isGeneratingWebpage ? '正在生成（内容将持续更新）' : '网页内容已生成' }}</span>
              </div>
            </div>
            <div class="bg-white border border-gray-200 rounded-lg p-4 min-h-[500px] overflow-y-auto">
              <!-- 当内容是完整HTML文档时，用 iframe 隔离渲染，避免样式被覆盖 -->
              <iframe
                v-if="isStreamingIframe || shouldUseIframe"
                :srcdoc="!isStreamingIframe && !isGeneratingWebpage ? webpageContent : undefined"
                ref="iframeRef"
                class="w-full min-h-[500px] rounded-md border-0"
              ></iframe>
              <div v-else v-html="webpageContent" class="prose max-w-none"></div>
            </div>
          </div>

          <!-- 默认状态 -->
          <div v-else class="w-full h-full flex items-center justify-center min-h-[500px]">
            <div class="text-center text-gray-500">
              <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2"></path>
                </svg>
              </div>
              <p class="text-xl font-medium text-gray-600 mb-2">暂无网页内容</p>
              <p class="text-sm text-gray-400">请在聊天页面生成网页后查看预览</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部输入框区域 -->
      <div class="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-6">
        <div class="text-center mb-4">
          <h3 class="text-lg font-semibold text-gray-800">快速生成网页内容</h3>
          <p class="text-sm text-gray-600">输入您的需求，AI将为您生成网页内容</p>
        </div>

        <!-- 输入框和按钮 -->
        <div class="border border-gray-200 rounded-xl bg-white shadow-lg">
          <div class="p-4">
            <textarea
              v-model="inputMessage"
              placeholder="请输入您想要生成的网页内容描述，例如：创建一个关于人工智能的科技博客页面..."
              class="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
              :style="{ height: '80px' }"
              @keydown.enter="handleKeyDown"
            ></textarea>
          </div>

          <div class="flex justify-between items-center px-4 pb-4">
            <div class="flex gap-3">
              <button
                @click="toggleSearchWeb"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm flex items-center gap-1',
                  isSearchWebEnabled ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                ]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                {{ isSearchWebEnabled ? '联网' : '联网' }}
              </button>
              <button
                @click="toggleLocalMock"
                :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-sm',
                  isLocalMockEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white'
                ]"
              >
                本地流
              </button>
            </div>

            <button
              @click="generateWebpageFromInput"
              :disabled="!inputMessage.trim() || isGeneratingWebpage"
              class="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              <svg v-if="!isGeneratingWebpage" class="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              <svg v-else class="w-4 h-4 inline mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isGeneratingWebpage ? '生成中...' : '生成网页' }}
            </button>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="text-center mt-6 space-x-4">
        <button
          @click="goToChat"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          前往聊天页面
        </button>
        <button
          @click="refreshContent"
          class="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          刷新内容
        </button>
        <button
          @click="showLocalTemplate"
          class="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
        >
          展示本地模板
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { difyApi } from '../../api/modules/dify'
import templateHtml from './template.html?raw'

// 组件名称
defineOptions({
  name: 'WebpagePreviewPage'
})

const router = useRouter()

// 响应式数据
const isGeneratingWebpage = ref(false) // 是否正在生成网页
const webpageContent = ref('') // 生成的网页内容
const streamingHtml = ref('') // 流式期间的HTML缓冲，不触发模板重渲染
const inputMessage = ref(`[
  { "type": "user", "content": "我想做一个把聊天内容自动生成网页的工具，给我一个产品着陆页的大纲。" },
  { "type": "bot", "content": "可以。建议包含：主视觉（价值主张）、核心功能、使用流程、示例代码、对比表、FAQ、CTA 按钮。" },
  { "type": "user", "content": "这个产品叫 Talk2Page，目标用户是非技术和轻量技术用户，比如产品经理、内容运营、独立开发者。" },
  { "type": "bot", "content": "了解。目标受众：产品经理、内容运营、独立开发者与前端工程师。定位：把对话快速转成可分享网页。" },
  { "type": "user", "content": "核心卖点有：结构化输出稳定、单文件 HTML 可离线分享、严格内容安全清洗、内置现代风格主题、支持一键下载。" },
  { "type": "bot", "content": "已记录核心卖点：1) 结构化输出稳定；2) 单文件可离线分享；3) 安全清洗防注入；4) 现代风格主题；5) 一键下载与分享。" }
]`)
const isSearchWebEnabled = ref(false) // 是否开启联网搜索
const isLocalMockEnabled = ref(false) // 是否使用本地流式模拟

// 当内容包含完整HTML结构时，使用 iframe 渲染
const shouldUseIframe = computed(() => /<html|<head|<body|<style/i.test(webpageContent.value))
// 流式iframe渲染：实时展示页面构建过程
const isStreamingIframe = ref(false)
const iframeRef = ref<HTMLIFrameElement | null>(null)
const iframeReady = ref(false)
const pendingIframeChunks: string[] = []

// 进入流式iframe模式：等待DOM挂载后初始化iframe文档
const beginStreamingIframe = async () => {
  if (isStreamingIframe.value) return
  isStreamingIframe.value = true
  iframeReady.value = false
  // 等待 iframe 节点渲染并完成 ref 绑定
  await nextTick()
  if (iframeRef.value) {
    // 清空 srcdoc，避免浏览器重置文档
    try { iframeRef.value.srcdoc = '' } catch {}
  }
  initIframeDocument()
}

// 监听流式状态变化，动态管理iframe的srcdoc
watch(isStreamingIframe, (newVal) => {
  console.log('🔄 isStreamingIframe状态变化:', newVal)
  if (newVal && iframeRef.value) {
    // 流式渲染开始时，清空srcdoc，确保JavaScript能操作iframe内容
    console.log('🧹 清空iframe srcdoc，准备JavaScript操作')
    iframeRef.value.srcdoc = ''
  }
})

// 初始化 iframe 文档结构
const initIframeDocument = () => {
  console.log('🏗️ 开始初始化iframe文档')
  const frame = iframeRef.value
  if (!frame) {
    console.log('❌ iframe引用不存在')
    return
  }

  const doc = frame.contentDocument
  if (!doc) {
    console.log('❌ iframe contentDocument不存在')
    return
  }

  console.log('✅ iframe和contentDocument都存在，开始创建HTML结构')

  // 创建基础HTML结构
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>正在生成...</title>
      <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        .loading { color: #666; font-style: italic; }
        .generated-content { animation: fadeIn 0.3s ease-in; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      </style>
    </head>
    <body>
      <div id="content">
        <div class="loading">正在生成页面内容...</div>
      </div>
    </body>
    </html>
  `

  doc.open()
  doc.write(html)
  doc.close()
  console.log('✅ iframe HTML结构创建完成')
  iframeReady.value = true
  // 初始化完成后，flush积压片段
  while (pendingIframeChunks.length > 0) {
    const chunk = pendingIframeChunks.shift()!
    appendChunkToIframe(chunk)
  }
}

// 低层追加：要求iframe已经ready；若发现异常会降级为重新初始化并入队
const appendChunkToIframe = (htmlChunk: string) => {
  const frame = iframeRef.value
  if (!frame || !frame.contentDocument) {
    console.log('❌ append时frame/doc缺失，入队等待')
    iframeReady.value = false
    pendingIframeChunks.push(htmlChunk)
    beginStreamingIframe()
    return
  }
  const doc = frame.contentDocument
  const contentDiv = doc.getElementById('content')
  if (!contentDiv) {
    console.log('❌ append时content缺失，重新初始化并入队')
    iframeReady.value = false
    pendingIframeChunks.push(htmlChunk)
    initIframeDocument()
    return
  }

  // 移除加载提示
  const loadingEl = contentDiv.querySelector('.loading')
  if (loadingEl) loadingEl.remove()

  // 检测HTML标签类型并智能插入
  if (htmlChunk.includes('<head') || htmlChunk.includes('<html')) {
    return
  }
  if (htmlChunk.includes('<style')) {
    const styleMatch = htmlChunk.match(/<style[^>]*>([\s\S]*?)<\/style>/i)
    if (styleMatch) {
      const styleContent = styleMatch[1]
      const existingStyle = doc.querySelector('style')
      if (existingStyle) existingStyle.textContent += styleContent
      else {
        const newStyle = doc.createElement('style')
        newStyle.textContent = styleContent
        doc.head.appendChild(newStyle)
      }
    }
    return
  }
  if (htmlChunk.includes('<body')) {
    const bodyMatch = htmlChunk.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
    if (bodyMatch) contentDiv.innerHTML = bodyMatch[1]
    return
  }

  if (htmlChunk.trim()) {
    const tempDiv = doc.createElement('div')
    tempDiv.innerHTML = htmlChunk
    tempDiv.className = 'generated-content'
    contentDiv.appendChild(tempDiv)
    // 保持滚动至底部
    try { frame.scrollTop = frame.scrollHeight } catch {}
  }
}

// 实时流式渲染HTML内容到iframe
const streamRenderToIframe = (htmlChunk: string) => {
  console.log('🚀 streamRenderToIframe 被调用，HTML片段:', htmlChunk.substring(0, 100) + '...')

  if (!iframeReady.value) {
    console.log('⏳ iframe未就绪，入队等待。片段长度:', htmlChunk.length)
    pendingIframeChunks.push(htmlChunk)
    return
  }
  appendChunkToIframe(htmlChunk)
}

// 前往聊天页面
const goToChat = () => {
  router.push('/chat')
}

// 切换联网搜索状态
const toggleSearchWeb = () => {
  isSearchWebEnabled.value = !isSearchWebEnabled.value
}

// 切换本地流式模拟
const toggleLocalMock = () => {
  isLocalMockEnabled.value = !isLocalMockEnabled.value
}

// 处理键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    generateWebpageFromInput()
  }
}

// 展示本地HTML模板
const showLocalTemplate = () => {
  webpageContent.value = templateHtml
  localStorage.setItem('webpageContent', templateHtml)
  // 进入本地模板预览时，确保停止流式刷新
  // stopIframeFlushTimer() // This line is removed as per the edit hint
}

// 从输入框生成网页内容
const generateWebpageFromInput = async () => {
  if (!inputMessage.value.trim() || isGeneratingWebpage.value) return

  console.log('🚀 开始生成网页内容')
  isGeneratingWebpage.value = true
  webpageContent.value = ''
  streamingHtml.value = ''
  isStreamingIframe.value = false
  iframeReady.value = false

  // 确保iframe的srcdoc被清空
  if (iframeRef.value) {
    console.log('🧹 清空iframe srcdoc')
    iframeRef.value.srcdoc = ''
  }

  console.log('🔄 状态重置完成')

  try {
    // 解析输入框中的聊天记录数组
    let chatHistory = []
    let question = inputMessage.value.trim()

    try {
      // 尝试解析为JSON数组
      const parsedInput = JSON.parse(inputMessage.value.trim())
      if (Array.isArray(parsedInput) && parsedInput.length > 0) {
        chatHistory = parsedInput
        // 使用最后一条用户消息作为问题
        type ChatMsg = { type: 'user' | 'bot'; content: string }
        const lastUserMessage = (parsedInput as ChatMsg[]).filter((msg) => msg.type === 'user').pop()
        question = lastUserMessage ? lastUserMessage.content : '请根据聊天记录生成一个完整的网页HTML内容'
      }
    } catch {
      // 如果不是JSON格式，直接使用输入内容作为问题
      question = inputMessage.value.trim()
    }

    if (isLocalMockEnabled.value) {
      console.log('🎭 开始本地流式模拟')
      // 本地流式模拟：把 templateHtml 按块推送
      await beginStreamingIframe()
      console.log('✅ iframe文档已初始化')
      const full = templateHtml
      const chunkSize = 50
      let offset = 0

      const pushChunk = () => {
        if (offset >= full.length) {
          console.log('🎉 本地模拟完成')
          // 模拟完成
          isStreamingIframe.value = false
          iframeReady.value = false
          isGeneratingWebpage.value = false
          webpageContent.value = streamingHtml.value
          streamingHtml.value = ''
          localStorage.setItem('webpageContent', webpageContent.value)
          return
        }
        const next = full.slice(offset, offset + chunkSize)
        offset += chunkSize
        console.log(`📦 推送第${Math.floor(offset/chunkSize)}块，长度: ${next.length}, 进度: ${Math.round(offset/full.length*100)}%`)

        // 实时渲染到iframe
        streamRenderToIframe(next)
        streamingHtml.value += next

        setTimeout(pushChunk, 200)
      }
      pushChunk()
      return
    }

    // 调用Dify API进行流式对话
    await difyApi.quick.stream(
      {
        inputs: {
          question: `请根据以下需求生成一个完整的网页HTML内容：${question}`,
          history_message: JSON.stringify(chatHistory),
          is_search_web: isSearchWebEnabled.value ? 1 : 0,
          is_create_html: 1,
        },
        response_mode: 'streaming',
        user: 'webpage-preview-user',
      },
      {
        onTextChunk: (text: string) => {
          console.log('📨 收到文本块，长度:', text.length, '内容预览:', text.substring(0, 50) + '...')

          // 检测是否为完整HTML
          const next = (isStreamingIframe.value ? streamingHtml.value : webpageContent.value) + text
          const isFullHtml = /<!DOCTYPE|<html|<head|<body|<style/i.test(next)

          if (!isStreamingIframe.value && isFullHtml) {
            console.log('🎯 检测到完整HTML，切换到iframe模式')
            streamingHtml.value = next
            beginStreamingIframe()
            console.log('✅ iframe文档已初始化')
            return
          }

          if (isStreamingIframe.value) {
            console.log('🔄 流式iframe模式，实时渲染')
            // 实时渲染到iframe
            streamRenderToIframe(text)
            streamingHtml.value = next
          } else {
            console.log('📝 普通文本模式，增量展示')
            // 普通片段：做增量展示
            if (!webpageContent.value) {
              webpageContent.value = text
            } else {
              webpageContent.value += text
            }
          }
        },
        onError: (error) => {
          console.error('Dify API error:', error)
          let errorMessage = '抱歉，发生了错误，请稍后重试。'

          if (error.message.includes('HTTP error')) {
            if (error.message.includes('401')) errorMessage = '认证失败，请检查API配置。'
            else if (error.message.includes('403')) errorMessage = '权限不足，请检查API权限。'
            else if (error.message.includes('404')) errorMessage = '接口不存在，请检查API地址。'
            else if (error.message.includes('500')) errorMessage = '服务器内部错误，请稍后重试。'
            else if (error.message.includes('timeout')) errorMessage = '请求超时，请检查网络连接。'
          } else if (error.message.includes('Failed to fetch')) {
            errorMessage = '网络连接失败，请检查网络设置。'
          }

          webpageContent.value = `<div class="text-red-600">${errorMessage}</div>`
          isGeneratingWebpage.value = false
          isStreamingIframe.value = false
          iframeReady.value = false
        },
        onComplete: () => {
          console.log('🎉 网页内容生成完成')
          // 完成生成
          isGeneratingWebpage.value = false
          if (isStreamingIframe.value) {
            // 将最终流内容同步到存储变量
            webpageContent.value = streamingHtml.value
            streamingHtml.value = ''
            isStreamingIframe.value = false
            iframeReady.value = false
          }
          localStorage.setItem('webpageContent', webpageContent.value)
          console.log('✅ 状态更新完成，内容已保存到localStorage')
          console.log('📊 最终内容长度:', webpageContent.value?.length || 0)
          console.log('🔍 最终内容预览:', webpageContent.value?.substring(0, 200) + '...')
        },
      }
    )
  } catch (error) {
    console.error('Failed to call Dify API:', error)
    let errorMessage = '抱歉，网络连接失败，请检查网络后重试。'

    if (error instanceof Error) {
      if (error.message.includes('timeout')) errorMessage = '请求超时，请检查网络连接。'
      else if (error.message.includes('network')) errorMessage = '网络连接失败，请检查网络设置。'
      else if (error.message.includes('abort')) errorMessage = '请求被取消，请重试。'
    }

    webpageContent.value = `<div class="text-red-600">${errorMessage}</div>`
    isGeneratingWebpage.value = false
    isStreamingIframe.value = false
    iframeReady.value = false
    // htmlStreamBuffer = '' // This line is removed as per the edit hint
  }
}

// 刷新内容
const refreshContent = () => {
  if (inputMessage.value.trim()) {
    generateWebpageFromInput()
  } else {
    inputMessage.value = `[
  { "type": "user", "content": "请生成一个现代化的个人介绍网页，包含头部导航、主要内容区域和页脚，使用响应式设计，包含个人信息、技能展示、项目经验和联系方式等部分" }
]`
    generateWebpageFromInput()
  }
}

// 页面加载时检查是否有存储的内容
onMounted(async () => {
  const storedContent = localStorage.getItem('webpageContent')
  if (storedContent) {
    webpageContent.value = storedContent
  }
})

onUnmounted(() => {
  // stopIframeFlushTimer() // This line is removed as per the edit hint
})
</script>

<style scoped>
/* 网页内容样式 */
.prose {
  /* 避免强制设置深色，继承具体内容的颜色 */
  color: inherit;
  @apply leading-relaxed;
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
  @apply mb-4;
}

.prose ul, .prose ol {
  @apply mb-4 pl-6;
}

.prose li {
  @apply mb-2;
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

/* 玻璃态效果 */
.backdrop-blur-sm {
  backdrop-filter: blur(8px);
}
</style>
