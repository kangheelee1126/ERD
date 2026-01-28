import { useEffect, useState } from 'react';
import { ShieldCheck, Plus, Save, X, Trash2, Edit } from 'lucide-react'; 
import { RoleService } from '../../services/RoleService';
import './RoleManagement.css';

const RoleManagement = () => {
    const [roles, setRoles] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    // ✨ roleId 필드 추가 및 초기화 [cite: 2026-01-28]
    const [role, setRole] = useState<any>({ 
        roleId: '', roleName: '', roleDesc: '', useYn: 'Y', regDt: '' 
    });

    const loadRoles = async () => {
        try {
            const data = await RoleService.getRoles();
            setRoles(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            setRoles([]);
        }
    };

    useEffect(() => { loadRoles(); }, []);

    const openModal = (targetRole: any = null) => {
        if (targetRole) {
            setRole({ ...targetRole });
        } else {
            // 신규 등록 시 초기값
            setRole({ roleId: '', roleName: '', roleDesc: '', useYn: 'Y', regDt: '' });
        }
        setShowModal(true);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    };

    const handleSave = async () => {
        // ✨ 필수값 체크 로직 추가 [cite: 2026-01-28]
        if (!role.roleId || role.roleId.trim() === '') {
            alert('권한 아이디는 필수 입력 항목입니다.');
            return;
        }
        if (!role.roleName || role.roleName.trim() === '') {
            alert('권한명은 필수 입력 항목입니다.');
            return;
        }

        try {
            await RoleService.saveRole(role);
            alert('성공적으로 저장되었습니다.');
            setShowModal(false);
            loadRoles();
        } catch (error: any) {
            alert(error.response?.data?.message || "저장 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (roleId: string) => {
        if (!window.confirm('해당 권한을 정말 삭제하시겠습니까?')) return;
        try {
            await RoleService.deleteRole(roleId);
            alert('삭제되었습니다.');
            loadRoles();
        } catch (error: any) {
            alert(error.response?.data?.message || "삭제 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="page-title">
                    <ShieldCheck size={28} /> 권한 관리
                </div>
                <button className="btn-primary" onClick={() => openModal()}>
                    <Plus size={16} /> 신규 권한 등록
                </button>
            </header>
            
            <div className="table-container">
                <table className="standard-table">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '150px' }}>권한아이디</th>
                            <th className="text-center">권한명</th>
                            <th className="text-center">설명</th>
                            <th className="text-center" style={{ width: '100px' }}>사용여부</th>
                            <th className="text-center" style={{ width: '150px' }}>등록일</th>
                            <th className="text-center col-manage">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roles.length > 0 ? (
                            roles.map((r) => (
                                <tr key={r.roleId}>
                                    <td className="highlight-text">{r.roleId}</td>
                                    <td className="highlight-text">{r.roleName}</td>
                                    <td>{r.roleDesc}</td>
                                    <td className="text-center">
                                        <span className={r.useYn === 'Y' ? 'status-blue' : 'status-red'}>
                                            {r.useYn === 'Y' ? '사용' : '미사용'}
                                        </span>
                                    </td>
                                    <td className="text-center">{formatDate(r.regDt)}</td>
                                    <td className="text-center">
                                        <div className="btn-table-group">
                                            <button className="btn-table-edit" onClick={() => openModal(r)}>
                                                <Edit size={14} /> 수정
                                            </button>
                                            <button className="btn-table-delete" onClick={() => handleDelete(r.roleId)}>
                                                <Trash2 size={14} /> 삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={6} className="text-center">조회된 데이터가 없습니다.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>권한 정보 {!role.regDt ? '등록' : '수정'}</h3>
                        </div>
                        <div className="modal-body">
                            <table className="input-table">
                                <tbody>
                                    <tr>
                                        <th className="form-label">권한 아이디 <span style={{color: '#ef4444'}}>*</span></th>
                                        <td>
                                            <input 
                                                className="form-input"
                                                value={role.roleId || ''} 
                                                onChange={(e) => setRole({ ...role, roleId: e.target.value })} 
                                                placeholder="ID 입력 (예: ADMIN)"
                                                autoComplete="off"
                                                // ✨ 수정 시에는 아이디 변경 불가 처리 [cite: 2026-01-28]
                                                readOnly={!!role.regDt}
                                                style={role.regDt ? { backgroundColor: '#0f172a', color: '#94a3b8' } : {}}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">권한명 <span style={{color: '#ef4444'}}>*</span></th>
                                        <td>
                                            <input 
                                                className="form-input"
                                                value={role.roleName || ''} 
                                                onChange={(e) => setRole({ ...role, roleName: e.target.value })} 
                                                placeholder="권한 명칭 입력"
                                                autoComplete="off"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">권한 설명</th>
                                        <td>
                                            <input 
                                                className="form-input"
                                                value={role.roleDesc || ''} 
                                                onChange={(e) => setRole({ ...role, roleDesc: e.target.value })} 
                                                placeholder="상세 설명 입력"
                                                autoComplete="off"
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">사용 여부</th>
                                        <td>
                                            <select 
                                                className="form-input"
                                                value={role.useYn || 'Y'} 
                                                onChange={(e) => setRole({ ...role, useYn: e.target.value })}
                                            >
                                                <option value="Y">사용</option>
                                                <option value="N">미사용</option>
                                            </select>
                                        </td>
                                    </tr>
                                    {role.regDt && (
                                        <tr>
                                            <th className="form-label">등록일</th>
                                            <td style={{ paddingLeft: '10px', color: '#94a3b8' }}>
                                                {formatDate(role.regDt)}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-group">
                            <div className="btn-action-group">
                                <button className="btn-secondary" onClick={() => setShowModal(false)}>
                                    <X size={14} /> 닫기
                                </button>
                                <button className="btn-primary" onClick={handleSave}>
                                    <Save size={14} /> 저장
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;