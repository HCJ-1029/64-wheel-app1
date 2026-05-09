/**
 * 输入区域组件
 * 用户可以输入问题（可选，不影响随机结果）
 */
import React, { useState, useCallback } from 'react'

/**
 * 输入区域组件
 * @param {Object} props
 * @param {Function} props.onInputChange - 输入变化回调
 * @param {boolean} props.disabled - 是否禁用
 * @param {string} props.placeholder - 占位符文本
 */
function InputArea({ onInputChange, disabled = false, placeholder = '心中默念你的问题（可选）' }) {
  const [inputValue, setInputValue] = useState('')

  const handleChange = useCallback((e) => {
    const value = e.target.value
    setInputValue(value)
    if (onInputChange) {
      onInputChange(value)
    }
  }, [onInputChange])

  const handleClear = useCallback(() => {
    setInputValue('')
    if (onInputChange) {
      onInputChange('')
    }
  }, [onInputChange])

  return (
    <div className="w-full max-w-sm mx-auto mb-4">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          className="
            w-full
            px-4 py-3
            bg-white bg-opacity-10
            border border-white border-opacity-20
            rounded-full
            text-white text-sm
            placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent
            transition-all
            disabled:opacity-50
          "
          aria-label="输入你的问题"
        />
        {inputValue && (
          <button
            onClick={handleClear}
            disabled={disabled}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            aria-label="清除输入"
          >
            ✕
          </button>
        )}
      </div>
      <p className="text-center text-xs text-gray-500 mt-2">
        输入问题仅为心理暗示，不影响随机结果
      </p>
    </div>
  )
}

export default React.memo(InputArea)
