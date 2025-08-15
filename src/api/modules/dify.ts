import request from '../request'
import type { BaseResponse, RequestConfig } from '../types'
import { getCurrentEnv } from '../config/env'

// Dify 错误类型
export class DifyError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string,
        public details?: unknown
    ) {
        super(message)
        this.name = 'DifyError'
    }
}

export class DifyStreamError extends DifyError {
    constructor(
        message: string,
        public event?: DifyStreamEvent,
        public originalError?: Error
    ) {
        super(message)
        this.name = 'DifyStreamError'
    }
}

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
    workflow_id?: string
    inputs?: Record<string, unknown>
    query?: string
    user?: string
    conversation_id?: string
    [key: string]: unknown
}

export interface DifyWorkflowResponse<T = unknown> {
    data: T
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
    onError?: (error: DifyStreamError) => void
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
                    const parseError = new DifyStreamError(
                        'Failed to parse Dify stream event',
                        undefined,
                        error instanceof Error ? error : new Error(String(error))
                    )
                    if (this.config.onError) {
                        this.config.onError(parseError)
                    } else {
                        console.warn('Failed to parse Dify stream event:', error)
                    }
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

// Dify 配置构建器
export class DifyConfigBuilder {
    private config: Partial<DifyWorkflowConfig> = {}

    constructor(baseConfig?: Partial<DifyWorkflowConfig>) {
        if (baseConfig) {
            this.config = { ...baseConfig }
        }
    }

    withApiKey(apiKey: string): DifyConfigBuilder {
        this.config.apiKey = apiKey
        return this
    }

    withBaseURL(baseURL: string): DifyConfigBuilder {
        this.config.baseURL = baseURL
        return this
    }

    withTimeout(timeout: number): DifyConfigBuilder {
        this.config.timeout = timeout
        return this
    }

    build(): DifyWorkflowConfig {
        return {
            apiKey: this.config.apiKey || getCurrentEnv().DIFY_API_KEY,
            baseURL: this.config.baseURL || getCurrentEnv().DIFY_API_BASE_URL,
            timeout: this.config.timeout || 30000,
        }
    }

    // 静态工厂方法
    static fromEnv(): DifyConfigBuilder {
        return new DifyConfigBuilder()
    }

    static fromConfig(config: Partial<DifyWorkflowConfig>): DifyConfigBuilder {
        return new DifyConfigBuilder(config)
    }
}

// 统一的流式请求处理函数
async function _handleStreamRequest(
    params: DifyWorkflowParams,
    streamConfig: DifyStreamConfig,
    config: Partial<DifyWorkflowConfig> | undefined,
    urlBuilder: (baseURL: string, params: DifyWorkflowParams) => string
): Promise<void> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    }

    // 如果提供了 API Key，添加到请求头
    if (config?.apiKey) {
        headers['Authorization'] = `Bearer ${config.apiKey}`
    }

    try {
        const baseURL = config?.baseURL || getCurrentEnv().DIFY_API_BASE_URL
        const url = urlBuilder(baseURL, params)
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(params),
        })

        if (!response.ok) {
            const error = new DifyStreamError(
                `HTTP error! status: ${response.status}`,
                undefined,
                new Error(`HTTP ${response.status}: ${response.statusText}`)
            )
            if (streamConfig.onError) {
                streamConfig.onError(error)
            }
            return
        }

        if (!response.body) {
            const error = new DifyStreamError('Response body is null')
            if (streamConfig.onError) {
                streamConfig.onError(error)
            }
            return
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
        const streamError = new DifyStreamError(
            'Stream request failed',
            undefined,
            error instanceof Error ? error : new Error(String(error))
        )
        if (streamConfig.onError) {
            streamConfig.onError(streamError)
        }
    }
}

// Dify API
export const difyApi = {
    // 执行工作流
    invokeCompletion: <T = unknown>(
        params: DifyWorkflowParams,
        config?: Partial<DifyWorkflowConfig> | DifyConfigBuilder
    ) => {
        const finalConfig = config instanceof DifyConfigBuilder ? config.build() : config

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        // 如果提供了 API Key，添加到请求头
        if (finalConfig?.apiKey) {
            headers['Authorization'] = `Bearer ${finalConfig.apiKey}`
        }

        const requestConfig: RequestConfig = {
            url: 'workflows/run',
            method: 'POST',
            data: params,
            headers,
            timeout: finalConfig?.timeout || 30000,
            showLoading: true,
        }

        return request<BaseResponse<DifyWorkflowResponse<T>>>(requestConfig)
    },

    // 测试工作流
    invokeChat: <T = unknown>(
        params: DifyWorkflowParams,
        config?: Partial<DifyWorkflowConfig> | DifyConfigBuilder
    ) => {
        const finalConfig = config instanceof DifyConfigBuilder ? config.build() : config

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
        }

        // 如果提供了 API Key，添加到请求头
        if (finalConfig?.apiKey) {
            headers['Authorization'] = `Bearer ${finalConfig.apiKey}`
        }

        const requestConfig: RequestConfig = {
            url: `workflows/run/${params.workflow_id}`,
            method: 'POST',
            data: params,
            headers,
            timeout: finalConfig?.timeout || 30000,
            showLoading: true,
        }

        return request<BaseResponse<DifyWorkflowResponse<T>>>(requestConfig)
    },

    // 流式执行工作流
    invokeCompletionStream: (
        params: DifyWorkflowParams,
        streamConfig: DifyStreamConfig,
        config?: Partial<DifyWorkflowConfig> | DifyConfigBuilder
    ): Promise<void> => {
        const finalConfig = config instanceof DifyConfigBuilder ? config.build() : config

        return _handleStreamRequest(
            params,
            streamConfig,
            finalConfig,
            (baseURL) => new URL('workflows/run', baseURL).toString()
        )
    },

    // 流式测试工作流
    invokeChatStream: (
        params: DifyWorkflowParams,
        streamConfig: DifyStreamConfig,
        config?: Partial<DifyWorkflowConfig> | DifyConfigBuilder
    ): Promise<void> => {
        const finalConfig = config instanceof DifyConfigBuilder ? config.build() : config

        return _handleStreamRequest(
            params,
            streamConfig,
            finalConfig,
            (baseURL, params) => new URL(`workflows/run/${params.workflow_id}`, baseURL).toString()
        )
    },

    // 便捷方法：使用默认配置
    withDefaultConfig() {
        return {
            invokeCompletion: <T = unknown>(params: DifyWorkflowParams) =>
                this.invokeCompletion<T>(params, defaultDifyConfig),
            invokeChat: <T = unknown>(params: DifyWorkflowParams) =>
                this.invokeChat<T>(params, defaultDifyConfig),
            invokeCompletionStream: (params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
                this.invokeCompletionStream(params, streamConfig, defaultDifyConfig),
            invokeChatStream: (params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
                this.invokeChatStream(params, streamConfig, defaultDifyConfig),
        }
    },

    // 便捷方法：创建配置构建器
    config() {
        return DifyConfigBuilder.fromEnv()
    },

    // 便捷方法：快速调用（使用环境变量配置）
    quick: {
        // 快速执行工作流
        invoke: <T = unknown>(params: DifyWorkflowParams) =>
            difyApi.invokeCompletion<T>(params, defaultDifyConfig),

        // 快速测试工作流
        chat: <T = unknown>(params: DifyWorkflowParams) =>
            difyApi.invokeChat<T>(params, defaultDifyConfig),

        // 快速流式执行
        stream: (params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
            difyApi.invokeCompletionStream(params, streamConfig, defaultDifyConfig),

        // 快速流式聊天
        chatStream: (params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
            difyApi.invokeChatStream(params, streamConfig, defaultDifyConfig),
    },

    // 便捷方法：链式配置
    withConfig(config: Partial<DifyWorkflowConfig>) {
        return {
            invokeCompletion: <T = unknown>(params: DifyWorkflowParams) =>
                this.invokeCompletion<T>(params, config),
            invokeChat: <T = unknown>(params: DifyWorkflowParams) =>
                this.invokeChat<T>(params, config),
            invokeCompletionStream: (params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
                this.invokeCompletionStream(params, streamConfig, config),
            invokeChatStream: (params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
                this.invokeChatStream(params, streamConfig, config),
        }
    },
}

// 默认配置
export const defaultDifyConfig: DifyWorkflowConfig = {
    apiKey: getCurrentEnv().DIFY_API_KEY,
    baseURL: getCurrentEnv().DIFY_API_BASE_URL,
    timeout: 30000,
}