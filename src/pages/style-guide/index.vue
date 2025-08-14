<script setup lang="ts">
import { ref } from 'vue'

const copiedText = ref('')
const showCopied = ref(false)

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copiedText.value = text
    showCopied.value = true
    setTimeout(() => {
      showCopied.value = false
    }, 2000)
  } catch (err) {
    console.error('复制失败:', err)
  }
}

const styleSections = [
  {
    title: '按钮组件',
    items: [
      { name: '主要按钮', class: 'btn-primary', code: 'btn-primary' },
      { name: '成功按钮', class: 'btn-success', code: 'btn-success' },
      { name: '危险按钮', class: 'btn-danger', code: 'btn-danger' },
      { name: '次要按钮', class: 'btn-secondary', code: 'btn-secondary' },
      { name: '轮廓按钮', class: 'btn-outline', code: 'btn-outline' },
    ],
  },
  {
    title: '徽章组件',
    items: [
      { name: '主要徽章', class: 'badge badge-primary', code: 'badge badge-primary' },
      { name: '成功徽章', class: 'badge badge-success', code: 'badge badge-success' },
      { name: '警告徽章', class: 'badge badge-warning', code: 'badge badge-warning' },
      { name: '危险徽章', class: 'badge badge-danger', code: 'badge badge-danger' },
    ],
  },
  {
    title: '卡片组件',
    items: [
      { name: '基础卡片', class: 'card', code: 'card' },
      { name: '卡片头部', class: 'card-header', code: 'card-header' },
      { name: '卡片内容', class: 'card-body', code: 'card-body' },
      { name: '卡片底部', class: 'card-footer', code: 'card-footer' },
    ],
  },
  {
    title: '表单组件',
    items: [
      { name: '表单输入', class: 'form-input', code: 'form-input' },
      { name: '表单标签', class: 'form-label', code: 'form-label' },
      { name: '表单错误', class: 'form-error', code: 'form-error' },
    ],
  },
  {
    title: '加载组件',
    items: [
      { name: '加载旋转器', class: 'loading-spinner w-6 h-6', code: 'loading-spinner' },
      { name: '加载点', class: 'loading-dots', code: 'loading-dots' },
    ],
  },
  {
    title: '状态指示器',
    items: [
      { name: '在线状态', class: 'status-indicator', code: 'status-indicator' },
      { name: '在线点', class: 'status-dot status-online', code: 'status-dot status-online' },
      { name: '离线点', class: 'status-dot status-offline', code: 'status-dot status-offline' },
      { name: '忙碌点', class: 'status-dot status-busy', code: 'status-dot status-busy' },
    ],
  },
  {
    title: '头像组件',
    items: [
      { name: '小头像', class: 'avatar avatar-sm bg-blue-500', code: 'avatar avatar-sm' },
      { name: '中头像', class: 'avatar avatar-md bg-green-500', code: 'avatar avatar-md' },
      { name: '大头像', class: 'avatar avatar-lg bg-purple-500', code: 'avatar avatar-lg' },
      { name: '超大头像', class: 'avatar avatar-xl bg-red-500', code: 'avatar avatar-xl' },
    ],
  },
  {
    title: '文本效果',
    items: [
      { name: '渐变文本', class: 'text-gradient', code: 'text-gradient' },
      { name: '文本阴影', class: 'text-shadow', code: 'text-shadow' },
      { name: '文本描边', class: 'text-stroke', code: 'text-stroke' },
    ],
  },
  {
    title: '阴影效果',
    items: [
      { name: '柔和阴影', class: 'shadow-soft p-4 bg-white rounded', code: 'shadow-soft' },
      { name: '中等阴影', class: 'shadow-medium p-4 bg-white rounded', code: 'shadow-medium' },
      { name: '强烈阴影', class: 'shadow-strong p-4 bg-white rounded', code: 'shadow-strong' },
    ],
  },
  {
    title: '渐变背景',
    items: [
      {
        name: '主要渐变',
        class: 'gradient-primary p-4 rounded text-white',
        code: 'gradient-primary',
      },
      {
        name: '次要渐变',
        class: 'gradient-secondary p-4 rounded text-white',
        code: 'gradient-secondary',
      },
      {
        name: '成功渐变',
        class: 'gradient-success p-4 rounded text-white',
        code: 'gradient-success',
      },
      {
        name: '警告渐变',
        class: 'gradient-warning p-4 rounded text-white',
        code: 'gradient-warning',
      },
    ],
  },
  {
    title: '特殊效果',
    items: [
      { name: '玻璃效果', class: 'glass-effect p-4 rounded', code: 'glass-effect' },
      {
        name: '悬停上移',
        class: 'hover-lift p-4 bg-white rounded shadow cursor-pointer',
        code: 'hover-lift',
      },
      {
        name: '悬停发光',
        class: 'hover-glow p-4 bg-white rounded cursor-pointer',
        code: 'hover-glow',
      },
    ],
  },
  {
    title: '动画效果',
    items: [
      { name: '淡入动画', class: 'fade-in p-4 bg-blue-100 rounded', code: 'fade-in' },
      { name: '上滑动画', class: 'slide-up p-4 bg-green-100 rounded', code: 'slide-up' },
      { name: '缩放动画', class: 'scale-in p-4 bg-purple-100 rounded', code: 'scale-in' },
      {
        name: '柔和脉冲',
        class: 'animate-pulse-soft p-4 bg-yellow-100 rounded',
        code: 'animate-pulse-soft',
      },
      {
        name: '柔和弹跳',
        class: 'animate-bounce-soft p-4 bg-red-100 rounded',
        code: 'animate-bounce-soft',
      },
    ],
  },
  {
    title: '布局工具',
    items: [
      {
        name: '绝对居中',
        class: 'center-absolute p-4 bg-blue-100 rounded',
        code: 'center-absolute',
      },
      { name: '响应式文本', class: 'responsive-text', code: 'responsive-text' },
      {
        name: '响应式内边距',
        class: 'responsive-padding bg-gray-100 rounded',
        code: 'responsive-padding',
      },
    ],
  },
  {
    title: '网格布局',
    items: [
      { name: '自适应网格', class: 'grid-auto-fit gap-4', code: 'grid-auto-fit' },
      { name: '填充网格', class: 'grid-auto-fill gap-4', code: 'grid-auto-fill' },
      { name: '响应式网格', class: 'grid-responsive', code: 'grid-responsive' },
    ],
  },
  {
    title: '容器尺寸',
    items: [
      { name: '小容器', class: 'container-sm bg-gray-100 p-4 rounded', code: 'container-sm' },
      { name: '中容器', class: 'container-md bg-gray-100 p-4 rounded', code: 'container-md' },
      { name: '大容器', class: 'container-lg bg-gray-100 p-4 rounded', code: 'container-lg' },
      { name: '超大容器', class: 'container-xl bg-gray-100 p-4 rounded', code: 'container-xl' },
    ],
  },
  {
    title: '分割线',
    items: [
      { name: '水平分割线', class: 'divider', code: 'divider' },
      { name: '垂直分割线', class: 'divider-vertical h-8', code: 'divider-vertical' },
    ],
  },
  {
    title: '滚动条',
    items: [
      {
        name: '细滚动条',
        class: 'scrollbar-thin h-32 overflow-y-auto bg-gray-100 p-4',
        code: 'scrollbar-thin',
      },
    ],
  },
  {
    title: '选择文本',
    items: [
      { name: '蓝色选择', class: 'selection-blue', code: 'selection-blue' },
      { name: '绿色选择', class: 'selection-green', code: 'selection-green' },
    ],
  },
  {
    title: '裁剪效果',
    items: [
      { name: '圆形裁剪', class: 'clip-circle w-16 h-16 bg-blue-500', code: 'clip-circle' },
      { name: '多边形裁剪', class: 'clip-polygon w-16 h-16 bg-green-500', code: 'clip-polygon' },
    ],
  },
  {
    title: '背景图案',
    items: [
      { name: '点状图案', class: 'bg-pattern-dots w-32 h-32', code: 'bg-pattern-dots' },
      { name: '网格图案', class: 'bg-pattern-grid w-32 h-32', code: 'bg-pattern-grid' },
    ],
  },
  {
    title: '混合模式',
    items: [
      { name: '正片叠底', class: 'mix-blend-multiply bg-red-500 p-4', code: 'mix-blend-multiply' },
      { name: '滤色', class: 'mix-blend-screen bg-blue-500 p-4', code: 'mix-blend-screen' },
      { name: '叠加', class: 'mix-blend-overlay bg-green-500 p-4', code: 'mix-blend-overlay' },
    ],
  },
  {
    title: '过滤器',
    items: [
      { name: '柔和模糊', class: 'filter-blur-soft', code: 'filter-blur-soft' },
      { name: '亮度增强', class: 'filter-brightness-110', code: 'filter-brightness-110' },
      { name: '对比度增强', class: 'filter-contrast-110', code: 'filter-contrast-110' },
    ],
  },
  {
    title: '宽高比',
    items: [
      { name: '视频比例', class: 'aspect-video bg-blue-200', code: 'aspect-video' },
      { name: '正方形', class: 'aspect-square bg-green-200', code: 'aspect-square' },
      { name: '照片比例', class: 'aspect-photo bg-purple-200', code: 'aspect-photo' },
    ],
  },
]
</script>

<template>
  <div class="min-h-full bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <!-- 页面标题 -->
      <div class="text-center mb-12">
        <h1 class="text-gradient text-4xl font-bold mb-4">样式指南</h1>
        <p class="text-xl text-gray-600">点击任何样式示例来复制 CSS 类名</p>
      </div>

      <!-- 复制提示 -->
      <div
        v-if="showCopied"
        class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      >
        ✅ 已复制: {{ copiedText }}
      </div>

      <!-- 样式分类 -->
      <div class="space-y-12">
        <div v-for="section in styleSections" :key="section.title" class="card">
          <div class="card-header">
            <h2 class="text-2xl font-semibold text-gray-800">{{ section.title }}</h2>
          </div>
          <div class="card-body">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div
                v-for="item in section.items"
                :key="item.name"
                @click="copyToClipboard(item.code)"
                class="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div class="mb-2">
                  <div :class="item.class" class="inline-block">
                    {{ item.name }}
                  </div>
                </div>
                <div class="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
                  {{ item.code }}
                </div>
                <div
                  class="text-xs text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  点击复制
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 使用说明 -->
      <div class="card mt-12">
        <div class="card-header">
          <h2 class="text-2xl font-semibold text-gray-800">使用说明</h2>
        </div>
        <div class="card-body">
          <div class="space-y-4">
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">如何复制样式</h3>
              <p class="text-gray-600">
                点击上面的任何样式示例，对应的 CSS 类名会自动复制到剪贴板。
              </p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">如何使用</h3>
              <p class="text-gray-600">将复制的类名直接添加到 HTML 元素的 class 属性中即可。</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-800 mb-2">组合使用</h3>
              <p class="text-gray-600">
                多个类名可以组合使用，例如：<code class="bg-gray-100 px-2 py-1 rounded"
                  >btn-primary hover-lift</code
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
