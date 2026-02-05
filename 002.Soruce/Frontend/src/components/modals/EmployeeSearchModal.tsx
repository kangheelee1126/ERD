import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
    Search, X, UserCheck, List,
    ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight 
} from 'lucide-react';
import { EmployeeService } from '../../services/Admin/EmployeeService';

interface EmployeeSearchModalProps {
    onClose: () => void;
    onSelect: (emp: any) => void;
}

const EmployeeSearchModal: React.FC<EmployeeSearchModalProps> = ({ onClose, onSelect }) => {
    /* 1. 상태 관리 [cite: 2026-01-30] */
    const [employees, setEmployees] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    /* 2. 데이터 조회 로직 (서버 사이드 페이징/검색) [cite: 2026-02-03] */
    const loadEmployees = useCallback(async () => {
        try {
            const result = await EmployeeService.getEmployees(page, pageSize, searchTerm);
            setEmployees(result.items || []);
            setTotalCount(result.totalCount || 0);
        } catch (error) {
            console.error("직원 목록 조회 실패:", error);
        }
    }, [page, pageSize, searchTerm]);

    useEffect(() => {
        loadEmployees();
    }, [loadEmployees]);

    /* 3. 페이징 그룹 계산 (최대 10개 표시) [cite: 2026-02-03] */
    const { totalPages, startPage, endPage, pageNumbers } = useMemo(() => {
        const total = Math.ceil(totalCount / pageSize) || 1;
        const start = Math.floor((page - 1) / 10) * 10 + 1;
        const end = Math.min(start + 9, total);
        const nums = [];
        for (let i = start; i <= end; i++) nums.push(i);
        return { totalPages: total, startPage: start, endPage: end, pageNumbers: nums };
    }, [totalCount, pageSize, page]);

    /* 4. 이벤트 핸들러 */
    const handleSearch = () => {
        setPage(1); // 검색 시 1페이지로 초기화 [cite: 2026-01-30]
        loadEmployees();
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '850px' }}>
                <div className="modal-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Search size={20} color="#3b82f6" />
                        <h3 style={{ margin: 0 }}>직원 검색 전용 팝업</h3>
                    </div>
                    <button className="btn-secondary" style={{ border: 'none', background: 'none', cursor: 'pointer' }} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    {/* 검색 바 영역 */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '15px', alignItems: 'center' }}>
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>검색어</label>
                            <input 
                                className="form-input" 
                                placeholder="사번 또는 성명 입력" 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button className="um-btn edit" onClick={handleSearch}>
                            <Search size={14} /> 조회
                        </button>
                    </div>

                    {/* 직원 목록 그리드 (기존 스타일 계승) */}
                    <div className="table-container" style={{ minHeight: '350px' }}>
                        <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <List size={14} color="#94a3b8" />
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                                검색 결과 (전체: <b style={{ color: '#3b82f6' }}>{totalCount}</b>건)
                            </span>
                        </div>
                        <table className="user-mgmt-table">
                            <thead>
                                <tr>
                                    <th className="um-th center" style={{ width: '50px' }}>No</th>
                                    <th className="um-th left" style={{ width: '120px' }}>사번</th>
                                    <th className="um-th center">성명</th>
                                    <th className="um-th center">부서명</th>
                                    <th className="um-th center" style={{ width: '100px' }}>선택</th>
                                </tr>
                            </thead>
                            <tbody>
                                {employees.map((emp, idx) => (
                                    <tr key={emp.empId} onDoubleClick={() => onSelect(emp)}>
                                        <td className="um-td center">{(page - 1) * pageSize + idx + 1}</td>
                                        <td className="um-td left highlight-id">{emp.empNo}</td>
                                        <td className="um-td center">{emp.empNm}</td>
                                        <td className="um-td center">{emp.deptNm || '-'}</td>
                                        <td className="um-td center">
                                            <button className="um-btn edit" onClick={() => onSelect(emp)}>
                                                <UserCheck size={14} /> 선택
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {employees.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="um-td center" style={{ padding: '50px' }}>
                                            조회된 직원이 없습니다.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이징 컨트롤 [cite: 2026-02-03] */}
                    <div className="pagination-container" style={{ marginTop: '20px' }}>
                        <button className="paging-btn" disabled={page === 1} onClick={() => setPage(1)}>
                            <ChevronsLeft size={16} />
                        </button>
                        <button className="paging-btn" disabled={startPage === 1} onClick={() => setPage(startPage - 1)}>
                            <ChevronLeft size={16} />
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
                            <ChevronRight size={16} />
                        </button>
                        <button className="paging-btn" disabled={page === totalPages} onClick={() => setPage(totalPages)}>
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeSearchModal;