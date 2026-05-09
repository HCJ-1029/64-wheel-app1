/**
 * 64转盘主应用组件
 * 整合所有功能模块
 */
import React, { useState, useRef, useCallback, useEffect } from 'react'
import MobileLayout from './components/Layout/MobileLayout'
import Wheel from './components/Wheel/Wheel'
import InputArea from './components/InputArea/InputArea'
import Interpretation from './components/Interpretation/Interpretation'
import DetailModal from './components/Interpretation/DetailModal'
import ShareButton from './components/ShareButton/ShareButton'
import SettingsPanel from './components/Settings/SettingsPanel'
import { useWheelSpin } from './hooks/useWheelSpin'
import { useGuaInterpretation } from './hooks/useGuaInterpretation'
import useSound from './hooks/useSound'

// 默认设置
const DEFAULT_SETTINGS = {
  fontSize: 16,
  soundEnabled: true,
  soundVolume: 0.5,
  colorScheme: 'default',
  textDirection: 'vertical'
}

// 颜色方案映射
export const COLOR_SCHEMES = {
  default: ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#1ABC9C', '#3498DB', '#9B59B6', '#E91E63'],
  ocean: ['#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#ADE8F4', '#CAF0F8', '#E0F7FA'],
  sunset: ['#FF6B6B', '#FF8E53', '#FFA726', '#FFCC02', '#FFD93D', '#FFE066', '#FFF176', '#FFF59D'],
  forest: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2', '#B7E4C7', '#D8F3DC', '#F0F7F4'],
  purple: ['#5A189A', '#7B2CBF', '#9D4EDD', '#C77DFF', '#E0AAFF', '#E8C5FF', '#F0DCFF', '#F8F0FF']
}

/**
 * 从localStorage加载设置
 * @returns {Object} 设置对象
 */
function loadSettings() {
  try {
    const saved = localStorage.getItem('64wheel-settings')
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) }
    }
  } catch (e) {
    console.warn('Failed to load settings:', e)
  }
  return { ...DEFAULT_SETTINGS }
}

/**
 * 保存设置到localStorage
 * @param {Object} settings - 设置对象
 */
function saveSettings(settings) {
  try {
    localStorage.setItem('64wheel-settings', JSON.stringify(settings))
  } catch (e) {
    console.warn('Failed to save settings:', e)
  }
}

/**
 * 主应用组件
 */
function App() {
  // 用户输入的问题
  const [userInput, setUserInput] = useState('')

  // 设置状态
  const [settings, setSettings] = useState(loadSettings)
  const [showSettings, setShowSettings] = useState(false)

  // 截图引用
  const screenshotRef = useRef(null)

  // 转盘旋转 Hook
  const {
    rotation,
    isSpinning,
    selectedGuaId,
    targetRotation,
    spin,
    easing,
    duration,
  } = useWheelSpin({
    duration: 2000,
    extraRotations: 5,
  })

  // 卦象解读 Hook
  const {
    currentGua,
    showDetail,
    showBrief,
    selectGua,
    expandDetail,
    closeInterpretation,
    toggleDetail,
  } = useGuaInterpretation()

  // 音效 Hook
  const { playSpinSound, stopSound } = useSound(settings)

  // 保存设置到localStorage
  useEffect(() => {
    saveSettings(settings)
  }, [settings])

  /**
   * 处理设置变更
   * @param {Object} newSettings - 新设置
   */
  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings)
  }, [])

  /**
   * 处理转盘点击旋转
   */
  const handleSpin = useCallback(async () => {
    try {
      // 播放音效
      if (settings.soundEnabled) {
        playSpinSound(duration)
      }

      const guaId = await spin()
      // 旋转结束后显示解读
      selectGua(guaId)
    } catch (error) {
      console.warn('旋转失败:', error.message)
      stopSound()
    }
  }, [spin, selectGua, settings.soundEnabled, playSpinSound, stopSound, duration])

  /**
   * 处理输入变化
   * @param {string} value - 输入值
   */
  const handleInputChange = useCallback((value) => {
    setUserInput(value)
    // 输入仅作心理暗示，不影响随机结果
  }, [])

  /**
   * 处理详细解读展开
   */
  const handleExpandDetail = useCallback(() => {
    expandDetail()
  }, [expandDetail])

  return (
    <MobileLayout
      title="64转盘"
      onSettingsClick={() => setShowSettings(true)}
    >
      {/* 截图目标区域 */}
      <div ref={screenshotRef} className="w-full flex flex-col items-center">

        {/* 输入区域 */}
        <InputArea
          onInputChange={handleInputChange}
          disabled={isSpinning}
        />

        {/* 转盘区域 */}
        <div className="relative mb-6">
          <Wheel
            rotation={rotation}
            isSpinning={isSpinning}
            duration={duration}
            easing={easing}
            onSpinStart={handleSpin}
            size={Math.min(window.innerWidth * 0.85, 400)}
            settings={settings}
          />

          {/* 旋转提示 */}
          {!isSpinning && !showBrief && (
            <p className="text-center text-sm text-gray-400 mt-4">
              ↑ 点击转盘开始旋转
            </p>
          )}
          {isSpinning && (
            <p className="text-center text-sm text-yellow-400 mt-4 animate-pulse">
              转盘旋转中...
            </p>
          )}
        </div>

        {/* 卦象解读区域 */}
        {showBrief && currentGua && (
          <div className="w-full">
            <Interpretation
              gua={currentGua}
              showDetail={showDetail}
              onToggleDetail={toggleDetail}
              onClose={closeInterpretation}
            />

            {/* 分享按钮 */}
            <ShareButton
              screenshotRef={screenshotRef}
              gua={currentGua}
              disabled={isSpinning}
            />
          </div>
        )}

      </div>

      {/* 设置面板 */}
      {showSettings && (
        <SettingsPanel
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* 详细解读弹窗 */}
      <DetailModal
        gua={currentGua}
        visible={showDetail}
        onClose={() => toggleDetail()}
      />

      {/* 用户输入显示（仅调试用） */}
      {import.meta.env.DEV && userInput && (
        <div className="fixed bottom-4 left-4 right-4 text-xs text-gray-500 text-center opacity-50">
          当前问题: {userInput}
        </div>
      )}
    </MobileLayout>
  )
}

export default App
