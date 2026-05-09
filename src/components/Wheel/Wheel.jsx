/**
 * 转盘主组件
 * 整合 WheelSVG 和 Pointer，处理旋转逻辑
 * 
 * 旋转逻辑：
 * - 使用 CSS transform: rotate() 实现旋转
 * - 使用 CSS transition 实现平滑动画
 * - isSpinning=true 时应用 transition，否则不应用
 */
import React, { useRef, useMemo, useEffect, useCallback } from 'react'
import WheelSVG from './WheelSVG'
import Pointer from './Pointer'
import useSound from '../../hooks/useSound'

/**
 * @param {Object} props
 * @param {number} props.rotation - 当前旋转角度（CSS rotate 值）
 * @param {boolean} props.isSpinning - 是否正在旋转
 * @param {number} props.duration - 旋转持续时间（ms）
 * @param {string} props.easing - CSS 缓动函数
 * @param {Function} props.onSpinStart - 旋转开始回调
 * @param {number} props.size - 转盘大小（px），默认 300
 * @param {Object} props.settings - 设置对象
 */
function Wheel({ rotation, isSpinning, duration = 2000, easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)', onSpinStart, size = 300, settings = {} }) {
  const wheelRef = useRef(null)
  
  // 音效 Hook
  const { playSpinSound, stopSound } = useSound(settings)

  // 开始旋转时播放音效
  useEffect(() => {
    if (isSpinning) {
      playSpinSound(duration)
    }
  }, [isSpinning, duration, playSpinSound])

  // 转盘样式
  // 当 isSpinning 时应用 transition，否则不应用（避免初始动画）
  const wheelStyle = useMemo(() => ({
    transform: `rotate(${rotation}deg)`,
    transition: isSpinning ? `transform ${duration}ms ${easing}` : 'none',
    willChange: isSpinning ? 'transform' : 'auto',
    transformOrigin: 'center center',
  }), [rotation, isSpinning, duration, easing])

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      {/* 转盘 SVG */}
      <div ref={wheelRef} className="w-full h-full" style={wheelStyle}>
        <WheelSVG size={size} settings={settings} />
      </div>

      {/* 顶部指针 */}
      <Pointer size={size} />

      {/* 点击区域 - 覆盖整个转盘 */}
      <button
        className="absolute inset-0 w-full h-full cursor-pointer z-10"
        style={{ background: 'transparent', border: 'none', outline: 'none' }}
        onClick={onSpinStart}
        disabled={isSpinning}
        aria-label="点击转盘开始旋转"
      >
        <span className="sr-only">点击转盘开始旋转</span>
      </button>
    </div>
  )
}

export default React.memo(Wheel)
