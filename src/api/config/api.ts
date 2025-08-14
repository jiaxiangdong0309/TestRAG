import { getCurrentEnv } from './env'
import { CONTENT_TYPES } from './constants'

// API 基础配置
export const API_CONFIG = {
    // 基础 URL
    baseURL: getCurrentEnv().API_BASE_URL,

    // 请求超时时间
    timeout: getCurrentEnv().API_TIMEOUT,

    // 重试次数
    retryTimes: getCurrentEnv().API_RETRY_TIMES,

    // 默认请求头
    headers: {
        'Content-Type': CONTENT_TYPES.JSON,
        'Accept': CONTENT_TYPES.JSON,
    },

    // 请求配置
    request: {
        // 是否显示加载状态
        showLoading: true,
        // 是否显示错误提示
        showError: true,
        // 是否自动重试
        autoRetry: true,
        // 重试延迟时间
        retryDelay: 1000,
    },

    // 响应配置
    response: {
        // 是否自动处理错误
        autoHandleError: true,
        // 是否自动刷新 token
        autoRefreshToken: true,
        // 成功状态码
        successCodes: [200, 201],
    },
} as const

// 请求方法配置
export const REQUEST_CONFIG = {
    // GET 请求配置
    GET: {
        timeout: 10000,
        showLoading: false,
    },

    // POST 请求配置
    POST: {
        timeout: 15000,
        showLoading: true,
    },

    // PUT 请求配置
    PUT: {
        timeout: 15000,
        showLoading: true,
    },

    // DELETE 请求配置
    DELETE: {
        timeout: 10000,
        showLoading: true,
    },
} as const