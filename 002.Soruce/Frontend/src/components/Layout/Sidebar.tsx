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

  // ✨ 세션 또는 로컬스토리지에서 userNo를 가져옵니다. [cite: 2026-01-27]
  const userNo = Number(localStorage.getItem('userNo')) || 0; 

  useEffect(() => {
    const loadAuthorizedMenus = async () => {
      try {
        
        if (!userNo) return;

        // ✨ 1. 전체 메뉴가 아닌 인가된 메뉴만 서버에 요청 [cite: 2026-01-28]
        const data = await MenuService.getAuthorizedMenus(userNo);
        
        // ✨ 2. 평면 리스트를 트리 구조로 변환하는 안전장치 (UpMenuId & SortNo 반영)
        const buildTree = (items: any[], upMenuId: string | null = null): any[] => {
          return items
            .filter(item => item.upMenuId === upMenuId)
            .map(item => ({
              ...item,
              children: buildTree(items, item.menuId)
            }))
            .sort((a, b) => (a.sortNo || 0) - (b.sortNo || 0));
        };
  
        // 데이터가 이미 Children 리스트를 포함한 트리 형태면 그대로, 아니면 변환
        const menuTree = (data.length > 0 && data[0].children) ? data : buildTree(data);
        setMenus(menuTree);
        
      } catch (error) {
        console.error("인가된 사이드바 메뉴 로드 실패:", error);
      }
    };
  
    loadAuthorizedMenus();
  }, [userNo]); 

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

      // Lucide 아이콘 동적 할당 [cite: 2026-01-28]
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
          
          {/* 하위 메뉴 렌더링: Children 리스트 기반 */}
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
      {/* 상단 레이아웃 가이드 준수 [cite: 2026-01-28] */}
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