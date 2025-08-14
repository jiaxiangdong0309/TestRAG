# 配置文件说明

## 敏感信息配置

为了保护敏感信息（如API密钥）不被泄露到git仓库中，请按照以下步骤操作：

### 1. 复制示例配置文件

```bash
cp config.example.ts config.local.ts
```

### 2. 编辑本地配置文件

在 `config.local.ts` 文件中填入你的实际配置：

```typescript
export const LOCAL_CONFIG = {
    DIFY_API_KEY: 'your-actual-dify-api-key',
    DIFY_API_BASE_URL: 'https://your-actual-dify-api-url.com/v1/',
} as const
```

### 3. 重要提醒

- `config.local.ts` 文件已经被添加到 `.gitignore` 中，不会被提交到git
- 永远不要将包含真实API密钥的配置文件提交到git仓库
- 如果团队协作，请确保每个开发者都有自己的 `config.local.ts` 文件

### 4. 环境变量方式（可选）

你也可以使用环境变量的方式，创建 `.env.local` 文件：

```bash
VITE_DIFY_API_KEY=your-actual-dify-api-key
VITE_DIFY_API_BASE_URL=https://your-actual-dify-api-url.com/v1/
```

然后在 `env.ts` 中使用 `import.meta.env.VITE_DIFY_API_KEY` 来获取。
