/**
 * 转盘 SVG 绘制组件
 * 使用 SVG 绘制 64 个扇形，每 8 个一种颜色
 * 支持设置：自定义颜色、字体大小、文字方向
 */
import React, { useMemo } from 'react'
import { getAllGua } from '../../data/bagua64'
import { SECTOR_ANGLE, describeSector, getTextPosition, getGuaStartAngle, getGuaEndAngle, getGuaCenterAngle } from '../../utils/angleCalculator'

// 颜色方案
const COLOR_SCHEMES = {
  default: ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#1ABC9C', '#3498DB', '#9B59B6', '#E91E63'],
  ocean: ['#0077B6', '#0096C7', '#00B4D8', '#48CAE4', '#90E0EF', '#ADE8F4', '#CAF0F8', '#E0F7FA'],
  sunset: ['#FF6B6B', '#FF8E53', '#FFA726', '#FFCC02', '#FFD93D', '#FFE066', '#FFF176', '#FFF59D'],
  forest: ['#2D6A4F', '#40916C', '#52B788', '#74C69D', '#95D5B2', '#B7E4C7', '#D8F3DC', '#F0F7F4'],
  purple: ['#5A189A', '#7B2CBF', '#9D4EDD', '#C77DFF', '#E0AAFF', '#E8C5FF', '#F0DCFF', '#F8F0FF']
}

/**
 * 转盘 SVG 组件
 * @param {Object} props
 * @param {number} props.size - 转盘大小（px），默认 300
 * @param {Object} props.settings - 设置对象
 */
function WheelSVG({ size = 300, settings = {} }) {
  const center = size / 2
  const radius = size / 2 - 10 // 留点边距
  const innerRadius = radius * 0.25 // 内圈半径

  // 使用设置中的颜色方案或默认
  const colorScheme = settings.colorScheme || 'default'
  const colors = COLOR_SCHEMES[colorScheme] || COLOR_SCHEMES.default
  const fontSize = (settings.fontSize || 16) * 0.04 * size / 16 // 根据设置调整字体大小
  const textDirection = settings.textDirection || 'vertical'

  // 获取所有卦象数据
  const allGua = getAllGua()

  // 生成扇形路径
  const sectors = useMemo(() => {
    return allGua.map(gua => {
      const startAngle = getGuaStartAngle(gua.id)
      const endAngle = getGuaEndAngle(gua.id)
      const centerAngle = getGuaCenterAngle(gua.id)

      // 扇形路径
      const pathD = describeSector(center, center, radius, startAngle, endAngle)

      // 颜色
      const color = colors[(gua.colorGroup - 1) % colors.length]

      return {
        ...gua,
        pathD,
        color,
        startAngle,
        endAngle,
        centerAngle,
      }
    })
  }, [allGua, center, radius, innerRadius, colors])

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="overflow-visible"
      style={{ touchAction: 'manipulation' }}
    >
      {/* 背景圆 */}
      <circle
        cx={center}
        cy={center}
        r={radius + 5}
        fill="none"
        stroke="#333"
        strokeWidth="2"
      />

      {/* 扇形 */}
      {sectors.map(gua => {
        // 获取卦名简称（如"乾卦" -> "乾"）
        const shortName = gua.shortName.replace('卦', '')
        const displayChars = shortName.split('')

        // 文字排列范围：从外圈(0.65)到内圈(0.40)
        const outerRatio = 0.65
        const innerRatio = 0.40

        return (
          <g key={gua.id}>
            <path
              d={gua.pathD}
              fill={gua.color}
              stroke="#fff"
              strokeWidth="0.5"
              opacity="0.85"
            />
            {/* 卦名文本 */}
            {textDirection === 'vertical' ? (
              // 竖向排列：从外到内依次排列字符
              displayChars.map((char, index) => {
                const charCount = displayChars.length
                const ratio = charCount === 1
                  ? (outerRatio + innerRatio) / 2  // 只有一个字符时放在中间
                  : outerRatio - (index / (charCount - 1)) * (outerRatio - innerRatio)

                const pos = getTextPosition(center, center, radius, gua.centerAngle, ratio)

                // 文字旋转：垂直于径向线，使其在扇形内可读
                let rotation = (gua.centerAngle + 90) % 360

                // 在左侧半圆时，翻转180度使文字正立
                if (gua.centerAngle > 90 && gua.centerAngle < 270) {
                  rotation = (rotation + 180) % 360
                }

                return (
                  <text
                    key={index}
                    x={pos.x}
                    y={pos.y}
                    transform={`rotate(${rotation}, ${pos.x}, ${pos.y})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize}
                    fill="#fff"
                    fontWeight="bold"
                    stroke="#000"
                    strokeWidth="1.5"
                    paintOrder="stroke"
                  >
                    {char}
                  </text>
                )
              })
            ) : (
              // 横向排列：文字沿径向方向排列
              (() => {
                const pos = getTextPosition(center, center, radius, gua.centerAngle, 0.55)
                let rotation = gua.centerAngle % 360

                // 调整文字方向使其可读
                if (rotation > 90 && rotation < 270) {
                  rotation = (rotation + 180) % 360
                }

                return (
                  <text
                    key="horizontal"
                    x={pos.x}
                    y={pos.y}
                    transform={`rotate(${rotation}, ${pos.x}, ${pos.y})`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={fontSize * 0.8}
                    fill="#fff"
                    fontWeight="bold"
                    stroke="#000"
                    strokeWidth="1.5"
                    paintOrder="stroke"
                  >
                    {shortName}
                  </text>
                )
              })()
            )}
          </g>
        )
      })}

      {/* 中心圆 */}
      <circle
        cx={center}
        cy={center}
        r={innerRadius}
        fill="#1a1a2e"
        stroke="#333"
        strokeWidth="2"
      />
    </svg>
  )
}

export default React.memo(WheelSVG)
