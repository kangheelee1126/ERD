import { useEffect, useState } from 'react';
import { Users, Plus, Save, X, Trash2, Edit, ShieldCheck } from 'lucide-react';
import { UserService } from '../../services/UserService';
import { RoleService } from '../../services/RoleService';
import { UserRoleService } from '../../services/UserRoleService';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [allRoles, setAllRoles] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]);
    const [user, setUser] = useState<any>({ 
        userNo: 0, userId: '', userName: '', password: '', email: '', useYn: 'Y', regDt: '' 
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

    useEffect(() => { loadData(); }, []);

    // ✨ 신규/수정 기본 정보 모달 열기 [cite: 2026-01-28]
    const openModal = (targetUser: any = null) => {
        if (targetUser) {
            setUser({ ...targetUser, password: '' });
        } else {
            setUser({ userNo: 0, userId: '', userName: '', password: '', email: '', useYn: 'Y', regDt: '' });
        }
        setShowModal(true);
    };

    // ✨ 권한 설정 전용 모달 [cite: 2026-01-28]
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
                <table className="standard-table">
                    <thead>
                        {/* 헤더 중앙 정렬 및 실선 가이드 [cite: 2026-01-28] */}
                        <tr>
                            <th className="text-center" style={{ width: '60px' }}>No</th>
                            
                            {/* ✨ 아이디: 폭 120px, 왼쪽 정렬 */}
                            <th className="text-left" style={{ width: '120px' }}>아이디</th>
                            
                            {/* ✨ 이름: 폭 200px, 가운데 정렬 */}
                            <th className="text-center" style={{ width: '200px' }}>이름</th>
                            
                            <th className="text-center">이메일</th>
                            <th className="text-center" style={{ width: '100px' }}>사용여부</th>
                            
                            {/* ✨ 등록일: 폭 200px, 가운데 정렬 */}
                            <th className="text-center" style={{ width: '200px' }}>등록일</th>
                            
                            {/* ✨ 권한: 폭 100px, 가운데 정렬 */}
                            <th className="text-center" style={{ width: '100px' }}>권한</th>
                            
                            {/* ✨ 수정: 폭 80px, 가운데 정렬 */}
                            <th className="text-center" style={{ width: '80px' }}>수정</th>
                            
                            {/* ✨ 삭제: 폭 80px, 가운데 정렬 */}
                            <th className="text-center" style={{ width: '80px' }}>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, idx) => (
                            <tr key={u.userNo}>
                                <td className="text-center">{idx + 1}</td>
                                
                                {/* 아이디: 왼쪽 정렬 적용 */}
                                <td className="text-left highlight-id">{u.userId}</td>
                                
                                {/* 이름: 가운데 정렬 적용 */}
                                <td className="text-center">{u.userName}</td>
                                
                                <td>{u.email || '-'}</td>
                                <td className="text-center">
                                    <span className={u.useYn === 'Y' ? 'status-blue' : 'status-red'}>
                                        {u.useYn === 'Y' ? '사용' : '미사용'}
                                    </span>
                                </td>
                                
                                {/* 등록일: 가운데 정렬 */}
                                <td className="text-center">{formatDate(u.regDt)}</td>

                                {/* 버튼들: 중앙 정렬 */}
                                <td className="text-center">
                                    <button className="btn-table-edit center-btn" onClick={() => openRoleModal(u)}>
                                        <ShieldCheck size={14} /> 권한설정
                                    </button>
                                </td>
                                <td className="text-center">
                                    <button className="btn-table-edit center-btn" onClick={() => openModal(u)}>
                                        <Edit size={14} /> 수정
                                    </button>
                                </td>
                                <td className="text-center">
                                    {/* 삭제 버튼: 빨간색 스타일 클래스(btn-table-delete) 사용 */}
                                    <button className="btn-table-delete center-btn" onClick={() => handleDelete(u.userNo)}>
                                        <Trash2 size={14} /> 삭제
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 사용자 정보 모달 (라벨-입력 테이블 구조) */}
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

            {/* 권한 설정 모달 */}
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
        </div>
    );
};

export default UserManagement;