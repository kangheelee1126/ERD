import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ErdPage from './pages/ERD/ErdPage';
// 👇 새로 만든 페이지 import 확인
import MenuManagePage from './pages/System/MenuManagePage'; 

function App() {
  return (
    <Routes>
      {/* 1. 로그인/회원가입 (사이드바 없음) */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 2. 메인 레이아웃 그룹 (사이드바 + 헤더 포함) */}
      {/* 👇 이 태그 안쪽에 있어야 사이드바가 나옵니다! */}
      <Route element={<MainLayout />}>
        <Route path="/main" element={<Dashboard />} />
        
        {/* ERD 페이지 */}
        <Route path="/erd" element={<ErdPage />} />
        
        {/* ✨ [수정] 메뉴 관리 페이지를 여기 안으로 쏙 넣어주세요! ✨ */}
        <Route path="/menu" element={<MenuManagePage />} />

        {/* 나머지 준비중 페이지들 */}
        <Route path="/sr" element={<div style={{color:'white'}}>SR 관리 페이지</div>} />
        <Route path="/users" element={<div style={{color:'white'}}>사용자 관리 페이지</div>} />
      </Route>

      {/* 3. 예외 처리 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;