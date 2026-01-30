import React, { useState, useEffect } from 'react';
/* ✨ [추가] 페이징 아이콘(ChevronLeft, ChevronRight) 임포트 */
import { Briefcase, Search, List, Plus, Edit, Trash2, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';

import { CustomerService, type Customer, type CommonCode } from '../../services/CustomerService';

import './CustomerManagement.css';

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // ✨ [추가] 페이징 관련 상태
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); // 기본 10개
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 공통코드 상태
  const [codes, setCodes] = useState<{
    custType: CommonCode[],
    industry: CommonCode[],
    mfgType: CommonCode[],
    devCapability: CommonCode[]
  }>({
    custType: [], industry: [], mfgType: [], devCapability: []
  });

  // 초기값
  const initialCust: Customer = {
    customerId: 0, custCd: '', custNm: '', custNmEn: '', 
    custTypeCd: '', industryCd: '', mfgTypeCd: '', devCapabilityCd: '', 
    sourceModYn: 'N', bizNo: '', telNo: '', zipCd: '', addr1: '', addr2: '', 
    timezoneCd: 'Asia/Seoul', comments: '', sortNo: 1, useYn: 'Y'
  };
  const [cust, setCust] = useState<Customer>(initialCust);

  // 초기 데이터 로드 (공통코드)
  useEffect(() => {
    const initData = async () => {
      try {
        const [custTypeData, industryData, mfgTypeData, devData] = await Promise.all([
          CustomerService.getCommonCodes('CUST_TYPE'),
          CustomerService.getCommonCodes('INDUSTRY'),
          CustomerService.getCommonCodes('MFG_TYPE'),
          CustomerService.getCommonCodes('DEV_CAPABILITY')
        ]);
        
        setCodes({
          custType: custTypeData,
          industry: industryData,
          mfgType: mfgTypeData,
          devCapability: devData
        });

        // 초기 로드는 useEffect([page, pageSize])가 처리하므로 여기서는 제거해도 되지만, 
        // 명시적으로 호출하려면 아래 useEffect가 돌기 때문에 생략 가능합니다.
      } catch (error) {
        console.error("데이터 초기화 실패:", error);
      }
    };
    initData();
  }, []);

  // ✨ [수정] 페이지나 사이즈가 변경되면 자동 조회
  useEffect(() => {
    loadCustomers();
  }, [page, pageSize]); 

  // ✨ [수정] 데이터 조회 함수 (페이징 파라미터 전달)
  const loadCustomers = async () => {
    try {
      // 백엔드가 PagedResult<Customer> { items, totalCount, totalPages... } 형태로 반환한다고 가정
      // 만약 에러가 난다면 service/CustomerService.ts의 리턴 타입을 확인하세요.
      const result: any = await CustomerService.getCustomers(page, pageSize, searchTerm);
      
      // result가 배열이면(구버전 API) 배열 그대로, 객체면 items 추출
      if (Array.isArray(result)) {
         setCustomers(result);
         // 배열인 경우 페이징 처리가 안된 상태임
      } else {
         setCustomers(result.items || []);
         setTotalCount(result.totalCount || 0);
         setTotalPages(result.totalPages || 0);
      }
    } catch (error) {
      console.error("목록 조회 실패:", error);
      setCustomers([]);
    }
  };

  // ✨ [추가] 검색 실행 (페이지를 1로 초기화)
  const handleSearch = () => {
    setPage(1);
    loadCustomers(); // page가 1인 상태에서 다시 검색어 적용 조회
  };

  // ✨ [추가] 페이지 사이즈 변경 핸들러
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1); // 사이즈 변경 시 1페이지로 리셋
  };

  const openModal = async (id: number = 0) => {
    if (id > 0) {
      // [수정 모드] 서버에서 최신 데이터 조회
      try {
        const data = await CustomerService.getCustomer(id);
        setCust(data); // 조회된 데이터로 폼 채우기
      } catch (error) {
        console.error("상세 조회 실패:", error);
        alert("데이터를 불러오지 못했습니다.");
        return; // 창 띄우지 않음
      }
    } else {
      // [신규 모드] 초기화
      setCust({ ...initialCust });
    }
    
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!cust.custCd || !cust.custNm) {
      alert("고객사 코드와 명칭은 필수입니다.");
      return;
    }
    try {
      await CustomerService.saveCustomer(cust);
      alert("저장되었습니다.");
      setShowModal(false);
      loadCustomers();
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await CustomerService.deleteCustomer(id);
        loadCustomers();
      } catch (error) {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const getCodeName = (list: CommonCode[], code?: string) => {
    if (!code) return '-';
    const found = list.find(c => c.code === code);
    return found ? found.name : code;
  };

  return (
    <div className="page-container">
      {/* 헤더 */}
      <div className="page-header">
        <div className="header-title"><Briefcase size={24} color="var(--primary-color)" /> 고객사 정보 관리</div>
      </div>

      {/* 검색 */}
      <div className="filter-bar">
        <div className="filter-item">
          <label>검색어</label>
          <input 
            type="text" className="filter-input" 
            placeholder="코드 또는 명칭" 
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} 
          />
        </div>
        {/* ✨ onClick을 handleSearch로 변경 */}
        <button className="btn-search" onClick={handleSearch}><Search size={14} /> 조회</button>
      </div>

      {/* 그리드 영역 */}
      <div className="content-body section">
        <div className="part-header">
          <div className="header-left">
            <List size={16} /> 
            <span className="part-title">고객사 리스트</span>
            {/* ✨ 총 건수 표시 */}
            <span style={{fontSize: '0.85rem', color: '#94a3b8', marginLeft: '8px', fontWeight: 'normal'}}>
              (총 {totalCount}건)
            </span>
          </div>
          <div className="header-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {/* ✨ 페이지 사이즈 선택 Select Box */}
            <select 
                className="form-input" 
                style={{ width: '100px', height: '40px', cursor: 'pointer' }}
                value={pageSize} 
                onChange={handlePageSizeChange}
            >
                <option value={10}>10개씩</option>
                <option value={50}>50개씩</option>
                <option value={100}>100개씩</option>
            </select>
            <button className="btn-primary" onClick={() => openModal()}><Plus size={14} /> 신규</button>
          </div>
        </div>

        <div className="part-body">
          <table className="cust-mgmt-table">
            <thead>
              <tr>
                <th className="cm-th center" style={{ width: '50px' }}>No</th>
                <th className="cm-th center" style={{ width: '110px' }}>코드</th>
                <th className="cm-th center">고객사 명칭</th>
                <th className="cm-th center" style={{ width: '150px' }}>구분</th>
                <th className="cm-th center" style={{ width: '150px' }}>산업군</th>
                <th className="cm-th center" style={{ width: '100px' }}>역량</th>
                <th className="cm-th center" style={{ width: '70px' }}>사용</th>
                <th className="cm-th center" style={{ width: '80px' }}>수정</th>
                <th className="cm-th center" style={{ width: '80px' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, idx) => (
                <tr key={c.customerId}>
                  {/* ✨ No 계산: (현재페이지-1)*페이지사이즈 + 인덱스 + 1 */}
                  <td className="cm-td center">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="cm-td center highlight-text">{c.custCd}</td>
                  <td className="cm-td left" title={c.custNm}>{c.custNm}</td>
                  <td className="cm-td center">{getCodeName(codes.custType, c.custTypeCd)}</td>
                  <td className="cm-td center">{getCodeName(codes.industry, c.industryCd)}</td>
                  <td className="cm-td center">{getCodeName(codes.devCapability, c.devCapabilityCd)}</td>
                  <td className="cm-td center">
                    <span className={c.useYn === 'Y' ? 'status-blue' : 'status-red'}>{c.useYn === 'Y' ? '사용' : '미사용'}</span>
                  </td>
                  <td className="cm-td center">
                    <button className="cm-btn edit" onClick={() => openModal(c.customerId)}>
                    <Edit size={14} /> 수정
                    </button>
                  </td>
                  <td className="cm-td center">
                    <button className="cm-btn delete" onClick={() => handleDelete(c.customerId)}>
                      <Trash2 size={14} /> 삭제
                    </button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && <tr><td colSpan={9} className="cm-td center" style={{ padding: '20px' }}>데이터가 없습니다.</td></tr>}
            </tbody>
          </table>

          {/* ✨ 페이지네이션 컨트롤 (하단) */}
          {totalPages > 0 && (
            <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '15px', gap: '5px' }}>
              {/* 이전 버튼 */}
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="paging-btn"
                style={{ padding: '5px 8px', background: '#334155', border: '1px solid #475569', color: 'white', borderRadius: '4px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
              >
                <ChevronLeft size={16} />
              </button>

              {/* 페이지 번호 (간단 구현: 전체 페이지 나열) */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                // 페이지가 많을 경우 여기서 slice 로직 추가 가능 (예: 1~10까지만 표시)
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    padding: '5px 12px',
                    background: page === pageNum ? '#3b82f6' : '#334155', // 현재 페이지 강조
                    border: page === pageNum ? '1px solid #3b82f6' : '1px solid #475569',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    minWidth: '32px'
                  }}
                >
                  {pageNum}
                </button>
              ))}

              {/* 다음 버튼 */}
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="paging-btn"
                style={{ padding: '5px 8px', background: '#334155', border: '1px solid #475569', color: 'white', borderRadius: '4px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 팝업 모달 (기존 코드 유지) */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '700px' }}>
            {/* ... 모달 내용은 변경 없음 ... */}
            <div className="modal-header">
                <h3>고객사 정보 {cust.customerId === 0 ? '등록' : '수정'}</h3>
                <button className="modal-close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '600px' }}>
              <table className="input-table">
                <tbody>
                  <tr>
                    <th>고객사 코드 <span className="req">*</span></th>
                    <td><input className="form-input" value={cust.custCd} onChange={(e) => setCust({...cust, custCd: e.target.value})} readOnly={cust.customerId !== 0} placeholder="예: CUST-001" /></td>
                    <th>고객사 명칭 <span className="req">*</span></th>
                    <td><input className="form-input" value={cust.custNm} onChange={(e) => setCust({...cust, custNm: e.target.value})} /></td>
                  </tr>
                  {/* ... 나머지 입력 필드들 ... */}
                  <tr>
                    <th>영문명</th>
                    <td><input className="form-input" value={cust.custNmEn || ''} onChange={(e) => setCust({...cust, custNmEn: e.target.value})} /></td>
                    <th>고객구분</th>
                    <td>
                      <select className="form-input" value={cust.custTypeCd || ''} onChange={(e) => setCust({...cust, custTypeCd: e.target.value})}>
                        <option value="">선택</option>
                        {codes.custType.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>산업군</th>
                    <td>
                      <select className="form-input" value={cust.industryCd || ''} onChange={(e) => setCust({...cust, industryCd: e.target.value})}>
                        <option value="">선택</option>
                        {codes.industry.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </td>
                    <th>제조형태</th>
                    <td>
                      <select className="form-input" value={cust.mfgTypeCd || ''} onChange={(e) => setCust({...cust, mfgTypeCd: e.target.value})}>
                        <option value="">선택</option>
                        {codes.mfgType.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>개발역량</th>
                    <td>
                      <select className="form-input" value={cust.devCapabilityCd || ''} onChange={(e) => setCust({...cust, devCapabilityCd: e.target.value})}>
                        <option value="">선택</option>
                        {codes.devCapability.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                      </select>
                    </td>
                    <th>소스변경여부</th>
                    <td>
                      <select className="form-input" value={cust.sourceModYn} onChange={(e) => setCust({...cust, sourceModYn: e.target.value})}>
                        <option value="N">N</option><option value="Y">Y</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>사업자번호</th>
                    <td><input className="form-input" value={cust.bizNo || ''} onChange={(e) => setCust({...cust, bizNo: e.target.value})} /></td>
                    <th>대표전화</th>
                    <td><input className="form-input" value={cust.telNo || ''} onChange={(e) => setCust({...cust, telNo: e.target.value})} /></td>
                  </tr>
                  <tr>
                    <th>주소</th>
                    <td colSpan={3}>
                        <div style={{display:'flex', gap:'5px', marginBottom:'5px'}}>
                            <input className="form-input" style={{width:'100px'}} placeholder="우편번호" value={cust.zipCd || ''} onChange={(e) => setCust({...cust, zipCd: e.target.value})} />
                            <input className="form-input" placeholder="기본주소" value={cust.addr1 || ''} onChange={(e) => setCust({...cust, addr1: e.target.value})} />
                        </div>
                        <input className="form-input" placeholder="상세주소" value={cust.addr2 || ''} onChange={(e) => setCust({...cust, addr2: e.target.value})} />
                    </td>
                  </tr>
                  <tr>
                    <th>운영 메모</th>
                    <td colSpan={3}><textarea className="form-input" rows={3} value={cust.comments || ''} onChange={(e) => setCust({...cust, comments: e.target.value})} /></td>
                  </tr>
                  <tr>
                    <th>정렬순서</th>
                    <td><input type="number" className="form-input" value={cust.sortNo} onChange={(e) => setCust({...cust, sortNo: Number(e.target.value)})} /></td>
                    <th>사용여부</th>
                    <td>
                      <select className="form-input" value={cust.useYn} onChange={(e) => setCust({...cust, useYn: e.target.value})}>
                        <option value="Y">사용</option><option value="N">미사용</option>
                      </select>
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
    </div>
  );
};

export default CustomerManagement;