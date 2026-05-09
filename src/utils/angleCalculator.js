/**
 * 角度计算工具函数
 * 用于64转盘的角度计算和卦象定位
 *
 * 坐标系说明：
 * - SVG坐标系：0°=3点钟方向，顺时针增加
 * - 指针位置：顶部（12点钟方向 = SVG的270°位置）
 * - 转盘旋转：CSS rotate() 顺时针增加角度
 * - 卦象1起始角度：270°（顶部），顺时针排列
 */

/** 每个卦象占据的角度（度） */
export const SECTOR_ANGLE = 360 / 64 // 5.625度

/**
 * 根据卦象ID计算其起始角度（SVG坐标系）
 * 卦象按顺时针排列，ID 1在顶部（SVG 270°位置）
 * @param {number} guaId - 卦象ID (1-64)
 * @returns {number} 起始角度（SVG坐标系，度）
 */
export function getGuaStartAngle(guaId) {
  const index = guaId - 1
  // 卦象1在顶部（SVG 270°），顺时针排列
  return (270 + index * SECTOR_ANGLE) % 360
}

/**
 * 根据卦象ID计算其结束角度
 * @param {number} guaId - 卦象ID (1-64)
 * @returns {number} 结束角度（度）
 */
export function getGuaEndAngle(guaId) {
  return (getGuaStartAngle(guaId) + SECTOR_ANGLE) % 360
}

/**
 * 根据卦象ID计算其扇形的中心点角度
 * @param {number} guaId - 卦象ID (1-64)
 * @returns {number} 中心点角度（度）
 */
export function getGuaCenterAngle(guaId) {
  const start = getGuaStartAngle(guaId)
  return (start + SECTOR_ANGLE / 2) % 360
}

/**
 * 根据转盘旋转角度计算指针位置对应的卦象ID
 * 
 * 逻辑：
 * - 转盘CSS旋转角度为 rotation 时，SVG内部也旋转了 rotation 度（顺时针）
 * - SVG中角度为 Y 的点，在屏幕上显示的角度为 (Y - rotation + 360) % 360
 * - 指针在屏幕顶部，对应SVG角度为 (270 + rotation) % 360
 * - 找到包含该SVG角度的卦象即可
 *
 * @param {number} rotation - 转盘CSS旋转角度（度）
 * @returns {number} 卦象ID (1-64)
 */
export function getGuaIdFromRotation(rotation) {
  // 标准化 rotation 到 0-359.999...
  const normalizedRotation = ((rotation % 360) + 360) % 360

  // 指针在屏幕顶部，对应的SVG角度是 (270 + rotation) mod 360
  // 找到包含该角度的卦象
  // 卦象起始角度 = (270 + (id-1) * 5.625) mod 360
  // 所以：id = floor(normalizedRotation / 5.625) + 1
  const index = Math.floor(normalizedRotation / SECTOR_ANGLE)
  // index 范围 0-63，对应 ID 1-64
  return (index % 64) + 1
}

/**
 * 生成随机旋转目标角度
 * @param {number} currentRotation - 当前旋转角度
 * @param {number} extraRotations - 额外旋转圈数，默认5
 * @returns {{target: number, guaId: number}} 目标角度和对应的卦象ID
 */
export function generateRandomRotation(currentRotation = 0, extraRotations = 5) {
  // 至少旋转 extraRotations 圈
  const minAdd = extraRotations * 360
  
  // 随机增加一个角度，使结果随机
  const randomAdd = Math.floor(Math.random() * 360)
  
  const target = currentRotation + minAdd + randomAdd
  
  // 计算最终停在指针处的卦象
  const guaId = getGuaIdFromRotation(target)
  
  return { target, guaId }
}

/**
 * 将角度转换为弧度
 * @param {number} degrees - 角度
 * @returns {number} 弧度
 */
export function degreesToRadians(degrees) {
  return (degrees * Math.PI) / 180
}

/**
 * 计算扇形路径的SVG d属性
 * @param {number} centerX - 圆心X坐标
 * @param {number} centerY - 圆心Y坐标
 * @param {number} radius - 半径
 * @param {number} startAngle - 起始角度（SVG坐标系，度）
 * @param {number} endAngle - 结束角度（度）
 * @returns {string} SVG path的d属性值
 */
export function describeSector(centerX, centerY, radius, startAngle, endAngle) {
  const startRad = degreesToRadians(startAngle)
  const endRad = degreesToRadians(endAngle)

  const x1 = centerX + radius * Math.cos(startRad)
  const y1 = centerY + radius * Math.sin(startRad)
  const x2 = centerX + radius * Math.cos(endRad)
  const y2 = centerY + radius * Math.sin(endRad)

  // 判断是否为大弧（角度差 > 180度）
  let angleDiff = (endAngle - startAngle + 360) % 360
  const largeArcFlag = angleDiff > 180 ? 1 : 0

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

/**
 * 计算扇形中心点的文本位置（SVG坐标系）
 * @param {number} centerX - 圆心X坐标
 * @param {number} centerY - 圆心Y坐标
 * @param {number} radius - 半径
 * @param {number} angle - 中心角度（SVG坐标系，度）
 * @param {number} textRadiusRatio - 文本位置占半径的比例 (0-1)
 * @returns {{x: number, y: number, rotation: number}} 文本位置和旋转角度
 */
export function getTextPosition(centerX, centerY, radius, angle, textRadiusRatio = 0.65) {
  const rad = degreesToRadians(angle)
  const textRadius = radius * textRadiusRatio
  const x = centerX + textRadius * Math.cos(rad)
  const y = centerY + textRadius * Math.sin(rad)
  // 文本旋转角度，使其沿径向方向（指向圆心）
  const rotation = angle + 90
  return { x, y, rotation }
}
