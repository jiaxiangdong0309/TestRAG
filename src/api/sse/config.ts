import type { SSEConfig } from './types'

// 默认 SSE 配置
export const DEFAULT_SSE_CONFIG: SSEConfig = {
    // 基础配置
    url: '',
    withCredentials: false,

    // 重连配置
    retryInterval: 3000, // 3秒
    maxRetries: 5,
    enableAutoReconnect: true,

    // 超时配置
    timeout: 30000, // 30秒
    connectionTimeout: 10000, // 10秒

    // 事件配置
    eventTypes: ['message', 'open', 'error'],
    defaultEventType: 'message',

    // 错误处理
    onError: undefined,
    onConnectionError: undefined,

    // 调试配置
    debug: false,
    logLevel: 'warn'
}

// SSE 配置验证
export function validateSSEConfig(config: Partial<SSEConfig>): SSEConfig {
    const validatedConfig = { ...DEFAULT_SSE_CONFIG, ...config }

    // 验证必要字段
    if (!validatedConfig.url) {
        throw new Error('SSE URL is required')
    }

    // 验证数值范围
    if (validatedConfig.retryInterval && validatedConfig.retryInterval < 1000) {
        validatedConfig.retryInterval = 1000
    }

    if (validatedConfig.maxRetries && validatedConfig.maxRetries < 0) {
        validatedConfig.maxRetries = 0
    }

    if (validatedConfig.timeout && validatedConfig.timeout < 5000) {
        validatedConfig.timeout = 5000
    }

    return validatedConfig
}

// 创建 SSE 配置
export function createSSEConfig(config: Partial<SSEConfig> = {}): SSEConfig {
    return validateSSEConfig(config)
}

// 合并 SSE 配置
export function mergeSSEConfig(
    baseConfig: SSEConfig,
    newConfig: Partial<SSEConfig>
): SSEConfig {
    return validateSSEConfig({ ...baseConfig, ...newConfig })
}