import type {
    SSEEvent,
    SSEEventListener,
    SSEConnectionListener,
    SSEConnectionStatus
} from './types'
import { SSELogger, parseSSEMessage, createSSEEvent } from './utils'

// 事件处理器类
export class SSEEventHandler {
    private logger: SSELogger
    private eventListeners: Map<string, Set<SSEEventListener>>
    private connectionListeners: Set<SSEConnectionListener>
    private onceListeners: Map<string, Set<SSEEventListener>>

    constructor(logger: SSELogger) {
        this.logger = logger
        this.eventListeners = new Map()
        this.connectionListeners = new Set()
        this.onceListeners = new Map()
    }

    // 添加事件监听器
    on(eventType: string, listener: SSEEventListener): void {
        if (!this.eventListeners.has(eventType)) {
            this.eventListeners.set(eventType, new Set())
        }
        this.eventListeners.get(eventType)!.add(listener)
        this.logger.debug(`Added listener for event: ${eventType}`)
    }

    // 移除事件监听器
    off(eventType: string, listener: SSEEventListener): void {
        const listeners = this.eventListeners.get(eventType)
        if (listeners) {
            listeners.delete(listener)
            if (listeners.size === 0) {
                this.eventListeners.delete(eventType)
            }
            this.logger.debug(`Removed listener for event: ${eventType}`)
        }
    }

    // 添加一次性事件监听器
    once(eventType: string, listener: SSEEventListener): void {
        if (!this.onceListeners.has(eventType)) {
            this.onceListeners.set(eventType, new Set())
        }
        this.onceListeners.get(eventType)!.add(listener)
        this.logger.debug(`Added once listener for event: ${eventType}`)
    }

    // 添加连接状态监听器
    onConnectionChange(listener: SSEConnectionListener): void {
        this.connectionListeners.add(listener)
        this.logger.debug('Added connection change listener')
    }

    // 移除连接状态监听器
    offConnectionChange(listener: SSEConnectionListener): void {
        this.connectionListeners.delete(listener)
        this.logger.debug('Removed connection change listener')
    }

    // 触发事件
    emit(eventType: string, data: any, id?: string, retry?: number): void {
        const event = createSSEEvent(eventType, data, id, retry)

        // 触发普通监听器
        const listeners = this.eventListeners.get(eventType)
        if (listeners) {
            listeners.forEach(listener => {
                try {
                    listener(event)
                } catch (error) {
                    this.logger.error(`Error in event listener for ${eventType}:`, error)
                }
            })
        }

        // 触发一次性监听器
        const onceListeners = this.onceListeners.get(eventType)
        if (onceListeners) {
            onceListeners.forEach(listener => {
                try {
                    listener(event)
                } catch (error) {
                    this.logger.error(`Error in once event listener for ${eventType}:`, error)
                }
            })
            // 清除一次性监听器
            this.onceListeners.delete(eventType)
        }

        this.logger.debug(`Emitted event: ${eventType}`, event)
    }

    // 触发连接状态变化
    emitConnectionChange(status: SSEConnectionStatus): void {
        this.connectionListeners.forEach(listener => {
            try {
                listener(status)
            } catch (error) {
                this.logger.error('Error in connection change listener:', error)
            }
        })
        this.logger.debug(`Connection status changed to: ${status}`)
    }

    // 处理原始 SSE 消息
    handleRawMessage(event: MessageEvent): void {
        try {
            const parsedMessage = parseSSEMessage(event.data)

            if (!parsedMessage.valid) {
                this.logger.warn('Invalid SSE message received:', event.data)
                return
            }

            // 触发解析后的事件
            this.emit(
                parsedMessage.type,
                parsedMessage.data,
                parsedMessage.id,
                parsedMessage.retry
            )

        } catch (error) {
            this.logger.error('Error parsing SSE message:', error)
        }
    }

    // 处理连接打开事件
    handleOpen(): void {
        this.emitConnectionChange(SSEConnectionStatus.OPEN)
        this.emit('open', { timestamp: Date.now() })
    }

    // 处理连接错误事件
    handleError(error: Event): void {
        this.emitConnectionChange(SSEConnectionStatus.ERROR)
        this.emit('error', { error, timestamp: Date.now() })
    }

    // 处理连接关闭事件
    handleClose(): void {
        this.emitConnectionChange(SSEConnectionStatus.CLOSED)
        this.emit('close', { timestamp: Date.now() })
    }

    // 清理所有监听器
    clear(): void {
        this.eventListeners.clear()
        this.onceListeners.clear()
        this.connectionListeners.clear()
        this.logger.debug('Cleared all event listeners')
    }

    // 获取监听器数量
    getListenerCount(eventType?: string): number {
        if (eventType) {
            const listeners = this.eventListeners.get(eventType)
            const onceListeners = this.onceListeners.get(eventType)
            return (listeners?.size || 0) + (onceListeners?.size || 0)
        }

        let total = 0
        for (const listeners of this.eventListeners.values()) {
            total += listeners.size
        }
        for (const listeners of this.onceListeners.values()) {
            total += listeners.size
        }
        return total
    }

    // 检查是否有监听器
    hasListeners(eventType?: string): boolean {
        if (eventType) {
            return this.eventListeners.has(eventType) || this.onceListeners.has(eventType)
        }
        return this.eventListeners.size > 0 || this.onceListeners.size > 0
    }
}