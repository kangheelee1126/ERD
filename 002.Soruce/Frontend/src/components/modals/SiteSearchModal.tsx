import React, { useState, useEffect } from 'react';
import { Search, X, Plus, ChevronLeft, ChevronRight, Factory , ChevronsLeft, ChevronsRight} from 'lucide-react';
import { BusinessSiteService } from '../../services/BusinessSiteService';

interface SiteSearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (selectedSites: any[]) => void; // ✨ 멀티 선택 지원 [cite: 2026-01-30]
    customerId: number | null; // ✨ 부모로부터 받은 고객사 필터 ID
}

const SiteSearchModal: React.FC<SiteSearchModalProps> = ({ isOpen, onClose, onSelect , customerId }) => {
    const [sites, setSites] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set()); // 선택된 ID 관리
    const [page, setPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [searchKeyword, setSearchKeyword] = useState('');

    // 페이징 그룹 계산 (최대 10개 노출) [cite: 2026-01-30, 2026-02-03]
    const pageGroup = Math.ceil(page / 10);
    const lastPage = Math.min(totalPages, pageGroup * 10);
    const firstPage = Math.max(1, (pageGroup - 1) * 10 + 1);

    const loadSites = async () => {
        try {
            const result: any = await BusinessSiteService.getSites(
                page, 
                pageSize, 
                searchKeyword, 
                customerId ?? undefined
            );
            
            if (result) {
                setSites(result.items || []);
                setTotalCount(result.totalCount || 0);
                setTotalPages(Math.ceil((result.totalCount || 0) / pageSize));
            }
        } catch (error) {
            console.error("조회 실패:", error);
        }
    };

    useEffect(() => { if (isOpen) loadSites(); }, [isOpen, page]);

    const handleSearch = () => { 
        setPage(1); // 검색 시 1페이지 초기화 지침 준수 [cite: 2026-01-30, 2026-02-03]
        loadSites(); 
    };

    // 체크박스 제어 로직 [cite: 2026-01-30]
    const toggleSelect = (id: number) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
    };

    const toggleAll = () => {
        if (selectedIds.size === sites.length) setSelectedIds(new Set());
        else setSelectedIds(new Set(sites.map(s => s.siteId)));
    };

    const handleAdd = () => {
        const selectedData = sites.filter(s => selectedIds.has(s.siteId));
        if (selectedData.length === 0) return alert("추가할 사업장을 선택해주세요.");
        onSelect(selectedData); // 부모 창으로 전달 [cite: 2026-01-30]
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ width: '900px' }}>
                <div className="modal-header">
                    <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Factory size={20} color="var(--primary-color)" />
                        <h3 style={{ margin: 0 }}>사업장 검색 추가</h3>
                        {/* ✨ totalCount를 사용하여 경고 해결 및 건수 표시*/}
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '8px' }}>
                            (총 {totalCount}건)
                        </span>
                    </div>
                    <button className="modal-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="modal-body">
                    {/* 검색 필터 영역 */}
                    <div className="filter-bar" style={{ marginBottom: '15px' }}>
                        <div className="filter-item">
                            <label>사업장 검색</label>
                            <input 
                                className="filter-input" 
                                placeholder="코드 또는 사업장명 입력" 
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                        </div>
                        <button className="btn-search" onClick={handleSearch} style={{ marginLeft: 'auto' }}>
                            <Search size={14} /> 조회
                        </button>
                    </div>
                    {/* ✨ 2. 리스트 안내 및 건수 표시 영역 (이 위치에 추가합니다) */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            * 추가할 사업장을 선택해 주세요. (중복 선택 가능)
                        </div>
                        {/* 헤더 영역 외에 리스트 바로 위에서도 건수를 한 번 더 보여주면 직관적입니다 */}
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            조회 결과: <strong style={{ color: 'var(--primary-color)' }}>{totalCount}</strong>건
                        </div>
                    </div>
                    {/* 그리드 영역 */}
                    <table className="standard-table">
                        <colgroup>
                            <col width="50px" /><col width="80px" /><col width="80px" /><col width="300px" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th><input type="checkbox" onChange={toggleAll} checked={selectedIds.size > 0 && selectedIds.size === sites.length} /></th>
                                <th>사업장 코드</th><th>사업장 명칭</th><th>주소</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sites.map((site) => (
                                <tr key={site.siteId}>
                                    <td className="center">
                                        <input type="checkbox" checked={selectedIds.has(site.siteId)} onChange={() => toggleSelect(site.siteId)} />
                                    </td>
                                    <td className="center">{site.siteCd}</td>
                                    <td className="left highlight-text">{site.siteNm}</td>
                                    <td className="left">{site.addr1}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* 표준 페이징 바 (10개 제한) [cite: 2026-01-30, 2026-02-03] */}
                    <div className="pagination-container">
                        {/* 1. 처음으로 (10페이지 단위 이동) */}
                        <button 
                            className="paging-btn" 
                            onClick={() => setPage(1)} 
                            disabled={page === 1}
                        >
                            <ChevronsLeft size={16} />
                        </button>

                        {/* ✨ 2. 이전 페이지 (1페이지 뒤로) */}
                        <button 
                            className="paging-btn" 
                            onClick={() => setPage(prev => Math.max(1, prev - 1))} 
                            disabled={page === 1}
                        >
                            <ChevronLeft size={16} />
                        </button>

                        {/* 3. 숫자 페이지 버튼 (최대 10개) */}
                        {Array.from({ length: lastPage - firstPage + 1 }, (_, i) => firstPage + i).map(n => (
                            <button 
                                key={n} 
                                className={`paging-btn ${page === n ? 'active' : ''}`} 
                                onClick={() => setPage(n)}
                            >
                                {n}
                            </button>
                        ))}

                        {/* ✨ 4. 다음 페이지 (1페이지 앞으로) */}
                        <button 
                            className="paging-btn" 
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))} 
                            disabled={page === totalPages || totalPages === 0}
                        >
                            <ChevronRight size={16} />
                        </button>

                        {/* 5. 마지막으로 (10페이지 단위 이동) */}
                        <button 
                            className="paging-btn" 
                            onClick={() => setPage(totalPages)} 
                            disabled={page === totalPages || totalPages === 0}
                        >
                            <ChevronsRight size={16} />
                        </button>
                    </div>
                </div>

                <div className="btn-group">
                    <div className="btn-action-group">
                        <button className="cm-btn" onClick={onClose}><X size={14} /> 닫기</button>
                        <button className="cm-btn edit" onClick={handleAdd}>
                            <Plus size={14} /> 선택 항목 추가
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteSearchModal;