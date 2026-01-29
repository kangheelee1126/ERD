import React, { useState } from 'react';
/* [중요] 아래 임포트 구문이 반드시 있어야 아이콘이 나옵니다. */
import { Briefcase, Search, List, Plus, Edit, Trash2, Info, X, Save } from 'lucide-react';
import './CustomerManagement.css';

interface Customer {
  customerId: number;
  custCd: string;
  custNm: string;
  industryCd: string;
  devCapabilityCd: string;
  sourceModYn: string;
  useYn: string;
}

const CustomerManagement: React.FC = () => {
  const [customers] = useState<Customer[]>([
    { customerId: 1, custCd: 'CUST-001', custNm: '(주)에이치에스 테크', industryCd: '반도체', devCapabilityCd: '상', sourceModYn: 'N', useYn: 'Y' },
    { customerId: 2, custCd: 'CUST-002', custNm: '디지털 솔루션즈', industryCd: '자동차', devCapabilityCd: '중', sourceModYn: 'Y', useYn: 'Y' },
    { customerId: 3, custCd: 'CUST-003', custNm: '미래정밀 (미사용)', industryCd: '화학', devCapabilityCd: '하', sourceModYn: 'N', useYn: 'N' }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [cust, setCust] = useState<Partial<Customer>>({});

  const openModal = (target: any = null) => {
    setCust(target || { useYn: 'Y' });
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('삭제하시겠습니까?')) {
      console.log(`${id} 삭제 로직 수행`);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header-layout">
        <div className="header-left">
          <Briefcase size={20} color="var(--primary-color)" />
          <h2 className="header-title">고객사 정보 관리</h2>
        </div>
      </div>

      <div className="filter-bar">
        <div className="filter-item">
          <label>검색어</label>
          <input type="text" placeholder="고객사 코드 또는 명칭" className="filter-input" />
        </div>
        <button className="btn-search"><Search size={14} /> 조회</button>
      </div>

      <div className="content-body section">
        <div className="part-header">
          <div className="header-left">
            <List size={16} />
            <span className="part-title">고객사 리스트</span>
            <span className="part-desc">등록된 고객사의 상세 기준 정보를 관리합니다.</span>
          </div>
          <div className="header-right">
            <button className="btn-action btn-blue" onClick={() => openModal()}>
              <Plus size={14} /> 신규
            </button>
          </div>
        </div>

        <div className="part-body">
          <table className="standard-table fixed-layout">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>No</th>
                <th style={{ width: '120px' }}>고객사 코드</th>
                <th>고객사 명칭</th>
                <th style={{ width: '140px' }}>제조 산업</th>
                <th style={{ width: '80px' }}>사용여부</th>
                <th style={{ width: '60px' }}>수정</th>
                <th style={{ width: '60px' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c: Customer, idx: number) => (
                <tr key={c.customerId}>
                  <td className="center">{idx + 1}</td>
                  <td className="center highlight-id">{c.custCd}</td>
                  <td className="ellipsis" title={c.custNm}>{c.custNm}</td>
                  <td className="center">{c.industryCd}</td>
                  <td className="center">
                    <span className={c.useYn === 'Y' ? 'status-y' : 'status-n'}>
                      {c.useYn === 'Y' ? '사용' : '미사용'}
                    </span>
                  </td>
                  <td className="center">
                    {/* [오류 해결] 아이콘 색상 명시적 지정 (혹시 모를 상속 문제 방지) */}
                    <button className="btn-table-icon-only edit" onClick={() => openModal(c)} title="수정">
                      <Edit size={16} color="currentColor" />
                    </button>
                  </td>
                  <td className="center">
                    <button className="btn-table-icon-only delete" onClick={() => handleDelete(c.customerId)} title="삭제">
                      <Trash2 size={16} color="currentColor" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content wide-modal">
            <div className="modal-header">
              <div className="header-title-area">
                <Info size={18} color="var(--primary-color)" />
                <h3>고객사 상세 정보</h3>
              </div>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <div className="modal-scroll-area">
              <table className="input-table">
                <tbody>
                  <tr>
                    <th>고객사 명칭</th>
                    <td><input className="form-input" defaultValue={cust.custNm} /></td>
                  </tr>
                  {/* ... 나머지 항목 ... */}
                </tbody>
              </table>
            </div>
            <div className="btn-group">
              <div className="btn-action-group">
                <button className="btn-secondary" onClick={() => setShowModal(false)}><X size={14} /> 취소</button>
                <button className="btn-primary" onClick={() => setShowModal(false)}><Save size={14} /> 저장</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerManagement;