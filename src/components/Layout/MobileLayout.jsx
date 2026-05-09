/**
 * 移动端布局组件
 * 9:16 比例布局，响应式设计
 */
import React, { useMemo } from 'react'

/**
 * 移动端布局组件
 * @param {Object} props
 * @param {React.ReactNode} props.children - 子组件
 * @param {string} props.title - 页面标题
 * @param {Function} props.onSettingsClick - 设置按钮点击回调
 * @param {number} props.maxWidth - 最大宽度（px），默认 450
 */
function MobileLayout({ children, title = '64转盘', onSettingsClick, maxWidth = 450 }) {
  // 容器样式 - 9:16 比例
  const containerStyle = useMemo(() => ({
    maxWidth: `${maxWidth}px`,
    minHeight: '100vh',
    margin: '0 auto',
  }), [maxWidth])

  return (
    <div
      className="
        relative
        w-full
        min-h-screen
        bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900
        text-white
        overflow-x-hidden
      "
    >
      {/* 主容器 - 9:16 比例 */}
      <div
        className="relative mx-auto px-4 py-6 flex flex-col items-center"
        style={containerStyle}
      >
        {/* 标题区 */}
        <header className="text-center mb-6 w-full">
          <div className="flex items-center justify-between">
            {/* 左侧占位 */}
            <div className="w-8"></div>

            {/* 标题 */}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-sm text-gray-400 mt-1">易经六十四卦 · 智慧决策工具</p>
            </div>

            {/* 右侧设置按钮 */}
            <button
              onClick={onSettingsClick}
              className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              title="设置"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.517c.128-1.059.528-2.078 1.29-2.79a2.5 2.5 0 012.69-.575l.07.06c.79.7 1.24 1.62 1.29 2.58.04.378.04.757 0 1.134m-5.34 0A9.004 9.004 0 005.517 9M15 5.622v4.03m0 0a9.002 9.002 0 01-5.683 2.46m5.683-2.46a9.002 9.002 0 00-5.683 2.46m0 0A9.004 9.004 0 0118.483 15M9 18.378v-4.03m0 0a9.002 9.002 0 005.683-2.46M9 14.348a9.002 9.002 0 01-5.683-2.46m5.683 2.46V18.38"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* 内容区 */}
        <main className="flex-1 w-full flex flex-col items-center">
          {children}
        </main>

        {/* 底部信息 */}
        <footer className="mt-8 text-center text-xs text-gray-600">
          <p>64转盘 · 基于易经六十四卦</p>
          <p className="mt-1">仅供娱乐参考 · 重大决策请咨询专业人士</p>
        </footer>
      </div>
    </div>
  )
}

export default React.memo(MobileLayout)
