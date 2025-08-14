import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
    id: string
    name: string
    email: string
}

export const useUserStore = defineStore('user', () => {
    // 状态
    const currentUser = ref<User>({
        id: '1',
        name: '张三',
        email: 'zhangsan@example.com'
    })

    // 计算属性
    const userDisplayName = computed(() => {
        return currentUser.value.name
    })

    // 动作
    const updateName = (newName: string) => {
        currentUser.value.name = newName
        // 保存到本地存储
        localStorage.setItem('user', JSON.stringify(currentUser.value))
    }

    const loadUser = () => {
        const saved = localStorage.getItem('user')
        if (saved) {
            try {
                currentUser.value = JSON.parse(saved)
            } catch (error) {
                console.error('加载用户数据失败:', error)
            }
        }
    }

    return {
        // 状态
        currentUser,

        // 计算属性
        userDisplayName,

        // 动作
        updateName,
        loadUser
    }
})