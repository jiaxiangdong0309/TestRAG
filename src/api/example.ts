// API 使用示例
import { userApi, commonApi } from './index'
import type { LoginParams, RegisterParams, UpdateUserParams } from './types'

// 用户相关 API 使用示例
export const userApiExamples = {
    // 用户登录示例
    loginExample: async () => {
        try {
            const loginParams: LoginParams = {
                username: 'testuser',
                password: '123456',
                remember: true
            }

            const response = await userApi.login(loginParams)
            console.log('登录成功:', response.data)

            // 保存 token
            localStorage.setItem('token', response.data.token)

            return response.data
        } catch (error) {
            console.error('登录失败:', error)
            throw error
        }
    },

    // 用户注册示例
    registerExample: async () => {
        try {
            const registerParams: RegisterParams = {
                username: 'newuser',
                email: 'newuser@example.com',
                password: '123456',
                confirmPassword: '123456',
                nickname: '新用户'
            }

            const response = await userApi.register(registerParams)
            console.log('注册成功:', response.data)

            return response.data
        } catch (error) {
            console.error('注册失败:', error)
            throw error
        }
    },

    // 获取用户信息示例
    getUserInfoExample: async () => {
        try {
            const response = await userApi.getCurrentUser()
            console.log('用户信息:', response.data)

            return response.data
        } catch (error) {
            console.error('获取用户信息失败:', error)
            throw error
        }
    },

    // 更新用户信息示例
    updateUserInfoExample: async () => {
        try {
            const updateParams: UpdateUserParams = {
                nickname: '更新后的昵称',
                email: 'updated@example.com',
                phone: '13800138000'
            }

            const response = await userApi.updateUserInfo(updateParams)
            console.log('更新成功:', response.data)

            return response.data
        } catch (error) {
            console.error('更新用户信息失败:', error)
            throw error
        }
    },

    // 上传头像示例
    uploadAvatarExample: async (file: File) => {
        try {
            const response = await userApi.uploadAvatar(file)
            console.log('头像上传成功:', response.data)

            return response.data
        } catch (error) {
            console.error('头像上传失败:', error)
            throw error
        }
    },

    // 用户登出示例
    logoutExample: async () => {
        try {
            await userApi.logout()
            console.log('登出成功')

            // 清除本地存储的 token
            localStorage.removeItem('token')
        } catch (error) {
            console.error('登出失败:', error)
            throw error
        }
    }
}

// 通用 API 使用示例
export const commonApiExamples = {
    // 文件上传示例
    uploadFileExample: async (file: File) => {
        try {
            const response = await commonApi.uploadFile(file, 'image')
            console.log('文件上传成功:', response.data)

            return response.data
        } catch (error) {
            console.error('文件上传失败:', error)
            throw error
        }
    },

    // 获取系统配置示例
    getSystemConfigExample: async () => {
        try {
            const response = await commonApi.getSystemConfig()
            console.log('系统配置:', response.data)

            return response.data
        } catch (error) {
            console.error('获取系统配置失败:', error)
            throw error
        }
    },

    // 获取验证码示例
    getCaptchaExample: async () => {
        try {
            const response = await commonApi.getCaptcha()
            console.log('验证码:', response.data)

            return response.data
        } catch (error) {
            console.error('获取验证码失败:', error)
            throw error
        }
    },

    // 发送短信验证码示例
    sendSmsCodeExample: async (phone: string) => {
        try {
            const response = await commonApi.sendSmsCode(phone, 'login')
            console.log('短信发送成功:', response.data)

            return response.data
        } catch (error) {
            console.error('短信发送失败:', error)
            throw error
        }
    },

    // 搜索示例
    searchExample: async (keyword: string) => {
        try {
            const response = await commonApi.search(keyword, 'all')
            console.log('搜索结果:', response.data)

            return response.data
        } catch (error) {
            console.error('搜索失败:', error)
            throw error
        }
    }
}

// Vue 组件中使用示例
export const vueComponentExample = `
<template>
  <div>
    <button @click="handleLogin">登录</button>
    <button @click="handleGetUserInfo">获取用户信息</button>
    <button @click="handleUploadFile">上传文件</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { userApi, commonApi } from '@/api'

const loading = ref(false)
const userInfo = ref(null)

// 登录处理
const handleLogin = async () => {
  try {
    loading.value = true
    const response = await userApi.login({
      username: 'testuser',
      password: '123456'
    })
    console.log('登录成功:', response.data)
  } catch (error) {
    console.error('登录失败:', error)
  } finally {
    loading.value = false
  }
}

// 获取用户信息
const handleGetUserInfo = async () => {
  try {
    loading.value = true
    const response = await userApi.getCurrentUser()
    userInfo.value = response.data
    console.log('用户信息:', response.data)
  } catch (error) {
    console.error('获取用户信息失败:', error)
  } finally {
    loading.value = false
  }
}

// 文件上传
const handleUploadFile = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  try {
    loading.value = true
    const response = await commonApi.uploadFile(file)
    console.log('文件上传成功:', response.data)
  } catch (error) {
    console.error('文件上传失败:', error)
  } finally {
    loading.value = false
  }
}
</script>
`