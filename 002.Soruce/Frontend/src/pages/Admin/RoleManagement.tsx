import { useEffect, useState } from 'react';
import { ShieldCheck, Plus, Save, X, Trash2, Edit, ListChecks } from 'lucide-react'; 
import { RoleService } from '../../services/RoleService';
import { MenuService } from '../../services/menuService';
import './RoleManagement.css';

const RoleManagement = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [allMenus, setAllMenus] = useState<any[]>([]); // ✨ 평면화된 메뉴 리스트
    const [showModal, setShowModal] = useState(false);
    const [showMenuModal, setShowMenuModal] = useState(false);
    const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>([]);
    const [role, setRole] = useState<any>({ roleId: '', roleName: '', roleDesc: '', useYn: 'Y', regDt: '' });

    // ✨ 1. 트리 구조를 테이블용 평면 리스트로 변환 (들여쓰기 레벨 계산) [cite: 2026-01-28]
    const flattenMenus = (menus: any[], level = 0): any[] => {
        let flat: any[] = [];
        menus.forEach(m => {
            flat.push({ ...m, level }); // 현재 노드에 깊이(level) 저장
            if (m.children && m.children.length > 0) {
                // 자식 노드가 있으면 재귀적으로 탐색하여 배열에 병합
                flat = [...flat, ...flattenMenus(m.children, level + 1)];
            }
        });
        return flat;
    };

    const loadData = async () => {
        try {
            const [roleData, menuTreeData] = await Promise.all([
                RoleService.getRoles(),
                MenuService.getMenus() // 서버는 트리 구조(Children 포함) 반환
            ]);
            setRoles(Array.isArray(roleData) ? roleData : []);
            
            // ✨ 서버의 트리 데이터를 테이블에서 순서대로 그릴 수 있게 평면화하여 저장
            if (Array.isArray(menuTreeData)) {
                setAllMenus(flattenMenus(menuTreeData));
            }
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        }
    };

    useEffect(() => { loadData(); }, []);

    // ✨ 2. 특정 메뉴의 모든 하위 자식 ID를 재귀적으로 추출 [cite: 2026-01-28]
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

    // ✨ 3. 체크박스 핸들러 (상위 선택 시 하위 전체 일괄 처리) [cite: 2026-01-28]
    const handleMenuCheck = (menu: any, checked: boolean) => {
        let newIds = [...selectedMenuIds];
        const descendantIds = getDescendantIds(menu);

        if (checked) {
            // 본인 추가 및 모든 하위 메뉴 ID 추가
            newIds = [...new Set([...newIds, menu.menuId, ...descendantIds])];
        } else {
            // 본인 제거 및 모든 하위 메뉴 ID 제거
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
                <table className="standard-table">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '60px' }}>No</th>
                            <th className="text-center" style={{ width: '150px' }}>권한아이디</th>
                            <th className="text-center">권한명</th>
                            <th className="text-center" style={{ width: '100px' }}>사용여부</th>
                            <th className="text-center" style={{ width: '150px' }}>등록일</th>
                            <th className="text-center col-manage">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.map((r, index) => (
                            <tr key={r.roleId}>
                                <td className="text-center">{index + 1}</td>
                                <td className="highlight-text text-center">{r.roleId}</td>
                                <td>{r.roleName}</td>
                                <td className="text-center">
                                    <span className={r.useYn === 'Y' ? 'status-blue' : 'status-red'}>{r.useYn === 'Y' ? '사용' : '미사용'}</span>
                                </td>
                                <td className="text-center">{r.regDt ? new Date(r.regDt).toLocaleDateString() : '-'}</td>
                                <td className="text-center">
                                    <div className="btn-table-group">
                                        <button className="btn-table-edit" onClick={() => openMenuMapping(r)}><ListChecks size={14} /> 메뉴설정</button>
                                        <button className="btn-table-edit" onClick={() => { setRole(r); setShowModal(true); }}><Edit size={14} /> 수정</button>
                                        <button className="btn-table-delete" onClick={() => handleDelete(r.roleId)}><Trash2 size={14} /> 삭제</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showMenuModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '680px' }}>
                        <div className="modal-header"><h3>[{role.roleName}] 메뉴 권한 설정</h3></div>
                        <div className="modal-body" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                            <table className="standard-table">
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{ width: '80px' }}>선택</th>
                                        <th className="text-center">메뉴명 (아이콘)</th>
                                        <th className="text-center">URL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allMenus.map(m => {
                                        // ✨ 4. 레벨에 따른 들여쓰기 패딩 계산 [cite: 2026-01-28]
                                        const paddingLeft = m.level * 25 + 15;
                                        return (
                                            <tr key={m.menuId}>
                                                <td className="text-center">
                                                    {/* ✨ handleMenuCheck에 메뉴 객체 전체 전달 */}
                                                    <input type="checkbox" checked={selectedMenuIds.includes(m.menuId)} onChange={(e) => handleMenuCheck(m, e.target.checked)} />
                                                </td>
                                                <td style={{ paddingLeft: `${paddingLeft}px` }}>
                                                    {m.level > 0 && <span style={{ color: '#475569', marginRight: '8px' }}>└</span>}
                                                    {/* ✨ 아이콘 시각화 */}
                                                    {m.menuIcon && <span style={{ marginRight: '8px', opacity: 0.7 }}>i</span>}
                                                    <span style={{ fontWeight: m.level === 0 ? 'bold' : 'normal', color: m.level === 0 ? '#fff' : '#cbd5e1' }}>
                                                        {m.menuName}
                                                    </span>
                                                </td>
                                                <td className="text-center" style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{m.menuUrl || '-'}</td>
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