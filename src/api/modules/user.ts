import request from '../request'
import type {
    BaseResponse,
    UserInfo,
    LoginParams,
    RegisterParams,
    UpdateUserParams,
    ChangePasswordParams,
    PageResponse,
    PageParams
} from '../types'

// 用户相关 API
export const userApi = {
    // 用户登录
    login: (params: LoginParams) => {
        return request<BaseResponse<{ token: string; user: UserInfo }>>({
            url: '/auth/login',
            method: 'POST',
            data: params,
            showLoading: true,
        })
    },

    // 用户注册
    register: (params: RegisterParams) => {
        return request<BaseResponse<UserInfo>>({
            url: '/auth/register',
            method: 'POST',
            data: params,
            showLoading: true,
        })
    },

    // 用户登出
    logout: () => {
        return request<BaseResponse<null>>({
            url: '/auth/logout',
            method: 'POST',
            showLoading: false,
        })
    },

    // 获取当前用户信息
    getCurrentUser: () => {
        return request<BaseResponse<UserInfo>>({
            url: '/user/profile',
            method: 'GET',
            showLoading: false,
        })
    },

    // 获取用户信息
    getUserInfo: (userId: number) => {
        return request<BaseResponse<UserInfo>>({
            url: `/user/${userId}`,
            method: 'GET',
            showLoading: false,
        })
    },

    // 更新用户信息
    updateUserInfo: (params: UpdateUserParams) => {
        return request<BaseResponse<UserInfo>>({
            url: '/user/profile',
            method: 'PUT',
            data: params,
            showLoading: true,
        })
    },

    // 修改密码
    changePassword: (params: ChangePasswordParams) => {
        return request<BaseResponse<null>>({
            url: '/user/password',
            method: 'PUT',
            data: params,
            showLoading: true,
        })
    },

    // 上传头像
    uploadAvatar: (file: File) => {
        const formData = new FormData()
        formData.append('avatar', file)

        return request<BaseResponse<{ avatar: string }>>({
            url: '/user/avatar',
            method: 'POST',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            showLoading: true,
        })
    },

    // 获取用户列表（管理员功能）
    getUserList: (params?: PageParams) => {
        return request<BaseResponse<PageResponse<UserInfo>>>({
            url: '/admin/users',
            method: 'GET',
            params,
            showLoading: true,
        })
    },

    // 删除用户（管理员功能）
    deleteUser: (userId: number) => {
        return request<BaseResponse<null>>({
            url: `/admin/users/${userId}`,
            method: 'DELETE',
            showLoading: true,
        })
    },

    // 启用/禁用用户（管理员功能）
    toggleUserStatus: (userId: number, status: 'active' | 'inactive') => {
        return request<BaseResponse<UserInfo>>({
            url: `/admin/users/${userId}/status`,
            method: 'PUT',
            data: { status },
            showLoading: true,
        })
    },

    // 刷新 token
    refreshToken: () => {
        return request<BaseResponse<{ token: string }>>({
            url: '/auth/refresh',
            method: 'POST',
            showLoading: false,
        })
    },

    // 验证 token
    verifyToken: () => {
        return request<BaseResponse<{ valid: boolean }>>({
            url: '/auth/verify',
            method: 'GET',
            showLoading: false,
        })
    },
}