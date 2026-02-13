/**
 * 파일명: MaintContractMgt.tsx
 * 경로: src/pages/business/contract/MaintContractMgt.tsx
 * 설명: 유지관리 계약 정보 관리 메인 화면
 * - 경로 수정: ./../../components/modals/
 * - 주석 추가: 모달 역할 설명 포함
 */

import { useState } from 'react';
import { FileText, Search, Plus, Edit, Trash2, List, Clock, MapPin, X } from 'lucide-react';

// [수정] 모달 컴포넌트 경로 변경 (요청사항 반영)
import MaintContractModal from './../../components/modals/MaintContractModal';  // 계약 정보 팝업
import CustomerSearchModal from './../../components/modals/CustomerSearchModal'; //고객 정보 팝업

// 공통 스타일 임포트
import './../../style/layout.css'; 

const MaintContractMgt = () => {
  // --- State 관리 ---
  const [searchParams, setSearchParams] = useState({
    custId: undefined as number | undefined,
    custNm: '',
    statusCd: 'ALL'
  });
  const [pageSize, setPageSize] = useState(10);
  const [activeTab, setActiveTab] = useState('SITE'); // SITE(사업장) or HIST(이력)
  const [selectedContId, setSelectedContId] = useState<number | null>(null);
  
  // --- 모달 표시 상태 (Visibility State) ---
  
  /**
   * 계약 등록/수정 팝업 상태
   * - 신규 등록 시: selectedContId = null
   * - 수정 시: selectedContId = 계약 ID
   */
  const [isModalOpen, setIsModalOpen] = useState(false);

  /**
   * 고객사 검색 팝업 상태 (검색 필터용)
   * - 필터 영역의 돋보기 아이콘 클릭 시 활성화
   */
  const [showCustSearch, setShowCustSearch] = useState(false);


  // --- 이벤트 핸들러 ---

  // 1. 조회
  const handleSearch = () => {
    console.log("조회 실행:", searchParams);
    // TODO: API 호출 로직
  };

  // 2. 계약 등록/수정 모달 열기
  const handleOpenModal = (contId: number | null = null) => {
    setSelectedContId(contId);
    setIsModalOpen(true);
  };

  // 3. 삭제
  const handleDelete = (contId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      alert("삭제되었습니다.");
    }
  };

  // 4. 고객사 필터 초기화 (X 버튼)
  const clearCustFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchParams(prev => ({ ...prev, custId: undefined, custNm: '' }));
  };

  return (
    <div className="page-container">
      {/* 1. 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', color: 'var(--text-main)' }}>
        <FileText size={20} style={{ marginRight: '8px', color: 'var(--primary-color)' }} />
        <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0 }}>유지관리 계약 정보 관리</h2>
      </div>

      {/* 2. 검색 필터 영역 */}
      <div className="section" style={{ padding: '15px', flexDirection: 'row', alignItems: 'center', gap: '20px', flex: 'none' }}>
        
        {/* 고객사 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '50px' }}>고객사</label>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
                <input 
                    type="text" 
                    value={searchParams.custNm}
                    placeholder="전체 고객사"
                    readOnly
                    onClick={() => setShowCustSearch(true)}
                    style={{ 
                        width: '180px', cursor: 'pointer', backgroundColor: '#1e293b', 
                        paddingRight: '30px', border: '1px solid var(--border-color)', 
                        borderRadius: '4px', color: 'var(--text-main)', padding: '6px 30px 6px 10px'
                    }} 
                />
                {searchParams.custId && (
                    <button 
                        onClick={clearCustFilter}
                        style={{
                            position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)'
                        }}
                    >
                        <X size={14} />
                    </button>
                )}
            </div>
            <button className="cm-btn" onClick={() => setShowCustSearch(true)} style={{ padding: '0 8px', height: '34px', background: 'var(--bg-header)', border: '1px solid var(--border-color)' }}>
                <Search size={14} color="var(--text-muted)"/>
            </button>
          </div>
        </div>

        {/* 상태 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>상태</label>
          <select 
            style={{ width: '120px', padding: '6px', backgroundColor: '#1e293b', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px' }}
            value={searchParams.statusCd}
            onChange={(e) => setSearchParams({...searchParams, statusCd: e.target.value})}
          >
            <option value="ALL">전체</option>
            <option value="NORMAL">정상</option>
            <option value="EXPIRED">만료</option>
            <option value="TERMINATED">해지</option>
          </select>
        </div>

        {/* Spacer: 버튼을 우측 끝으로 밀기 */}
        <div style={{ flex: 1 }}></div>

        {/* 조회 버튼 */}
        <button 
          className="cm-btn btn-primary btn-lg" 
          onClick={handleSearch} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '5px', 
            padding: '6px 20px',
            borderRadius: '4px', color: 'white', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 'bold'
          }}
        >
          <Search size={16} /> 조회
        </button>
      </div>

      {/* 3. 메인 그리드 섹션 */}
      <div className="section" style={{ flex: '1.5', minHeight: '0', display: 'flex', flexDirection: 'column' }}>
        <div className="part-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <List size={16} /> 계약 목록 <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>(총 120건)</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <select 
                style={{ height: '36px', padding: '0 8px', fontSize: '0.85rem', borderColor: 'var(--border-color)', borderRadius: '4px', backgroundColor: 'var(--bg-input)', color: 'var(--text-main)' }}
                value={pageSize} 
                onChange={(e) => setPageSize(Number(e.target.value))}
              >
                <option value={10}>10개씩</option>
                <option value={50}>50개씩</option>
                <option value={100}>100개씩</option>
              </select>
              
              <button 
                className="cm-btn btn-primary btn-lg"
                onClick={() => handleOpenModal(null)}
                style={{ 
                    height: '36px', 
                    padding: '0 20px', 
                    fontSize: '0.9rem', 
                    fontWeight: 'bold',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                <Plus size={16} /> 신규등록
              </button>
          </div>
        </div>
        
        <div className="part-body" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
          <table className="standard-table" style={{ width: '100%', tableLayout: 'fixed' }}>
            <colgroup>
                <col width="60" />
                <col width="180" />
                <col width="*" />
                <col width="100" />
                <col width="180" />
                <col width="120" />
                <col width="100" />
                <col width="80" />
                <col width="140" />
            </colgroup>
            <thead>
              <tr>
                <th>No</th>
                <th>고객사</th>
                <th>계약명</th>
                <th>계약범위</th>
                <th>계약기간</th>
                <th>계약금액</th>
                <th>잔여공수</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="center">1</td>
                <td className="center">한국교통안전공단</td>
                <td style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>2026년 통합 유지보수</td>
                <td className="center">통합</td>
                <td className="center">2026-01-01 ~ 2026-12-31</td>
                <td style={{ textAlign: 'right' }}>50,000,000</td>
                <td style={{ textAlign: 'right', color: 'var(--primary-color)', fontWeight: 'bold' }}>120.5H</td>
                <td className="center" style={{ color: 'var(--primary-color)' }}>정상</td>
                <td className="center">
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                    <button onClick={() => handleOpenModal(1)} style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '4px 8px', borderRadius: '4px', color: 'var(--text-main)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                      <Edit size={12} /> 수정
                    </button>
                    <button onClick={() => handleDelete(1)} style={{ background: 'transparent', border: '1px solid var(--danger-color)', padding: '4px 8px', borderRadius: '4px', color: 'var(--danger-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                      <Trash2 size={12} /> 삭제
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. 하단 탭 섹션 */}
      <div className="section" style={{ flex: '1', minHeight: '0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', borderBottom: 'var(--border-style)', background: 'rgba(255,255,255,0.03)' }}>
          <button onClick={() => setActiveTab('SITE')} style={{ padding: '10px 16px', background: activeTab === 'SITE' ? 'var(--bg-card)' : 'transparent', color: activeTab === 'SITE' ? 'var(--primary-color)' : 'var(--text-muted)', border: 'none', borderTop: activeTab === 'SITE' ? '2px solid var(--primary-color)' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <MapPin size={14} /> 계약 대상 사업장
          </button>
          <button onClick={() => setActiveTab('HIST')} style={{ padding: '10px 16px', background: activeTab === 'HIST' ? 'var(--bg-card)' : 'transparent', color: activeTab === 'HIST' ? 'var(--primary-color)' : 'var(--text-muted)', border: 'none', borderTop: activeTab === 'HIST' ? '2px solid var(--primary-color)' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
            <Clock size={14} /> 계약 변경 이력
          </button>
        </div>
        
        <div className="part-body" style={{ padding: 0, flex: 1, overflow: 'auto' }}>
            {activeTab === 'SITE' ? (
                <table className="standard-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                    <colgroup>
                        <col width="60" />  {/* No */}
                        <col width="30%" /> {/* 사업장명 */}
                        <col width="150" /> {/* 배정 금액 */}
                        <col width="*" />   {/* 특이사항 */}
                    </colgroup>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>사업장명</th>
                            <th>배정 금액</th>
                            <th>특이사항</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan={4} className="center" style={{ padding: '20px', color: 'var(--text-muted)' }}>데이터가 없습니다.</td></tr>
                    </tbody>
                </table>
            ) : (
                <table className="standard-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                    <colgroup>
                        <col width="60" />
                        <col width="180" />
                        <col width="*" />
                        <col width="150" />
                        <col width="100" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>변경일시</th>
                            <th>변경사유</th>
                            <th>당시 금액</th>
                            <th>처리자</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr><td colSpan={5} className="center" style={{ padding: '20px', color: 'var(--text-muted)' }}>변경 이력이 없습니다.</td></tr>
                    </tbody>
                </table>
            )}
        </div>
      </div>

      {/* --- 모달 컴포넌트 렌더링 영역 --- */}

      {/* [1] 유지관리 계약 등록/수정 팝업 
        - isModalOpen이 true일 때만 렌더링
        - selectedContId가 있으면 수정 모드, 없으면(null) 신규 등록 모드
      */}
      {isModalOpen && (
        <MaintContractModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            contId={selectedContId} 
        />
      )}

      {/* [2] 고객사 검색 팝업 (검색 필터용)
        - 상단 검색바에서 고객사 찾기(돋보기) 클릭 시 호출됨
        - 선택된 고객사 정보를 searchParams에 반영
      */}
      <CustomerSearchModal 
        isOpen={showCustSearch} 
        onClose={() => setShowCustSearch(false)} 
        onSelect={(c) => setSearchParams(p => ({...p, custId: c.customerId, custNm: c.custNm}))} 
      />
    </div>
  );
};

export default MaintContractMgt;