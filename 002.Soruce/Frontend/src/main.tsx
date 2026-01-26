import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css' <-- 이 줄이 있다면 지우거나 주석 처리해주세요! (우리가 만든 css와 충돌할 수 있음)
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
