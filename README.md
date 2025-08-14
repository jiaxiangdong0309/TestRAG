# TestRAG

这是一个使用 Vue 3 + Vite + Tailwind CSS 构建的前端项目。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 快速的开发服务器和构建工具
- **Tailwind CSS** - 实用优先的 CSS 框架
- **TypeScript** - 类型安全的 JavaScript
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue 的状态管理库

## 开发环境要求

- Node.js 20.19.4 (自动版本管理)
- npm 或 yarn

> 💡 **提示**: 项目已配置自动 Node.js 版本管理，进入项目目录时会自动切换到 20.19.4

## 安装和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 项目结构

```
TestRAG/
├── .nvmrc                    # Node.js 版本配置
├── .node-version             # 备用版本文件
├── src/
│   ├── api/                  # API 模块
│   │   ├── sse/             # SSE 客户端模块
│   │   └── index.ts         # API 主入口
│   ├── assets/              # 静态资源
│   ├── components/          # Vue 组件
│   ├── router/              # 路由配置
│   ├── stores/              # Pinia 状态管理
│   ├── views/               # 页面组件
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── public/                  # 公共静态资源
├── docs/                    # 项目文档
├── tailwind.config.js       # Tailwind CSS 配置
├── postcss.config.js        # PostCSS 配置
└── vite.config.ts           # Vite 配置
```

## 特性

- 🚀 基于 Vite 的快速开发体验
- 🎨 使用 Tailwind CSS 的现代化 UI
- 📱 响应式设计
- 🔧 TypeScript 支持
- 📦 组件化开发
- 🛣️ Vue Router 路由管理
- 🗃️ Pinia 状态管理
- 🔄 SSE 实时数据流支持
- 🤖 自动化 Node.js 版本管理

## 开发指南

1. 项目使用 Vue 3 Composition API
2. 样式使用 Tailwind CSS 类名
3. 组件放置在 `src/components` 目录
4. 页面放置在 `src/views` 目录
5. 路由配置在 `src/router` 目录
6. SSE 模块在 `src/api/sse` 目录

## 配置指南

- 📖 [SSE 模块详细文档](./docs/SSE-Module-Setup.md)
- ⚡ [快速配置指南](./docs/Quick-Setup-Guide.md)

## 许可证

MIT
