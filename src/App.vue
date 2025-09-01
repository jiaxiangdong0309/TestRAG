<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'

const router = useRouter()

// 响应式状态
const isSidebarOpen = ref(false)
const isLoggedIn = ref(false)
const username = ref('')
const showLoginModal = ref(false)
const loginUsername = ref('')

// 初始化时检查登录状态
onMounted(() => {
  const savedUsername = localStorage.getItem('username')
  if (savedUsername) {
    username.value = savedUsername
    isLoggedIn.value = true
  }
})

const navigateTo = (path: string) => {
  router.push(path)
}

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

// 关闭侧边栏
const closeSidebar = () => {
  isSidebarOpen.value = false
}

// 显示登录弹窗
const showLogin = () => {
  showLoginModal.value = true
  loginUsername.value = ''
}

// 关闭登录弹窗
const closeLoginModal = () => {
  showLoginModal.value = false
  loginUsername.value = ''
}

// 执行登录
const handleLogin = () => {
  if (loginUsername.value.trim()) {
    username.value = loginUsername.value.trim()
    isLoggedIn.value = true
    localStorage.setItem('username', username.value)
    showLoginModal.value = false
    closeSidebar() // 登录成功后关闭侧边栏
  }
}

// 退出登录
const handleLogout = () => {
  isLoggedIn.value = false
  username.value = ''
  localStorage.removeItem('username')
  closeSidebar()
}
</script>

<template>
  <div id="app" class="h-screen flex flex-col">
    <!-- 固定导航栏 -->
    <nav class="bg-white shadow-lg flex-shrink-0 sticky top-0 z-50">
      <div class="container w-1280px px-4">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-8">
            <!-- 点击标题展开侧边栏 -->
            <button
              @click="toggleSidebar"
              class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
            >
              TestRAG
            </button>

            <div class="hidden md:flex space-x-6">
              <button
                @click="navigateTo('/chat')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                💬 Chat
              </button>
              <button
                @click="navigateTo('/webpage-preview')"
                class="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                🌐 网页预览
              </button>
            </div>
          </div>

          <!-- 移动端菜单按钮 -->
          <div class="md:hidden">
            <button class="text-gray-600 hover:text-blue-600 p-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- 侧边栏 -->
    <div
      v-if="isSidebarOpen"
      class="fixed inset-0 z-40"
      @click="closeSidebar"
    >
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <!-- 侧边栏内容 -->
      <div
        class="absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
        @click.stop
      >
        <!-- 侧边栏头部 -->
        <div class="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">用户中心</h2>
          <button
            @click="closeSidebar"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- 侧边栏内容 -->
        <div class="p-6">
          <!-- 登录状态显示 -->
          <div v-if="isLoggedIn" class="space-y-4">
            <div class="text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <span class="text-2xl font-bold text-blue-600">{{ username.charAt(0).toUpperCase() }}</span>
              </div>
              <h3 class="text-lg font-medium text-gray-900">{{ username }}</h3>
              <p class="text-sm text-gray-500">已登录</p>
            </div>

            <button
              @click="handleLogout"
              class="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              退出登录
            </button>
          </div>

          <!-- 未登录状态显示 -->
          <div v-else class="space-y-4">
            <div class="text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900">未登录</h3>
              <p class="text-sm text-gray-500">请登录以使用完整功能</p>
            </div>

            <button
              @click="showLogin"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              登录
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 可滚动的主内容区域 -->
    <main class="flex-1 overflow-auto">
      <RouterView />
    </main>

    <!-- 登录弹窗 -->
    <div
      v-if="showLoginModal"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click="closeLoginModal"
    >
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black bg-opacity-50"></div>

      <!-- 弹窗内容 -->
      <div
        class="relative bg-white rounded-lg shadow-xl p-6 w-96 max-w-sm mx-4"
        @click.stop
      >
        <div class="text-center mb-6">
          <h3 class="text-lg font-medium text-gray-900">用户登录</h3>
          <p class="text-sm text-gray-500">请输入您的用户名</p>
        </div>

        <div class="space-y-4">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700 mb-2">
              用户名
            </label>
            <input
              id="username"
              v-model="loginUsername"
              type="text"
              placeholder="请输入用户名"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @keyup.enter="handleLogin"
            />
          </div>

          <div class="flex space-x-3">
            <button
              @click="closeLoginModal"
              class="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
            >
              取消
            </button>
            <button
              @click="handleLogin"
              :disabled="!loginUsername.trim()"
              class="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              确定
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden; /* 防止页面整体滚动 */
}

/* 确保主内容区域可以正常滚动 */
main {
  -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
}

/* 侧边栏动画 */
.sidebar-enter-active,
.sidebar-leave-active {
  transition: transform 0.3s ease-in-out;
}

.sidebar-enter-from,
.sidebar-leave-to {
  transform: translateX(-100%);
}

.sidebar-enter-to,
.sidebar-leave-from {
  transform: translateX(0);
}
</style>
