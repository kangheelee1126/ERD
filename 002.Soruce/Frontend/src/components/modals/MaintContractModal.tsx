/**
 * 파일명: MaintContractModal.tsx
 * 경로: src/components/modals/MaintContractModal.tsx
 * 설명: 유지관리 계약 정보 등록 및 수정 팝업
 * - 수정: style 속성 순서 변경 (...inputStyle을 앞으로 이동하여 중복 속성 오류 해결)
 */

import { useState } from 'react';
import { X, Save, Trash2, CheckCircle, Search, Plus, MapPin, FileText } from 'lucide-react';

import CustomerSearchModal from './CustomerSearchModal'; 
import ContractSiteRegModal from './ContractSiteRegModal'; 
import './../../style/layout.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contId: number | null;
}

const MaintContractModal = ({ isOpen, onClose, contId }: Props) => {
  const [showCustSearch, setShowCustSearch] = useState(false);
  const [showSiteReg, setShowSiteReg] = useState(false);

  const [formData, setFormData] = useState({
      custId: 0, custNm: '', statusCd: 'NORMAL', contAmt: 0
  });

  const [siteList, setSiteList] = useState<any[]>([]);

  if (!isOpen) return null;
  const isEditMode = contId !== null;

  // 공통 인풋 스타일
  const inputStyle = {
    width: '100%', padding: '6px 8px', backgroundColor: 'var(--bg-input)',
    border: 'var(--border-style)', color: 'var(--text-main)', borderRadius: '4px', fontSize: '0.85rem', outline: 'none'
  };

  // --- 이벤트 핸들러 ---
  const handleOpenSiteReg = () => {
    if (!formData.custId) {
      alert("먼저 고객사를 선택해주세요.");
      return;
    }
    setShowSiteReg(true);
  };

  const handleSiteSelect = (selectedSites: any[]) => {
    const newSites = selectedSites.filter(
        newItem => !siteList.some(existItem => existItem.siteId === newItem.siteId)
    ).map(item => ({
        ...item,
        amount: 0, 
        note: '' 
    }));

    if (newSites.length === 0 && selectedSites.length > 0) {
        alert("이미 등록된 사업장입니다.");
    } else {
        setSiteList([...siteList, ...newSites]);
    }
  };

  const handleSiteChange = (index: number, field: string, value: any) => {
    const newList = [...siteList];
    newList[index][field] = value;
    setSiteList(newList);
  };

  const handleRemoveSite = (index: number) => {
    setSiteList(siteList.filter((_, i) => i !== index));
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
    }}>
      <div className="section" style={{ width: '1100px', maxHeight: '95vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
        
        {/* 헤더 */}
        <div className="part-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-header)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
            <CheckCircle size={18} color="var(--primary-color)" />
            <span>{isEditMode ? '유지관리 계약 정보 수정' : '유지관리 계약 정보 등록'}</span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* 바디 */}
        <div className="part-body" style={{ overflowY: 'auto', padding: '15px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* [섹션 1] 기본 정보 */}
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={16} /> 기본 정보
            </h3>
            <table className="form-table">
                <colgroup>
                    <col style={{ width: '120px' }} /><col /><col style={{ width: '120px' }} /><col />
                </colgroup>
                <tbody>
                <tr>
                    <th>고객사 <span style={{ color: 'var(--danger-color)' }}>*</span></th>
                    <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <input 
                            type="text" 
                            placeholder="고객사를 선택하세요" 
                            value={formData.custNm} 
                            readOnly 
                            onClick={() => setShowCustSearch(true)} 
                            // [수정] ...inputStyle을 맨 앞으로 이동하여 개별 스타일(backgroundColor)이 우선 적용되도록 함
                            style={{ ...inputStyle, flex: 1, backgroundColor: '#1e293b', cursor: 'pointer' }} 
                        />
                        <button onClick={() => setShowCustSearch(true)} style={{ padding: '0 12px', background: 'var(--primary-color)', border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', fontSize: '0.8rem' }}>찾기</button>
                    </div>
                    </td>
                    <th>담당 영업</th>
                    <td><select style={inputStyle}><option value="">선택하세요</option></select></td>
                </tr>
                <tr>
                    <th>계약 범위</th>
                    <td><select style={inputStyle}><option value="ALL">통합(전체)</option><option value="DIV">사업장별 구분</option></select></td>
                    <th>계약 상태</th>
                    <td><select style={inputStyle} value={formData.statusCd} onChange={(e) => setFormData({...formData, statusCd: e.target.value})}><option value="NORMAL">정상</option><option value="STOP">중지</option><option value="EXPIRED">만료</option></select></td>
                </tr>
                <tr>
                    <th>계약 체결일</th>
                    <td><input type="date" style={inputStyle} /></td>
                    <th>유지관리 기간 <span style={{ color: 'var(--danger-color)' }}>*</span></th>
                    <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input type="date" style={inputStyle} /> ~ <input type="date" style={inputStyle} />
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>계약 금액</th>
                    <td><input type="number" style={{ ...inputStyle, textAlign: 'right' }} placeholder="0" /></td>
                    <th>기준/이월 공수</th>
                    <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <input type="number" placeholder="기준" style={{ ...inputStyle, textAlign: 'right', width: '80px' }} /> + <input type="number" placeholder="이월" style={{ ...inputStyle, textAlign: 'right', width: '80px' }} />
                        </div>
                    </td>
                </tr>
                <tr>
                    <th style={{ color: 'var(--primary-color)' }}>현재 잔여 공수</th>
                    <td colSpan={3}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px'}}>
                        <input type="text" readOnly value="120.5" style={{ ...inputStyle, width: '150px', textAlign: 'right', fontWeight: 'bold', color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }} />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>* (기준 + 이월 - 사용) 자동 계산</span>
                        </div>
                    </td>
                </tr>
                <tr>
                    <th>비고</th>
                    <td colSpan={3}><input type="text" style={inputStyle} /></td>
                </tr>
                </tbody>
            </table>
          </div>

          {/* [섹션 2] 계약 대상 사업장 리스트 */}
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} /> 계약 대상 사업장
                </h3>
                
                <button 
                    onClick={handleOpenSiteReg}
                    style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '4px 10px', background: 'var(--bg-header)', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-main)', fontSize: '0.8rem', cursor: 'pointer' }}
                >
                    <Plus size={14} /> 사업장 등록
                </button>
            </div>

            <div style={{ border: 'var(--border-style)', borderRadius: '4px', overflow: 'hidden' }}>
                <table className="standard-table" style={{ width: '100%', tableLayout: 'fixed' }}>
                    <colgroup>
                        <col width="50" />
                        <col width="*" />
                        <col width="150" />
                        <col width="200" />
                        <col width="60" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>사업장명</th>
                            <th>배정 금액 (원)</th>
                            <th>특이사항</th>
                            <th>삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {siteList.length > 0 ? siteList.map((site, idx) => (
                            <tr key={idx}>
                                <td className="center">{idx + 1}</td>
                                <td className="center">{site.siteNm}</td>
                                <td className="center" style={{ padding: '4px' }}>
                                    <input 
                                        type="number" 
                                        value={site.amount} 
                                        onChange={(e) => handleSiteChange(idx, 'amount', e.target.value)}
                                        style={{ ...inputStyle, textAlign: 'right', background: 'transparent', border: '1px solid #475569' }} 
                                    />
                                </td>
                                <td className="center" style={{ padding: '4px' }}>
                                    <input 
                                        type="text" 
                                        value={site.note} 
                                        onChange={(e) => handleSiteChange(idx, 'note', e.target.value)}
                                        style={{ ...inputStyle, background: 'transparent', border: '1px solid #475569' }} 
                                    />
                                </td>
                                <td className="center">
                                    <button 
                                        onClick={() => handleRemoveSite(idx)} 
                                        style={{ background: 'none', border: 'none', color: 'var(--danger-color)', cursor: 'pointer' }}
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="center" style={{ padding: '20px', color: 'var(--text-muted)' }}>
                                    등록된 사업장이 없습니다. 우측 상단의 '사업장 등록' 버튼을 눌러주세요.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            
            <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                 배정 금액 합계: <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>
                    {siteList.reduce((acc, cur) => acc + Number(cur.amount || 0), 0).toLocaleString()} 원
                 </span>
            </div>
          </div>

          {isEditMode && (
             <div style={{ marginTop: '10px', padding: '12px', background: 'rgba(255,255,255,0.05)', border: 'var(--border-style)', borderRadius: '4px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--text-main)' }}>변경 사유 (이력 관리용)</label>
                <input type="text" placeholder="수정 사유를 입력하세요 (예: 계약 연장, 금액 조정)" style={inputStyle} />
             </div>
          )}

        </div>

        {/* 푸터 */}
        <div style={{ padding: '16px', borderTop: 'var(--border-style)', display: 'flex', justifyContent: 'flex-end', gap: '8px', background: 'rgba(255,255,255,0.02)' }}>
          {isEditMode && <button style={{ marginRight: 'auto', color: 'var(--danger-color)', background: 'transparent', border: '1px solid var(--danger-color)', padding: '6px 12px', borderRadius: '4px', display:'flex', alignItems:'center', gap:'5px', cursor:'pointer' }}><Trash2 size={14}/> 삭제</button>}
          <button onClick={onClose} style={{ padding: '6px 16px', background: 'transparent', border: 'var(--border-style)', color: 'var(--text-main)', borderRadius: '4px', cursor: 'pointer' }}>닫기</button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 16px', background: 'var(--primary-color)', border: 'none', color: 'white', borderRadius: '4px', cursor: 'pointer' }}><Save size={14} /> 저장</button>
        </div>

      </div>
      
      {/* 자식 모달들 */}
      <CustomerSearchModal 
        isOpen={showCustSearch} 
        onClose={() => setShowCustSearch(false)} 
        onSelect={(c) => {
            setFormData(p => ({...p, custId: c.customerId, custNm: c.custNm}));
            setSiteList([]); 
        }} 
      />
      
      <ContractSiteRegModal 
        isOpen={showSiteReg}
        onClose={() => setShowSiteReg(false)}
        custId={formData.custId}
        custNm={formData.custNm}
        onSelect={handleSiteSelect}
      />
    </div>
  );
};

export default MaintContractModal;