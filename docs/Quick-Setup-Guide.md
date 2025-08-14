# 快速配置指南

## 🚀 一键配置 Node.js 版本管理

### 1. 创建版本配置文件

```bash
# 在项目根目录执行
echo "20.19.4" > .nvmrc
echo "20.19.4" > .node-version
```

### 2. 更新 package.json

在 `package.json` 中添加或更新 `engines` 字段：

```json
{
  "engines": {
    "node": "20.19.4"
  }
}
```

### 3. 配置 shell 自动切换

将以下内容添加到 `~/.zshrc`（如果还没配置过）：

```bash
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"
  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")
    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

### 4. 重新加载配置

```bash
source ~/.zshrc
```

## 📦 SSE 模块配置

### 1. 创建目录结构

```bash
mkdir -p src/api/sse
```

### 2. 复制以下文件到新项目

从当前项目复制以下文件到新项目的对应位置：

```
src/api/sse/
├── index.ts          # 主入口
├── types.ts          # TypeScript 类型定义
├── config.ts         # 配置管理
├── utils.ts          # 工具函数
├── event-handler.ts  # 事件处理器
├── client.ts         # SSE 客户端核心类
├── example.ts        # 使用示例
└── README.md         # 详细文档
```

### 3. 更新 API 模块主入口

在 `src/api/index.ts` 中添加：

```typescript
// SSE 模块导出
export * from './sse'
```

## 🎯 使用示例

### SSE 模块使用

```typescript
import { SSEClient } from '@/api/sse'

// 创建 SSE 客户端
const sseClient = new SSEClient('http://localhost:3000/api/sse', {
  retryInterval: 3000,
  maxRetries: 5,
  debug: true,
})

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

### Vue 组件中使用

```vue
<template>
  <div>
    <p>连接状态: {{ connectionStatus }}</p>
    <button @click="connect">连接</button>
    <button @click="disconnect">断开</button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { SSEClient, SSEConnectionStatus } from '@/api/sse'

const sseClient = new SSEClient('http://localhost:3000/api/sse')
const connectionStatus = ref(SSEConnectionStatus.CLOSED)

sseClient.onConnectionChange((status) => {
  connectionStatus.value = status
})

const connect = () => sseClient.connect()
const disconnect = () => sseClient.disconnect()

onMounted(() => connect())
onUnmounted(() => sseClient.destroy())
</script>
```

## ✅ 验证配置

### 检查 Node.js 版本管理

```bash
# 进入项目目录
cd /path/to/your/project

# 检查是否自动切换到 20.19.4
node --version
# 应该显示: v20.19.4
```

### 检查 SSE 模块

```bash
# 启动开发服务器
npm run dev

# 在浏览器控制台测试
# 应该能看到 SSE 模块正常工作
```

## 📝 注意事项

1. **Node.js 版本**：确保已安装 Node.js 20.19.4
2. **nvm 配置**：确保已正确配置 nvm
3. **TypeScript**：确保项目支持 TypeScript
4. **路径别名**：确保 `@/` 路径别名配置正确

## 🔧 故障排除

### Node.js 版本问题

```bash
# 安装指定版本
nvm install 20.19.4

# 手动切换
nvm use 20.19.4

# 检查 nvm 配置
nvm list
```

### SSE 连接问题

```bash
# 检查浏览器支持
typeof EventSource !== 'undefined'

# 检查服务器配置
# 确保服务器返回正确的 SSE 头
```

## 🎉 完成！

配置完成后，你将拥有：

- ✅ 自动化的 Node.js 版本管理
- ✅ 完整的 SSE 客户端封装
- ✅ 企业级的实时数据流处理能力

现在可以开始开发你的实时应用了！
