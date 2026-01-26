// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage'; // 추가됨
import MainLayout from './pages/Main/MainLayout'; // 👈 추가

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 주소가 그냥 '/' 일 때 -> '/login'으로 납치(리다이렉트) */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* '/login' 주소일 때 -> 로그인 페이지 보여주기 */}
        <Route path="/login" element={<LoginPage />} />
        {/* 회원가입 경로 추가 */}
        <Route path="/register" element={<RegisterPage />} />

        {/* 메인 화면 라우트 추가 */}
        <Route path="/main" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;