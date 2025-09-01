import type { BaseResponse } from '../types'
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
    // 文件相关字段
    type?: string
    belongs_to?: string
    url?: string
    conversation_id?: string
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
    onFileReceived?: (fileInfo: { id: string; type: string; belongs_to: string; url: string; conversation_id: string }) => void
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
        console.log('收到原始数据块:', chunk)
        this.buffer += chunk

        // 查找完整的数据块（以 \n\n 分隔）
        const chunks = this.buffer.split('\n\n')
        console.log('分割后的数据块数量:', chunks.length)

        // 保留最后一个可能不完整的块
        this.buffer = chunks.pop() || ''

        // 处理完整的块
        for (const chunk of chunks) {
            if (chunk.startsWith('data: ')) {
                try {
                    const jsonStr = chunk.substring(6) // 去掉 'data: ' 前缀
                    console.log('解析流式数据块:', jsonStr)
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
            } else if (chunk.trim()) {
                // 记录非标准数据块，帮助调试
                console.log('非标准数据块:', chunk)

                // 尝试直接解析为JSON，可能是直接的文本响应
                try {
                    const data = JSON.parse(chunk)
                    console.log('直接解析JSON成功:', data)

                    // 如果是直接的文本响应，直接调用 onTextChunk
                    if (this.config.onTextChunk && data.text) {
                        this.accumulatedText += data.text
                        this.config.onTextChunk(data.text, this.accumulatedText)
                    } else if (this.config.onTextChunk && data.answer) {
                        this.accumulatedText += data.answer
                        this.config.onTextChunk(data.answer, this.accumulatedText)
                    }
                } catch {
                    console.log('直接JSON解析失败，可能是纯文本:', chunk)
                    // 如果是纯文本，直接作为文本块处理
                    if (this.config.onTextChunk && chunk.trim()) {
                        this.accumulatedText += chunk.trim()
                        this.config.onTextChunk(chunk.trim(), this.accumulatedText)
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
            case 'message':
                // 处理 chat-messages 接口的消息事件
                if (this.config.onTextChunk && event.data) {
                    const data = event.data as Record<string, unknown>
                    if (data.answer && typeof data.answer === 'string') {
                        this.accumulatedText += data.answer
                        this.config.onTextChunk(data.answer, this.accumulatedText)
                    }
                } else if (this.config.onTextChunk && event.answer) {
                    // 直接处理 answer 字段（如果 answer 在顶层）
                    this.accumulatedText += event.answer
                    this.config.onTextChunk(event.answer, this.accumulatedText)
                }
                break
            case 'message_end':
                // 处理 chat-messages 接口的消息结束事件
                if (this.config.onComplete) {
                    this.config.onComplete()
                }
                break
            case 'message_file':
                // 处理文件事件
                if (this.config.onFileReceived) {
                    const fileInfo = {
                        id: event.id || '',
                        type: event.type || '',
                        belongs_to: event.belongs_to || '',
                        url: event.url || '',
                        conversation_id: event.conversation_id || ''
                    }
                    this.config.onFileReceived(fileInfo)
                }
                break
            case 'ping':
                // ping事件不需要特殊处理
                console.log('收到 ping 事件')
                break
            default:
                console.log('Unknown Dify event type:', event.event, event)
        }
    }

    // 重置解析器状态
    reset(): void {
        this.buffer = ''
        this.accumulatedText = ''
    }
}

// ========== 重构后的架构 ==========

// 1. API 端点配置
export interface ApiMethodConfig {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    path: string
    description?: string
}

// API 端点定义
export const API_ENDPOINTS = {
    workflow: {
        invoke: {
            method: 'POST',
            path: 'workflows/run',
            description: '执行工作流'
        } as ApiMethodConfig,

        invokeById: {
            method: 'POST',
            path: 'workflows/run/{id}',
            description: '根据ID执行工作流'
        } as ApiMethodConfig,

        list: {
            method: 'GET',
            path: 'workflows',
            description: '获取工作流列表'
        } as ApiMethodConfig,

        getById: {
            method: 'GET',
            path: 'workflows/{id}',
            description: '获取工作流详情'
        } as ApiMethodConfig
    },

    chat: {
        createMessage: {
            method: 'POST',
            path: 'chat-messages',
            description: '创建聊天消息'
        } as ApiMethodConfig,

        getMessages: {
            method: 'GET',
            path: 'chat-messages',
            description: '获取聊天消息'
        } as ApiMethodConfig
    },

    stream: {
        invoke: {
            method: 'POST',
            path: 'workflows/run',
            description: '流式执行工作流'
        } as ApiMethodConfig,

        chat: {
            method: 'POST',
            path: 'workflows/run/{id}',
            description: '流式聊天'
        } as ApiMethodConfig
    }
} as const

// 2. 请求构建器
export class RequestBuilder {
    private endpoint: ApiMethodConfig
    private pathParams: Record<string, string | number> = {}
    private queryParams: Record<string, unknown> = {}
    private requestBody: unknown = null
    private headers: Record<string, string> = {}

    constructor(endpoint: ApiMethodConfig) {
        this.endpoint = endpoint
    }

    // 设置路径参数
    pathParam(key: string, value: string | number): RequestBuilder {
        this.pathParams[key] = value
        return this
    }

    // 设置查询参数
    queryParam(key: string, value: unknown): RequestBuilder {
        this.queryParams[key] = value
        return this
    }

    // 设置请求体
    body(data: unknown): RequestBuilder {
        this.requestBody = data
        return this
    }

    // 设置请求头
    header(key: string, value: string): RequestBuilder {
        this.headers[key] = value
        return this
    }

    // 构建请求
    build(): DifyRequest {
        let finalPath = this.endpoint.path

        // 替换路径参数
        for (const [key, value] of Object.entries(this.pathParams)) {
            finalPath = finalPath.replace(`{${key}}`, String(value))
        }

        // 构建查询字符串
        const queryString = Object.entries(this.queryParams)
            .filter(([, value]) => value !== undefined && value !== null)
            .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
            .join('&')

        if (queryString) {
            finalPath += `?${queryString}`
        }

        return {
            method: this.endpoint.method,
            path: finalPath,
            body: this.requestBody,
            headers: this.headers
        }
    }
}

// 3. 请求对象
export interface DifyRequest {
    method: string
    path: string
    body?: unknown
    headers?: Record<string, string>
}

// 4. Dify 客户端
export class DifyClient {
    private baseURL: string
    private apiKey: string
    private timeout: number

    constructor(config: DifyWorkflowConfig) {
        this.baseURL = config.baseURL
        this.apiKey = config.apiKey
        this.timeout = config.timeout || 30000
    }

    // 创建请求构建器
    request(endpoint: ApiMethodConfig): RequestBuilder {
        return new RequestBuilder(endpoint)
    }

    // 执行请求
    async execute<T>(request: DifyRequest): Promise<T> {
        const url = new URL(request.path, this.baseURL).toString()

        const response = await fetch(url, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                ...request.headers
            },
            body: request.body ? JSON.stringify(request.body) : undefined,
            signal: AbortSignal.timeout(this.timeout)
        })

        if (!response.ok) {
            throw new DifyError(`HTTP ${response.status}: ${response.statusText}`)
        }

        return response.json()
    }

    // 执行流式请求
    async executeStream(
        request: DifyRequest,
        streamConfig: DifyStreamConfig
    ): Promise<void> {
        const url = new URL(request.path, this.baseURL).toString()

        const response = await fetch(url, {
            method: request.method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`,
                ...request.headers
            },
            body: request.body ? JSON.stringify(request.body) : undefined,
            signal: AbortSignal.timeout(this.timeout)
        })

        if (!response.ok) {
            throw new DifyStreamError(`HTTP ${response.status}: ${response.statusText}`)
        }

        if (!response.body) {
            throw new DifyStreamError('Response body is null')
        }

        // 处理流式响应
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        const parser = new DifyStreamParser(streamConfig)

        try {
            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                parser.parseChunk(chunk)
            }
        } finally {
            reader.releaseLock()
        }
    }
}

// 5. 重构后的 API 调用层
export const difyApi = {
    // 创建客户端实例
    client(config?: Partial<DifyWorkflowConfig>): DifyClient {
        const finalConfig = {
            ...defaultDifyConfig,
            ...config
        }
        return new DifyClient(finalConfig)
    },

    // 工作流相关
    workflow: {
        // 执行工作流
        invoke: (params: DifyWorkflowParams, config?: Partial<DifyWorkflowConfig>) => {
            const client = difyApi.client(config)
            const request = client
                .request(API_ENDPOINTS.workflow.invoke)
                .body(params)
                .build()
            return client.execute<BaseResponse<DifyWorkflowResponse<unknown>>>(request)
        },

        // 根据ID执行工作流
        invokeById: (workflowId: string, params: DifyWorkflowParams, config?: Partial<DifyWorkflowConfig>) => {
            const client = difyApi.client(config)
            const request = client
                .request(API_ENDPOINTS.workflow.invokeById)
                .pathParam('id', workflowId)
                .body(params)
                .build()
            return client.execute<BaseResponse<DifyWorkflowResponse<unknown>>>(request)
        },

        // 获取工作流列表
        list: (page?: number, size?: number, config?: Partial<DifyWorkflowConfig>) => {
            const client = difyApi.client(config)
            const request = client
                .request(API_ENDPOINTS.workflow.list)
                .queryParam('page', page || 1)
                .queryParam('size', size || 20)
                .build()
            return client.execute<BaseResponse<DifyWorkflowResponse<unknown[]>>>(request)
        },

        // 获取工作流详情
        getById: (workflowId: string, config?: Partial<DifyWorkflowConfig>) => {
            const client = difyApi.client(config)
            const request = client
                .request(API_ENDPOINTS.workflow.getById)
                .pathParam('id', workflowId)
                .build()
            return client.execute<BaseResponse<DifyWorkflowResponse<unknown>>>(request)
        }
    },

    // 聊天相关
    chat: {
        // 创建消息（支持流式）
        createMessage: (params: Record<string, unknown>, streamConfig?: DifyStreamConfig, config?: Partial<DifyWorkflowConfig>) => {
            const client = difyApi.client(config)
            const request = client
                .request(API_ENDPOINTS.workflow.invoke)
                .body(params)
                .build()

            // 如果提供了流式配置，使用流式执行
            if (streamConfig) {
                return client.executeStream(request, streamConfig)
            }

            // 否则使用普通执行
            return client.execute<BaseResponse<unknown>>(request)
        },


        // 获取消息
        getMessages: (conversationId: string, limit?: number, config?: Partial<DifyWorkflowConfig>) => {
            const client = difyApi.client(config)
            const request = client
                .request(API_ENDPOINTS.chat.getMessages)
                .queryParam('conversation_id', conversationId)
                .queryParam('limit', limit || 50)
                .build()
            return client.execute<BaseResponse<unknown[]>>(request)
        }
    },

    // 流式相关
    stream: {
        // 流式执行工作流
        invoke: (params: DifyWorkflowParams, streamConfig: DifyStreamConfig, config?: Partial<DifyWorkflowConfig>) => {
            const client = difyApi.client(config)
            const request = client
                .request(API_ENDPOINTS.stream.invoke)
                .body(params)
                .build()
            return client.executeStream(request, streamConfig)
        },

        // 流式聊天
        chat: (workflowId: string, params: DifyWorkflowParams, streamConfig: DifyStreamConfig, config?: Partial<DifyWorkflowConfig>) => {
            const client = difyApi.client(config)
            const request = client
                .request(API_ENDPOINTS.stream.chat)
                .pathParam('id', workflowId)
                .body(params)
                .build()
            return client.executeStream(request, streamConfig)
        }
    },

    // 便捷方法：使用默认配置
    withDefaultConfig() {
        return {
            workflow: {
                invoke: (params: DifyWorkflowParams) => difyApi.workflow.invoke(params),
                invokeById: (workflowId: string, params: DifyWorkflowParams) =>
                    difyApi.workflow.invokeById(workflowId, params),
                list: (page?: number, size?: number) =>
                    difyApi.workflow.list(page, size),
                getById: (workflowId: string) =>
                    difyApi.workflow.getById(workflowId)
            },
            chat: {
                createMessage: (params: Record<string, unknown>, streamConfig?: DifyStreamConfig) =>
                    difyApi.chat.createMessage(params, streamConfig),
                getMessages: (conversationId: string, limit?: number) =>
                    difyApi.chat.getMessages(conversationId, limit)
            },
            stream: {
                invoke: (params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
                    difyApi.stream.invoke(params, streamConfig),
                chat: (workflowId: string, params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
                    difyApi.stream.chat(workflowId, params, streamConfig)
            }
        }
    },

    // 便捷方法：链式配置
    withConfig(config: Partial<DifyWorkflowConfig>) {
        return {
            workflow: {
                invoke: (params: DifyWorkflowParams) => difyApi.workflow.invoke(params, config),
                invokeById: (workflowId: string, params: DifyWorkflowParams) =>
                    difyApi.workflow.invokeById(workflowId, params, config),
                list: (page?: number, size?: number) =>
                    difyApi.workflow.list(page, size, config),
                getById: (workflowId: string) =>
                    difyApi.workflow.getById(workflowId, config)
            },
            chat: {
                createMessage: (params: Record<string, unknown>, streamConfig?: DifyStreamConfig) =>
                    difyApi.chat.createMessage(params, streamConfig, config),
                getMessages: (conversationId: string, limit?: number) =>
                    difyApi.chat.getMessages(conversationId, limit, config)
            },
            stream: {
                invoke: (params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
                    difyApi.stream.invoke(params, streamConfig, config),
                chat: (workflowId: string, params: DifyWorkflowParams, streamConfig: DifyStreamConfig) =>
                    difyApi.stream.chat(workflowId, params, streamConfig, config)
            }
        }
    }
}

// 默认配置
export const defaultDifyConfig: DifyWorkflowConfig = {
    apiKey: getCurrentEnv().DIFY_BROWSER_API_KEY,
    baseURL: getCurrentEnv().DIFY_BROWSER_API_BASE_URL,
    timeout: 30000,
}