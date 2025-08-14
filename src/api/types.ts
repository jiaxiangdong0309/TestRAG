import type { AxiosRequestConfig, AxiosResponse } from 'axios'

// 基础响应类型
export interface BaseResponse<T = any> {
    code: number
    message: string
    data: T
    success: boolean
}

// 分页响应类型
export interface PageResponse<T = any> {
    list: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
}

// 用户信息类型
export interface UserInfo {
    id: number
    username: string
    email: string
    nickname: string
    avatar: string
    phone: string
    status: 'active' | 'inactive'
    createdAt: string
    updatedAt: string
}

// 用户登录参数类型
export interface LoginParams {
    username: string
    password: string
    remember?: boolean
}

// 用户注册参数类型
export interface RegisterParams {
    username: string
    email: string
    password: string
    confirmPassword: string
    nickname?: string
}

// 用户更新参数类型
export interface UpdateUserParams {
    nickname?: string
    email?: string
    phone?: string
    avatar?: string
}

// 修改密码参数类型
export interface ChangePasswordParams {
    oldPassword: string
    newPassword: string
    confirmPassword: string
}

// 文件上传响应类型
export interface UploadResponse {
    url: string
    filename: string
    size: number
    type: string
}

// 请求配置扩展类型
export interface RequestConfig extends AxiosRequestConfig {
    showLoading?: boolean
    showError?: boolean
    autoRetry?: boolean
    retryTimes?: number
    retryDelay?: number
}

// 响应配置扩展类型
export interface ResponseConfig {
    autoHandleError?: boolean
    autoRefreshToken?: boolean
    successCodes?: number[]
}

// 错误信息类型
export interface ApiError {
    code: number
    message: string
    details?: any
}

// 请求状态类型
export interface RequestState {
    loading: boolean
    error: ApiError | null
    data: any
}

// 分页参数类型
export interface PageParams {
    page?: number
    pageSize?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

// 搜索参数类型
export interface SearchParams extends PageParams {
    keyword?: string
    filters?: Record<string, any>
}