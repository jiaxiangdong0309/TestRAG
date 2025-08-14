# 网络请求架构说明

## 目录结构

```
src/api/
├── index.ts              # API 统一导出
├── request.ts            # 请求实例和拦截器配置
├── types.ts              # API 相关类型定义
├── example.ts            # 使用示例
├── modules/              # 按模块划分的 API
│   ├── user.ts          # 用户相关 API
│   └── common.ts        # 通用 API
└── config/              # API 相关配置文件夹
    ├── index.ts         # 配置统一导出
    ├── api.ts           # API 基础配置
    ├── env.ts           # 环境变量配置
    └── constants.ts     # 常量配置
```

## 特性

- ✅ **TypeScript 支持**: 完整的类型定义
- ✅ **请求拦截器**: 自动添加 token、时间戳等
- ✅ **响应拦截器**: 统一错误处理、状态码处理
- ✅ **环境配置**: 支持开发、生产、测试环境
- ✅ **错误处理**: 统一的错误处理机制
- ✅ **文件上传**: 支持单文件和批量文件上传
- ✅ **自动重试**: 网络错误时自动重试
- ✅ **加载状态**: 自动管理请求加载状态

## 快速开始

### 1. 安装依赖

```bash
npm install axios
```

### 2. 在组件中使用

```typescript
import { userApi, commonApi } from '@/api'

// 用户登录
const handleLogin = async () => {
  try {
    const response = await userApi.login({
      username: 'testuser',
      password: '123456',
    })
    console.log('登录成功:', response.data)
  } catch (error) {
    console.error('登录失败:', error)
  }
}

// 获取用户信息
const handleGetUserInfo = async () => {
  try {
    const response = await userApi.getCurrentUser()
    console.log('用户信息:', response.data)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 文件上传
const handleUploadFile = async (file: File) => {
  try {
    const response = await commonApi.uploadFile(file)
    console.log('文件上传成功:', response.data)
  } catch (error) {
    console.error('文件上传失败:', error)
  }
}
```

## API 模块

### 用户相关 API (userApi)

| 方法               | 描述             | 参数                     |
| ------------------ | ---------------- | ------------------------ |
| `login`            | 用户登录         | `LoginParams`            |
| `register`         | 用户注册         | `RegisterParams`         |
| `logout`           | 用户登出         | 无                       |
| `getCurrentUser`   | 获取当前用户信息 | 无                       |
| `getUserInfo`      | 获取指定用户信息 | `userId: number`         |
| `updateUserInfo`   | 更新用户信息     | `UpdateUserParams`       |
| `changePassword`   | 修改密码         | `ChangePasswordParams`   |
| `uploadAvatar`     | 上传头像         | `file: File`             |
| `getUserList`      | 获取用户列表     | `PageParams?`            |
| `deleteUser`       | 删除用户         | `userId: number`         |
| `toggleUserStatus` | 启用/禁用用户    | `userId: number, status` |
| `refreshToken`     | 刷新 token       | 无                       |
| `verifyToken`      | 验证 token       | 无                       |

### 通用 API (commonApi)

| 方法                         | 描述             | 参数                      |
| ---------------------------- | ---------------- | ------------------------- |
| `uploadFile`                 | 文件上传         | `file: File, type?`       |
| `uploadFiles`                | 批量文件上传     | `files: File[], type?`    |
| `deleteFile`                 | 删除文件         | `fileUrl: string`         |
| `getSystemConfig`            | 获取系统配置     | 无                        |
| `getDictionary`              | 获取字典数据     | `type: string`            |
| `getRegions`                 | 获取地区数据     | `parentId?`               |
| `getCaptcha`                 | 获取验证码       | 无                        |
| `verifyCaptcha`              | 验证验证码       | `captchaId, captchaCode`  |
| `sendSmsCode`                | 发送短信验证码   | `phone, type`             |
| `verifySmsCode`              | 验证短信验证码   | `phone, code, type`       |
| `getServerTime`              | 获取服务器时间   | 无                        |
| `healthCheck`                | 健康检查         | 无                        |
| `getVersion`                 | 获取应用版本     | 无                        |
| `getNotifications`           | 获取通知列表     | `SearchParams?`           |
| `markNotificationRead`       | 标记通知已读     | `notificationId`          |
| `markAllNotificationsRead`   | 标记所有通知已读 | 无                        |
| `getUnreadNotificationCount` | 获取未读通知数量 | 无                        |
| `search`                     | 搜索功能         | `keyword, type?, params?` |

## 配置说明

### 环境配置

在 `src/api/config/env.ts` 中配置不同环境的 API 地址：

```typescript
export const ENV_CONFIG = {
  development: {
    API_BASE_URL: 'http://localhost:3000/api',
    API_TIMEOUT: 10000,
    API_RETRY_TIMES: 3,
  },
  production: {
    API_BASE_URL: 'https://api.example.com/api',
    API_TIMEOUT: 15000,
    API_RETRY_TIMES: 2,
  },
}
```

### 请求配置

在 `src/api/config/api.ts` 中配置请求相关参数：

```typescript
export const API_CONFIG = {
  baseURL: getCurrentEnv().API_BASE_URL,
  timeout: getCurrentEnv().API_TIMEOUT,
  retryTimes: getCurrentEnv().API_RETRY_TIMES,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}
```

## 错误处理

### 自动错误处理

- 401 错误自动跳转登录页
- 网络错误自动重试
- 统一错误提示

### 手动错误处理

```typescript
try {
  const response = await userApi.login(params)
  // 处理成功响应
} catch (error) {
  // 处理错误
  console.error('请求失败:', error.message)
}
```

## 类型定义

所有 API 都有完整的 TypeScript 类型定义，包括：

- 请求参数类型
- 响应数据类型
- 错误类型
- 配置类型

## 扩展

### 添加新的 API 模块

1. 在 `src/api/modules/` 下创建新的模块文件
2. 在 `src/api/index.ts` 中导出新模块
3. 在 `src/api/types.ts` 中添加相关类型定义

### 自定义请求配置

```typescript
import request from '@/api/request'

const customRequest = (config) => {
  return request({
    ...config,
    showLoading: false, // 不显示加载状态
    showError: false, // 不显示错误提示
  })
}
```

## 注意事项

1. **Token 管理**: 登录成功后会自动保存 token，登出时会清除
2. **错误处理**: 建议在组件中捕获错误并显示用户友好的提示
3. **文件上传**: 支持图片、文档、视频等多种文件类型
4. **环境变量**: 可以通过 `.env` 文件配置不同环境的 API 地址
5. **类型安全**: 所有 API 都有完整的类型定义，建议使用 TypeScript
