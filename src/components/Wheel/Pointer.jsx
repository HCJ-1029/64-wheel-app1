/**
 * 指针组件
 * 固定在转盘顶部，不随转盘旋转
 */
import React from 'react'

/**
 * 指针组件
 * @param {Object} props
 * @param {number} props.size - 转盘大小（px），默认 300
 * @param {string} props.color - 指针颜色，默认 '#FFD700'
 */
function Pointer({ size = 300, color = '#FFD700' }) {
  const center = size / 2
  const pointerWidth = size * 0.08
  const pointerHeight = size * 0.12

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{
        left: '50%',
        top: -2,
        transform: 'translateX(-50%)',
      }}
    >
      {/* 指针 SVG */}
      <svg
        width={pointerWidth}
        height={pointerHeight + 10}
        viewBox={`0 0 ${pointerWidth} ${pointerHeight + 10}`}
        style={{ display: 'block' }}
      >
        {/* 指针主体 - 三角形指向下方（朝向转盘） */}
        <polygon
          points={`0,0 ${pointerWidth},0 ${pointerWidth / 2},${pointerHeight}`}
          fill={color}
          stroke="#333"
          strokeWidth="1.5"
        />
        {/* 顶部圆弧装饰（靠近转盘边缘） */}
        <circle
          cx={pointerWidth / 2}
          cy={pointerWidth * 0.15}
          r={pointerWidth * 0.15}
          fill={color}
          stroke="#333"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}

export default React.memo(Pointer)
