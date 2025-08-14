import { difyApi, defaultDifyConfig } from './dify'

// 测试Dify API调用
export const testDifyAPI = async () => {
    try {
        console.log('开始测试Dify API...')

        // 测试执行工作流
        console.log('测试执行工作流...')
        const completionParams = {
            inputs: {},
            query: '测试执行工作流',
            user: 'test-user',
        }

        const completionResult = await difyApi.invokeCompletion(completionParams, defaultDifyConfig)
        console.log('工作流执行成功:', completionResult)

        return completionResult
    } catch (error) {
        console.error('Dify API测试失败:', error)
        throw error
    }
}

// 测试工作流测试功能
export const testWorkflowTest = async () => {
    try {
        console.log('开始测试工作流测试功能...')

        const testParams = {
            inputs: {},
            query: '测试工作流',
            user: 'test-user',
        }

        const result = await difyApi.invokeChat(testParams, defaultDifyConfig)
        console.log('工作流测试成功:', result)

        return result
    } catch (error) {
        console.error('工作流测试失败:', error)
        throw error
    }
}
