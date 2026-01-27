import { Outlet } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import Sidebar from './Sidebar'; // 작성하신 Sidebar 컴포넌트 임포트
import './Layout.css';

const MainLayout = () => {
  

    return (
    <div className="layout-container">
      {/* 🌟 상단 헤더 (Top Bar) 복구 */}
      <header className="main-header">
        <div className="header-left">
          <div className="logo-placeholder">001</div>
          <span className="project-title">ERD SYSTEM</span>
        </div>
        <div className="header-right">
          <Bell className="icon-btn" size={20} />
          <div className="divider-vertical"></div>
          <div className="user-profile">
            <User size={18} />
            <span>관리자님</span>
          </div>
        </div>
      </header>
      
      <div className="main-body">
        {/* 사이드바 영역 */}
        <Sidebar />
        {/* 콘텐츠 영역 */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout; // 🌟 화면 백화 현상 방지를 위한 필수 내보내기