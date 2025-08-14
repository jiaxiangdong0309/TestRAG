import type {
    SSEConfig,
    SSEClientState,
    SSEConnectionStatus,
    SSEEventListener,
    SSEConnectionListener,
    SSEError
} from './types'
import {
    SSELogger,
    isEventSourceSupported,
    isValidUrl,
    calculateBackoffDelay,
    createSSEError
} from './utils'
import { createSSEConfig } from './config'
import { SSEEventHandler } from './event-handler'

// SSE 客户端类
export class SSEClient {
    private config: SSEConfig
    private logger: SSELogger
    private eventHandler: SSEEventHandler
    private eventSource: EventSource | null = null
    private state: SSEClientState
    private reconnectTimer: NodeJS.Timeout | null = null
    private connectionTimer: NodeJS.Timeout | null = null
    private isManualDisconnect: boolean = false

    constructor(url: string, config: Partial<SSEConfig> = {}) {
        // 验证浏览器支持
        if (!isEventSourceSupported()) {
            throw new Error('EventSource is not supported in this browser')
        }

        // 验证 URL
        if (!isValidUrl(url)) {
            throw new Error('Invalid SSE URL')
        }

        // 创建配置
        this.config = createSSEConfig({ url, ...config })

        // 创建日志器和事件处理器
        this.logger = new SSELogger(this.config.logLevel, this.config.debug)
        this.eventHandler = new SSEEventHandler(this.logger)

        // 初始化状态
        this.state = {
            status: SSEConnectionStatus.CLOSED,
            retryCount: 0,
            reconnectAttempts: 0
        }

        this.logger.info('SSE Client initialized', { url: this.config.url })
    }

    // 连接方法
    connect(): void {
        if (this.state.status === SSEConnectionStatus.CONNECTING ||
            this.state.status === SSEConnectionStatus.OPEN) {
            this.logger.warn('Connection already in progress or established')
            return
        }

        this.isManualDisconnect = false
        this.setState(SSEConnectionStatus.CONNECTING)

        try {
            // 创建 EventSource
            this.eventSource = new EventSource(this.config.url, {
                withCredentials: this.config.withCredentials
            })

            // 绑定事件处理器
            this.bindEventHandlers()

            // 设置连接超时
            this.setConnectionTimeout()

            this.logger.info('SSE connection initiated')
        } catch (error) {
            this.handleConnectionError(error as Error)
        }
    }

    // 断开连接
    disconnect(): void {
        this.isManualDisconnect = true
        this.clearTimers()

        if (this.eventSource) {
            this.eventSource.close()
            this.eventSource = null
        }

        this.setState(SSEConnectionStatus.CLOSED)
        this.logger.info('SSE connection disconnected')
    }

    // 重新连接
    reconnect(): void {
        this.logger.info('Manual reconnect initiated')
        this.disconnect()
        setTimeout(() => this.connect(), 100)
    }

    // 事件监听方法
    on(eventType: string, listener: SSEEventListener): void {
        this.eventHandler.on(eventType, listener)
    }

    off(eventType: string, listener: SSEEventListener): void {
        this.eventHandler.off(eventType, listener)
    }

    once(eventType: string, listener: SSEEventListener): void {
        this.eventHandler.once(eventType, listener)
    }

    // 连接状态监听
    onConnectionChange(listener: SSEConnectionListener): void {
        this.eventHandler.onConnectionChange(listener)
    }

    // 获取状态
    getState(): SSEClientState {
        return { ...this.state }
    }

    isConnected(): boolean {
        return this.state.status === SSEConnectionStatus.OPEN
    }

    // 更新配置
    updateConfig(newConfig: Partial<SSEConfig>): void {
        const oldConfig = { ...this.config }
        this.config = { ...this.config, ...newConfig }

        this.logger.info('SSE config updated', {
            old: oldConfig,
            new: this.config
        })
    }

    // 获取配置
    getConfig(): SSEConfig {
        return { ...this.config }
    }

    // 私有方法

    private bindEventHandlers(): void {
        if (!this.eventSource) return

        // 连接打开事件
        this.eventSource.onopen = (event) => {
            this.clearConnectionTimeout()
            this.state.connectionTime = Date.now()
            this.state.reconnectAttempts = 0
            this.setState(SSEConnectionStatus.OPEN)
            this.eventHandler.handleOpen()
            this.logger.info('SSE connection opened')
        }

        // 消息事件
        this.eventSource.onmessage = (event) => {
            this.eventHandler.handleRawMessage(event)
        }

        // 错误事件
        this.eventSource.onerror = (event) => {
            this.handleConnectionError(event)
        }

        // 自定义事件监听
        if (this.config.eventTypes) {
            this.config.eventTypes.forEach(eventType => {
                if (eventType !== 'message' && eventType !== 'open' && eventType !== 'error') {
                    this.eventSource!.addEventListener(eventType, (event) => {
                        this.eventHandler.handleRawMessage(event as MessageEvent)
                    })
                }
            })
        }
    }

    private handleConnectionError(error: Event | Error): void {
        this.clearConnectionTimeout()

        const sseError = createSSEError(
            error instanceof Error ? error.message : 'Connection error',
            undefined,
            true,
            error instanceof Event ? error : undefined
        )

        this.state.lastError = sseError
        this.setState(SSEConnectionStatus.ERROR)
        this.eventHandler.handleError(error)

        // 自动重连逻辑
        if (this.config.enableAutoReconnect && !this.isManualDisconnect) {
            this.scheduleReconnect()
        }

        this.logger.error('SSE connection error', sseError)
    }

    private scheduleReconnect(): void {
        if (this.state.reconnectAttempts >= (this.config.maxRetries || 5)) {
            this.logger.error('Max reconnection attempts reached')
            return
        }

        const delay = calculateBackoffDelay(
            this.state.reconnectAttempts,
            this.config.retryInterval
        )

        this.state.reconnectAttempts++
        this.logger.info(`Scheduling reconnect attempt ${this.state.reconnectAttempts} in ${delay}ms`)

        this.reconnectTimer = setTimeout(() => {
            this.connect()
        }, delay)
    }

    private setConnectionTimeout(): void {
        if (this.config.connectionTimeout) {
            this.connectionTimer = setTimeout(() => {
                if (this.state.status === SSEConnectionStatus.CONNECTING) {
                    this.logger.error('Connection timeout')
                    this.handleConnectionError(new Error('Connection timeout'))
                }
            }, this.config.connectionTimeout)
        }
    }

    private clearConnectionTimeout(): void {
        if (this.connectionTimer) {
            clearTimeout(this.connectionTimer)
            this.connectionTimer = null
        }
    }

    private clearTimers(): void {
        this.clearConnectionTimeout()
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer)
            this.reconnectTimer = null
        }
    }

    private setState(status: SSEConnectionStatus): void {
        this.state.status = status
        this.eventHandler.emitConnectionChange(status)
    }

    // 清理资源
    destroy(): void {
        this.disconnect()
        this.eventHandler.clear()
        this.logger.info('SSE Client destroyed')
    }
}