import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { ChevronDown, ChevronRight, Circle, Database } from 'lucide-react';
import { MenuService } from '../../services/menuService';
import './Sidebar.css';

const Sidebar = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log("사이드바 useEffect 실행됨"); // 1. useEffect 진입 확인
  
    const loadMenus = async () => {
      try {
        console.log("MenuService.getMenus() 호출 시작"); // 2. 서비스 호출 직전
        const data = await MenuService.getMenus();
        console.log("API 응답 데이터:", data); // 3. 데이터 수신 확인
        
        // 평면 리스트를 트리 구조로 변환하는 안전장치 추가
        const buildTree = (items: any[], parentId: string | null = null): any[] => {
          return items
            .filter(item => item.parentId === parentId)
            .map(item => ({
              ...item,
              children: buildTree(items, item.menuId)
            }))
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));
        };
  
        // 데이터가 이미 트리 형태면 그대로, 아니면 변환
        const menuTree = (data.length > 0 && data[0].children) ? data : buildTree(data);
        setMenus(menuTree);
        
      } catch (error) {
        console.error("사이드바 API 호출 중 에러 발생:", error); // 4. 에러 로그
      }
    };
  
    loadMenus();
  }, []); // 의존성 배열이 빈 배열[]인지 꼭 확인하세요.

  const toggleMenu = (menuId: string) => {
    setOpenMenus(prev => 
      prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]
    );
  };

  const renderMenuItems = (items: any[], depth: number = 0) => {
    return items.map((item) => {
      if (item.useYn === 'N') return null;
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openMenus.includes(item.menuId);
      const isActive = location.pathname === item.menuUrl;

      // 아이콘 컴포넌트 동적 할당 (React 임포트 에러 방지)
      const IconComponent = (Icons as any)[item.menuIcon] || Circle;

      return (
        <div key={item.menuId} className="menu-group-wrapper">
          <div 
            className={`sidebar-menu-item depth-${depth} ${isActive ? 'active' : ''}`}
            onClick={() => {
              if (hasChildren) toggleMenu(item.menuId);
              else if (item.menuUrl) navigate(item.menuUrl);
            }}
          >
            <div className="menu-inner-content">
              <span className="icon-box">
                <IconComponent size={18} />
              </span>
              <span className="menu-text-label">{item.menuName}</span>
            </div>
            {hasChildren && (
              <span className="arrow-box">
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </span>
            )}
          </div>
          
          {/* 하위 메뉴 수직 배치 */}
          {hasChildren && isOpen && (
            <div className="sub-menu-container">
              {renderMenuItems(item.children, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <aside className="app-sidebar-container">
      <div className="sidebar-brand" onClick={() => navigate('/main')}>
        <Database className="brand-icon" size={24} color="#3b82f6" />
        <span className="brand-name">ERD TOOL</span>
      </div>
      <nav className="sidebar-nav-list">
        {renderMenuItems(menus)}
      </nav>
    </aside>
  );
};

export default Sidebar;