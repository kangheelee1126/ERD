import React, { useState, useMemo } from 'react';
/* ✨ 그룹 이동 아이콘 추가: ChevronsLeft, ChevronsRight */
import { 
    Search, UserPlus, Edit, Trash2, Users, 
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import EmployeeModal from './EmployeeModal';
import '../../style/common-layout.css';

const EmployeeManagement: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(125); // ✨ 테스트용 임시 건수
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState<any>(null);

    /* =========================================
       ✨ 페이징 그룹 계산 로직 [cite: 2026-02-03]
       ========================================= */
    const { totalPages, startPage, endPage, pageNumbers } = useMemo(() => {
        const total = Math.ceil(totalCount / pageSize) || 1;
        // 현재 페이지가 속한 그룹의 시작 번호 (1, 11, 21...)
        const start = Math.floor((page - 1) / 10) * 10 + 1;
        // 그룹의 끝 번호 (최대 10개 표시 지침 준수)
        const end = Math.min(start + 9, total);
        
        const nums = [];
        for (let i = start; i <= end; i++) nums.push(i);
        
        return { totalPages: total, startPage: start, endPage: end, pageNumbers: nums };
    }, [totalCount, pageSize, page]);

    const handleSearch = () => setPage(1); // 검색 시 1페이지 초기화 [cite: 2026-02-03]
    
    const openModal = (emp: any = null) => {
        setSelectedEmp(emp);
        setIsModalOpen(true);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="header-title">
                    <Users size={24} color="var(--primary-color)" />
                    직원 마스터 관리
                </div>
            </div>

            <div className="filter-bar">
                <div className="filter-item">
                    <label>검색어</label>
                    <input type="text" className="filter-input" placeholder="사번 / 이름 / 부서" />
                </div>
                <div className="filter-item">
                    <label>재직여부</label>
                    <select className="page-select">
                        <option value="Y">재직</option>
                        <option value="N">퇴사</option>
                    </select>
                </div>
                <button className="btn-search" onClick={handleSearch}>
                    <Search size={14} /> 조회
                </button>
            </div>

            <div className="content-body section">
                <div className="part-header">
                    <div className="header-left">
                        <span className="part-title">직원 목록</span>
                        <span className="text-secondary">(전체: <b className="highlight-text">{totalCount}</b>건)</span>
                    </div>
                    <div className="header-right">
                        <select 
                            className="page-select" 
                            value={pageSize} 
                            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        >
                            <option value={10}>10개씩</option>
                            <option value={50}>50개씩</option>
                            <option value={100}>100개씩</option>
                        </select>
                        <button className="btn-primary" onClick={() => openModal()}>
                            <UserPlus size={14} /> 신규 등록
                        </button>
                    </div>
                </div>

                <div className="part-body">
                    <table className="standard-table">
                        <colgroup>
                            <col width="60px" /><col width="120px" /><col width="120px" />
                            <col width="*" /><col width="150px" /><col width="100px" />
                            <col width="100px" /><col width="160px" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>No</th><th>사번</th><th>성명</th>
                                <th>이메일</th><th>부서</th><th>직급</th>
                                <th>재직</th><th>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3].map((idx) => (
                                <tr key={idx}>
                                    <td className="center">{idx}</td>
                                    <td className="center">EMP202600{idx}</td>
                                    <td className="center">홍길동{idx}</td>
                                    <td>test{idx}@erdsystem.com</td>
                                    <td className="center">개발팀</td>
                                    <td className="center">책임</td>
                                    <td className="center"><span className="status-blue">재직</span></td>
                                    <td className="center">
                                        <div className="btn-action-group flex-center">
                                            <button className="cm-btn edit" onClick={() => openModal({id: idx})}><Edit size={14} /> 수정</button>
                                            <button className="cm-btn delete"><Trash2 size={14} /> 삭제</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* =========================================
                   ✨ 수정된 페이징 영역 [cite: 2026-01-30, 2026-02-03]
                   ========================================= */}
                <div className="pagination-container">
                    {/* 처음으로 */}
                    <button className="paging-btn" disabled={page === 1} onClick={() => setPage(1)}>
                        <ChevronsLeft />
                    </button>
                    {/* 이전 그룹 이동 */}
                    <button className="paging-btn" disabled={startPage === 1} onClick={() => setPage(startPage - 1)}>
                        <ChevronLeft />
                    </button>

                    {/* 페이지 번호 그룹 (최대 10개) */}
                    {pageNumbers.map(num => (
                        <button 
                            key={num} 
                            className={`paging-btn ${page === num ? 'active' : ''}`}
                            onClick={() => setPage(num)}
                        >
                            {num}
                        </button>
                    ))}

                    {/* 다음 그룹 이동 */}
                    <button className="paging-btn" disabled={endPage === totalPages} onClick={() => setPage(endPage + 1)}>
                        <ChevronRight />
                    </button>
                    {/* 끝으로 */}
                    <button className="paging-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
                        <ChevronsRight />
                    </button>
                </div>
            </div>

            {isModalOpen && <EmployeeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} data={selectedEmp} />}
        </div>
    );
};

export default EmployeeManagement;