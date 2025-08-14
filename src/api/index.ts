// API 统一导出
export * from './modules/user'
export * from './modules/common'
export * from './modules/dify'
export * from './types'
export * from './config'

// SSE 模块导出
export * from './sse'

// 默认导出所有 API
import { userApi } from './modules/user'
import { commonApi } from './modules/common'
import { difyApi } from './modules/dify'

export default {
    user: userApi,
    common: commonApi,
    dify: difyApi,
}