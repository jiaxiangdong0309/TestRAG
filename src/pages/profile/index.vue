<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../../stores/user'

const userStore = useUserStore()
const isEditing = ref(false)
const newName = ref('')

onMounted(() => {
  userStore.loadUser()
})

const startEdit = () => {
  isEditing.value = true
  newName.value = userStore.currentUser.name
}

const saveName = () => {
  if (newName.value.trim()) {
    userStore.updateName(newName.value.trim())
    isEditing.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  newName.value = ''
}
</script>

<template>
  <div class="profile min-h-full bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow p-8 mb-6">
          <div class="flex items-center space-x-6 mb-6">
            <div
              class="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center"
            >
              <span class="text-white text-2xl font-bold">{{
                userStore.userDisplayName.charAt(0)
              }}</span>
            </div>
            <div>
              <h1 class="text-2xl font-bold text-gray-900">{{ userStore.userDisplayName }}</h1>
              <p class="text-gray-600">前端开发工程师</p>
              <p class="text-sm text-gray-500">{{ userStore.currentUser.email }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-800">姓名</h3>
                <p class="text-sm text-gray-600">{{ userStore.currentUser.name }}</p>
              </div>
              <button
                @click="startEdit"
                class="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                修改
              </button>
            </div>

            <!-- 编辑姓名表单 -->
            <div v-if="isEditing" class="p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 class="font-medium text-gray-800 mb-2">修改姓名</h4>
              <div class="flex space-x-2">
                <input
                  v-model="newName"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入新姓名"
                />
                <button
                  @click="saveName"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  保存
                </button>
                <button
                  @click="cancelEdit"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>

            <div class="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h3 class="font-medium text-gray-800">邮箱</h3>
                <p class="text-sm text-gray-600">{{ userStore.currentUser.email }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
