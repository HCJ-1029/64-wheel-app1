/**
 * 详细解读弹窗组件
 * 全屏弹窗显示完整的卦象解读
 */
import React, { useCallback } from 'react'

/**
 * 详细解读弹窗组件
 * @param {Object} props
 * @param {Object} props.gua - 卦象数据
 * @param {boolean} props.visible - 是否显示
 * @param {Function} props.onClose - 关闭回调
 */
function DetailModal({ gua, visible = false, onClose }) {
  if (!visible || !gua) return null

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])

  // 阻止冒泡，防止点击内容区关闭弹窗
  const handleContentClick = useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="详细解读"
    >
      <div
        className="relative w-11/12 max-w-md max-h-[80vh] overflow-y-auto bg-gray-900 rounded-2xl p-6 text-white"
        onClick={handleContentClick}
      >
        {/* 关闭按钮 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          aria-label="关闭"
        >
          ✕
        </button>

        {/* 卦名和符号 */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{gua.unicode}</div>
          <h2 className="text-2xl font-bold">{gua.name}</h2>
          <div className="flex justify-center gap-2 mt-2">
            <span className="px-3 py-1 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-xs">
              {gua.wuxing}
            </span>
            <span className="px-3 py-1 bg-blue-400 bg-opacity-20 text-blue-400 rounded-full text-xs">
              第{gua.id}卦
            </span>
            <span className="px-3 py-1 bg-purple-400 bg-opacity-20 text-purple-400 rounded-full text-xs">
              颜色组{gua.colorGroup}
            </span>
          </div>
        </div>

        {/* 一句话概括 */}
        <div className="text-center mb-6">
          <p className="text-yellow-400 font-semibold text-lg">{gua.brief}</p>
        </div>

        {/* 详细含义 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">📖 详细解读</h3>
          <p className="text-gray-300 leading-relaxed">{gua.meaning}</p>
        </div>

        {/* 卦象信息 */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-5 rounded-lg p-3">
            <h4 className="text-xs text-gray-500 mb-1">二进制</h4>
            <p className="font-mono text-sm">{gua.binary}</p>
          </div>
          <div className="bg-white bg-opacity-5 rounded-lg p-3">
            <h4 className="text-xs text-gray-500 mb-1">五行属性</h4>
            <p className="text-sm">{gua.wuxing}</p>
          </div>
        </div>

        {/* 建议 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-green-400 mb-3">💡 建议</h3>
          <ul className="space-y-2">
            {gua.advice.map((item, index) => (
              <li key={index} className="flex items-start bg-green-400 bg-opacity-5 rounded-lg p-3">
                <span className="text-green-400 mr-2 font-bold">{index + 1}.</span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 注意事项 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-red-400 mb-3">⚠️ 注意事项</h3>
          <ul className="space-y-2">
            {gua.warnings.map((item, index) => (
              <li key={index} className="flex items-start bg-red-400 bg-opacity-5 rounded-lg p-3">
                <span className="text-red-400 mr-2">⚠</span>
                <span className="text-gray-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 分享按钮区 */}
        <div className="text-center">
          <button
            onClick={handleClose}
            className="px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full hover:bg-yellow-300 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(DetailModal)
