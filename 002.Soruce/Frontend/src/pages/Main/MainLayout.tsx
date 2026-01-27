import { Outlet, useNavigate } from 'react-router-dom';
import { Menu, LogOut, Upload } from 'lucide-react';
import Sidebar from '../../components/Layout/Sidebar'; // 두 단계 위로 올라가서 찾아야 함
import './Layout.css'; 

const MainLayout = () => {
  const navigate = useNavigate();

  return (
    <div className="layout-container">
      {/* 1. 헤더: 프로젝트 공통 상단 바 */}
      <header className="main-header">
        <div className="header-left">
          <Menu className="icon-btn" />
          <span className="project-title">001.ERD Project</span>
        </div>
        <div className="header-right">
          <button className="header-btn export-btn">
            <Upload size={16} /> <span>SQL Export</span>
          </button>
          <div className="divider-vertical"></div>
          <div className="user-profile">Admin</div>
          <span title="로그아웃2">
            <LogOut className="icon-btn" onClick={() => navigate('/')} />
          </span>
        </div>
      </header>

      <div className="main-body">
        {/* 2. 좌측 사이드바: DB에서 데이터를 가져와 자동으로 메뉴 생성 */}
        <Sidebar /> 

        {/* 3. 콘텐츠 영역: 라우터에 따라 대시보드, 메뉴관리, ERD 등이 표시됨 */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;