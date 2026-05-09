/**
 * 卦象解读组件
 * 显示卦象的详细解读信息
 */
import React, { useCallback } from 'react'

/**
 * 卦象解读卡片组件
 * @param {Object} props
 * @param {Object} props.gua - 卦象数据
 * @param {boolean} props.showDetail - 是否显示详细模式
 * @param {Function} props.onToggleDetail - 切换详细模式回调
 * @param {Function} props.onClose - 关闭回调
 */
function Interpretation({ gua, showDetail = false, onToggleDetail, onClose }) {
  if (!gua) return null

  const handleToggleDetail = useCallback(() => {
    if (onToggleDetail) {
      onToggleDetail()
    }
  }, [onToggleDetail])

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose()
    }
  }, [onClose])

  return (
    <div className="w-full max-w-sm mx-auto bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-5 text-white">
      {/* 关闭按钮 */}
      <button
        onClick={handleClose}
        className="float-right text-gray-400 hover:text-white transition-colors text-xl leading-none"
        aria-label="关闭解读"
      >
        ✕
      </button>

      {/* 卦名和符号 */}
      <div className="text-center mb-4">
        <div className="text-5xl mb-2">{gua.unicode}</div>
        <h3 className="text-xl font-bold">{gua.name}</h3>
        <span className="inline-block mt-1 px-3 py-1 bg-yellow-400 bg-opacity-20 text-yellow-400 rounded-full text-xs">
          {gua.wuxing} · 第{gua.id}卦
        </span>
      </div>

      {/* 一句话概括 */}
      <div className="text-center mb-4">
        <p className="text-yellow-400 font-semibold">{gua.brief}</p>
      </div>

      {/* 详细含义 - 简洁模式 */}
      {!showDetail && (
        <div className="mb-4">
          <p className="text-sm text-gray-300 line-clamp-3">{gua.meaning}</p>
        </div>
      )}

      {/* 详细含义 - 详细模式 */}
      {showDetail && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-yellow-400 mb-2">📖 详细解读</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{gua.meaning}</p>
        </div>
      )}

      {/* 建议 */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-green-400 mb-2">💡 建议</h4>
        <ul className="space-y-1">
          {gua.advice.map((item, index) => (
            <li key={index} className="text-sm text-gray-300 flex items-start">
              <span className="text-green-400 mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 注意事项 */}
      <div className="mb-4">
        <h4 className="text-sm font-semibold text-red-400 mb-2">⚠️ 注意事项</h4>
        <ul className="space-y-1">
          {gua.warnings.map((item, index) => (
            <li key={index} className="text-sm text-gray-300 flex items-start">
              <span className="text-red-400 mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 展开/收起按钮 */}
      <button
        onClick={handleToggleDetail}
        className="w-full py-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
      >
        {showDetail ? '收起详细解读 ▲' : '展开详细解读 ▼'}
      </button>
    </div>
  )
}

export default React.memo(Interpretation)
