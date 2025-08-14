// 环境配置
import { LOCAL_CONFIG } from './config.local'

export const ENV_CONFIG = {
    // 开发环境
    development: {
        API_BASE_URL: 'https://dify-contest.hewa.cn/v1/',
        API_TIMEOUT: 10000,
        API_RETRY_TIMES: 3,
        DIFY_API_BASE_URL: LOCAL_CONFIG.DIFY_API_BASE_URL,
        DIFY_API_KEY: LOCAL_CONFIG.DIFY_API_KEY,
    },
    // 生产环境
    production: {
        API_BASE_URL: 'https://dify-contest.hewa.cn/v1/',
        API_TIMEOUT: 15000,
        API_RETRY_TIMES: 2,
        DIFY_API_BASE_URL: LOCAL_CONFIG.DIFY_API_BASE_URL,
        DIFY_API_KEY: LOCAL_CONFIG.DIFY_API_KEY,
    },
    // 测试环境
    test: {
        API_BASE_URL: 'https://dify-contest.hewa.cn/v1/',
        API_TIMEOUT: 8000,
        API_RETRY_TIMES: 1,
        DIFY_API_BASE_URL: LOCAL_CONFIG.DIFY_API_BASE_URL,
        DIFY_API_KEY: LOCAL_CONFIG.DIFY_API_KEY,
    },
} as const

// 获取当前环境
export const getCurrentEnv = () => {
    const env = import.meta.env.MODE || 'development'
    return ENV_CONFIG[env as keyof typeof ENV_CONFIG] || ENV_CONFIG.development
}

// 环境变量
export const ENV_VARS = {
    NODE_ENV: import.meta.env.MODE,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
    VITE_API_TIMEOUT: import.meta.env.VITE_API_TIMEOUT,
    VITE_API_RETRY_TIMES: import.meta.env.VITE_API_RETRY_TIMES,
    VITE_DIFY_API_BASE_URL: import.meta.env.VITE_DIFY_API_BASE_URL,
    VITE_DIFY_API_KEY: import.meta.env.VITE_DIFY_API_KEY,
} as const