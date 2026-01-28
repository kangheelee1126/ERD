import React, { useEffect, useState } from 'react';
// ✨ Edit 아이콘 import 추가
import { Users, Plus, Save, X, Trash2, Edit } from 'lucide-react';
import { UserService } from '../../services/UserService';
import './UserManagement.css';

const UserManagement = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState<any>({ 
        userNo: 0, userId: '', userName: '', password: '', email: '', useYn: 'Y', regDt: '' 
    });

    const loadUsers = async () => {
        try {
            const data = await UserService.getUsers();
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            setUsers([]);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    const handleDelete = async (userNo: number) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await UserService.deleteUser(userNo);
            alert('성공적으로 삭제되었습니다.');
            loadUsers();
        } catch (error: any) {
            alert(error.response?.data?.message || "삭제 처리 중 오류가 발생했습니다.");
        }
    };

    const openModal = (targetUser: any = null) => {
        if (targetUser) {
            setUser({ ...targetUser, password: '' });
        } else {
            setUser({ userNo: 0, userId: '', userName: '', password: '', email: '', useYn: 'Y', regDt: '' });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        await UserService.saveUser(user);
        setShowModal(false);
        loadUsers();
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleString('ko-KR', {
            year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit', minute: '2-digit', hour12: false
        }).replace(/\. /g, '-').replace('.', '');
    };

    return (
        <div className="page-container">
            <header className="page-header">
                <div className="page-title">
                    <Users size={28} /> 사용자 관리
                </div>
                <button className="btn-primary" onClick={() => openModal()}>
                    <Plus size={16} /> 신규 등록
                </button>
            </header>
            
            <div className="table-container">
                <table className="user-table">
                    <thead>
                        <tr>
                            <th className="text-center" style={{ width: '60px' }}>No</th>
                            <th className="text-center">아이디</th>
                            <th className="text-center">이름</th>
                            <th className="text-center">이메일</th>
                            <th className="text-center" style={{ width: '100px' }}>사용여부</th>
                            <th className="text-center" style={{ width: '180px' }}>등록일</th>
                            <th className="text-center col-manage">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((u) => (
                            <tr key={u.userNo}>
                                <td className="text-center">{u.userNo}</td>
                                <td className="highlight-id">{u.userId}</td>
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
                                        {/* ✨ 수정 버튼에 Edit 아이콘 추가 */}
                                        <button className="btn-table-edit" onClick={() => openModal(u)}>
                                            <Edit size={14} /> 수정
                                        </button>
                                        <button className="btn-table-delete" onClick={() => handleDelete(u.userNo)}>
                                            <Trash2 size={14} /> 삭제
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 모달 컴포넌트는 이전과 동일하여 생략합니다. */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        {/* ... 모달 내용 ... */}
                        <div className="modal-header">
                            <h3>사용자 정보 {user.userNo === 0 ? '등록' : '수정'}</h3>
                        </div>
                        <div className="modal-body">
                            <table className="input-table">
                                <tbody>
                                    <tr>
                                        <th className="form-label">사용자 ID</th>
                                        <td>
                                            <input 
                                                className="form-input"
                                                value={user.userId || ''} 
                                                onChange={(e) => setUser({ ...user, userId: e.target.value })} 
                                                readOnly={user.userNo !== 0}
                                                autoComplete="off"
                                            />
                                        </td>
                                    </tr>
                                    {/* ... 나머지 입력 필드들 ... */}
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

export default UserManagement;