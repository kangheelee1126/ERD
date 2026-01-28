import { useEffect, useState } from 'react';
import { Users, Plus, Save, X, Trash2, Edit } from 'lucide-react';
import { UserService } from '../../services/UserService';
import { RoleService } from '../../services/RoleService';
import { UserRoleService } from '../../services/UserRoleService';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [allRoles, setAllRoles] = useState<any[]>([]); // 전체 권한 목록
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<any>({ 
        userNo: 0, userId: '', userName: '', password: '', email: '', useYn: 'Y', regDt: '' 
    });
    const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>([]); // 선택된 권한 IDs

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

    const openModal = async (targetUser: any = null) => {
        if (targetUser) {
            setUser({ ...targetUser, password: '' });
            // ✨ 사용자의 기존 권한 로드 [cite: 2026-01-28]
            const roleIds = await UserRoleService.getUserRoles(targetUser.userNo);
            setSelectedRoleIds(roleIds);
        } else {
            setUser({ userNo: 0, userId: '', userName: '', password: '', email: '', useYn: 'Y', regDt: '' });
            setSelectedRoleIds([]);
        }
        setShowModal(true);
    };

    const handleRoleToggle = (roleId: string) => {
        setSelectedRoleIds(prev => 
            prev.includes(roleId) ? prev.filter(id => id !== roleId) : [...prev, roleId]
        );
    };

    const handleSave = async () => {
        // ✨ 필수값 체크 [cite: 2026-01-28]
        if (!user.userId || !user.userName) return alert('ID와 이름은 필수 입력 항목입니다.');

        try {
            // 1. 사용자 정보 저장
            const savedUser = await UserService.saveUser(user);
            const userNo = user.userNo || savedUser.userNo;

            // 2. 권한 매핑 정보 저장 [cite: 2026-01-28]
            await UserRoleService.saveUserRoles({
                userNo: userNo,
                roleIds: selectedRoleIds
            });

            alert('성공적으로 저장되었습니다.');
            setShowModal(false);
            loadData();
        } catch (error) {
            alert("저장 처리 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async (userNo: number) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        await UserService.deleteUser(userNo);
        loadData();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit'
        });
    };

    return (
        <div className="page-container">
            {/* 상단 레이아웃 가이드 준수 [cite: 2026-01-28] */}
            <header className="page-header">
                <div className="page-title"><Users size={28} /> 사용자 관리</div>
                <button className="btn-primary" onClick={() => openModal()}><Plus size={16} /> 신규 등록</button>
            </header>
            
            <div className="table-container">
                <table className="standard-table">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '60px' }}>No</th>
                            <th className="text-center">아이디</th>
                            <th className="text-center">이름</th>
                            <th className="text-center">이메일</th>
                            <th className="text-center" style={{ width: '100px' }}>사용여부</th>
                            <th className="text-center" style={{ width: '150px' }}>등록일</th>
                            <th className="text-center col-manage">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u, idx) => (
                            <tr key={u.userNo}>
                                <td className="text-center">{idx + 1}</td>
                                <td className="highlight-text">{u.userId}</td>
                                <td>{u.userName}</td>
                                <td>{u.email}</td>
                                <td className="text-center">
                                    <span className={u.useYn === 'Y' ? 'status-blue' : 'status-red'}>
                                        {u.useYn === 'Y' ? '사용' : '미사용'}
                                    </span>
                                </td>
                                <td className="text-center">{formatDate(u.regDt)}</td>
                                <td className="text-center">
                                    <div className="btn-table-group">
                                        <button className="btn-table-edit" onClick={() => openModal(u)}><Edit size={14} /> 수정</button>
                                        <button className="btn-table-delete" onClick={() => handleDelete(u.userNo)}><Trash2 size={14} /> 삭제</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '500px' }}>
                        <div className="modal-header">
                            <h3>사용자 정보 {user.userNo === 0 ? '등록' : '수정'}</h3>
                        </div>
                        <div className="modal-body">
                            {/* 모달 팝업: 좌측 라벨, 우측 입력 테이블 구조 [cite: 2026-01-28] */}
                            <table className="input-table">
                                <tbody>
                                    <tr>
                                        <th className="form-label">사용자 ID</th>
                                        <td>
                                            <input className="form-input" value={user.userId || ''} 
                                                onChange={(e) => setUser({ ...user, userId: e.target.value })} 
                                                readOnly={user.userNo !== 0} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">이름</th>
                                        <td><input className="form-input" value={user.userName || ''} 
                                            onChange={(e) => setUser({ ...user, userName: e.target.value })} /></td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">이메일</th>
                                        <td><input className="form-input" value={user.email || ''} 
                                            onChange={(e) => setUser({ ...user, email: e.target.value })} /></td>
                                    </tr>
                                    {/* ✨ 권한 할당 행 추가 [cite: 2026-01-28] */}
                                    <tr>
                                        <th className="form-label">권한 설정</th>
                                        <td>
                                            <div className="role-checkbox-group">
                                                {allRoles.map(r => (
                                                    <label key={r.roleId} className="checkbox-label">
                                                        <input type="checkbox" 
                                                            checked={selectedRoleIds.includes(r.roleId)}
                                                            onChange={() => handleRoleToggle(r.roleId)} />
                                                        <span>{r.roleName}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="form-label">사용 여부</th>
                                        <td>
                                            <select className="form-input" value={user.useYn} 
                                                onChange={(e) => setUser({ ...user, useYn: e.target.value })}>
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
        </div>
    );
};

export default UserManagement;