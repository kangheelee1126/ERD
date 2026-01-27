import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
// 👇 1. 이 줄을 추가하세요!
import { BrowserRouter } from 'react-router-dom' 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 👇 2. BrowserRouter로 App을 감싸주세요! */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)