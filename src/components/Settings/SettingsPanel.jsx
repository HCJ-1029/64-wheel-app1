/**
 * 设置面板组件
 * 包含：字体大小、声音控制、颜色方案、文字方向
 */
import React, { useState, useEffect, useCallback } from 'react'

// 预设颜色方案
const COLOR_SCHEMES = [
  {
    id: 'default',
    name: '经典',
    colors: ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#1ABC9C', '#3498DB', '#9B59B6', '#E91E63']
  },
  {
    id: 'ocean',
    name: '海洋',
    colors: ['#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#ADE8F4', '#CAF0F8', '#E0F7FA']
  },
  {
    id: 'sunset',
    name: '日落',
    colors: ['#FF6B6B', '#FF8E53', '#FFA726', '#FFCC02', '#FFD93D', '#FFE066', '#FFF176', '#FFF59D']
  },
  {
    id: 'forest',
    name: '森林',
    colors: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2', '#B7E4C7', '#D8F3DC', '#F0F7F4']
  },
  {
    id: 'purple',
    name: '紫韵',
    colors: ['#5A189A', '#7B2CBF', '#9D4EDD', '#C77DFF', '#E0AAFF', '#E8C5FF', '#F0DCFF', '#F8F0FF']
  }
]

/**
 * 设置面板组件
 * @param {Object} props
 * @param {Object} props.settings - 当前设置
 * @param {Function} props.onSettingsChange - 设置变更回调
 * @param {Function} props.onClose - 关闭回调
 */
function SettingsPanel({ settings, onSettingsChange, onClose }) {
  const [localSettings, setLocalSettings] = useState(settings)

  // 更新设置
  const updateSetting = useCallback((key, value) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev, [key]: value }
      onSettingsChange(newSettings)
      return newSettings
    })
  }, [onSettingsChange])

  // 字体大小选项
  const fontSizes = [12, 14, 16, 18, 20, 24]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl p-6 w-11/12 max-w-md max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-700">
        {/* 标题栏 */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>⚙️</span>
            <span>设置</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 字体大小设置 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            字体大小 ({localSettings.fontSize}px)
          </label>
          <input
            type="range"
            min="12"
            max="24"
            step="1"
            value={localSettings.fontSize}
            onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>小</span>
            <span>大</span>
          </div>
        </div>

        {/* 声音控制 */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">
              声音效果
            </label>
            <button
              onClick={() => updateSetting('soundEnabled', !localSettings.soundEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                localSettings.soundEnabled ? 'bg-yellow-400' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localSettings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          {localSettings.soundEnabled && (
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                音量 ({Math.round(localSettings.soundVolume * 100)}%)
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={localSettings.soundVolume}
                onChange={(e) => updateSetting('soundVolume', parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
            </div>
          )}
        </div>

        {/* 颜色方案 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            颜色方案
          </label>
          <div className="grid grid-cols-5 gap-2">
            {COLOR_SCHEMES.map(scheme => (
              <button
                key={scheme.id}
                onClick={() => updateSetting('colorScheme', scheme.id)}
                className={`relative p-2 rounded-lg border-2 transition-all ${
                  localSettings.colorScheme === scheme.id
                    ? 'border-yellow-400 scale-105'
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                title={scheme.name}
              >
                <div className="flex flex-col gap-0.5">
                  {scheme.colors.slice(0, 4).map((color, idx) => (
                    <div
                      key={idx}
                      className="h-3 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400 mt-1 block">{scheme.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 文字方向 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            文字方向
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => updateSetting('textDirection', 'vertical')}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                localSettings.textDirection === 'vertical'
                  ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 text-white'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              竖向
            </button>
            <button
              onClick={() => updateSetting('textDirection', 'horizontal')}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                localSettings.textDirection === 'horizontal'
                  ? 'border-yellow-400 bg-yellow-400 bg-opacity-20 text-white'
                  : 'border-gray-600 text-gray-400 hover:border-gray-500'
              }`}
            >
              横向
            </button>
          </div>
        </div>

        {/* 重置按钮 */}
        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={() => {
              const defaultSettings = {
                fontSize: 16,
                soundEnabled: true,
                soundVolume: 0.5,
                colorScheme: 'default',
                textDirection: 'vertical'
              }
              setLocalSettings(defaultSettings)
              onSettingsChange(defaultSettings)
            }}
            className="w-full py-2 px-4 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
          >
            恢复默认设置
          </button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(SettingsPanel)
