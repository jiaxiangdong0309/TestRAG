import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios'
import { API_CONFIG } from './config'
import { HTTP_STATUS, ERROR_MESSAGES } from './config'
import type { BaseResponse, RequestConfig as CustomRequestConfig, ApiError } from './types'

// 创建 axios 实例
const request: AxiosInstance = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers,
})

// 调试信息：显示实际的配置
console.log('Axios实例配置:', {
    baseURL: API_CONFIG.baseURL,
    actualBaseURL: request.defaults.baseURL,
    timeout: API_CONFIG.timeout,
    headers: API_CONFIG.headers
})

// 请求拦截器
request.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // 添加认证 token
        const token = localStorage.getItem('token')
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // 添加请求时间戳
        if (config.params) {
            config.params._t = Date.now()
        }

        // 显示加载状态
        const customConfig = config as CustomRequestConfig
        if (customConfig.showLoading !== false) {
            // 这里可以触发全局 loading 状态
            console.log('开始请求:', config.url)
        }

        return config
    },
    (error) => {
        console.error('请求拦截器错误:', error)
        return Promise.reject(error)
    }
)

// 响应拦截器
request.interceptors.response.use(
    (response: AxiosResponse<BaseResponse>) => {
        const { data, status } = response
        const customConfig = response.config as CustomRequestConfig

        // 隐藏加载状态
        if (customConfig.showLoading !== false) {
            // 这里可以关闭全局 loading 状态
            console.log('请求完成:', response.config.url)
        }

        // 处理业务状态码
        if (status === HTTP_STATUS.OK || status === HTTP_STATUS.CREATED) {
            // 检查业务状态码
            if (data.success) {
                return response
            } else {
                // 业务错误处理
                const error: ApiError = {
                    code: data.code,
                    message: data.message,
                    details: data
                }

                // 自动处理错误
                if (customConfig.showError !== false) {
                    handleError(error)
                }

                return Promise.reject(error)
            }
        }

        return response
    },
    (error) => {
        console.error('响应拦截器错误:', error)

        // 隐藏加载状态
        const customConfig = error.config as CustomRequestConfig
        if (customConfig?.showLoading !== false) {
            // 这里可以关闭全局 loading 状态
        }

        // 错误处理
        const apiError = handleAxiosError(error)

        // 自动处理错误
        if (customConfig?.showError !== false) {
            handleError(apiError)
        }

        return Promise.reject(apiError)
    }
)

// 处理 axios 错误
function handleAxiosError(error: unknown): ApiError {
    if (error && typeof error === 'object' && 'response' in error) {
        // 服务器响应错误
        const response = (error as { response: { status: number; data?: { message?: string } } }).response
        const { status, data } = response
        return {
            code: status,
            message: data?.message || getErrorMessageByStatus(status),
            details: data
        }
    } else if (error && typeof error === 'object' && 'request' in error) {
        // 网络错误
        return {
            code: 0,
            message: ERROR_MESSAGES.NETWORK_ERROR,
            details: (error as { request: unknown }).request
        }
    } else {
        // 其他错误
        return {
            code: -1,
            message: (error as Error)?.message || ERROR_MESSAGES.UNKNOWN_ERROR,
            details: error
        }
    }
}

// 根据状态码获取错误信息
function getErrorMessageByStatus(status: number): string {
    switch (status) {
        case HTTP_STATUS.UNAUTHORIZED:
            return ERROR_MESSAGES.UNAUTHORIZED
        case HTTP_STATUS.FORBIDDEN:
            return ERROR_MESSAGES.FORBIDDEN
        case HTTP_STATUS.NOT_FOUND:
            return ERROR_MESSAGES.NOT_FOUND
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        case HTTP_STATUS.BAD_GATEWAY:
        case HTTP_STATUS.SERVICE_UNAVAILABLE:
            return ERROR_MESSAGES.SERVER_ERROR
        default:
            return ERROR_MESSAGES.UNKNOWN_ERROR
    }
}

// 处理错误
function handleError(error: ApiError) {
    // 这里可以实现统一的错误处理逻辑
    // 比如显示错误提示、跳转登录页等

    console.error('API 错误:', error)

    // 401 错误自动跳转登录
    if (error.code === HTTP_STATUS.UNAUTHORIZED) {
        localStorage.removeItem('token')
        // 跳转到登录页
        window.location.href = '/login'
    }
}

// 创建请求方法
export const createRequest = (config: CustomRequestConfig) => {
    return request(config)
}

// 导出请求实例
export default request