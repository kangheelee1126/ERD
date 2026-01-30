import { useEffect, useState } from 'react';
import { ShieldCheck, Plus, Save, X, Trash2, Edit, ListChecks } from 'lucide-react'; 
import { RoleService } from '../../services/RoleService';
import { MenuService } from '../../services/menuService';
import './RoleManagement.css';

const RoleManagement = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [allMenus, setAllMenus] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
    const [role, setRole] = useState<any>({ roleId: '', roleName: '', roleDesc: '', useYn: 'Y', regDt: '' });

    // 트리 구조 평면화 로직 (유지)
    const flattenMenus = (menus: any[], level = 0): any[] => {
        let flat: any[] = [];
        menus.forEach(m => {
            flat.push({ ...m, level });
            if (m.children && m.children.length > 0) {
                flat = [...flat, ...flattenMenus(m.children, level + 1)];
            }
        });
        return flat;
    };

    const loadData = async () => {
        try {
            const [roleData, menuTreeData] = await Promise.all([
                RoleService.getRoles(),
                MenuService.getMenus()
            ]);
            setRoles(Array.isArray(roleData) ? roleData : []);
            if (Array.isArray(menuTreeData)) {
                setAllMenus(flattenMenus(menuTreeData));
            }
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        }
    };

    useEffect(() => { loadData(); }, []);

    const getDescendantIds = (menu: any): string[] => {
        let ids: string[] = [];
        if (menu.children && menu.children.length > 0) {
            menu.children.forEach((child: any) => {
                ids.push(child.menuId);
                ids = [...ids, ...getDescendantIds(child)];
            });
        }
        return ids;
    };

    const handleMenuCheck = (menu: any, checked: boolean) => {
        let newIds = [...selectedMenuIds];
        const descendantIds = getDescendantIds(menu);

        if (checked) {
            newIds = [...new Set([...newIds, menu.menuId, ...descendantIds])];
        } else {
            newIds = newIds.filter(id => id !== menu.menuId && !descendantIds.includes(id));
        }
        setSelectedMenuIds(newIds);
    };

    const openMenuMapping = async (targetRole: any) => {
        setRole(targetRole);
        const mappedIds = await RoleService.getRoleMenus(targetRole.roleId);
        setSelectedMenuIds(mappedIds);
        setShowMenuModal(true);
    };

    const handleSaveRole = async () => {
        if (!role.roleId || !role.roleName) return alert('권한 아이디와 명칭은 필수입니다.');
        try {
            await RoleService.saveRole(role);
            alert('저장되었습니다.');
            setShowModal(false);
            loadData();
        } catch (error) { alert('저장 중 오류가 발생했습니다.'); }
    };

    const handleSaveMenuMapping = async () => {
        try {
            await RoleService.saveRoleMenus({ roleId: role.roleId, menuIds: selectedMenuIds });
            alert('메뉴 권한 설정이 저장되었습니다.');
            setShowMenuModal(false);
        } catch (error) { alert('매핑 저장 중 오류가 발생했습니다.'); }
    };

    const handleDelete = async (roleId: string) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        await RoleService.deleteRole(roleId);
        loadData();
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="page-title"><ShieldCheck size={28} /> 권한 관리</div>
                <button className="btn-primary" onClick={() => { setRole({ roleId: '', roleName: '', roleDesc: '', useYn: 'Y', regDt: '' }); setShowModal(true); }}>
                    <Plus size={16} /> 신규 권한 등록
                </button>
            </header>
            
            <div className="table-container">
                {/* ✨ [수정] 고유 클래스 'role-mgmt-table' 사용 */}
                <table className="role-mgmt-table">
                    <thead>
                        <tr>
                            <th className="rm-th center" style={{ width: '60px' }}>No</th>
                            <th className="rm-th left" style={{ width: '150px' }}>권한아이디</th>
                            <th className="rm-th center" style={{ width: '200px' }}>권한명</th>
                            <th className="rm-th center" style={{ width: '100px' }}>사용여부</th>
                            <th className="rm-th center" style={{ width: '150px' }}>등록일</th>
                            
                            {/* ✨ [수정] 관리 컬럼 3분할 (메뉴설정 / 수정 / 삭제) */}
                            <th className="rm-th center" style={{ width: '60px' }}>메뉴설정</th>
                            <th className="rm-th center" style={{ width: '50px' }}>수정</th>
                            <th className="rm-th center" style={{ width: '50px' }}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((r, index) => (
                            <tr key={r.roleId}>
                                <td className="rm-td center">{index + 1}</td>
                                <td className="rm-td left highlight-text">{r.roleId}</td>
                                <td className="rm-td center">{r.roleName}</td>
                                <td className="rm-td center">
                                    <span className={r.useYn === 'Y' ? 'status-blue' : 'status-red'}>{r.useYn === 'Y' ? '사용' : '미사용'}</span>
                                </td>
                                <td className="rm-td center">{r.regDt ? new Date(r.regDt).toLocaleDateString() : '-'}</td>
                                
                                {/* ✨ [수정] 버튼별 개별 컬럼 및 고유 클래스(rm-btn) 적용 */}
                                <td className="rm-td center">
                                    <button className="rm-btn edit" onClick={() => openMenuMapping(r)}>
                                        <ListChecks size={14} /> 메뉴설정
                                    </button>
                                </td>
                                <td className="rm-td center">
                                    <button className="rm-btn edit" onClick={() => { setRole(r); setShowModal(true); }}>
                                        <Edit size={14} /> 수정
                                    </button>
                                </td>
                                <td className="rm-td center">
                                    <button className="rm-btn delete" onClick={() => handleDelete(r.roleId)}>
                                        <Trash2 size={14} /> 삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 메뉴 매핑 모달 (기존 유지) */}
            {showMenuModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '680px' }}>
                        <div className="modal-header"><h3>[{role.roleName}] 메뉴 권한 설정</h3></div>
                        <div className="modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <table className="role-mgmt-table">
                                <thead>
                                    <tr>
                                        <th className="rm-th center" style={{ width: '80px' }}>선택</th>
                                        <th className="rm-th left">메뉴명 (아이콘)</th>
                                        <th className="rm-th center">URL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allMenus.map(m => {
                                        const paddingLeft = m.level * 25 + 15;
                                        return (
                                            <tr key={m.menuId}>
                                                <td className="rm-td center">
                                                    <input type="checkbox" checked={selectedMenuIds.includes(m.menuId)} onChange={(e) => handleMenuCheck(m, e.target.checked)} />
                                                </td>
                                                <td className="rm-td left" style={{ paddingLeft: `${paddingLeft}px` }}>
                                                    {m.level > 0 && <span style={{ color: '#475569', marginRight: '8px' }}>└</span>}
                                                    {m.menuIcon && <span style={{ marginRight: '8px', opacity: 0.7 }}>i</span>}
                                                    <span style={{ fontWeight: m.level === 0 ? 'bold' : 'normal', color: m.level === 0 ? '#fff' : '#cbd5e1' }}>
                                                        {m.menuName}
                                                    </span>
                                                </td>
                                                <td className="rm-td center" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{m.menuUrl || '-'}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-group">
                            <div className="btn-action-group">
                                <button className="btn-secondary" onClick={() => setShowMenuModal(false)}><X size={14} /> 닫기</button>
                                <button className="btn-primary" onClick={handleSaveMenuMapping}><Save size={14} /> 매핑 저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 권한 정보 모달 (기존 유지) */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header"><h3>권한 정보 {role.regDt ? '수정' : '등록'}</h3></div>
                        <div className="modal-body">
                            <table className="input-table">
                                <tbody>
                                    <tr>
                                        <th className="form-label">권한 아이디</th>
                                        <td><input className="form-input" value={role.roleId} onChange={(e) => setRole({ ...role, roleId: e.target.value })} readOnly={!!role.regDt} placeholder="예: ADMIN" /></td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">권한명</th>
                                        <td><input className="form-input" value={role.roleName} onChange={(e) => setRole({ ...role, roleName: e.target.value })} placeholder="권한 명칭 입력" /></td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">권한 설명</th>
                                        <td><input className="form-input" value={role.roleDesc} onChange={(e) => setRole({ ...role, roleDesc: e.target.value })} placeholder="설명 입력" /></td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">사용 여부</th>
                                        <td>
                                            <select className="form-input" value={role.useYn} onChange={(e) => setRole({ ...role, useYn: e.target.value })}>
                                                <option value="Y">사용</option><option value="N">미사용</option>
                                            </select>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-group">
                            <div className="btn-action-group">
                                <button className="btn-secondary" onClick={() => setShowModal(false)}><X size={14} /> 닫기</button>
                                <button className="btn-primary" onClick={handleSaveRole}><Save size={14} /> 저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;