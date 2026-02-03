import React, { useState } from 'react';
import { Search, UserPlus, Edit, Trash2, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import EmployeeModal from './EmployeeModal';
/* 공통 CSS 임포트 */
import '../../style/common-layout.css';

const EmployeeManagement: React.FC = () => {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmp, setSelectedEmp] = useState<any>(null);

    const handleSearch = () => setPage(1); // 검색 시 1페이지 초기화 지침 준수 [cite: 2026-02-03]
    
    const openModal = (emp: any = null) => {
        setSelectedEmp(emp);
        setIsModalOpen(true);
    };

    return (
        /* ✨ CSS 표준에 맞춰 page-container로 변경 */
        <div className="page-container">
            {/* 상단 헤더 영역 */}
            <div className="page-header">
                <div className="header-title">
                    <Users size={24} color="var(--primary-color)" />
                    직원 마스터 관리
                </div>
            </div>

            {/* 검색 필터바 [cite: 2026-01-29] */}
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
                {/* ✨ CSS에 정의된 전용 조회 버튼 스타일 사용 */}
                <button className="btn-search" onClick={handleSearch}>
                    <Search size={14} /> 조회
                </button>
            </div>

            {/* 메인 컨텐츠 (그리드) 영역 */}
            <div className="content-body section">
                <div className="part-header">
                    <div className="header-left">
                        <span className="part-title">직원 목록</span>
                        <span className="text-secondary">(전체: <b className="highlight-text">0</b>건)</span>
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

                {/* ✨ 스크롤 제어를 위해 part-body 적용 */}
                <div className="part-body">
                    <table className="standard-table">
                        <colgroup>
                            <col width="60px" /><col width="100px" /><col width="120px" />
                            <col width="*" /><col width="120px" /><col width="100px" />
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

                {/* 페이징 영역 (part-body 내부 하단 배치) [cite: 2026-01-30] */}
                <div className="pagination-container">
                    <button className="paging-btn" disabled={page === 1} onClick={() => setPage(prev => prev - 1)}>
                        <ChevronLeft />
                    </button>
                    <button className={`paging-btn ${page === 1 ? 'active' : ''}`} onClick={() => setPage(1)}>1</button>
                    <button className={`paging-btn ${page === 2 ? 'active' : ''}`} onClick={() => setPage(2)}>2</button>
                    <button className="paging-btn" onClick={() => setPage(prev => prev + 1)}>
                        <ChevronRight />
                    </button>
                </div>
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