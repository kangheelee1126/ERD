import React, { useState, useEffect } from 'react';
/* ✨ [추가] 페이징 아이콘 및 검색 아이콘 임포트 */
import { Briefcase, Search, List, Plus, Edit, Trash2, X, Save, ChevronLeft, ChevronRight } from 'lucide-react';

/* ✨ [추가] 직원 검색 모달 임포트 */
import EmployeeSearchModal from '../../components/modals/EmployeeSearchModal';

import { CustomerService, type Customer, type CommonCode } from '../../services/CustomerService';
import './CustomerManagement.css';

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // ✨ 직원 검색 팝업 상태 관리
  const [showEmpSearch, setShowEmpSearch] = useState(false);

  // 페이징 관련 상태
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  const pageGroup = Math.ceil(page / 10);
  const lastPage = Math.min(totalPages, pageGroup * 10);
  const firstPage = Math.max(1, (pageGroup - 1) * 10 + 1);

  // 공통코드 상태
  const [codes, setCodes] = useState<{
    custType: CommonCode[],
    industry: CommonCode[],
    mfgType: CommonCode[],
    devCapability: CommonCode[]
  }>({
    custType: [], industry: [], mfgType: [], devCapability: []
  });

  // ✨ [수정] 초기값에 담당 영업 필드(salesEmpId, salesEmpNm) 추가
  // (TS 인터페이스 에러가 날 경우 Customer 인터페이스에도 필드를 추가해야 합니다)
  const initialCust: any = {
    customerId: 0, custCd: '', custNm: '', custNmEn: '', 
    custTypeCd: '', industryCd: '', mfgTypeCd: '', devCapabilityCd: '', 
    sourceModYn: 'N', bizNo: '', telNo: '', zipCd: '', addr1: '', addr2: '', 
    timezoneCd: 'Asia/Seoul', comments: '', sortNo: 1, useYn: 'Y',
    salesEmpId: '', salesEmpNm: '' // ✨ 추가됨
  };
  const [cust, setCust] = useState<any>(initialCust);

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
      } catch (error) {
        console.error("데이터 초기화 실패:", error);
      }
    };
    initData();
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [page, pageSize]); 

  const loadCustomers = async () => {
    try {
      const result: any = await CustomerService.getCustomers(page, pageSize, searchTerm);
      
      if (Array.isArray(result)) {
         setCustomers(result);
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

  const handleSearch = () => {
    setPage(1);
    loadCustomers();
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPage(1);
  };

  const openModal = async (id: number = 0) => {
    if (id > 0) {
      try {
        const data = await CustomerService.getCustomer(id);
        setCust(data);
      } catch (error) {
        console.error("상세 조회 실패:", error);
        alert("데이터를 불러오지 못했습니다.");
        return;
      }
    } else {
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

  // ✨ [추가] 담당 영업 선택 핸들러
  const handleSalesEmpSelect = (emp: any) => {
    setCust({ 
        ...cust, 
        salesEmpId: emp.empId, // DB 저장용
        salesEmpNm: emp.empNm  // 화면 표시용
    });
    setShowEmpSearch(false);
  };

  const getCodeName = (list: CommonCode[], code?: string) => {
    if (!code) return '-';
    const found = list.find(c => c.code === code);
    return found ? found.name : code;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-title"><Briefcase size={24} color="var(--primary-color)" /> 고객사 정보 관리</div>
      </div>

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
        <button className="btn-search" onClick={handleSearch}><Search size={14} /> 조회</button>
      </div>

      <div className="content-body section">
        <div className="part-header">
          <div className="header-left">
            <List size={16} /> 
            <span className="part-title">고객사 리스트</span>
            <span style={{fontSize: '0.85rem', color: '#94a3b8', marginLeft: '8px', fontWeight: 'normal'}}>
              (총 {totalCount}건)
            </span>
          </div>
          <div className="header-right" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
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
                {/* ✨ 담당 영업 컬럼 추가 */}
                <th className="cm-th center" style={{ width: '100px' }}>담당 영업</th>
                <th className="cm-th center" style={{ width: '120px' }}>구분</th>
                <th className="cm-th center" style={{ width: '120px' }}>산업군</th>
                <th className="cm-th center" style={{ width: '70px' }}>사용</th>
                <th className="cm-th center" style={{ width: '80px' }}>수정</th>
                <th className="cm-th center" style={{ width: '80px' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: any, idx) => (
                <tr key={c.customerId}>
                  <td className="cm-td center">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="cm-td center highlight-text">{c.custCd}</td>
                  <td className="cm-td left" title={c.custNm}>{c.custNm}</td>
                  {/* ✨ 담당 영업 데이터 바인딩 */}
                  <td className="cm-td center">{c.salesEmpNm || '-'}</td>
                  <td className="cm-td center">{getCodeName(codes.custType, c.custTypeCd)}</td>
                  <td className="cm-td center">{getCodeName(codes.industry, c.industryCd)}</td>
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

            <button className="paging-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
                <ChevronRight size={16}/>
            </button>
            <button className="paging-btn" onClick={() => setPage(totalPages)} disabled={page === totalPages}>
                <ChevronRight size={16}/><ChevronRight size={16} style={{marginLeft:'-8px'}}/>
            </button>
        </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ width: '700px' }}>
            <div className="modal-header">
                <h3>고객사 정보 {cust.customerId === 0 ? '등록' : '수정'}</h3>
                <button className="modal-close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            
            <div className="modal-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              <table className="input-table">
                <tbody>
                  <tr>
                    <th>고객사 코드 <span className="req">*</span></th>
                    <td><input className="form-input" value={cust.custCd} onChange={(e) => setCust({...cust, custCd: e.target.value})} readOnly={cust.customerId !== 0} placeholder="예: CUST-001" /></td>
                    <th>고객사 명칭 <span className="req">*</span></th>
                    <td><input className="form-input" value={cust.custNm} onChange={(e) => setCust({...cust, custNm: e.target.value})} /></td>
                  </tr>
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
                  
                  {/* ✨ [수정] 사업자번호 옆에 '담당 영업' 배치 (중요 정보 격상) */}
                  <tr>
                    <th>사업자번호</th>
                    <td><input className="form-input" value={cust.bizNo || ''} onChange={(e) => setCust({...cust, bizNo: e.target.value})} /></td>
                    
                    {/* ✨ 담당 영업 검색 필드 */}
                    <th>담당 영업</th>
                    <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                            <input 
                                className="form-input" 
                                style={{ flex: 1, backgroundColor: '#1e293b', cursor: 'default' }} 
                                value={cust.salesEmpNm || ''} 
                                readOnly 
                                placeholder="담당 영업 선택" 
                                onClick={() => setShowEmpSearch(true)} // 클릭 시 팝업 오픈
                            />
                            <button className="btn-secondary" onClick={() => setShowEmpSearch(true)} style={{ padding: '0 8px' }}>
                                <Search size={14} />
                            </button>
                            {/* 선택 해제 버튼 (필요 시 사용) */}
                            {cust.salesEmpId && (
                                <button className="btn-secondary" onClick={() => setCust({...cust, salesEmpId: '', salesEmpNm: ''})} title="초기화" style={{ padding: '0 8px' }}>
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </td>
                  </tr>

                  {/* ✨ 대표전화를 한 줄 아래로 이동 */}
                  <tr>
                    <th>대표전화</th>
                    <td><input className="form-input" value={cust.telNo || ''} onChange={(e) => setCust({...cust, telNo: e.target.value})} /></td>
                    <th>사용여부</th>
                    <td>
                      <select className="form-input" value={cust.useYn} onChange={(e) => setCust({...cust, useYn: e.target.value})}>
                        <option value="Y">사용</option><option value="N">미사용</option>
                      </select>
                    </td>
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
                    {/* 빈 칸 채우기용 */}
                    <th></th><td></td>
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

      {/* ✨ [추가] 직원 검색 모달 컴포넌트 배치 */}
      {showEmpSearch && (
        <EmployeeSearchModal 
            onClose={() => setShowEmpSearch(false)} 
            onSelect={handleSalesEmpSelect} 
        />
      )}
    </div>
  );
};

export default CustomerManagement;