import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MainLayout from './components/Layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import ErdPage from './pages/ERD/ErdPage';
import MenuManagePage from './pages/System/MenuManagePage'; 
import UserManagement from './pages/Admin/UserManagement';
// ✨ 권한 관리 페이지 import 추가
import RoleManagement from './pages/Admin/RoleManagement';
import SamplePage from './pages/Sample/sample';       // [cite: 2026-01-28]
// ✨ 신규 페이지 임포트 [cite: 2026-01-28]
import CommonCode from './pages/System/CommonCode';

import CustomerManagement from './pages/base/CustomerManagement'; // [cite: 2026-01-28]


function App() {
  return (
    <Routes>
      {/* 1. 로그인/회원가입 (사이드바 없음) */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* 2. 메인 레이아웃 그룹 (사이드바 + 헤더 포함) */}
      <Route element={<MainLayout />}>
        <Route path="/main" element={<Dashboard />} />
        
        {/* ERD 페이지 */}
        <Route path="/erd" element={<ErdPage />} />
        
        {/* 메뉴 관리 페이지 */}
        <Route path="/menu" element={<MenuManagePage />} />

        {/* 사용자 관리 및 권한 관리 페이지 */}
        <Route path="/admin/users" element={<UserManagement />} />
        {/* ✨ 권한 관리 경로 등록 */}
        <Route path="/admin/roles" element={<RoleManagement />} />

        {/* 나머지 준비중 페이지들 */}
        <Route path="/sr" element={<div style={{color:'white'}}>SR 관리 페이지</div>} />

        {/* 3. 표준 샘플 페이지 (TypeScript 경고 해결 지점) [cite: 2026-01-28] */}
        <Route path="/sample" element={<SamplePage />} />

        {/* 3. 공통코드 관리 페이지 (System 메뉴) ✨ [cite: 2026-01-28] */}
        <Route path="/system/CommonCode" element={<CommonCode />} />

        {/* ✨ [추가] 기준정보 관리 라우트 [cite: 2026-01-28] */}
        <Route path="/base/customer" element={<CustomerManagement />} />
      </Route>

      {/* 3. 예외 처리 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;