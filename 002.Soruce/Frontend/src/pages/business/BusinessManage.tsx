import React, { useState, useEffect } from 'react';
import { 
    Search, List, Plus, Edit, Trash2, 
    ChevronLeft, ChevronRight, X, Save, Factory 
} from 'lucide-react';

/* 서비스 및 검색 모달 임포트 */
import { BusinessSiteService } from '../../services/BusinessSiteService';
import CustomerSearchModal from '../../components/modals/CustomerSearchModal';

/* 공통 CSS 임포트 */
import '../../style/common-layout.css';

const BusinessManage: React.FC = () => {
    // 1. 상태 관리
    const [sites, setSites] = useState<any[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [searchCustId, setSearchCustId] = useState<number | undefined>(undefined);
    const [searchCustNm, setSearchCustNm] = useState('');
    const [searchKeyword, setSearchKeyword] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [showCustSearch, setShowCustSearch] = useState(false);
    const [custSearchTarget, setCustSearchTarget] = useState<'FILTER' | 'FORM'>('FILTER');

    const initialForm = {
        siteId: 0, customerId: 0, custNm: '', siteCd: '', siteNm: '',
        siteNmEn: '', siteTypeCd: '', telNo: '', faxNo: '', zipCd: '',
        addr1: '', addr2: '', timezoneCd: 'UTC+9', isMain: 'N', useYn: 'Y', comments: ''
    };
    const [formData, setFormData] = useState<any>(initialForm);

    // 2. 데이터 연동 로직
    const loadSites = async () => {
        try {
            const result: any = await BusinessSiteService.getSites(page, pageSize, searchKeyword);
            if (result) {
                setSites(result.items || []);
                setTotalCount(result.totalCount || 0);
                setTotalPages(Math.ceil((result.totalCount || 0) / pageSize));
            }
        } catch (error) {
            console.error("조회 실패:", error);
        }
    };

    useEffect(() => { 
        loadSites(); 
    }, [page, pageSize]);

    const handleSearch = () => { 
        setPage(1); 
        loadSites(); 
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        try {
            await BusinessSiteService.deleteSite(id);
            alert("삭제되었습니다.");
            handleSearch();
        } catch (e) {
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    const handleSave = async () => {
        if (!formData.customerId) return alert("고객사를 선택해주세요.");
        if (!formData.siteNm) return alert("사업장 명칭을 입력해주세요.");

        try {
            if (formData.siteId === 0) {
                await BusinessSiteService.createSite(formData);
            } else {
                await BusinessSiteService.updateSite(formData.siteId, formData);
            }
            alert("저장되었습니다.");
            setShowModal(false);
            handleSearch();
        } catch (e) {
            alert("저장 실패");
        }
    };

    // 3. UI 제어 로직
    const openCustSearch = (target: 'FILTER' | 'FORM') => {
        setCustSearchTarget(target);
        setShowCustSearch(true);
    };

    const handleCustSelect = (customer: any) => {
        if (custSearchTarget === 'FILTER') {
            setSearchCustId(customer.customerId);
            setSearchCustNm(customer.custNm);
        } else {
            setFormData({ ...formData, customerId: customer.customerId, custNm: customer.custNm });
        }
    };

    const openModal = async (id: number = 0) => {
        if (id > 0) {
            try {
                const data = await BusinessSiteService.getSiteById(id);
                setFormData(data);
            } catch (e) {
                alert("데이터를 불러올 수 없습니다.");
                return;
            }
        } else {
            setFormData({ ...initialForm, customerId: searchCustId || 0, custNm: searchCustNm || '' });
        }
        setShowModal(true);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="header-title">
                    <Factory size={24} color="var(--primary-color)" /> 사업장 정보 관리
                </div>
            </div>

            <div className="filter-bar">
                <div className="filter-item">
                    <label>고객사</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input className="filter-input" value={searchCustNm} readOnly onClick={() => openCustSearch('FILTER')} 
                               placeholder="전체 고객사" style={{ width: '150px', cursor: 'pointer' }} />
                        {searchCustId && (
                            <button className="btn-secondary" onClick={() => { setSearchCustId(undefined); setSearchCustNm(''); }} style={{ padding: '0 8px' }}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>
                <div className="filter-item">
                    <label>사업장명</label>
                    <input className="filter-input" placeholder="사업장명 입력" value={searchKeyword} 
                           onChange={(e) => setSearchKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
                </div>
                <button className="btn-search" onClick={handleSearch} style={{ marginLeft: 'auto' }}>
                    <Search size={14} /> 조회
                </button>
            </div>

            <div className="content-body section">
                <div className="part-header">
                    <div className="header-left">
                        <List size={16} color="var(--text-secondary)" /> 
                        <span className="part-title">사업장 리스트</span>
                        <span className="count-label">(총 {totalCount}건)</span>
                    </div>
                    <div className="header-right">
                        <select className="page-select" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
                            <option value={10}>10개씩</option>
                            <option value={50}>50개씩</option>
                            <option value={100}>100개씩</option>
                        </select>
                        <button className="btn-primary" onClick={() => openModal(0)}>
                            <Plus size={14} /> 신규 등록
                        </button>
                    </div>
                </div>

                <div className="part-body">
                    <div style={{ overflow: 'auto' }}>
                        <table className="standard-table">
                            <thead>
                                <tr>
                                    <th style={{width: '50px'}}>No</th>
                                    <th>고객사</th>
                                    <th>사업장 코드</th>
                                    <th>사업장 명칭</th>
                                    <th>대표전화</th>
                                    <th style={{width: '60px'}}>대표</th>
                                    <th style={{width: '60px'}}>상태</th>
                                    <th style={{width: '180px'}}>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sites.length > 0 ? sites.map((item, idx) => (
                                    <tr key={item.siteId}>
                                        <td className="center">{(page - 1) * pageSize + idx + 1}</td>
                                        <td className="left">{item.custNm}</td>
                                        <td className="center readonly-text">{item.siteCd}</td>
                                        <td className="left highlight-text">{item.siteNm}</td>
                                        <td className="center">{item.telNo}</td>
                                        <td className="center">{item.isMain === 'Y' ? 'Y' : 'N'}</td>
                                        <td className="center">
                                            <span className={item.useYn === 'Y' ? 'status-blue' : 'status-red'}>
                                                {item.useYn === 'Y' ? '사용' : '미사용'}
                                            </span>
                                        </td>
                                        <td className="center">
                                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                <button className="cm-btn edit" onClick={() => openModal(item.siteId)}><Edit size={14} /> 수정</button>
                                                <button className="cm-btn delete" onClick={() => handleDelete(item.siteId)}><Trash2 size={14} /> 삭제</button>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={8} className="center" style={{padding: '40px 0'}}>데이터가 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination-container">
                        <button className="paging-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}><ChevronLeft size={16}/></button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                            <button key={pageNum} className={`paging-btn ${page === pageNum ? 'active' : ''}`} onClick={() => setPage(pageNum)}>{pageNum}</button>
                        ))}
                        <button className="paging-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}><ChevronRight size={16}/></button>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '800px' }}>
                        <div className="modal-header">
                            <h3>사업장 정보 {formData.siteId === 0 ? '등록' : '수정'}</h3>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body">
                            <table className="input-table">
                                <colgroup>
                                    <col width="18%" /><col width="32%" /><col width="18%" /><col width="32%" />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th>고객사 <span className="req">*</span></th>
                                        <td colSpan={3}>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <input className="form-input" value={formData.custNm} readOnly style={{ backgroundColor: '#1e293b', flex: 1 }} />
                                                <button className="btn-secondary" onClick={() => openCustSearch('FORM')}><Search size={14} /> 찾기</button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>사업장 코드 <span className="req">*</span></th>
                                        <td>
                                            <input 
                                                className={`form-input ${formData.siteId !== 0 ? 'readonly-text' : ''}`} 
                                                value={formData.siteCd} 
                                                readOnly={formData.siteId !== 0}
                                                onChange={(e) => setFormData({...formData, siteCd: e.target.value})} 
                                            />
                                        </td>
                                        <th>사업장 명칭 <span className="req">*</span></th>
                                        <td><input className="form-input" value={formData.siteNm} onChange={(e) => setFormData({...formData, siteNm: e.target.value})} /></td>
                                    </tr>
                                    <tr>
                                        <th>대표전화</th>
                                        <td><input className="form-input" value={formData.telNo} onChange={(e) => setFormData({...formData, telNo: e.target.value})} /></td>
                                        <th>팩스번호</th>
                                        <td><input className="form-input" value={formData.faxNo} onChange={(e) => setFormData({...formData, faxNo: e.target.value})} /></td>
                                    </tr>
                                    <tr>
                                        <th>우편번호</th>
                                        <td><input className="form-input" value={formData.zipCd} onChange={(e) => setFormData({...formData, zipCd: e.target.value})} /></td>
                                        <th>타임존</th>
                                        <td><input className="form-input" value={formData.timezoneCd} onChange={(e) => setFormData({...formData, timezoneCd: e.target.value})} /></td>
                                    </tr>
                                    <tr>
                                        <th>기본주소</th>
                                        <td colSpan={3}><input className="form-input" value={formData.addr1} onChange={(e) => setFormData({...formData, addr1: e.target.value})} /></td>
                                    </tr>
                                    <tr>
                                        <th>상세주소</th>
                                        <td colSpan={3}><input className="form-input" value={formData.addr2} onChange={(e) => setFormData({...formData, addr2: e.target.value})} /></td>
                                    </tr>
                                    <tr>
                                        <th>사용여부</th>
                                        <td>
                                            <select className="form-input" value={formData.useYn} onChange={(e) => setFormData({...formData, useYn: e.target.value})}>
                                                <option value="Y">사용</option>
                                                <option value="N">미사용</option>
                                            </select>
                                        </td>
                                        <th>대표사업장</th>
                                        <td>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fff', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={formData.isMain === 'Y'} onChange={(e) => setFormData({...formData, isMain: e.target.checked ? 'Y' : 'N'})} /> 대표사업장 지정
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>비고</th>
                                        <td colSpan={3}>
                                            <textarea className="form-input" rows={2} style={{height: '60px'}} value={formData.comments} onChange={(e) => setFormData({...formData, comments: e.target.value})} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-group">
                            <div className="btn-action-group">
                                <button className="btn-secondary" onClick={() => setShowModal(false)}><X size={14} /> 취소</button>
                                <button className="btn-primary" onClick={handleSave}><Save size={14} /> 저장</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <CustomerSearchModal 
                isOpen={showCustSearch} 
                onClose={() => setShowCustSearch(false)} 
                onSelect={handleCustSelect} 
            />
        </div>
    );
};

export default BusinessManage;