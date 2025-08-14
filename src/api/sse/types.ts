// SSE 连接状态枚举
export enum SSEConnectionStatus {
    CONNECTING = 'connecting',
    OPEN = 'open',
    CLOSED = 'closed',
    ERROR = 'error'
}

// SSE 事件类型
export interface SSEEvent {
    type: string
    data: any
    id?: string
    retry?: number
    timestamp: number
}

// SSE 配置选项
export interface SSEConfig {
    // 基础配置
    url: string
    withCredentials?: boolean

    // 重连配置
    retryInterval?: number
    maxRetries?: number
    enableAutoReconnect?: boolean

    // 超时配置
    timeout?: number
    connectionTimeout?: number

    // 事件配置
    eventTypes?: string[]
    defaultEventType?: string

    // 错误处理
    onError?: (error: Event) => void
    onConnectionError?: (error: Event) => void

    // 调试配置
    debug?: boolean
    logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug'
}

// SSE 客户端状态
export interface SSEClientState {
    status: SSEConnectionStatus
    retryCount: number
    lastError?: Error
    connectionTime?: number
    reconnectAttempts: number
}

// SSE 事件监听器类型
export type SSEEventListener = (event: SSEEvent) => void

// SSE 连接事件类型
export type SSEConnectionListener = (status: SSEConnectionStatus) => void

// SSE 客户端接口
export interface ISSEClient {
    // 连接管理
    connect(): void
    disconnect(): void
    reconnect(): void

    // 事件监听
    on(eventType: string, listener: SSEEventListener): void
    off(eventType: string, listener: SSEEventListener): void
    once(eventType: string, listener: SSEEventListener): void

    // 连接状态监听
    onConnectionChange(listener: SSEConnectionListener): void

    // 状态获取
    getState(): SSEClientState
    isConnected(): boolean

    // 配置管理
    updateConfig(config: Partial<SSEConfig>): void
    getConfig(): SSEConfig
}

// SSE 错误类型
export interface SSEError extends Error {
    code?: number
    retryable?: boolean
    originalError?: Event
}

// SSE 消息解析结果
export interface SSEMessageParseResult {
    type: string
    data: any
    id?: string
    retry?: number
    valid: boolean
}