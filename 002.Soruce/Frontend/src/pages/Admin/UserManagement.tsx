import { useEffect, useState } from 'react';
import { Users, Plus, Save, X, Trash2, Edit, ShieldCheck , Search } from 'lucide-react';
import { UserService } from '../../services/UserService';
import { RoleService } from '../../services/RoleService';
import { UserRoleService } from '../../services/UserRoleService';
import './UserManagement.css'; // 전용 스타일 파일
import EmployeeSearchModal from '../../components/modals/EmployeeSearchModal';

const UserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [allRoles, setAllRoles] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    const [user, setUser] = useState<any>({ 
        userNo: 0, userId: '', userName: '', password: '', email: '', useYn: 'Y', regDt: '' ,
        empId: null, empNm: ''
    });
    

    const loadData = async () => {
        try {
            const [userData, roleData] = await Promise.all([
                UserService.getUsers(),
                RoleService.getRoles()
            ]);
            setUsers(Array.isArray(userData) ? userData : []);
            setAllRoles(Array.isArray(roleData) ? roleData : []);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
        }
    };

    // 1. 직원 검색 팝업 열림 상태 관리
    const [showEmpSearch, setShowEmpSearch] = useState(false);

    /* 2. 직원 선택 시 실행되는 매핑 함수 */
    const handleSelectEmployee = (emp: any) => {
        // 팝업에서 받아온 직원 정보를 현재 수정 중인 user 상태에 업데이트
        setUser({ 
            ...user, 
            empId: emp.empId, // DB의 EMP_ID 컬럼과 매핑
            empNm: emp.empNm  // 화면 표시용 성명
        });
        
        // 매핑 완료 후 팝업 닫기
        setShowEmpSearch(false);
    };

    useEffect(() => { loadData(); }, []);

    // 모달 관련 함수들은 그대로 유지 (생략 가능하나 전체 흐름 위해 유지)
    const openModal = (targetUser: any = null) => {
        if (targetUser) {
            setUser({ ...targetUser, password: '' });
        } else {
            setUser({ userNo: 0, userId: '', userName: '', password: '', email: '', useYn: 'Y', regDt: '' });
        }
        setShowModal(true);
    };

    const openRoleModal = async (targetUser: any) => {
        setUser(targetUser);
        try {
            const roleIds = await UserRoleService.getUserRoles(targetUser.userNo);
            setSelectedRoleIds(Array.isArray(roleIds) ? roleIds : []);
        } catch (error) {
            console.warn("권한 로드 실패 - 신규 설정 모드로 전환");
            setSelectedRoleIds([]);
        } finally {
            setShowRoleModal(true);
        }
    };

    const handleSave = async () => {
        if (!user.userId || !user.userName) return alert('ID와 이름은 필수입니다.');
        try {
            await UserService.saveUser(user);
            alert('성공적으로 저장되었습니다.');
            setShowModal(false);
            loadData();
        } catch (error) {
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleSaveRoles = async () => {
        try {
            await UserRoleService.saveUserRoles({ userNo: user.userNo, roleIds: selectedRoleIds });
            alert('권한 설정이 저장되었습니다.');
            setShowRoleModal(false);
        } catch (error) {
            alert("권한 저장 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (userNo: number) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        await UserService.deleteUser(userNo);
        loadData();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="page-title"><Users size={28} /> 사용자 관리</div>
                <button className="btn-primary" onClick={() => openModal()}><Plus size={16} /> 신규 등록</button>
            </header>
            
            <div className="table-container">
                {/* ✨ [핵심 변경] 고유 클래스 'user-mgmt-table' 사용 */}
                <table className="user-mgmt-table">
                    <thead>
                        <tr>
                            <th className="um-th center" style={{ width: '60px' }}>No</th>
                            <th className="um-th left" style={{ width: '120px' }}>아이디</th>
                            <th className="um-th center" style={{ width: '200px' }}>이름</th>
                            <th className="um-th center">매핑 직원</th>
                            <th className="um-th center">이메일</th>
                            <th className="um-th center" style={{ width: '100px' }}>사용여부</th>
                            <th className="um-th center" style={{ width: '200px' }}>등록일</th>
                            
                            {/* 버튼 컬럼 */}
                            <th className="um-th center" style={{ width: '100px' }}>권한</th>
                            <th className="um-th center" style={{ width: '80px' }}>수정</th>
                            <th className="um-th center" style={{ width: '80px' }}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, idx) => (
                            <tr key={u.userNo}>
                                <td className="um-td center">{idx + 1}</td>
                                <td className="um-td left highlight-id">{u.userId}</td>
                                <td className="um-td center">{u.userName}</td>
                                <td className="um-td center highlight-text">{u.empNm || '-'}</td>
                                <td className="um-td left">{u.email || '-'}</td>
                                <td className="um-td center">
                                    <span className={u.useYn === 'Y' ? 'status-blue' : 'status-red'}>
                                        {u.useYn === 'Y' ? '사용' : '미사용'}
                                    </span>
                                </td>
                                <td className="um-td center">{formatDate(u.regDt)}</td>

                                <td className="um-td center">
                                    {/* 고유 버튼 클래스 사용 */}
                                    <button className="um-btn edit" onClick={() => openRoleModal(u)}>
                                        <ShieldCheck size={14} /> 권한설정
                                    </button>
                                </td>
                                <td className="um-td center">
                                    <button className="um-btn edit" onClick={() => openModal(u)}>
                                        <Edit size={14} /> 수정
                                    </button>
                                </td>
                                <td className="um-td center">
                                    {/* 고유 삭제 버튼 클래스 */}
                                    <button className="um-btn delete" onClick={() => handleDelete(u.userNo)}>
                                        <Trash2 size={14} /> 삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 모달은 기존 구조 유지하되 충돌 방지 위해 필요한 경우 클래스 변경 가능 */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '520px' }}>
                        <div className="modal-header"><h3>사용자 정보 {user.userNo === 0 ? '등록' : '수정'}</h3></div>
                        <div className="modal-body">
                            <table className="input-table">
                                <tbody>
                                    <tr>
                                        <th className="form-label">사용자 ID</th>
                                        <td><input className="form-input" value={user.userId} onChange={(e) => setUser({...user, userId: e.target.value})} readOnly={user.userNo !== 0} /></td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">이름</th>
                                        <td><input className="form-input" value={user.userName} onChange={(e) => setUser({...user, userName: e.target.value})} /></td>
                                    </tr>
                                    {/* ✨ [추가] 매핑 직원 선택 행 */}
                                    <tr>
                                        <th className="form-label">매핑 직원</th>
                                        <td>
                                            <div style={{ display: 'flex', gap: '4px' }}>
                                                <input className="form-input" style={{ flex: 1 }} value={user.empNm || ''} readOnly placeholder="직원을 선택하세요" />
                                                <button className="um-btn edit" style={{ padding: '0 10px' }} onClick={() => setShowEmpSearch(true)}>
                                                    <Search size={14} /> 조회
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">이메일</th>
                                        <td><input className="form-input" value={user.email} onChange={(e) => setUser({...user, email: e.target.value})} /></td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">사용 여부</th>
                                        <td>
                                            <select className="form-input" value={user.useYn} onChange={(e) => setUser({...user, useYn: e.target.value})}>
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
                                <button className="btn-primary" onClick={handleSave}><Save size={14} /> 저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showRoleModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '500px' }}>
                        <div className="modal-header"><h3>[{user.userName}] 권한 설정</h3></div>
                        <div className="modal-body">
                            <div className="role-checkbox-group">
                                {allRoles.map(r => (
                                    <label key={r.roleId} className="checkbox-label">
                                        <input type="checkbox" checked={selectedRoleIds.includes(r.roleId)} 
                                            onChange={() => setSelectedRoleIds(prev => prev.includes(r.roleId) ? prev.filter(id => id !== r.roleId) : [...prev, r.roleId])} />
                                        <span>{r.roleName}</span>
                                    </label>
                                ))}
                                {allRoles.length === 0 && <p style={{ color: '#94a3b8' }}>등록된 권한이 없습니다.</p>}
                            </div>
                        </div>
                        <div className="btn-group">
                            <div className="btn-action-group">
                                <button className="btn-secondary" onClick={() => setShowRoleModal(false)}><X size={14} /> 닫기</button>
                                <button className="btn-primary" onClick={handleSaveRoles}><Save size={14} /> 권한 저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ✨ [추가] 직원 조회 공통 팝업 호출: 'EmployeeSearchModal' 미사용 경고 해결 [cite: 2026-02-03] */}
            {showEmpSearch && (
                <EmployeeSearchModal 
                    onClose={() => setShowEmpSearch(false)} 
                    onSelect={handleSelectEmployee} 
                />
            )}
        </div>
    );
};

export default UserManagement;