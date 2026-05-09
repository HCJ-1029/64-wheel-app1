/**
 * 分享工具函数
 * 使用 html2canvas 生成截图，并使用 Web Share API 分享
 */

/**
 * 使用 html2canvas 将元素转换为 canvas
 * @param {HTMLElement} element - 要截图的元素
 * @returns {Promise<HTMLCanvasElement>} Canvas 元素
 */
export async function elementToCanvas(element) {
  const html2canvas = (await import('html2canvas')).default

  return html2canvas(element, {
    backgroundColor: '#1a1a2e',
    scale: 2, // 提高截图质量
    useCORS: true,
    logging: false,
    allowTaint: true,
  })
}

/**
 * 将 Canvas 转换为 Blob
 * @param {HTMLCanvasElement} canvas - Canvas 元素
 * @param {string} type - 图片类型，默认 'image/png'
 * @param {number} quality - 图片质量，默认 0.92
 * @returns {Promise<Blob>} 图片 Blob
 */
export function canvasToBlob(canvas, type = 'image/png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas 转换为 Blob 失败'))
        }
      },
      type,
      quality
    )
  })
}

/**
 * 下载图片到本地
 * @param {Blob} blob - 图片 Blob
 * @param {string} filename - 文件名，默认 '64转盘结果.png'
 */
export function downloadImage(blob, filename = '64转盘结果.png') {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 使用 Web Share API 分享图片
 * @param {Blob} blob - 图片 Blob
 * @param {string} title - 分享标题
 * @param {string} text - 分享文本
 * @returns {Promise<boolean>} 是否分享成功
 */
export async function shareImage(blob, title = '64转盘结果', text = '来看看我的卦象结果！') {
  // 检查是否支持 Web Share API
  if (!navigator.canShare || !navigator.canShare({ files: [] })) {
    return false
  }

  const file = new File([blob], '64转盘结果.png', { type: 'image/png' })

  try {
    await navigator.share({
      title,
      text,
      files: [file],
    })
    return true
  } catch (error) {
    // 用户取消分享或其他错误
    console.log('分享取消或失败:', error)
    return false
  }
}

/**
 * 完整的分享流程：截图 -> 尝试分享 -> 如果不支持则下载
 * @param {HTMLElement} element - 要截图的元素
 * @param {string} title - 分享标题
 * @param {string} text - 分享文本
 * @returns {Promise<{success: boolean, method: string}>} 分享结果
 */
export async function captureAndShare(element, title, text) {
  try {
    // 1. 生成截图
    const canvas = await elementToCanvas(element)
    const blob = await canvasToBlob(canvas)

    // 2. 尝试使用 Web Share API 分享
    const shared = await shareImage(blob, title, text)

    if (shared) {
      return { success: true, method: 'share-api' }
    }

    // 3. 如果不支持或分享失败，则下载图片
    downloadImage(blob, '64转盘结果.png')
    return { success: true, method: 'download' }
  } catch (error) {
    console.error('截图分享失败:', error)
    return { success: false, method: 'none', error: error.message }
  }
}

/**
 * 检查浏览器是否支持所需的分享功能
 * @returns {{ share: boolean, download: boolean }} 支持情况
 */
export function checkShareSupport() {
  return {
    share: !!(navigator.canShare && navigator.share),
    download: !!(document.createElement('a').download !== undefined),
  }
}
