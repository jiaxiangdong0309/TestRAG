# Pages 文件夹结构

这个文件夹包含了应用的所有页面组件，每个页面都有自己独立的文件夹。

## 文件夹结构

```
src/pages/
├── home/           # 首页
│   └── index.vue   # 首页组件
├── about/          # 关于页面
│   └── index.vue   # 关于页面组件
├── dashboard/      # 仪表板页面
│   └── index.vue   # 仪表板组件
├── profile/        # 个人资料页面
│   └── index.vue   # 个人资料组件
└── settings/       # 设置页面
    └── index.vue   # 设置组件
```

## 添加新页面

要添加新页面，请按照以下步骤：

1. 在 `src/pages/` 下创建新的文件夹（例如：`new-page/`）
2. 在文件夹中创建 `index.vue` 文件
3. 在 `src/router/index.ts` 中添加路由配置

### 示例

```typescript
// src/router/index.ts
{
  path: '/new-page',
  name: 'new-page',
  component: () => import('../pages/new-page/index.vue'),
}
```

## 页面组件规范

- 每个页面组件都应该使用 `<script setup>` 语法
- 使用 Tailwind CSS 进行样式设计
- 保持组件的简洁性和可维护性
- 如果需要子组件，可以在页面文件夹内创建额外的组件文件
