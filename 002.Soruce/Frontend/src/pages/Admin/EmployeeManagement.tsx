import React, { useState } from 'react';
import { Search,  UserPlus, Edit, Trash2, Users } from 'lucide-react';
import EmployeeModal from './EmployeeModal';
import './EmployeeManagement.css';

const EmployeeManagement: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState<any>(null);

    // 검색 또는 페이지 사이즈 변경 시 1페이지로 초기화 [cite: 2026-01-30, 2026-02-03]
    const handleSearch = () => setPage(1);
    
    const openModal = (emp: any = null) => {
        setSelectedEmp(emp);
        setIsModalOpen(true);
    };

    return (
        <div className="page-header-layout">
            <div className="part-header">
                <div className="left">
                    <Users size={20} />
                    <span className="part-title">직원 마스터 관리</span>
                    <span className="part-desc">시스템 사용자의 기본 정보를 관리합니다.</span>
                </div>
            </div>

            {/* 검색 영역 (filter-bar) [cite: 2026-01-29] */}
            <div className="filter-bar">
                <div className="search-group">
                    <label>검색어</label>
                    <input type="text" placeholder="사번 / 이름 / 부서" />
                    <label>재직여부</label>
                    <select className="page-select" style={{ height: '40px' }}>
                        <option value="Y">재직</option>
                        <option value="N">퇴사</option>
                    </select>
                </div>
                <button className="cm-btn search" onClick={handleSearch}>
                    <Search size={14} /> 조회
                </button>
            </div>

            {/* 그리드 헤더 영역 [cite: 2026-01-30] */}
            <div className="grid-control-bar">
                <div className="left">전체 건수: <span className="blue-text">0</span>건</div>
                <div className="right">
                    <select 
                        className="page-select" 
                        value={pageSize} 
                        onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                    >
                        <option value={10}>10개씩</option>
                        <option value={50}>50개씩</option>
                        <option value={100}>100개씩</option>
                    </select>
                    <button className="cm-btn edit" onClick={() => openModal()}>
                        <UserPlus size={14} /> 신규 등록
                    </button>
                </div>
            </div>

            {/* 그리드 영역 (.standard-table) [cite: 2026-01-30, 2026-02-03] */}
            <div className="content-body">
                <table className="standard-table">
                    <colgroup>
                        <col width="60px" /><col width="100px" /><col width="120px" />
                        <col width="150px" /><col width="120px" /><col width="100px" />
                        <col width="100px" /><col width="150px" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>No</th><th>사번</th><th>성명</th>
                            <th>이메일</th><th>부서</th><th>직급</th>
                            <th>재직</th><th>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 임시 데이터 3개 표시 지침 준수 [cite: 2026-01-29] */}
                        {[1, 2, 3].map((idx) => (
                            <tr key={idx}>
                                <td className="center">{idx}</td>
                                <td className="center">EMP202600{idx}</td>
                                <td className="center">홍길동{idx}</td>
                                <td>test{idx}@erdsystem.com</td>
                                <td className="center">개발팀</td>
                                <td className="center">책임</td>
                                <td className="center">
                                    <span className="status-blue">재직</span>
                                </td>
                                <td className="center" style={{ width: '150px' }}>
                                    <div className="flex-center gap-2">
                                        <button className="cm-btn edit" onClick={() => openModal({id: idx})}>
                                            <Edit size={14} /> 수정
                                        </button>
                                        <button className="cm-btn delete">
                                            <Trash2 size={14} /> 삭제
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 푸터 페이징 영역 [cite: 2026-01-30] */}
            <div className="pagination-container">
    <button 
        className="paging-btn" 
        disabled={page === 1} // 1페이지면 이전 버튼 비활성화
        onClick={() => setPage(prev => prev - 1)}
    >
        &lt;
    </button>

    {/* 현재 페이지 번호와 page 상태를 비교하여 active 클래스 적용 */}
    <button className={`paging-btn ${page === 1 ? 'active' : ''}`}>
        1
    </button>
    
    {/* 예시: 2페이지 버튼 (추후 totalCount에 따라 동적 생성) */}
    <button className={`paging-btn ${page === 2 ? 'active' : ''}`} onClick={() => setPage(2)}>
        2
    </button>

    <button 
        className="paging-btn"
        onClick={() => setPage(prev => prev + 1)}
    >
        &gt;
    </button>
</div>

            {/* 등록/수정 팝업 */}
            {isModalOpen && (
                <EmployeeModal 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    data={selectedEmp}
                />
            )}
        </div>
    );
};

export default EmployeeManagement;