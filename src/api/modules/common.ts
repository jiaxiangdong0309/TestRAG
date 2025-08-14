import request from '../request'
import type { BaseResponse, UploadResponse, SearchParams } from '../types'

// 通用 API
export const commonApi = {
    // 文件上传
    uploadFile: (file: File, type: 'image' | 'document' | 'video' = 'image') => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        return request<BaseResponse<UploadResponse>>({
            url: '/upload/file',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            showLoading: true,
        })
    },

    // 批量文件上传
    uploadFiles: (files: File[], type: 'image' | 'document' | 'video' = 'image') => {
        const formData = new FormData()
        files.forEach((file, index) => {
            formData.append(`files[${index}]`, file)
        })
        formData.append('type', type)

        return request<BaseResponse<UploadResponse[]>>({
            url: '/upload/files',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            showLoading: true,
        })
    },

    // 删除文件
    deleteFile: (fileUrl: string) => {
        return request<BaseResponse<null>>({
            url: '/upload/file',
            method: 'DELETE',
            data: { url: fileUrl },
            showLoading: true,
        })
    },

    // 获取系统配置
    getSystemConfig: () => {
        return request<BaseResponse<Record<string, any>>>({
            url: '/config/system',
            method: 'GET',
            showLoading: false,
        })
    },

    // 获取字典数据
    getDictionary: (type: string) => {
        return request<BaseResponse<Record<string, any>>>({
            url: `/config/dictionary/${type}`,
            method: 'GET',
            showLoading: false,
        })
    },

    // 获取地区数据
    getRegions: (parentId?: number) => {
        return request<BaseResponse<Array<{ id: number; name: string; code: string }>>>({
            url: '/config/regions',
            method: 'GET',
            params: { parentId },
            showLoading: false,
        })
    },

    // 获取验证码
    getCaptcha: () => {
        return request<BaseResponse<{ captchaId: string; captchaImage: string }>>({
            url: '/captcha',
            method: 'GET',
            showLoading: false,
        })
    },

    // 验证验证码
    verifyCaptcha: (captchaId: string, captchaCode: string) => {
        return request<BaseResponse<{ valid: boolean }>>({
            url: '/captcha/verify',
            method: 'POST',
            data: { captchaId, captchaCode },
            showLoading: false,
        })
    },

    // 发送短信验证码
    sendSmsCode: (phone: string, type: 'login' | 'register' | 'reset') => {
        return request<BaseResponse<{ messageId: string }>>({
            url: '/sms/send',
            method: 'POST',
            data: { phone, type },
            showLoading: true,
        })
    },

    // 验证短信验证码
    verifySmsCode: (phone: string, code: string, type: 'login' | 'register' | 'reset') => {
        return request<BaseResponse<{ valid: boolean }>>({
            url: '/sms/verify',
            method: 'POST',
            data: { phone, code, type },
            showLoading: false,
        })
    },

    // 获取服务器时间
    getServerTime: () => {
        return request<BaseResponse<{ timestamp: number; timezone: string }>>({
            url: '/time',
            method: 'GET',
            showLoading: false,
        })
    },

    // 健康检查
    healthCheck: () => {
        return request<BaseResponse<{ status: 'ok' | 'error'; message: string }>>({
            url: '/health',
            method: 'GET',
            showLoading: false,
        })
    },

    // 获取应用版本信息
    getVersion: () => {
        return request<BaseResponse<{ version: string; buildTime: string; commitHash: string }>>({
            url: '/version',
            method: 'GET',
            showLoading: false,
        })
    },

    // 获取通知列表
    getNotifications: (params?: SearchParams) => {
        return request<BaseResponse<Array<{
            id: number
            title: string
            content: string
            type: 'info' | 'warning' | 'error' | 'success'
            isRead: boolean
            createdAt: string
        }>>>({
            url: '/notifications',
            method: 'GET',
            params,
            showLoading: false,
        })
    },

    // 标记通知为已读
    markNotificationRead: (notificationId: number) => {
        return request<BaseResponse<null>>({
            url: `/notifications/${notificationId}/read`,
            method: 'PUT',
            showLoading: false,
        })
    },

    // 标记所有通知为已读
    markAllNotificationsRead: () => {
        return request<BaseResponse<null>>({
            url: '/notifications/read-all',
            method: 'PUT',
            showLoading: false,
        })
    },

    // 获取未读通知数量
    getUnreadNotificationCount: () => {
        return request<BaseResponse<{ count: number }>>({
            url: '/notifications/unread-count',
            method: 'GET',
            showLoading: false,
        })
    },

    // 搜索功能
    search: (keyword: string, type: 'all' | 'user' | 'content' = 'all', params?: SearchParams) => {
        return request<BaseResponse<{
            users: Array<{ id: number; username: string; nickname: string; avatar: string }>
            contents: Array<{ id: number; title: string; content: string; type: string }>
            total: number
        }>>({
            url: '/search',
            method: 'GET',
            params: { keyword, type, ...params },
            showLoading: true,
        })
    },
}