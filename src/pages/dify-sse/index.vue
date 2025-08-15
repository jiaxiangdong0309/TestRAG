<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dify API 测试</h1>

    <!-- 配置信息显示 -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">当前配置</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-3 bg-gray-50 rounded">
          <div class="text-sm font-medium text-gray-700">API Key</div>
          <div class="text-sm text-gray-600 mt-1">已配置</div>
        </div>
        <div class="p-3 bg-gray-50 rounded">
          <div class="text-sm font-medium text-gray-700">Base URL</div>
          <div class="text-sm text-gray-600 mt-1">{{ config.baseURL }}</div>
        </div>
        <div class="p-3 bg-gray-50 rounded">
          <div class="text-sm font-medium text-gray-700">应用类型</div>
          <div class="text-sm text-gray-600 mt-1">完成应用 / 聊天应用</div>
        </div>
      </div>
    </div>

    <!-- 测试区域 -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">API 测试</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">输入内容</label>
          <textarea
            v-model="userInput"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            placeholder="请输入您要发送给 Dify 的内容..."
          ></textarea>
        </div>
        <div class="flex space-x-4">
          <button
            @click="invokeCompletionStream"
            :disabled="loading || !userInput.trim()"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? '执行中...' : '流式执行工作流' }}
          </button>
          <button
            @click="invokeChatStream"
            :disabled="loading || !userInput.trim()"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            {{ loading ? '执行中...' : '流式测试工作流' }}
          </button>
          <button
            @click="clearResults"
            :disabled="!hasResults"
            class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 disabled:opacity-50"
          >
            清空结果
          </button>
        </div>
      </div>
    </div>

    <!-- 文本内容显示 -->
    <div v-if="accumulatedText" class="bg-white rounded-lg shadow p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">文本内容</h2>
      <div class="p-3 bg-blue-50 rounded border border-blue-200">
        <div class="text-sm font-medium text-blue-800 mb-2">累积完整文本:</div>
        <div class="text-sm text-gray-800 whitespace-pre-wrap">{{ accumulatedText }}</div>
      </div>
    </div>

    <!-- 错误显示区域 -->
    <div v-if="error" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">错误信息</h2>
      <div class="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>错误:</strong> {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { difyApi, type DifyStreamConfig, type DifyStreamEvent, type DifyStreamError } from '../../api/modules/dify'
import type { DifyWorkflowParams } from '../../api/modules/dify'

// 定义组件名称
defineOptions({
  name: 'DifySseTest'
})

// 响应式数据
const loading = ref(false)
const error = ref('')
const result = ref<unknown>(null)
const userInput = ref('科锐国际是哪一年成立的')

// 流式输出相关状态
const streamOutput = ref<Array<{type: string, content: string, timestamp: number}>>([])

// 文本内容相关状态
const accumulatedText = ref('')
const currentTextChunk = ref('')

// 配置 - 使用新的便捷方法
const config = difyApi.config().build()

// 计算属性：是否有结果
const hasResults = computed(() => {
  return streamOutput.value.length > 0 || result.value !== null || error.value !== ''
})

// 清空结果
const clearResults = () => {
  streamOutput.value = []
  result.value = null
  error.value = ''
  accumulatedText.value = ''
  currentTextChunk.value = ''
}

// 流式配置
const createStreamConfig = (): DifyStreamConfig => ({
  onMessage: (event: DifyStreamEvent) => {
    // 记录所有消息
    streamOutput.value.push({
      type: '消息',
      content: `事件: ${event.event}, 任务ID: ${event.task_id}`,
      timestamp: event.created_at * 1000
    })
  },

  onTextChunk: (text: string, fullText: string) => {
    currentTextChunk.value = text
    accumulatedText.value = fullText

    // 记录文本块
    streamOutput.value.push({
      type: '文本块',
      content: `收到文本: ${text}`,
      timestamp: Date.now()
    })
  },

  onWorkflowStarted: (event: DifyStreamEvent) => {
    streamOutput.value.push({
      type: '工作流开始',
      content: `工作流开始执行，ID: ${event.workflow_run_id || event.id}`,
      timestamp: event.created_at * 1000
    })
  },

  onNodeStarted: (event: DifyStreamEvent) => {
    if (event.data) {
      const data = event.data as Record<string, unknown>
      const nodeTitle = (data.title as string) || (data.node_type as string) || '未知节点'

      streamOutput.value.push({
        type: '节点开始',
        content: `节点开始执行: ${nodeTitle}`,
        timestamp: event.created_at * 1000
      })
    }
  },

  onNodeFinished: (event: DifyStreamEvent) => {
    if (event.data) {
      const data = event.data as Record<string, unknown>
      const status = (data.status as string) || '未知'

      if (status === 'succeeded' && data.outputs) {
        // 如果有输出内容，添加到流式输出
        const outputContent = typeof data.outputs === 'string'
          ? data.outputs
          : JSON.stringify(data.outputs)

        streamOutput.value.push({
          type: '节点完成',
          content: `节点执行完成 (${status}) - 输出: ${outputContent}`,
          timestamp: event.created_at * 1000
        })
      } else {
        streamOutput.value.push({
          type: '节点完成',
          content: `节点执行完成 (${status})`,
          timestamp: event.created_at * 1000
        })
      }
    }
  },

  onWorkflowFinished: (event: DifyStreamEvent) => {
    if (event.data) {
      const data = event.data as Record<string, unknown>
      const status = (data.status as string) || '未知'
      const elapsedTime = (data.elapsed_time as number) || 0
      const totalTokens = (data.total_tokens as number) || 0

      if (data.outputs) {
        result.value = data.outputs
      }

      streamOutput.value.push({
        type: '工作流完成',
        content: `工作流执行完成 (${status}), 耗时: ${elapsedTime}s, Tokens: ${totalTokens}`,
        timestamp: event.created_at * 1000
      })
    }

    loading.value = false
  },

  onError: (err: DifyStreamError) => {
    // 使用新的错误类型，提供更详细的错误信息
    const errorMessage = err.originalError
      ? `${err.message}: ${err.originalError.message}`
      : err.message

    error.value = errorMessage
    loading.value = false

    // 记录错误详情到控制台
    console.error('Dify Stream Error:', {
      name: err.name,
      message: err.message,
      originalError: err.originalError,
      event: err.event
    })
  },

  onComplete: () => {
    loading.value = false
  }
})

// 流式执行工作流 - 使用新的便捷方法
const invokeCompletionStream = async () => {
  if (!userInput.value.trim()) {
    error.value = '请输入内容'
    return
  }

  loading.value = true
  error.value = ''
  result.value = null
  streamOutput.value = []
  accumulatedText.value = ''
  currentTextChunk.value = ''

  try {
    const params: DifyWorkflowParams = {
      inputs: {
        question: userInput.value.trim()
      },
      response_mode: "streaming",
      user: "abc-123"
    }

    const streamConfig = createStreamConfig()

    // 使用新的便捷方法
    await difyApi.quick.stream(params, streamConfig)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    error.value = errorMessage || '执行工作流失败'
    loading.value = false
  }
}

// 流式测试工作流 - 使用新的便捷方法
const invokeChatStream = async () => {
  if (!userInput.value.trim()) {
    error.value = '请输入内容'
    return
  }

  loading.value = true
  error.value = ''
  result.value = null
  streamOutput.value = []
  accumulatedText.value = ''
  currentTextChunk.value = ''

  try {
    const params: DifyWorkflowParams = {
      inputs: {
        query: userInput.value.trim()
      },
      response_mode: "streaming",
      user: "abc-123"
    }

    const streamConfig = createStreamConfig()

    // 使用新的便捷方法
    await difyApi.quick.chatStream(params, streamConfig)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err)
    error.value = errorMessage || '测试工作流失败'
    loading.value = false
  }
}
</script>
