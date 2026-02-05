import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { 
    Search, UserPlus, Edit, Trash2, Users, List,
    ChevronsLeft, ChevronsRight , ChevronLeft , ChevronRight } from 'lucide-react';
import EmployeeModal from './EmployeeModal';
import { EmployeeService, type Employee } from '../../services/Admin/EmployeeService';

const EmployeeManagement: React.FC = () => {
    /* 1. 상태 관리 */
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    const [modalConfig, setModalConfig] = useState<{ 
        isOpen: boolean; 
        data?: Employee 
    }>({ isOpen: false });

    /* 2. 데이터 조회 로직 (검색어 포함) */
    const loadEmployees = useCallback(async () => {
        try {
            // API 호출 시 검색어, 페이지, 사이즈 전달
            const result = await EmployeeService.getEmployees(page, pageSize, searchTerm);
            setEmployees(result.items || []);
            setTotalCount(result.totalCount || 0);
        } catch (error) {
            console.error("직원 목록 조회 실패:", error);
            setEmployees([]);
        }
    }, [page, pageSize, searchTerm]);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    /* 3. 페이징 그룹 계산 (최대 10개 표시 지침 준수) [cite: 2026-02-03] */
    const { totalPages, startPage, endPage, pageNumbers } = useMemo(() => {
        const total = Math.ceil(totalCount / pageSize) || 1;
        
        // 현재 페이지가 속한 그룹의 시작 페이지 (1~10 -> 1, 11~20 -> 11)
        const start = Math.floor((page - 1) / 10) * 10 + 1;
        // 현재 그룹의 마지막 페이지 (최대 totalPages를 넘지 않음)
        const end = Math.min(start + 9, total);
        
        const nums = [];
        for (let i = start; i <= end; i++) nums.push(i);
        
        return { totalPages: total, startPage: start, endPage: end, pageNumbers: nums };
    }, [totalCount, pageSize, page]);
    /* 4. 이벤트 핸들러 */

    const handleSearch = () => {
        setPage(1); // 검색 시 1페이지로 초기화
        loadEmployees();
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('정말 삭제하시겠습니까?')) {
            try {
                await EmployeeService.deleteEmployee(id);
                loadEmployees();
            } catch (error) {
                alert("삭제 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="header-title">
                    <Users size={24} color="#3b82f6" /> 직원 마스터 관리
                </div>
            </div>

            {/* 검색 영역 */}
            <div className="filter-bar">
                <div className="filter-item">
                    <label>검색어</label>
                    <input 
                        type="text" 
                        className="filter-input" 
                        placeholder="사번 / 이름 / 부서명" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <button className="btn-search" onClick={handleSearch} style={{ height: '40px', padding: '0 20px' }}>
                    <Search size={16} /> 조회
                </button>
            </div>

            <div className="content-body section">
                <div className="part-header">
                    <div className="header-left">
                        <List size={16} />
                        <span className="part-title">직원 목록</span>
                        <span className="text-secondary">(전체: <b className="highlight-text">{totalCount}</b>건)</span>
                    </div>
                    <div className="header-right" style={{ display: 'flex', gap: '8px' }}>
                        <select 
                            className="page-select" 
                            value={pageSize} 
                            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        >
                            <option value={10}>10개씩</option>
                            <option value={50}>50개씩</option>
                            <option value={100}>100개씩</option>
                        </select>
                        <button className="btn-primary" onClick={() => setModalConfig({ isOpen: true })}>
                            <UserPlus size={14} /> 신규 등록
                        </button>
                    </div>
                </div>

                <div className="part-body">
                    <table className="standard-table">
                        <colgroup>
                                <col width="50px" /> {/* No */}
                                <col width="100px" /> {/* 사번 */}
                                <col width="100px" /> {/* 성명 */}
                                <col width="120px" /> {/* 부서명 */}
                                <col width="150px" /> {/* 전화번호 */}
                                <col width="*" /> {/* 이메일 */}
                                <col width="100px" /> {/* 입사일 */}
                                <col width="100px" /> {/* 퇴사일 */}
                                <col width="80px" /> {/* 재직 */}
                                <col width="160px" /> {/* 관리 */}
                        </colgroup>
                        <thead>
                            <tr>
                                <th style={{ width: '50px' }}>No</th>
                                <th style={{ width: '100px' }}>사번</th>
                                <th style={{ width: '100px' }}>성명</th>
                                <th style={{ width: '120px' }}>부서명</th>
                                <th style={{ width: '130px' }}>전화번호</th>
                                <th>이메일</th>
                                <th style={{ width: '100px' }}>입사일</th>
                                <th style={{ width: '100px' }}>퇴사일</th>
                                <th style={{ width: '80px' }}>재직</th>
                                <th style={{ width: '260px' }}>관리</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp, idx) => (
                                <tr key={emp.empId || idx}>
                                    <td className="center">{(page - 1) * pageSize + idx + 1}</td>
                                    <td className="center highlight-text">{emp.empNo}</td>
                                    <td className="center">{emp.empNm}</td>
                                    <td className="center">{emp.deptNm}</td> {/* 코드 대신 명칭 표시 */}
                                    <td className="center">{emp.phone}</td>
                                    <td>{emp.email}</td>
                                    <td className="center">{emp.hireDt}</td>
                                    <td className="center">{emp.hireDt || '-'}</td>
                                    <td className="center">
                                        <span className={emp.activeYn === 'Y' ? 'status-blue' : 'status-red'}>
                                            {emp.activeYn === 'Y' ? '재직' : '퇴사'}
                                        </span>
                                    </td>
                                    <td className="center">
                                        <div className="btn-action-group" style={{ display: 'flex', justifyContent: 'center', gap: '4px' }}>
                                            <button className="cm-btn edit" onClick={() => setModalConfig({ isOpen: true, data: emp })}>
                                                <Edit size={14} /> 수정
                                            </button>
                                            <button className="cm-btn delete" onClick={() => emp.empId && handleDelete(emp.empId)}>
                                                <Trash2 size={14} /> 삭제
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                   {/* [cite: 2026-01-30] 페이지네이션 컨트롤 (하단 중앙 배치) */}
                    <div className="pagination-container">
                        {/* 처음으로 이동 */}
                        <button className="paging-btn" disabled={page === 1} onClick={() => setPage(1)}>
                            <ChevronsLeft size={16} />
                        </button>
                        
                        {/* 이전 10개 그룹으로 이동 [cite: 2026-02-03] */}
                        <button 
                            className="paging-btn" 
                            disabled={startPage === 1} 
                            onClick={() => setPage(startPage - 1)}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* 페이지 번호 (최대 10개) */}
                        {pageNumbers.map(num => (
                            <button 
                                key={num} 
                                className={`paging-btn ${page === num ? 'active' : ''}`}
                                onClick={() => setPage(num)}
                            >
                                {num}
                            </button>
                        ))}

                        {/* 다음 10개 그룹으로 이동 */}
                        <button 
                            className="paging-btn" 
                            disabled={endPage === totalPages} 
                            onClick={() => setPage(endPage + 1)}
                        >
                            <ChevronRight size={16} />
                        </button>
                        
                        {/* 마지막으로 이동 */}
                        <button className="paging-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {modalConfig.isOpen && (
                <EmployeeModal 
                    isOpen={modalConfig.isOpen} 
                    onClose={() => setModalConfig({ isOpen: false })} 
                    onSuccess={loadEmployees} 
                    data={modalConfig.data} 
                />
            )}
        </div>
    );
};

export default EmployeeManagement;