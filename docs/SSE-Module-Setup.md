# SSE 模块与 Node.js 版本配置总结

## 📋 项目概述

本项目实现了一个完整的基于 EventSource 的 SSE (Server-Sent Events) 客户端封装模块，并配置了自动化的 Node.js 版本管理。

## 🎯 实现的功能

### 1. SSE 模块特性

- ✅ **自动重连机制**：支持指数退避算法
- ✅ **事件系统**：支持自定义事件类型和事件监听
- ✅ **连接状态管理**：实时监控连接状态变化
- ✅ **错误处理**：完善的错误处理和日志记录
- ✅ **配置灵活**：支持多种配置选项
- ✅ **TypeScript 支持**：完整的类型定义
- ✅ **工厂模式**：支持管理多个 SSE 连接
- ✅ **内存安全**：自动清理资源，防止内存泄漏

### 2. Node.js 版本管理

- ✅ **自动切换**：进入项目目录时自动切换到指定版本
- ✅ **无需手动命令**：不需要运行 `nvm use`
- ✅ **全局生效**：对所有项目都有效

## 📁 项目结构

```
TestRAG/
├── .nvmrc                    # Node.js 版本配置
├── .node-version             # 备用版本文件
├── package.json              # 项目配置（包含 engines 字段）
├── src/
│   └── api/
│       ├── sse/              # SSE 模块
│       │   ├── index.ts      # 主入口
│       │   ├── types.ts      # TypeScript 类型定义
│       │   ├── config.ts     # 配置管理
│       │   ├── utils.ts      # 工具函数
│       │   ├── event-handler.ts # 事件处理器
│       │   ├── client.ts     # SSE 客户端核心类
│       │   ├── example.ts    # 使用示例
│       │   └── README.md     # 详细文档
│       └── index.ts          # API 模块主入口
└── docs/
    └── SSE-Module-Setup.md   # 本文档
```

## 🚀 快速开始

### SSE 模块使用

```typescript
// 基础使用
import { SSEClient } from '@/api/sse'

const sseClient = new SSEClient('http://localhost:3000/api/sse')
sseClient.connect()

sseClient.on('message', (event) => {
  console.log('收到消息:', event.data)
})
```

### Node.js 版本管理

```bash
# 进入项目目录，自动切换到 Node.js 20.19.4
cd /path/to/TestRAG
# 无需任何手动命令！
```

## 🔧 配置说明

### SSE 模块配置

```typescript
const config: SSEConfig = {
  url: 'http://localhost:3000/api/sse',
  retryInterval: 3000, // 重连间隔 3 秒
  maxRetries: 5, // 最多重试 5 次
  enableAutoReconnect: true, // 启用自动重连
  debug: true, // 启用调试模式
  logLevel: 'debug', // 日志级别
}
```

### Node.js 版本配置

- **`.nvmrc`**: 指定 Node.js 版本为 20.19.4
- **`.node-version`**: 备用版本文件
- **`package.json`**: engines 字段指定版本要求

## 📝 下次配置指南

### 1. 为新项目配置 Node.js 版本管理

```bash
# 1. 创建版本配置文件
echo "20.19.4" > .nvmrc
echo "20.19.4" > .node-version

# 2. 更新 package.json
# 在 package.json 中添加或更新 engines 字段：
{
  "engines": {
    "node": "20.19.4"
  }
}

# 3. 配置 shell 自动切换（如果还没配置）
# 将以下内容添加到 ~/.zshrc：
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

# 4. 重新加载配置
source ~/.zshrc
```

### 2. 为新项目添加 SSE 模块

```bash
# 1. 创建 SSE 模块目录结构
mkdir -p src/api/sse

# 2. 复制 SSE 模块文件
# 从当前项目复制以下文件到新项目：
# - src/api/sse/types.ts
# - src/api/sse/config.ts
# - src/api/sse/utils.ts
# - src/api/sse/event-handler.ts
# - src/api/sse/client.ts
# - src/api/sse/index.ts
# - src/api/sse/example.ts
# - src/api/sse/README.md

# 3. 更新 API 模块主入口
# 在 src/api/index.ts 中添加：
export * from './sse'
```

### 3. 一键配置脚本

创建 `setup-node-sse.sh` 脚本：

```bash
#!/bin/bash

# 设置 Node.js 版本
echo "20.19.4" > .nvmrc
echo "20.19.4" > .node-version

# 更新 package.json engines
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.engines = { ...pkg.engines, node: '20.19.4' };
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
"

# 创建 SSE 模块目录
mkdir -p src/api/sse

# 复制 SSE 模块文件（需要手动复制）
echo "请手动复制 SSE 模块文件到 src/api/sse/ 目录"

echo "配置完成！"
```

## 🎯 最佳实践

### SSE 模块使用

1. **资源清理**：在组件卸载时调用 `destroy()` 方法
2. **错误处理**：始终监听错误事件并处理异常情况
3. **重连策略**：根据业务需求调整重连间隔和次数
4. **事件管理**：及时移除不需要的事件监听器
5. **状态监控**：监听连接状态变化，提供用户反馈

### Node.js 版本管理

1. **统一版本**：团队项目使用相同的 Node.js 版本
2. **版本锁定**：使用精确版本号而不是范围
3. **文档记录**：在 README 中说明版本要求
4. **CI/CD 配置**：确保构建环境使用正确版本

## 🔍 故障排除

### SSE 连接问题

```bash
# 检查浏览器支持
typeof EventSource !== 'undefined'

# 检查服务器配置
# 确保服务器返回正确的 SSE 头：
# Content-Type: text/event-stream
# Cache-Control: no-cache
# Connection: keep-alive
```

### Node.js 版本问题

```bash
# 检查当前版本
node --version

# 手动切换版本
nvm use 20.19.4

# 安装指定版本
nvm install 20.19.4

# 检查 nvm 配置
nvm list
```

## 📚 相关文档

- [SSE 模块详细文档](./src/api/sse/README.md)
- [SSE 使用示例](./src/api/sse/example.ts)
- [EventSource MDN 文档](https://developer.mozilla.org/en-US/docs/Web/API/EventSource)
- [nvm 使用指南](https://github.com/nvm-sh/nvm)

## 🎉 总结

通过本次配置，我们实现了：

1. **完整的 SSE 客户端封装**：提供了企业级的 SSE 连接管理功能
2. **自动化的 Node.js 版本管理**：无需手动切换版本
3. **可复用的配置方案**：可以快速应用到其他项目

这套配置方案可以大大提高开发效率，确保项目的一致性和稳定性。
