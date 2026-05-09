/**
 * 卦象解读 Hook
 * 管理卦象解读的显示状态
 */
import { useState, useCallback } from 'react'
import { getGuaById } from '../data/bagua64'

/**
 * 卦象解读自定义 Hook
 * @returns {Object} 解读状态和控制函数
 */
export function useGuaInterpretation() {
  // 当前选中的卦象数据
  const [currentGua, setCurrentGua] = useState(null)
  // 是否显示详细解读弹窗
  const [showDetail, setShowDetail] = useState(false)
  // 是否显示简洁模式
  const [showBrief, setShowBrief] = useState(false)

  /**
   * 设置当前卦象
   * @param {number} guaId - 卦象ID (1-64)
   */
  const selectGua = useCallback((guaId) => {
    const gua = getGuaById(guaId)
    setCurrentGua(gua)
    setShowBrief(true)
    setShowDetail(false)
  }, [])

  /**
   * 展开详细解读
   */
  const expandDetail = useCallback(() => {
    setShowDetail(true)
  }, [])

  /**
   * 收起详细解读
   */
  const collapseDetail = useCallback(() => {
    setShowDetail(false)
  }, [])

  /**
   * 关闭解读显示
   */
  const closeInterpretation = useCallback(() => {
    setShowBrief(false)
    setShowDetail(false)
    setCurrentGua(null)
  }, [])

  /**
   * 切换详细解读显示状态
   */
  const toggleDetail = useCallback(() => {
    setShowDetail(prev => !prev)
  }, [])

  return {
    currentGua,
    showDetail,
    showBrief,
    selectGua,
    expandDetail,
    collapseDetail,
    closeInterpretation,
    toggleDetail,
  }
}
