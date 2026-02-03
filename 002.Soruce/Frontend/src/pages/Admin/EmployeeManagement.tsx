import React, { useState, useMemo, useEffect } from 'react'; // ✨ useEffect 추가
import { 
    Search, UserPlus, Edit, Trash2, Users, 
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import EmployeeModal from './EmployeeModal';
import '../../style/common-layout.css';

const EmployeeManagement: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0); // ✨ 초기값 0으로 설정
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState<any>(null);

    /* =========================================
       ✨ 데이터 조회 로직 (setTotalCount 사용) [cite: 2026-01-30]
       ========================================= */
    const fetchEmployees = async () => {
        // 실제 구현 시: const response = await EmployeeService.getEmployees({ page, size: pageSize });
        // 현재는 가이드라인에 따라 임시 데이터 건수를 세팅하여 경고 해결 [cite: 2026-02-03]
        const mockTotalCount = 125; 
        setTotalCount(mockTotalCount); 
        
        console.log(`조회 실행: ${page}페이지, ${pageSize}개씩, 전체 ${mockTotalCount}건`);
    };

    /* ✨ 페이지 번호나 사이즈가 변경될 때마다 자동 조회 [cite: 2026-01-30] */
    useEffect(() => {
        fetchEmployees();
    }, [page, pageSize]);

    /* =========================================
       ✨ 페이징 그룹 계산 로직 [cite: 2026-02-03]
       ========================================= */
    const { totalPages, startPage, endPage, pageNumbers } = useMemo(() => {
        const total = Math.ceil(totalCount / pageSize) || 1;
        const start = Math.floor((page - 1) / 10) * 10 + 1;
        const end = Math.min(start + 9, total);
        
        const nums = [];
        for (let i = start; i <= end; i++) nums.push(i);
        
        return { totalPages: total, startPage: start, endPage: end, pageNumbers: nums };
    }, [totalCount, pageSize, page]);

    /* 검색 시 1페이지 초기화 지침 준수 [cite: 2026-02-03] */
    const handleSearch = () => {
        setPage(1);
        fetchEmployees();
    };
    
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
                        {/* ✨ totalCount가 실시간으로 반영됨 [cite: 2026-01-30] */}
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
                            {/* 실제 데이터 매핑 시: employees.map(...) */}
                            {[1, 2, 3].map((idx) => (
                                <tr key={idx} onDoubleClick={() => openModal({id: idx, empNo: `EMP${idx}`})}>
                                    <td className="center">{idx}</td>
                                    <td className="center">EMP202600{idx}</td>
                                    <td className="center">홍길동{idx}</td>
                                    <td>test{idx}@erdsystem.com</td>
                                    <td className="center">개발팀</td>
                                    <td className="center">책임</td>
                                    <td className="center"><span className="status-blue">재직</span></td>
                                    <td className="center">
                                        <div className="btn-action-group flex-center">
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

                <div className="pagination-container">
                    <button className="paging-btn" disabled={page === 1} onClick={() => setPage(1)}>
                        <ChevronsLeft />
                    </button>
                    <button className="paging-btn" disabled={startPage === 1} onClick={() => setPage(startPage - 1)}>
                        <ChevronLeft />
                    </button>

                    {pageNumbers.map(num => (
                        <button 
                            key={num} 
                            className={`paging-btn ${page === num ? 'active' : ''}`}
                            onClick={() => setPage(num)}
                        >
                            {num}
                        </button>
                    ))}

                    <button className="paging-btn" disabled={endPage === totalPages} onClick={() => setPage(endPage + 1)}>
                        <ChevronRight />
                    </button>
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