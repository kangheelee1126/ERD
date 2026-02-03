import React, { useState, useEffect } from 'react';
/* ✨ Lucide 아이콘 패키지 임포트 */
import { 
    Users, Search, List, Plus, Edit, Trash2, 
    ChevronLeft, ChevronRight, // ✨ 이 두 아이콘이 반드시 있어야 합니다.
    Star, X, Save , UserCheck , MapPin
} from 'lucide-react';

/* ✨ 서비스 및 타입 정의 임포트 */
import { ContactService, type Contact } from '../../services/ContactService';
import CustomerSearchModal from '../../components/modals/CustomerSearchModal'; // 6-1단계에서 만든 검색 팝업
/* ContactManagement.tsx 상단 */
import ContactRoleModal from './ContactRoleModal';

/* ✨ 1. 사업장 연결 관리 모달 임포트 */
import ContactSiteModal from './ContactSiteModal';

/* ✨ 통합된 공통 CSS 임포트 */
import '../../style/common-layout.css';

const ContactManagement: React.FC = () => {
    // ==================================================================================
    // 1. 상태 관리 (State Management)
    // ==================================================================================
    
    // 그리드 데이터 및 페이징
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // 1. 페이징 그룹 계산 [cite: 2026-01-30]
    const pageGroup = Math.ceil(page / 10);
    const lastPage = Math.min(totalPages, pageGroup * 10);
    const firstPage = Math.max(1, (pageGroup - 1) * 10 + 1);

    // 검색 필터 상태
    const [searchCustId, setSearchCustId] = useState<number | undefined>(undefined);
    const [searchCustNm, setSearchCustNm] = useState(''); // 화면 표시용 (읽기 전용)
    const [searchKeyword, setSearchKeyword] = useState('');

    // 팝업(Modal) 표시 여부
    const [showModal, setShowModal] = useState(false);        // 입력/수정 팝업
    const [showCustSearch, setShowCustSearch] = useState(false); // 고객사 찾기 팝업
    
    // 검색 팝업 호출 주체 구분 ('FILTER': 검색바에서 호출, 'FORM': 입력폼에서 호출)
    const [custSearchTarget, setCustSearchTarget] = useState<'FILTER' | 'FORM'>('FILTER');

    /* ✨ 2. 사업장 모달 표시 상태 추가 */
    const [showSiteModal, setShowSiteModal] = useState(false);

    /* 상단 상태 정의 추가 */
    const [selectedCustId, setSelectedCustId] = useState<number | null>(null);



    // 입력 폼 데이터 (초기값 설정)
    const initialContact: Contact = {
        contactId: 0,
        customerId: 0,   // ✨ FK 명칭 통일
        custNm: '',
        contactNm: '',
        contactCd: '',
        deptNm: '',
        dutyNm: '',
        mobileNo: '',
        email: '',
        isMain: 'N',
        isActive: 'Y',
        note: ''
    };
    const [formData, setFormData] = useState<Contact>(initialContact);

    const [showRoleModal, setShowRoleModal] = useState(false); // 모달의 표시 여부 (T/F)
    const [selectedContactId, setSelectedContactId] = useState<number | null>(null); // 선택된 담당자 ID 저장
    // ✨ [수정] 담당자 성함을 저장할 상태 변수 추가 [cite: 2026-01-30]
    const [selectedContactName, setSelectedContactName] = useState<string>('');
    // ==================================================================================
    // 2. 데이터 조회 및 API 연동
    // ==================================================================================

    // 목록 조회 함수
    const loadContacts = async () => {
        try {
            // API 호출 (페이지, 사이즈, 고객사ID, 검색어)
            const result: any = await ContactService.getContacts(page, pageSize, searchCustId, searchKeyword);
            
            if (result) {
                setContacts(result.items || []);
                setTotalCount(result.totalCount || 0);
                setTotalPages(result.totalPages || 0);
            }
        } catch (error) {
            console.error("데이터 로드 실패:", error);
            setContacts([]);
        }
    };

    // 페이지나 사이즈가 변경되면 자동 재조회
    useEffect(() => {
        loadContacts();
    }, [page, pageSize]);

    // 검색 버튼 클릭 핸들러
    const handleSearch = () => {
        setPage(1); // 검색 시 1페이지로 초기화
        loadContacts();
    };

    // ==================================================================================
    // 3. 팝업 및 UI 제어 로직
    // ==================================================================================

    /**
     * 역할 매핑 모달 열기 [cite: 2026-01-30]
     * @param id 선택된 담당자의 contactId
     */
    const openRoleModal = (id: number , name:string) => {
        // 1. 어떤 담당자의 역할을 수정할지 ID 저장
        setSelectedContactId(id);
        
        // 2. 역할 관리 모달 표시 상태를 true로 변경
        setShowRoleModal(true);

        setSelectedContactName(name); // ✨ 선택된 성함 저장 [cite: 2026-01-30]

        // (선택 사항) 로그를 통해 정상 호출 확인
        // console.log(`담당자 ID ${id}의 역할 관리 팝업 호출`);
    };

    /**
     * ✨ 3. 사업장 연결 관리 모달 열기 함수
     */
    const openSiteModal = (id: number, name: string , custId: number) => {
        setSelectedContactId(id);
        setSelectedContactName(name);
        setSelectedCustId(custId); // ✨ 고객사 ID 저장
        setShowSiteModal(true);
    };


    // 삭제 핸들러
    const handleDelete = async (id: number) => {
        if (!window.confirm("선택한 담당자를 삭제하시겠습니까?")) return;
        try {
            await ContactService.deleteContact(id);
            alert("삭제되었습니다.");
            loadContacts(); // 목록 갱신
        } catch (e) {
            console.error(e);
            alert("삭제 중 오류가 발생했습니다.");
        }
    };

    // 저장(신규/수정) 핸들러
    const handleSave = async () => {
        // 유효성 검사
        if (!formData.customerId || formData.customerId === 0) {
            alert("고객사를 선택해주세요.");
            return;
        }
        if (!formData.contactNm) {
            alert("담당자명을 입력해주세요.");
            return;
        }

        try {
            await ContactService.saveContact(formData);
            alert("저장되었습니다.");
            setShowModal(false);
            loadContacts(); // 목록 갱신
        } catch (e) {
            console.error(e);
            alert("저장 실패");
        }
    };

    // ==================================================================================
    // 3. 팝업 및 UI 제어 로직
    // ==================================================================================

    // 고객사 찾기 팝업 열기
    const openCustSearch = (target: 'FILTER' | 'FORM') => {
        setCustSearchTarget(target);
        setShowCustSearch(true);
    };

    // 고객사 선택 완료 시 처리
    const handleCustSelect = (customer: any) => {
        if (custSearchTarget === 'FILTER') {
            // 검색 필터에 세팅
            setSearchCustId(customer.customerId);
            setSearchCustNm(customer.custNm);
        } else {
            // 입력 폼에 세팅
            setFormData({ ...formData, customerId: customer.customerId, custNm: customer.custNm });
        }
    };

    // 신규/수정 모달 열기
    const openModal = async (id: number = 0) => {
        if (id > 0) {
            // 수정 모드: 상세 정보 조회
            try {
                const data = await ContactService.getContact(id);
                setFormData(data);
            } catch (e) {
                alert("데이터를 불러올 수 없습니다.");
                return;
            }
        } else {
            // 신규 모드: 초기화 (필터에 선택된 고객사가 있으면 자동 입력)
            setFormData({ 
                ...initialContact, 
                customerId: searchCustId || 0, 
                custNm: searchCustNm || '' 
            });
        }
        setShowModal(true);
    };

    // ==================================================================================
    // 4. 화면 렌더링 (UI)
    // ==================================================================================
    return (
        <div className="page-container">
            {/* --- 헤더 영역 --- */}
            <div className="page-header">
                <div className="header-title">
                    <Users size={24} color="var(--primary-color)" /> 담당자 정보 관리
                </div>
            </div>

            {/* --- 검색 필터바 (가로 정렬) --- */}
            <div className="filter-bar">
                <div className="filter-item">
                    <label>고객사</label>
                    <div style={{ display: 'flex', gap: '5px' }}>
                        <input 
                            className="filter-input" 
                            placeholder="전체" 
                            value={searchCustNm} 
                            readOnly 
                            onClick={() => openCustSearch('FILTER')} // 클릭 시 검색 팝업
                            style={{ width: '150px', cursor: 'pointer', backgroundColor: '#1e293b', color: '#94a3b8' }} 
                        />
                        <button className="btn-secondary" onClick={() => openCustSearch('FILTER')} style={{ padding: '0 8px' }}>
                            <Search size={14} />
                        </button>
                        {/* 선택 취소 버튼 */}
                        {searchCustId && (
                            <button className="btn-secondary" onClick={() => { setSearchCustId(undefined); setSearchCustNm(''); }} style={{ padding: '0 8px' }}>
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="filter-item">
                    <label>검색어</label>
                    <input 
                        type="text" 
                        className="filter-input" 
                        placeholder="이름 / 연락처 / 이메일" 
                        value={searchKeyword} 
                        onChange={(e) => setSearchKeyword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        style={{ width: '200px' }}
                    />
                </div>

                {/* 조회 버튼 (우측 끝 정렬) */}
                <button className="btn-search" onClick={handleSearch}>
                    <Search size={14} /> 조회
                </button>
            </div>

            {/* --- 그리드 컨텐츠 영역 (화면 남은 높이 채움) --- */}
            <div className="content-body section">
                <div className="part-header">
                    <div className="header-left">
                        <List size={16} color="var(--text-secondary)" /> 
                        <span className="part-title">담당자 리스트</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginLeft: '8px', fontWeight: 'normal' }}>
                            (총 {totalCount}건)
                        </span>
                    </div>
                    <div className="header-right">
                        {/* 페이지 사이즈 선택 (자동 폭 조절) */}
                        <select 
                            className="page-select" 
                            value={pageSize} 
                            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                        >
                            <option value={10}>10개씩</option>
                            <option value={50}>50개씩</option>
                            <option value={100}>100개씩</option>
                        </select>
                        
                        <button className="btn-primary" onClick={() => openModal(0)}>
                            <Plus size={14} /> 신규
                        </button>
                    </div>
                </div>

                {/* 테이블 + 페이징 영역 (Flex Grow) */}
                <div className="part-body">
                    {/* 테이블 스크롤 영역 */}
                    <div style={{ overflow: 'auto' }}> 
                        <table className="standard-table">
                            <colgroup>
                                <col width="50px" /><col width="150px" /><col width="100px" /><col width="120px" />
                                <col width="130px" /><col width="*" /><col width="60px" /><col width="60px" />
                                <col width="110px" /><col width="110px" /><col width="140px" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>No</th><th>고객사</th><th>담당자명</th><th>부서/직책</th>
                                    <th>휴대폰</th><th>이메일</th><th>대표</th><th>상태</th>
                                    <th>역활관리</th><th>사업장</th><th>관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((item, idx) => (
                                    <tr key={item.contactId}>
                                        <td className="center">{(page - 1) * pageSize + idx + 1}</td>
                                        <td className="left" title={item.custNm}>{item.custNm}</td>
                                        <td className="center highlight-text">{item.contactNm}</td>
                                        <td className="center">
                                            {item.deptNm && item.dutyNm ? `${item.deptNm}/${item.dutyNm}` : (item.deptNm || item.dutyNm || '-')}
                                        </td>
                                        <td className="center">{item.mobileNo || item.telNo}</td>
                                        <td className="left" title={item.email}>{item.email}</td>
                                        <td className="center">
                                            {item.isMain === 'Y' && <Star size={14} fill="#f59e0b" color="#f59e0b" style={{ margin: '0 auto' }} />}
                                        </td>
                                        <td className="center">
                                            <span className={item.isActive === 'Y' ? 'status-blue' : 'status-red'}>
                                                {item.isActive === 'Y' ? '사용' : '미사용'}
                                            </span>
                                        </td>
                                        <td className="center">
                                            {/* ✨ [수정] 버튼 클릭 시 성함(item.contactNm)을 함께 넘깁니다. [cite: 2026-01-30] */}
                                            <button className="cm-btn edit" onClick={() => openRoleModal(item.contactId , item.contactNm)}>
                                                <UserCheck size={14} /> 역활
                                            </button>
                                        </td>
                                        {/* ✨ 6. 사업장 관리 버튼 추가 */}
                                        <td className="center">
                                            <button className="cm-btn edit" onClick={() => openSiteModal(item.contactId, item.contactNm , item.customerId)}>
                                                <MapPin size={14} /> 사업장
                                            </button>
                                        </td>
                                        <td className="center">
                                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                                <button className="cm-btn edit" onClick={() => openModal(item.contactId)}>
                                                    <Edit size={14} /> 수정
                                                </button>
                                                <button className="cm-btn delete" onClick={() => handleDelete(item.contactId)}>
                                                    <Trash2 size={14} /> 삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {contacts.length === 0 && (
                                    <tr><td colSpan={9} className="center" style={{ padding: '40px 0', color: 'var(--text-secondary)' }}>데이터가 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 (하단 고정) */}
                    {totalPages > 0 && (
                        <div className="pagination-container">
                            <button className="paging-btn" onClick={() => setPage(1)} disabled={page === 1}>
                                <ChevronLeft size={16}/><ChevronLeft size={16} style={{marginLeft:'-8px'}}/>
                            </button>
                            <button className="paging-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                                <ChevronLeft size={16}/>
                            </button>

                            {Array.from({ length: lastPage - firstPage + 1 }, (_, i) => firstPage + i).map(n => (
                                <button key={n} className={`paging-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>
                                    {n}
                                </button>
                            ))}

                            <button className="paging-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || totalPages === 0}>
                                <ChevronRight size={16}/>
                            </button>
                            <button className="paging-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages || totalPages === 0}>
                                <ChevronRight size={16}/><ChevronRight size={16} style={{marginLeft:'-8px'}}/>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* --- 입력/수정 모달 --- */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ width: '750px' }}>
                        <div className="modal-header">
                            <h3>담당자 정보 {formData.contactId === 0 ? '등록' : '수정'}</h3>
                            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="input-table">
                                <colgroup>
                                    <col width="15%" /><col width="35%" /><col width="15%" /><col width="35%" />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th>고객사 <span className="req">*</span></th>
                                        <td colSpan={3}>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <input 
                                                    className="form-input" 
                                                    value={formData.custNm} 
                                                    readOnly 
                                                    placeholder="고객사를 선택하세요" 
                                                    style={{ backgroundColor: '#1e293b', flex: 1 }} 
                                                />
                                                <button className="btn-secondary" onClick={() => openCustSearch('FORM')}>
                                                    <Search size={14} /> 찾기
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>담당자명 <span className="req">*</span></th>
                                        <td colSpan={3}>
                                            <input 
                                                className="form-input" 
                                                value={formData.contactNm} 
                                                onChange={(e) => setFormData({...formData, contactNm: e.target.value})} 
                                            />
                                        </td>
                                        
                                    </tr>
                                    <tr>
                                        <th>부서명</th>
                                        <td>
                                            <input 
                                                className="form-input" 
                                                value={formData.deptNm || ''} 
                                                onChange={(e) => setFormData({...formData, deptNm: e.target.value})} 
                                            />
                                        </td>
                                        <th>직책/직급</th>
                                        <td>
                                            <input 
                                                className="form-input" 
                                                value={formData.dutyNm || ''} 
                                                onChange={(e) => setFormData({...formData, dutyNm: e.target.value})} 
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>휴대폰</th>
                                        <td>
                                            <input 
                                                className="form-input" 
                                                value={formData.mobileNo || ''} 
                                                onChange={(e) => setFormData({...formData, mobileNo: e.target.value})} 
                                            />
                                        </td>
                                        <th>이메일</th>
                                        <td>
                                            <input 
                                                className="form-input" 
                                                value={formData.email || ''} 
                                                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>대표 담당자</th>
                                        <td>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={formData.isMain === 'Y'} 
                                                    onChange={(e) => setFormData({...formData, isMain: e.target.checked ? 'Y' : 'N'})} 
                                                />
                                                대표 담당자로 지정
                                            </label>
                                        </td>
                                        <th>사용여부</th>
                                        <td>
                                            <select 
                                                className="form-input" 
                                                value={formData.isActive} 
                                                onChange={(e) => setFormData({...formData, isActive: e.target.value})}
                                            >
                                                <option value="Y">사용</option>
                                                <option value="N">미사용</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>비고</th>
                                        <td colSpan={3}>
                                            <textarea 
                                                className="form-input" 
                                                rows={3} 
                                                style={{ height: '80px', paddingTop: '8px' }}
                                                value={formData.note || ''} 
                                                onChange={(e) => setFormData({...formData, note: e.target.value})} 
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="btn-group">
                            <div className="btn-action-group">
                                <button className="btn-secondary" onClick={() => setShowModal(false)}>
                                    <X size={14} /> 취소
                                </button>
                                <button className="btn-primary" onClick={handleSave}>
                                    <Save size={14} /> 저장
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- 고객사 검색 모달 컴포넌트 --- */}
            <CustomerSearchModal 
                isOpen={showCustSearch} 
                onClose={() => setShowCustSearch(false)} 
                onSelect={handleCustSelect} 
            />
            {/* ✨ 1단계: 역할관리 모달 연결 (이 코드가 들어가야 경고가 사라집니다) [cite: 2026-01-30] */}
            {showRoleModal && (
                <ContactRoleModal 
                    isOpen={showRoleModal}
                    onClose={() => setShowRoleModal(false)}
                    contactId={selectedContactId}
                    contactName={selectedContactName}
                />
            )}

            {/* ✨ 이 부분이 추가되어야 6133 에러가 해결됩니다. */}
            {showSiteModal && (
                <ContactSiteModal 
                    isOpen={showSiteModal}
                    onClose={() => setShowSiteModal(false)}
                    contactId={selectedContactId}
                    contactName={selectedContactName}
                    customerId={selectedCustId}
                />
            )}

        </div>
    );
};

export default ContactManagement;