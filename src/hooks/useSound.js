/**
 * 音效Hook
 * 处理转盘旋转时的音效播放
 * 使用Web Audio API生成音效，无需外部音频文件
 */
import { useRef, useCallback, useEffect } from 'react'

/**
 * 生成旋转音效
 * 使用Web Audio API创建渐变频率的声音
 * @param {AudioContext} audioContext
 * @param {number} duration - 音效时长（秒）
 * @param {number} volume - 音量 (0-1)
 * @returns {AudioBufferSourceNode}
 */
function createSpinSound(audioContext, duration, volume) {
  const sampleRate = audioContext.sampleRate
  const length = sampleRate * duration
  const buffer = audioContext.createBuffer(1, length, sampleRate)
  const data = buffer.getChannelData(0)

  // 生成渐变频率的声音（从低频到高频）
  for (let i = 0; i < length; i++) {
    const t = i / length
    // 频率从200Hz渐变到800Hz
    const freq = 200 + t * 600
    // 振幅 envelope：淡入淡出
    const envelope = t < 0.1 ? t / 0.1 : t > 0.9 ? (1 - t) / 0.1 : 1
    // 生成正弦波
    data[i] = Math.sin(2 * Math.PI * freq * t * duration) * envelope * volume
  }

  const source = audioContext.createBufferSource()
  source.buffer = buffer

  const gainNode = audioContext.createGain()
  gainNode.gain.value = volume

  source.connect(gainNode)
  gainNode.connect(audioContext.destination)

  return { source, gainNode }
}

/**
 * useSound Hook
 * @param {Object} settings - 声音设置
 * @param {boolean} settings.soundEnabled - 是否启用声音
 * @param {number} settings.soundVolume - 音量 (0-1)
 * @returns {Object} 音效控制对象
 */
function useSound(settings) {
  const audioContextRef = useRef(null)
  const currentSourceRef = useRef(null)

  // 初始化AudioContext
  useEffect(() => {
    if (settings.soundEnabled && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close()
        audioContextRef.current = null
      }
    }
  }, [settings.soundEnabled])

  /**
   * 播放旋转音效
   * @param {number} duration - 旋转时长（毫秒）
   */
  const playSpinSound = useCallback((duration) => {
    if (!settings.soundEnabled || !audioContextRef.current) return

    // 停止当前播放的音效
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop()
      } catch (e) {
        // 忽略已经停止的错误
      }
    }

    const audioContext = audioContextRef.current

    // 恢复AudioContext（某些浏览器需要用户交互后才能播放）
    if (audioContext.state === 'suspended') {
      audioContext.resume()
    }

    const { source } = createSpinSound(
      audioContext,
      duration / 1000,
      settings.soundVolume
    )

    currentSourceRef.current = source

    source.onended = () => {
      currentSourceRef.current = null
    }

    source.start()
  }, [settings.soundEnabled, settings.soundVolume])

  /**
   * 停止音效
   */
  const stopSound = useCallback(() => {
    if (currentSourceRef.current) {
      try {
        currentSourceRef.current.stop()
      } catch (e) {
        // 忽略错误
      }
      currentSourceRef.current = null
    }
  }, [])

  return {
    playSpinSound,
    stopSound
  }
}

export default useSound
