<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from '../../stores/settings'

const settingsStore = useSettingsStore()

onMounted(() => {
  // 加载设置
  settingsStore.loadSettings()
})
</script>

<template>
  <div class="settings bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">设置</h1>
          <p class="text-gray-600 mt-2">管理您的账户和应用偏好</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- 侧边栏导航 -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow p-6">
              <nav class="space-y-2">
                <a
                  href="#profile"
                  class="block px-4 py-2 text-blue-600 bg-blue-50 rounded-lg font-medium"
                >
                  个人资料
                </a>
                <a
                  href="#security"
                  class="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  安全设置
                </a>
                <a
                  href="#notifications"
                  class="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  通知设置
                </a>
                <a
                  href="#privacy"
                  class="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  隐私设置
                </a>
                <a
                  href="#billing"
                  class="block px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  账单信息
                </a>
              </nav>
            </div>
          </div>

          <!-- 主要内容区域 -->
          <div class="lg:col-span-2 space-y-6">
            <!-- 主题设置 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">主题设置</h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-800">主题模式</h3>
                    <p class="text-sm text-gray-600">
                      当前主题: {{ settingsStore.settings.theme }}
                    </p>
                  </div>
                  <button
                    @click="settingsStore.toggleTheme"
                    class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    切换主题
                  </button>
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-800">侧边栏</h3>
                    <p class="text-sm text-gray-600">
                      {{ settingsStore.settings.sidebar.collapsed ? '已折叠' : '已展开' }}
                    </p>
                  </div>
                  <button
                    @click="settingsStore.toggleSidebar"
                    class="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    切换侧边栏
                  </button>
                </div>
              </div>
            </div>

            <!-- 通知设置 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">通知设置</h2>
              <div class="space-y-4">
                <div
                  class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h3 class="font-medium text-gray-800">邮件通知</h3>
                    <p class="text-sm text-gray-600">接收邮件通知</p>
                  </div>
                  <div class="relative">
                    <input
                      type="checkbox"
                      :checked="settingsStore.settings.notifications.email"
                      @change="
                        settingsStore.updateNotificationSettings('email', $event.target.checked)
                      "
                      class="sr-only"
                    />
                    <div class="w-10 h-6 bg-gray-200 rounded-full relative">
                      <div
                        class="w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-transform"
                        :class="settingsStore.settings.notifications.email ? 'translate-x-4' : ''"
                      ></div>
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h3 class="font-medium text-gray-800">推送通知</h3>
                    <p class="text-sm text-gray-600">接收推送通知</p>
                  </div>
                  <div class="relative">
                    <input
                      type="checkbox"
                      :checked="settingsStore.settings.notifications.push"
                      @change="
                        settingsStore.updateNotificationSettings('push', $event.target.checked)
                      "
                      class="sr-only"
                    />
                    <div class="w-10 h-6 bg-gray-200 rounded-full relative">
                      <div
                        class="w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-transform"
                        :class="settingsStore.settings.notifications.push ? 'translate-x-4' : ''"
                      ></div>
                    </div>
                  </div>
                </div>

                <div
                  class="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div>
                    <h3 class="font-medium text-gray-800">声音通知</h3>
                    <p class="text-sm text-gray-600">播放通知声音</p>
                  </div>
                  <div class="relative">
                    <input
                      type="checkbox"
                      :checked="settingsStore.settings.notifications.sound"
                      @change="
                        settingsStore.updateNotificationSettings('sound', $event.target.checked)
                      "
                      class="sr-only"
                    />
                    <div class="w-10 h-6 bg-gray-200 rounded-full relative">
                      <div
                        class="w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-transform"
                        :class="settingsStore.settings.notifications.sound ? 'translate-x-4' : ''"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 仪表板设置 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">仪表板设置</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">布局模式</label>
                  <select
                    v-model="settingsStore.settings.dashboard.layout"
                    @change="
                      settingsStore.updateSettings({
                        dashboard: {
                          ...settingsStore.settings.dashboard,
                          layout: $event.target.value,
                        },
                      })
                    "
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="grid">网格布局</option>
                    <option value="list">列表布局</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">刷新间隔 (秒)</label>
                  <input
                    type="number"
                    :value="settingsStore.settings.dashboard.refreshInterval"
                    @change="
                      settingsStore.updateSettings({
                        dashboard: {
                          ...settingsStore.settings.dashboard,
                          refreshInterval: parseInt($event.target.value),
                        },
                      })
                    "
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="font-medium text-gray-800">显示图表</h3>
                    <p class="text-sm text-gray-600">在仪表板中显示图表</p>
                  </div>
                  <div class="relative">
                    <input
                      type="checkbox"
                      :checked="settingsStore.settings.dashboard.showCharts"
                      @change="
                        settingsStore.updateSettings({
                          dashboard: {
                            ...settingsStore.settings.dashboard,
                            showCharts: $event.target.checked,
                          },
                        })
                      "
                      class="sr-only"
                    />
                    <div class="w-10 h-6 bg-gray-200 rounded-full relative">
                      <div
                        class="w-4 h-4 bg-white rounded-full absolute left-1 top-1 transition-transform"
                        :class="settingsStore.settings.dashboard.showCharts ? 'translate-x-4' : ''"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 重置设置 -->
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-xl font-semibold text-gray-800 mb-6">重置设置</h2>
              <p class="text-gray-600 mb-4">将所有设置恢复为默认值</p>
              <button
                @click="settingsStore.resetSettings"
                class="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                重置所有设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
