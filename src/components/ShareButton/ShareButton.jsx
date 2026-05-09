/**
 * 分享按钮组件
 * 使用 html2canvas 截图并分享
 */
import React, { useCallback, useRef } from 'react'
import { useScreenshot } from '../../hooks/useScreenshot'

/**
 * 分享按钮组件
 * @param {Object} props
 * @param {React.RefObject} props.screenshotRef - 截图目标的 ref
 * @param {Object} props.gua - 当前卦象数据
 * @param {boolean} props.disabled - 是否禁用
 */
function ShareButton({ screenshotRef, gua, disabled = false }) {
  const { isCapturing, captureResult, captureAndShareScreenshot } = useScreenshot()

  const handleShare = useCallback(async () => {
    if (!screenshotRef?.current || !gua) return

    try {
      const result = await captureAndShareScreenshot(
        screenshotRef.current,
        `64转盘 - ${gua.name}`,
        `我抽到了${gua.name}！${gua.brief}`
      )

      if (result.method === 'download') {
        alert('已生成截图并下载到本地！')
      } else if (result.method === 'share-api') {
        // 分享成功，无需提示
      }
    } catch (error) {
      console.error('分享失败:', error)
      alert('分享失败，请重试')
    }
  }, [screenshotRef, gua, captureAndShareScreenshot])

  if (!gua) return null

  return (
    <div className="flex justify-center gap-3 mt-4">
      {/* 分享/下载按钮 */}
      <button
        onClick={handleShare}
        disabled={disabled || isCapturing}
        className="
          flex items-center justify-center gap-2
          px-6 py-3
          bg-gradient-to-r from-yellow-400 to-orange-400
          text-gray-900 font-semibold
          rounded-full
          hover:from-yellow-300 hover:to-orange-300
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all
          shadow-lg
        "
        aria-label="分享结果"
      >
        {isCapturing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            生成截图中...
          </>
        ) : (
          <>
            <span>📤</span>
            分享结果
          </>
        )}
      </button>
    </div>
  )
}

export default React.memo(ShareButton)
