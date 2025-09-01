// API 统一导出
export * from './modules/dify'
export * from './types'
export * from './config'

// SSE 模块导出
export * from './sse'

// 默认导出所有 API
import { difyApi } from './modules/dify'

export default {
    dify: difyApi,
}