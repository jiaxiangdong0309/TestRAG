import type { SSEEvent, SSEMessageParseResult, SSEError } from './types'

// 日志级别枚举
export enum LogLevel {
    NONE = 0,
    ERROR = 1,
    WARN = 2,
    INFO = 3,
    DEBUG = 4
}

// 日志工具类
export class SSELogger {
    private logLevel: LogLevel
    private debug: boolean

    constructor(logLevel: string = 'warn', debug: boolean = false) {
        this.logLevel = this.getLogLevel(logLevel)
        this.debug = debug
    }

    private getLogLevel(level: string): LogLevel {
        switch (level.toLowerCase()) {
            case 'none': return LogLevel.NONE
            case 'error': return LogLevel.ERROR
            case 'warn': return LogLevel.WARN
            case 'info': return LogLevel.INFO
            case 'debug': return LogLevel.DEBUG
            default: return LogLevel.WARN
        }
    }

    error(message: string, ...args: any[]): void {
        if (this.logLevel >= LogLevel.ERROR) {
            console.error(`[SSE] ${message}`, ...args)
        }
    }

    warn(message: string, ...args: any[]): void {
        if (this.logLevel >= LogLevel.WARN) {
            console.warn(`[SSE] ${message}`, ...args)
        }
    }

    info(message: string, ...args: any[]): void {
        if (this.logLevel >= LogLevel.INFO) {
            console.info(`[SSE] ${message}`, ...args)
        }
    }

    debug(message: string, ...args: any[]): void {
        if (this.debug && this.logLevel >= LogLevel.DEBUG) {
            console.debug(`[SSE] ${message}`, ...args)
        }
    }
}

// 解析 SSE 消息
export function parseSSEMessage(rawMessage: string): SSEMessageParseResult {
    const lines = rawMessage.split('\n')
    const result: SSEMessageParseResult = {
        type: 'message',
        data: null,
        valid: false
    }

    for (const line of lines) {
        const trimmedLine = line.trim()

        if (!trimmedLine || trimmedLine.startsWith(':')) {
            continue
        }

        const colonIndex = trimmedLine.indexOf(':')
        if (colonIndex === -1) {
            continue
        }

        const field = trimmedLine.substring(0, colonIndex)
        const value = trimmedLine.substring(colonIndex + 1).trim()

        switch (field) {
            case 'event':
                result.type = value
                break
            case 'data':
                if (result.data === null) {
                    result.data = value
                } else {
                    result.data += '\n' + value
                }
                break
            case 'id':
                result.id = value
                break
            case 'retry':
                const retry = parseInt(value, 10)
                if (!isNaN(retry)) {
                    result.retry = retry
                }
                break
        }
    }

    // 尝试解析 JSON 数据
    if (result.data && typeof result.data === 'string') {
        try {
            result.data = JSON.parse(result.data)
        } catch (e) {
            // 如果不是 JSON，保持原始字符串
        }
    }

    result.valid = true
    return result
}

// 创建 SSE 事件对象
export function createSSEEvent(
    type: string,
    data: any,
    id?: string,
    retry?: number
): SSEEvent {
    return {
        type,
        data,
        id,
        retry,
        timestamp: Date.now()
    }
}

// 创建 SSE 错误
export function createSSEError(
    message: string,
    code?: number,
    retryable: boolean = true,
    originalError?: Event
): SSEError {
    const error = new Error(message) as SSEError
    error.code = code
    error.retryable = retryable
    error.originalError = originalError
    return error
}

// 计算指数退避延迟
export function calculateBackoffDelay(
    attempt: number,
    baseDelay: number = 1000,
    maxDelay: number = 30000
): number {
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
    // 添加随机抖动，避免多个客户端同时重连
    const jitter = Math.random() * 0.1 * delay
    return delay + jitter
}

// 检查浏览器是否支持 EventSource
export function isEventSourceSupported(): boolean {
    return typeof EventSource !== 'undefined'
}

// 检查 URL 是否有效
export function isValidUrl(url: string): boolean {
    try {
        new URL(url)
        return true
    } catch {
        return false
    }
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout)
        }
        timeout = setTimeout(() => func(...args), wait)
    }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
): (...args: Parameters<T>) => void {
    let inThrottle: boolean = false

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args)
            inThrottle = true
            setTimeout(() => inThrottle = false, limit)
        }
    }
}