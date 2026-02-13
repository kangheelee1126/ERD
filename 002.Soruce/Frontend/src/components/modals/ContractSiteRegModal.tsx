/**
 * 파일명: ContractSiteRegModal.tsx
 * 경로: src/components/modals/ContractSiteRegModal.tsx
 * 설명: 계약 대상 사업장 다중 선택 팝업
 */

import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import './../../style/layout.css'; // 공통 CSS

interface SiteItem {
  siteId: number;
  siteNm: string;
  address: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  custId: number; // 고객사 ID (필수)
  custNm: string; // 고객사 명 (표시용)
  onSelect: (selectedSites: SiteItem[]) => void; // 선택된 데이터 반환
}

const ContractSiteRegModal = ({ isOpen, onClose, custId, custNm, onSelect }: Props) => {
  const [keyword, setKeyword] = useState('');
  const [list, setList] = useState<SiteItem[]>([]);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  // 1. 팝업 열릴 때 해당 고객사의 사업장 목록 조회 (Mock)
  useEffect(() => {
    if (isOpen && custId) {
      // TODO: 실제 API 호출 (BusinessSiteService.getSitesByCustId(custId)...)
      // 여기서는 더미 데이터 생성
      const mockData = Array.from({ length: 5 }).map((_, i) => ({
        siteId: custId * 100 + i,
        siteNm: `${custNm} - 사업장 ${String.fromCharCode(65 + i)}`,
        address: `서울시 강남구 테헤란로 ${100 + i}길`
      }));
      setList(mockData);
      setCheckedIds([]); // 초기화
    }
  }, [isOpen, custId, custNm]);

  // 2. 체크박스 개별 선택/해제
  const handleCheck = (id: number) => {
    setCheckedIds(prev => 
      prev.includes(id) ? prev.filter(vid => vid !== id) : [...prev, id]
    );
  };

  // 3. 전체 선택/해제
  const handleCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setCheckedIds(list.map(item => item.siteId));
    } else {
      setCheckedIds([]);
    }
  };

  // 4. 선택 완료
  const handleConfirm = () => {
    const selectedItems = list.filter(item => checkedIds.includes(item.siteId));
    onSelect(selectedItems);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000
    }}>
      <div className="section" style={{ width: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
        
        {/* 헤더 */}
        <div className="part-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-header)' }}>
          <span style={{ color: 'var(--text-main)', fontSize: '1rem' }}>사업장 등록 ({custNm})</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        {/* 검색 영역 */}
        <div style={{ padding: '15px', borderBottom: 'var(--border-style)', display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="사업장명 검색" 
            value={keyword} 
            onChange={(e) => setKeyword(e.target.value)}
            style={{ flex: 1, backgroundColor: 'var(--bg-input)', border: 'var(--border-style)', color: 'var(--text-main)', padding: '6px 10px', borderRadius: '4px' }}
          />
          <button className="cm-btn btn-primary" style={{ height: '32px' }}>
            <Search size={14} /> 검색
          </button>
        </div>

        {/* 리스트 영역 */}
        <div className="part-body" style={{ padding: 0, flex: 1, overflow: 'auto', minHeight: '300px' }}>
          <table className="standard-table" style={{ width: '100%', tableLayout: 'fixed' }}>
            <colgroup>
              <col width="40" />
              <col width="150" />
              <col width="*" />
            </colgroup>
            <thead>
              <tr>
                <th className="center">
                  <input type="checkbox" onChange={handleCheckAll} checked={list.length > 0 && checkedIds.length === list.length} />
                </th>
                <th>사업장명</th>
                <th>주소</th>
              </tr>
            </thead>
            <tbody>
              {list.length > 0 ? list.map((item) => (
                <tr key={item.siteId} onClick={() => handleCheck(item.siteId)} style={{ cursor: 'pointer', backgroundColor: checkedIds.includes(item.siteId) ? 'rgba(59, 130, 246, 0.1)' : 'transparent' }}>
                  <td className="center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={checkedIds.includes(item.siteId)} onChange={() => handleCheck(item.siteId)} />
                  </td>
                  <td>{item.siteNm}</td>
                  <td>{item.address}</td>
                </tr>
              )) : (
                <tr><td colSpan={3} className="center" style={{ padding: '20px', color: 'var(--text-muted)' }}>검색된 사업장이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 푸터 */}
        <div style={{ padding: '12px 16px', borderTop: 'var(--border-style)', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <button onClick={onClose} className="cm-btn btn-secondary">취소</button>
          <button onClick={handleConfirm} className="cm-btn btn-primary">
            <Check size={14} /> 선택 완료 ({checkedIds.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractSiteRegModal;