// Dify API 使用示例
import { difyApi, defaultDifyConfig } from './dify'
import type { DifyWorkflowParams } from './dify'

// 配置 Dify API - 直接使用默认配置
const difyConfig = defaultDifyConfig

// Dify 工作流 API 使用示例
export const difyApiExamples = {
    // 执行工作流示例
    invokeCompletionExample: async () => {
        try {
            const params: DifyWorkflowParams = {
                inputs: {},
                query: '用户输入的内容',
                user: 'test-user',
            }

            const response = await difyApi.invokeCompletion(params, difyConfig)
            console.log('工作流执行成功:', response.data)
            return response.data
        } catch (error) {
            console.error('工作流执行失败:', error)
            throw error
        }
    },

    // 测试工作流示例
    invokeChatExample: async () => {
        try {
            const params: DifyWorkflowParams = {
                inputs: {},
                query: '测试输入',
                user: 'test-user',
            }

            const response = await difyApi.invokeChat(params, difyConfig)
            console.log('工作流测试成功:', response.data)
            return response.data
        } catch (error) {
            console.error('工作流测试失败:', error)
            throw error
        }
    },
}

// 在 Vue 组件中使用示例
export const useDifyWorkflow = () => {
    const invokeCompletion = async (params: DifyWorkflowParams) => {
        try {
            const response = await difyApi.invokeCompletion(params, difyConfig)
            return response.data
        } catch (error) {
            console.error('执行工作流失败:', error)
            throw error
        }
    }

    const invokeChat = async (params: DifyWorkflowParams) => {
        try {
            const response = await difyApi.invokeChat(params, difyConfig)
            return response.data
        } catch (error) {
            console.error('测试工作流失败:', error)
            throw error
        }
    }

    return {
        invokeCompletion,
        invokeChat,
    }
}