import { ref, onMounted } from 'vue'
import templateContent from '../templates/content-template.html?raw'

export function useContentManager() {
  const iframeContent = ref('')
  const isLoading = ref(true)
  const error = ref<string | null>(null)

  // 加载 HTML 模板内容
  const loadTemplateContent = async () => {
    try {
      isLoading.value = true
      error.value = null
      
      // 直接使用导入的模板内容
      iframeContent.value = templateContent
    } catch (err) {
      console.error('Failed to load template:', err)
      error.value = err instanceof Error ? err.message : '加载模板失败'
      
      // 降级到默认内容
      iframeContent.value = getDefaultContent()
    } finally {
      isLoading.value = false
    }
  }

  // 获取默认内容（作为降级方案）
  const getDefaultContent = () => {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 20px;
      line-height: 1.6;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .content {
      background: rgba(255, 255, 255, 0.1);
      padding: 40px;
      border-radius: 20px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .error { color: white; }
    h2 { margin-bottom: 20px; color: #fbbf24; }
  </style>
</head>
<body>
  <div class="content">
    <h2>🎉 内容展示区域已就绪！</h2>
    <p>这里是右侧内容展示区域，您可以：</p>
    <ul style="text-align: left; margin: 20px 0;">
      <li>查看AI生成的回答内容</li>
      <li>浏览网页内容</li>
      <li>进行内容管理操作</li>
    </ul>
    <p>请开始您的对话，AI助手将为您提供帮助！</p>
  </div>
</body>
</html>`
  }

  // 更新 iframe 内容
  const updateContent = (newContent: string) => {
    iframeContent.value = newContent
  }

  // 重置为默认内容
  const resetContent = () => {
    iframeContent.value = getDefaultContent()
  }

  // 组件挂载时自动加载内容
  onMounted(() => {
    // 延迟一点加载，确保组件完全挂载
    setTimeout(() => {
      loadTemplateContent()
    }, 100)
  })

  return {
    iframeContent,
    isLoading,
    error,
    loadTemplateContent,
    updateContent,
    resetContent
  }
}
