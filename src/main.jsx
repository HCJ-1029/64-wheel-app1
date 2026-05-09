/**
 * 应用入口文件
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// 开发环境提示
if (import.meta.env.DEV) {
  console.log('🎯 64转盘应用已启动')
  console.log('📱 移动端调试: 按 F12 打开开发者工具，切换到设备模拟模式')
}

// 渲染应用
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
