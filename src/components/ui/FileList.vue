<template>
  <div v-if="files.length > 0" class="file-list mt-3 pt-3 border-t border-gray-200">
    <div class="text-sm text-gray-600 mb-2">📎 附件文件：</div>
    <div class="space-y-2">
      <div
        v-for="file in files"
        :key="file.id"
        class="file-item flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        @click="handleFileClick(file)"
      >
        <!-- 文件图标 -->
        <div class="file-icon">
          <svg v-if="file.type === 'image'" class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
          </svg>
          <svg v-else class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>

        <!-- 文件信息 -->
        <div class="file-info flex-1 min-w-0">
          <div class="file-name text-sm font-medium text-gray-800 truncate">
            {{ getFileName(file.url) }}
          </div>
          <div class="file-meta text-xs text-gray-500">
            {{ file.type.toUpperCase() }} • {{ getFileSize(file.url) }}
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="file-actions">
          <button
            class="text-blue-600 hover:text-blue-800 text-sm font-medium"
            @click.stop="handleFileClick(file)"
          >
            查看
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 文件信息接口
interface FileInfo {
  id: string
  type: string
  belongs_to: string
  url: string
  conversation_id: string
}

// 组件属性
interface Props {
  files: FileInfo[]
}

const props = defineProps<Props>()

// 获取文件名
const getFileName = (url: string): string => {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const fileName = pathname.split('/').pop() || '未知文件'
    return decodeURIComponent(fileName)
  } catch {
    return '未知文件'
  }
}

// 获取文件大小（这里只是示例，实际需要从服务器获取）
const getFileSize = (url: string): string => {
  // 实际项目中，文件大小应该从服务器响应头或文件信息中获取
  return '未知大小'
}

// 处理文件点击
const handleFileClick = (file: FileInfo) => {
  console.log('点击文件:', file)

  if (file.type === 'image') {
    // 图片文件：在新窗口中打开
    window.open(file.url, '_blank')
  } else {
    // 其他类型文件：下载或在新窗口中打开
    const link = document.createElement('a')
    link.href = file.url
    link.target = '_blank'
    link.download = getFileName(file.url)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}
</script>

<style scoped>
.file-list {
  @apply border-t border-gray-200;
}

.file-item {
  @apply transition-all duration-200;
}

.file-item:hover {
  @apply transform scale-[1.02];
}

.file-icon {
  @apply flex-shrink-0;
}

.file-info {
  @apply min-w-0;
}

.file-name {
  @apply truncate;
}

.file-actions {
  @apply flex-shrink-0;
}
</style>
