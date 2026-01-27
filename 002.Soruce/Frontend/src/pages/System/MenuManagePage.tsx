import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, Trash2, 
  ChevronRight, ChevronDown, List, Layers,
  HelpCircle, LayoutDashboard, Settings, Database, Users, 
  ShieldCheck, UserCircle, PenTool, Share2, Box, AppWindow,
  Bell, Calendar, Search, Mail
} from 'lucide-react';
import * as Icons from 'lucide-react'; 
import { MenuService } from '../../services/menuService'; 
import './MenuManagePage.css';

// 1. 선택 가능한 아이콘 리스트 정의
const ICON_OPTIONS = [
  { name: 'LayoutDashboard', label: '대시보드' },
  { name: 'Home', label: '홈' },
  { name: 'Settings', label: '설정' },
  { name: 'Database', label: '데이터베이스' },
  { name: 'Users', label: '사용자 관리' },
  { name: 'ShieldCheck', label: '권한/보안' },
  { name: 'List', label: '리스트/메뉴' },
  { name: 'Layers', label: '계층 구조' },
  { name: 'FileText', label: '문서/게시판' },
  { name: 'AppWindow', label: '애플리케이션' },
  { name: 'PenTool', label: '디자인/도구' },
  { name: 'Share2', label: '공유/연결' },
  { name: 'Box', label: '박스/컴포넌트' },
  { name: 'Search', label: '검색' },
  { name: 'Mail', label: '메일' },
  { name: 'Bell', label: '알림' },
];

interface Menu {
  menuId: string;
  upMenuId: string | null;
  menuName: string;
  menuUrl: string | null;
  menuIcon: string | null;
  sortNo: number;
  useYn: 'Y' | 'N';
  children: Menu[];
  isOpen?: boolean; 
}

const MenuManagePage = () => {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const data = await MenuService.getMenus();
      setMenus(data);
    } catch (error: any) {
      console.error("데이터 로드 실패:", error);
      alert("서버 연결에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleSave = async () => {
    if (!selectedMenu) return;
    try {
      const { isOpen, children, ...payload } = selectedMenu as any;
      await MenuService.saveMenu(payload);
      alert('성공적으로 저장되었습니다.');
      fetchMenus(); 
    } catch (error: any) {
      alert(`저장 실패: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDelete = async () => {
    if (!selectedMenu || !window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await MenuService.deleteMenu(selectedMenu.menuId);
      alert('삭제되었습니다.');
      setSelectedMenu(null);
      fetchMenus();
    } catch (error: any) {
      alert(error.response?.data?.message || "삭제 오류");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!selectedMenu) return;
    const { name, value } = e.target;
    setSelectedMenu({ ...selectedMenu, [name]: value });
  };

  const handleAddNew = (isRoot: boolean = false) => {
    const newMenu: Menu = {
      menuId: `NEW_${Date.now().toString().slice(-4)}`,
      upMenuId: (isRoot || !selectedMenu) ? null : selectedMenu.menuId,
      menuName: '새 메뉴',
      menuUrl: '',
      menuIcon: 'List', 
      sortNo: 10,
      useYn: 'Y',
      children: []
    };
    setSelectedMenu(newMenu);
  };

  const toggleNode = (id: string) => {
    const toggleRecursive = (list: Menu[]): Menu[] => {
      return list.map(item => {
        if (item.menuId === id) return { ...item, isOpen: !item.isOpen };
        if (item.children) return { ...item, children: toggleRecursive(item.children) };
        return item;
      });
    };
    setMenus(toggleRecursive(menus));
  };

  // 동적 아이콘 렌더링
  const DynamicIcon = ({ name, size = 16 }: { name: string | null, size?: number }) => {
    if (!name) return <HelpCircle size={size} />;
    const IconComponent = (Icons as any)[name];
    return IconComponent ? <IconComponent size={size} /> : <HelpCircle size={size} />;
  };

  const renderTree = (nodes: Menu[]) => {
    return nodes.map((node) => (
      <div key={node.menuId}>
        <div 
          className={`tree-item ${selectedMenu?.menuId === node.menuId ? 'active' : ''}`}
          style={{ paddingLeft: `${(node.upMenuId ? 20 : 0) + 15}px` }}
          onClick={() => setSelectedMenu(node)}
        >
          <div className="tree-label">
            {node.children && node.children.length > 0 ? (
              <span onClick={(e) => { e.stopPropagation(); toggleNode(node.menuId); }}>
                {node.isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </span>
            ) : <span style={{width: 16}}></span>}
            <DynamicIcon name={node.menuIcon || (node.children?.length ? 'Folder' : 'FileText')} />
            <span>{node.menuName}</span>
          </div>
          <span className={`badge ${node.useYn === 'Y' ? 'badge-use' : 'badge-stop'}`}>
            {node.useYn === 'Y' ? '사용' : '중지'}
          </span>
        </div>
        {node.isOpen && node.children && renderTree(node.children)}
      </div>
    ));
  };

  return (
    <div className="page-container">
      <header className="page-header">
        <div className="page-title"><List size={28} /> 메뉴 관리</div>
        <button className="btn-primary" onClick={() => handleAddNew(true)}>
          <Plus size={16} /> 최상위 메뉴 추가
        </button>
      </header>

      <div className="split-layout">
        <div className="tree-section">
          <div className="section-header">메뉴 구조도</div>
          <div className="tree-content">
            {loading ? <div className="empty-msg">데이터 로드 중...</div> : renderTree(menus)}
          </div>
        </div>

        <div className="detail-section">
          <div className="section-header">상세 정보 {selectedMenu && `(${selectedMenu.menuId})`}</div>
          
          {selectedMenu ? (
            <div className="form-content">
              <div className="form-group">
                <label className="form-label">메뉴명</label>
                <input className="form-input" name="menuName" value={selectedMenu.menuName} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">메뉴 URL</label>
                <input className="form-input" name="menuUrl" value={selectedMenu.menuUrl || ''} onChange={handleInputChange} />
              </div>

              {/* ✨ 아이콘 선택 콤보박스 (Select) */}
              <div className="form-group">
                <label className="form-label">메뉴 아이콘</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <select 
                    className="form-input" 
                    name="menuIcon" 
                    value={selectedMenu.menuIcon || ''} 
                    onChange={handleInputChange}
                  >
                    <option value="">아이콘 선택 없음</option>
                    {ICON_OPTIONS.map(opt => (
                      <option key={opt.name} value={opt.name}>{opt.label} ({opt.name})</option>
                    ))}
                  </select>
                  <div className="icon-preview-box">
                    <DynamicIcon name={selectedMenu.menuIcon} size={24} />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">정렬 순서</label>
                <input className="form-input" type="number" name="sortNo" value={selectedMenu.sortNo} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label className="form-label">사용 여부</label>
                <select className="form-input" name="useYn" value={selectedMenu.useYn} onChange={handleInputChange}>
                  <option value="Y">사용</option>
                  <option value="N">미사용</option>
                </select>
              </div>

              <div className="btn-group">
                <button className="btn-secondary" onClick={() => handleAddNew(false)}>
                  <Plus size={14} /> 하위 추가
                </button>
                <div className="btn-action-group">
                  <button className="btn-danger" onClick={handleDelete}><Trash2 size={14} /> 삭제</button>
                  <button className="btn-primary" onClick={handleSave}><Save size={14} /> 저장</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-container">
              <div className="empty-icon-box"><Layers size={48} /></div>
              <h3 className="empty-text-main">선택된 메뉴가 없습니다</h3>
              <p className="empty-text-sub">트리에서 항목을 선택하여 수정하거나 새로운 메뉴를 추가하세요.</p>
              <button className="btn-root-add" onClick={() => handleAddNew(true)}>
                <Plus size={18} /> 최상위 메뉴 추가하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuManagePage;