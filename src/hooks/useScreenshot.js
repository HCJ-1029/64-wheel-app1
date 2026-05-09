/**
 * 截图分享 Hook
 * 管理截图和分享功能
 */
import { useState, useCallback } from 'react'
import { captureAndShare, checkShareSupport } from '../utils/shareUtils'

/**
 * 截图分享自定义 Hook
 * @returns {Object} 截图分享状态和控制函数
 */
export function useScreenshot() {
  // 是否正在截图
  const [isCapturing, setIsCapturing] = useState(false)
  // 截图结果
  const [captureResult, setCaptureResult] = useState(null)
  // 分享支持情况
  const supportStatus = checkShareSupport()

  /**
   * 截图并分享
   * @param {HTMLElement} element - 要截图的元素
   * @param {string} title - 分享标题
   * @param {string} text - 分享文本
   * @returns {Promise<Object>} 分享结果
   */
  const captureAndShareScreenshot = useCallback(async (
    element,
    title = '64转盘结果',
    text = '来看看我的卦象结果！'
  ) => {
    if (!element) {
      throw new Error('截图元素不存在')
    }

    setIsCapturing(true)
    setCaptureResult(null)

    try {
      const result = await captureAndShare(element, title, text)
      setCaptureResult(result)
      return result
    } catch (error) {
      const result = { success: false, method: 'none', error: error.message }
      setCaptureResult(result)
      throw error
    } finally {
      setIsCapturing(false)
    }
  }, [])

  /**
   * 重置截图结果
   */
  const resetCaptureResult = useCallback(() => {
    setCaptureResult(null)
  }, [])

  return {
    isCapturing,
    captureResult,
    supportStatus,
    captureAndShareScreenshot,
    resetCaptureResult,
  }
}
