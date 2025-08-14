import request from '../request'
import type { BaseResponse, RequestConfig } from '../types'
import { getCurrentEnv } from '../config/env'

// Dify 流式响应事件类型
export interface DifyStreamEvent {
    event: string
    task_id: string
    workflow_run_id?: string
    id?: string
    answer?: string
    created_at: number
    data?: Record<string, unknown>
    message_id?: string
    audio?: string
}

// text_chunk 事件的数据结构
export interface DifyTextChunkData {
    text: string
    from_variable_selector?: string[]
}

// Dify 工作流 API 相关类型定义
export interface DifyWorkflowParams {
    [key: string]: unknown
}

export interface DifyWorkflowResponse {
    data: unknown
    message: string
    status: string
}

export interface DifyWorkflowConfig {
    apiKey: string
    baseURL: string
    timeout?: number
}

// Dify 流式处理配置
export interface DifyStreamConfig {
    onMessage?: (event: DifyStreamEvent) => void
    onWorkflowStarted?: (event: DifyStreamEvent) => void
    onNodeStarted?: (event: DifyStreamEvent) => void
    onNodeFinished?: (event: DifyStreamEvent) => void
    onWorkflowFinished?: (event: DifyStreamEvent) => void
    onTTSMessage?: (event: DifyStreamEvent) => void
    onTextChunk?: (text: string, fullText: string) => void
    onError?: (error: Error) => void
    onComplete?: () => void
}

// Dify 流式响应解析器
export class DifyStreamParser {
    private buffer = ''
    private config: DifyStreamConfig
    private accumulatedText = ''

    constructor(config: DifyStreamConfig = {}) {
        this.config = config
    }

    // 解析流式数据
    parseChunk(chunk: string): void {
        this.buffer += chunk

        // 查找完整的数据块（以 \n\n 分隔）
        const chunks = this.buffer.split('\n\n')

        // 保留最后一个可能不完整的块
        this.buffer = chunks.pop() || ''

        // 处理完整的块
        for (const chunk of chunks) {
            if (chunk.startsWith('data: ')) {
                try {
                    const jsonStr = chunk.substring(6) // 去掉 'data: ' 前缀
                    const event: DifyStreamEvent = JSON.parse(jsonStr)
                    this.handleEvent(event)
                } catch (error) {
                    console.warn('Failed to parse Dify stream event:', error)
                }
            }
        }
    }

    // 处理不同类型的事件
    private handleEvent(event: DifyStreamEvent): void {
        // 通用消息回调
        if (this.config.onMessage) {
            this.config.onMessage(event)
        }

        // 根据事件类型调用对应的回调
        switch (event.event) {
            case 'workflow_started':
                if (this.config.onWorkflowStarted) {
                    this.config.onWorkflowStarted(event)
                }
                break
            case 'node_started':
                if (this.config.onNodeStarted) {
                    this.config.onNodeStarted(event)
                }
                break
            case 'node_finished':
                if (this.config.onNodeFinished) {
                    this.config.onNodeFinished(event)
                }
                break
            case 'workflow_finished':
                if (this.config.onWorkflowFinished) {
                    this.config.onWorkflowFinished(event)
                }
                // 工作流结束时调用完成回调
                if (this.config.onComplete) {
                    this.config.onComplete()
                }
                break
            case 'tts_message':
                if (this.config.onTTSMessage) {
                    this.config.onTTSMessage(event)
                }
                break
            case 'text_chunk':
                if (this.config.onTextChunk && event.data) {
                    const data = event.data as Record<string, unknown>
                    if (data.text && typeof data.text === 'string') {
                        this.accumulatedText += data.text
                        this.config.onTextChunk(data.text, this.accumulatedText)
                    }
                }
                break
            case 'ping':
                // ping事件不需要特殊处理
                break
            default:
                console.log('Unknown Dify event type:', event.event)
        }
    }

    // 重置解析器状态
    reset(): void {
        this.buffer = ''
        this.accumulatedText = ''
    }
}

// Dify API
export const difyApi = {
    // 执行工作流
    invokeCompletion: (
        params: DifyWorkflowParams,
        config?: Partial<DifyWorkflowConfig>
    ) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        // 如果提供了 API Key，添加到请求头
        if (config?.apiKey) {
            headers['Authorization'] = `Bearer ${config.apiKey}`
        }

        const requestConfig: RequestConfig = {
            url: 'workflows/run',
            method: 'POST',
            data: params,
            headers,
            timeout: config?.timeout || 30000,
            showLoading: true,
        }

        return request<BaseResponse<DifyWorkflowResponse>>(requestConfig)
    },

    // 测试工作流
    invokeChat: (
        params: DifyWorkflowParams,
        config?: Partial<DifyWorkflowConfig>
    ) => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        // 如果提供了 API Key，添加到请求头
        if (config?.apiKey) {
            headers['Authorization'] = `Bearer ${config.apiKey}`
        }

        const requestConfig: RequestConfig = {
            url: `workflows/run/${params.workflow_id}`,
            method: 'POST',
            data: params,
            headers,
            timeout: config?.timeout || 30000,
            showLoading: true,
        }

        return request<BaseResponse<DifyWorkflowResponse>>(requestConfig)
    },

    // 流式执行工作流
    invokeCompletionStream: async (
        params: DifyWorkflowParams,
        streamConfig: DifyStreamConfig,
        config?: Partial<DifyWorkflowConfig>
    ): Promise<void> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        // 如果提供了 API Key，添加到请求头
        if (config?.apiKey) {
            headers['Authorization'] = `Bearer ${config.apiKey}`
        }

        try {
            const baseURL = config?.baseURL || getCurrentEnv().DIFY_API_BASE_URL
            const url = new URL('workflows/run', baseURL)
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers,
                body: JSON.stringify(params),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            if (!response.body) {
                throw new Error('Response body is null')
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            const parser = new DifyStreamParser(streamConfig)

            try {
                while (true) {
                    const { done, value } = await reader.read()

                    if (done) {
                        break
                    }

                    const chunk = decoder.decode(value, { stream: true })
                    parser.parseChunk(chunk)
                }
            } finally {
                reader.releaseLock()
            }
        } catch (error) {
            if (streamConfig.onError) {
                streamConfig.onError(error instanceof Error ? error : new Error(String(error)))
            }
        }
    },

    // 流式测试工作流
    invokeChatStream: async (
        params: DifyWorkflowParams,
        streamConfig: DifyStreamConfig,
        config?: Partial<DifyWorkflowConfig>
    ): Promise<void> => {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        // 如果提供了 API Key，添加到请求头
        if (config?.apiKey) {
            headers['Authorization'] = `Bearer ${config.apiKey}`
        }

        try {
            const baseURL = config?.baseURL || getCurrentEnv().DIFY_API_BASE_URL
            const url = new URL(`workflows/run/${params.workflow_id}`, baseURL)
            const response = await fetch(url.toString(), {
                method: 'POST',
                headers,
                body: JSON.stringify(params),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            if (!response.body) {
                throw new Error('Response body is null')
            }

            const reader = response.body.getReader()
            const decoder = new TextDecoder()
            const parser = new DifyStreamParser(streamConfig)

            try {
                while (true) {
                    const { done, value } = await reader.read()

                    if (done) {
                        break
                    }

                    const chunk = decoder.decode(value, { stream: true })
                    parser.parseChunk(chunk)
                }
            } finally {
                reader.releaseLock()
            }
        } catch (error) {
            if (streamConfig.onError) {
                streamConfig.onError(error instanceof Error ? error : new Error(String(error)))
            }
        }
    },
}

// 默认配置
export const defaultDifyConfig: DifyWorkflowConfig = {
    apiKey: getCurrentEnv().DIFY_API_KEY,
    baseURL: getCurrentEnv().DIFY_API_BASE_URL,
    timeout: 30000,
}