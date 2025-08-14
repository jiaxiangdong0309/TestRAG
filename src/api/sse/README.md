# SSE (Server-Sent Events) 模块

这是一个基于 EventSource 的 SSE 客户端封装模块，提供了完整的 SSE 连接管理功能。

## 特性

- ✅ **自动重连机制**：连接断开时自动重连，支持指数退避算法
- ✅ **事件系统**：支持自定义事件类型和事件监听
- ✅ **连接状态管理**：实时监控连接状态变化
- ✅ **错误处理**：完善的错误处理和日志记录
- ✅ **配置灵活**：支持多种配置选项
- ✅ **TypeScript 支持**：完整的类型定义
- ✅ **工厂模式**：支持管理多个 SSE 连接
- ✅ **内存安全**：自动清理资源，防止内存泄漏

## 快速开始

### 基础使用

```typescript
import { SSEClient } from '@/api/sse'

// 创建 SSE 客户端
const sseClient = new SSEClient('http://localhost:3000/api/sse')

// 连接
sseClient.connect()

// 监听消息
sseClient.on('message', (event) => {
  console.log('收到消息:', event.data)
})

// 监听连接状态
sseClient.onConnectionChange((status) => {
  console.log('连接状态:', status)
})
```

### 带配置的使用

```typescript
import { createSSEClient } from '@/api/sse'

const sseClient = createSSEClient('http://localhost:3000/api/sse', {
  retryInterval: 5000, // 重连间隔 5 秒
  maxRetries: 3, // 最多重试 3 次
  enableAutoReconnect: true,
  debug: true,
  logLevel: 'debug',
})

sseClient.connect()
```

### 工厂模式

```typescript
import { sseFactory } from '@/api/sse'

// 创建多个 SSE 连接
const notificationClient = sseFactory.create(
  'notifications',
  'http://localhost:3000/api/notifications',
)

const chatClient = sseFactory.create('chat', 'http://localhost:3000/api/chat')

// 连接
notificationClient.connect()
chatClient.connect()
```

## API 参考

### SSEClient

#### 构造函数

```typescript
new SSEClient(url: string, config?: Partial<SSEConfig>)
```

#### 方法

| 方法                           | 描述                 |
| ------------------------------ | -------------------- |
| `connect()`                    | 建立 SSE 连接        |
| `disconnect()`                 | 断开 SSE 连接        |
| `reconnect()`                  | 手动重连             |
| `on(eventType, listener)`      | 添加事件监听器       |
| `off(eventType, listener)`     | 移除事件监听器       |
| `once(eventType, listener)`    | 添加一次性事件监听器 |
| `onConnectionChange(listener)` | 监听连接状态变化     |
| `getState()`                   | 获取当前状态         |
| `isConnected()`                | 检查是否已连接       |
| `updateConfig(config)`         | 更新配置             |
| `getConfig()`                  | 获取当前配置         |
| `destroy()`                    | 销毁客户端           |

### 配置选项

```typescript
interface SSEConfig {
  // 基础配置
  url: string // SSE 服务器地址
  withCredentials?: boolean // 是否发送 cookies

  // 重连配置
  retryInterval?: number // 重连间隔（毫秒）
  maxRetries?: number // 最大重试次数
  enableAutoReconnect?: boolean // 是否启用自动重连

  // 超时配置
  timeout?: number // 连接超时时间
  connectionTimeout?: number // 连接建立超时时间

  // 事件配置
  eventTypes?: string[] // 自定义事件类型
  defaultEventType?: string // 默认事件类型

  // 错误处理
  onError?: (error: Event) => void
  onConnectionError?: (error: Event) => void

  // 调试配置
  debug?: boolean // 是否启用调试模式
  logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug'
}
```

### 事件类型

```typescript
interface SSEEvent {
  type: string // 事件类型
  data: any // 事件数据
  id?: string // 事件 ID
  retry?: number // 重连间隔
  timestamp: number // 时间戳
}
```

### 连接状态

```typescript
enum SSEConnectionStatus {
  CONNECTING = 'connecting', // 连接中
  OPEN = 'open', // 已连接
  CLOSED = 'closed', // 已断开
  ERROR = 'error', // 错误状态
}
```

## Vue 组件中使用

```vue
<template>
  <div class="sse-demo">
    <h2>SSE 连接状态: {{ connectionStatus }}</h2>
    <div class="controls">
      <button @click="connect" :disabled="isConnected">连接</button>
      <button @click="disconnect" :disabled="!isConnected">断开</button>
    </div>

    <div class="messages">
      <div v-for="message in messages" :key="message.timestamp">
        {{ message.data }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { SSEClient, SSEConnectionStatus } from '@/api/sse'
import type { SSEEvent } from '@/api/sse'

const sseClient = new SSEClient('http://localhost:3000/api/sse')
const connectionStatus = ref(SSEConnectionStatus.CLOSED)
const messages = ref<SSEEvent[]>([])
const isConnected = ref(false)

// 连接状态监听
sseClient.onConnectionChange((status) => {
  connectionStatus.value = status
  isConnected.value = status === SSEConnectionStatus.OPEN
})

// 消息监听
sseClient.on('message', (event) => {
  messages.value.push(event)
})

// 连接方法
const connect = () => sseClient.connect()
const disconnect = () => sseClient.disconnect()

onMounted(() => connect())
onUnmounted(() => sseClient.destroy())
</script>
```

## 错误处理

```typescript
const sseClient = new SSEClient('http://localhost:3000/api/sse', {
  onError: (error) => {
    console.error('SSE 错误:', error)
  },
  onConnectionError: (error) => {
    console.error('连接错误:', error)
  },
})

sseClient.on('error', (event) => {
  console.error('收到错误事件:', event.data)
})
```

## 最佳实践

1. **资源清理**：在组件卸载时调用 `destroy()` 方法
2. **错误处理**：始终监听错误事件并处理异常情况
3. **重连策略**：根据业务需求调整重连间隔和次数
4. **事件管理**：及时移除不需要的事件监听器
5. **状态监控**：监听连接状态变化，提供用户反馈

## 注意事项

- 确保服务器支持 SSE 协议
- 服务器需要设置正确的 CORS 头
- 某些代理服务器可能不支持长连接
- 移动网络环境下可能需要调整超时设置

## 浏览器兼容性

- Chrome 6+
- Firefox 6+
- Safari 5+
- Edge 12+
- IE 不支持（需要使用 polyfill）
