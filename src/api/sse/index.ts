// SSE 模块主入口
export * from './types'
export * from './config'
export * from './utils'
export * from './event-handler'
export * from './client'

// 默认导出 SSE 客户端
export { SSEClient as default } from './client'

// 便捷创建函数
import { SSEClient } from './client'
import type { SSEConfig } from './types'

/**
 * 创建 SSE 客户端实例
 * @param url SSE 服务器地址
 * @param config 配置选项
 * @returns SSE 客户端实例
 */
export function createSSEClient(url: string, config: Partial<SSEConfig> = {}): SSEClient {
    return new SSEClient(url, config)
}

/**
 * SSE 工厂函数，用于快速创建和管理 SSE 连接
 */
export class SSEFactory {
    private clients: Map<string, SSEClient> = new Map()

    /**
     * 创建或获取 SSE 客户端
     * @param name 客户端名称
     * @param url SSE 服务器地址
     * @param config 配置选项
     * @returns SSE 客户端实例
     */
    create(name: string, url: string, config: Partial<SSEConfig> = {}): SSEClient {
        if (this.clients.has(name)) {
            return this.clients.get(name)!
        }

        const client = new SSEClient(url, config)
        this.clients.set(name, client)
        return client
    }

    /**
     * 获取已存在的 SSE 客户端
     * @param name 客户端名称
     * @returns SSE 客户端实例或 undefined
     */
    get(name: string): SSEClient | undefined {
        return this.clients.get(name)
    }

    /**
     * 移除 SSE 客户端
     * @param name 客户端名称
     */
    remove(name: string): void {
        const client = this.clients.get(name)
        if (client) {
            client.destroy()
            this.clients.delete(name)
        }
    }

    /**
     * 获取所有客户端名称
     * @returns 客户端名称数组
     */
    getClientNames(): string[] {
        return Array.from(this.clients.keys())
    }

    /**
     * 关闭所有 SSE 连接
     */
    destroyAll(): void {
        this.clients.forEach(client => client.destroy())
        this.clients.clear()
    }
}

// 创建全局 SSE 工厂实例
export const sseFactory = new SSEFactory()

// 导出便捷方法
export const createSSE = createSSEClient