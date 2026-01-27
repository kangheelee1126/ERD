import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutGrid, Users, Settings, List, Database, Bell, User } from 'lucide-react';
import Sidebar from './Sidebar'; // 작성하신 Sidebar 컴포넌트 임포트
import './Layout.css';

const MainLayout = () => {
  const location = useLocation();

  const menuGroups = [
    {
      title: "대쉬보드",
      items: [{ name: "메인", path: "/main", icon: LayoutGrid }]
    },
    {
      title: "WORKSPACE",
      items: [{ name: "ERD 캔버스", path: "/erd", icon: Database }]
    },
    {
      title: "SYSTEM",
      items: [
        { name: "사용자관리", path: "/users", icon: Users },
        { name: "메뉴관리", path: "/menu", icon: List },
        { name: "시스템 설정", path: "/settings", icon: Settings }
      ]
    }
  ];

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