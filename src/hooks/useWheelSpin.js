/**
 * 转盘旋转 Hook
 * 管理转盘的旋转角度、旋转状态和动画
 * 
 * 简化逻辑：
 * 1. 生成随机大角度（确保多圈旋转效果）
 * 2. 使用 CSS transition 从当前角度动画到目标角度
 * 3. 动画完成后，根据最终角度确定卦象
 */
import { useState, useCallback, useRef, useEffect } from 'react'
import { getGuaIdFromRotation } from '../utils/angleCalculator'

/**
 * 转盘旋转自定义 Hook
 * @param {Object} options - 配置选项
 * @param {number} options.duration - 旋转持续时间（ms），默认 2000
 * @param {number} options.extraRotations - 额外旋转圈数，默认 5
 * @param {string} options.easing - CSS 缓动函数，默认 'cubic-bezier(0.25, 0.1, 0.25, 1)'
 * @returns {Object} 旋转状态和控制函数
 */
export function useWheelSpin(options = {}) {
  const {
    duration = 2000,
    extraRotations = 5,
    easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  } = options

  // 当前旋转角度（CSS rotate 值）
  const [rotation, setRotation] = useState(0)
  // 是否正在旋转
  const [isSpinning, setIsSpinning] = useState(false)
  // 当前选中的卦象 ID（旋转结束后确定）
  const [selectedGuaId, setSelectedGuaId] = useState(null)

  // 使用 ref 跟踪最新状态，避免闭包问题
  const spinningRef = useRef(false)
  const rotationRef = useRef(0)

  // 同步 rotationRef 与 rotation 状态
  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  /**
   * 开始旋转转盘（随机选择卦象）
   * @returns {Promise<number>} 最终选中的卦象ID
   */
  const spin = useCallback(() => {
    return new Promise((resolve, reject) => {
      // 防止重复点击
      if (spinningRef.current) {
        reject(new Error('转盘正在旋转中'))
        return
      }

      spinningRef.current = true
      setIsSpinning(true)

      // 当前角度
      const current = rotationRef.current

      // 生成随机目标角度：至少转 extraRotations 圈，再加随机角度
      const minAdd = extraRotations * 360
      const randomAdd = Math.floor(Math.random() * 360)
      const target = current + minAdd + randomAdd

      // 更新 ref 和 state
      rotationRef.current = target
      setRotation(target)

      // 等待动画完成
      setTimeout(() => {
        // 根据最终角度确定卦象
        const guaId = getGuaIdFromRotation(target)
        
        setSelectedGuaId(guaId)
        setIsSpinning(false)
        spinningRef.current = false

        resolve(guaId)
      }, duration)
    })
  }, [duration, extraRotations])

  /**
   * 重置转盘状态
   */
  const reset = useCallback(() => {
    rotationRef.current = 0
    setRotation(0)
    setIsSpinning(false)
    setSelectedGuaId(null)
    spinningRef.current = false
  }, [])

  return {
    rotation,
    isSpinning,
    selectedGuaId,
    spin,
    reset,
    easing,
    duration,
  }
}
