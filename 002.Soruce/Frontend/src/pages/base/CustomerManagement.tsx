import React, { useState, useEffect } from 'react';
import { Briefcase, Search, Plus, Save, Trash2 } from 'lucide-react';
import axiosInstance from '../../api/http.ts';
import './CustomerManagement.css';

const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUserId = 'admin'; // 감사 필드용 [cite: 2026-01-29]

  useEffect(() => { fetchCustomers(); }, []);

  // 고객사 목록 조회 [cite: 2026-01-29]
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/system/customer', {
        params: { keyword: searchTerm }
      });
      setCustomers(res.data);
    } catch (err) {
      console.error('고객사 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (index: number, field: string, value: any) => {
    const newItems = [...customers];
    newItems[index] = { ...newItems[index], [field]: value };
    setCustomers(newItems);
  };

  const addRow = () => {
    setCustomers([...customers, { 
      customer_id: 0, 
      cust_cd: '', 
      cust_nm: '', 
      use_yn: 'Y', 
      sort_no: customers.length + 1, 
      isNew: true 
    }]);
  };

  const deleteRow = async (index: number) => {
    const target = customers[index];
    if (target.isNew) {
      setCustomers(customers.filter((_, i) => i !== index));
      return;
    }

    if (!window.confirm('고객사 정보를 즉시 삭제하시겠습니까?')) return;
    try {
      await axiosInstance.delete(`/system/customer/${target.customer_id}`);
      setCustomers(customers.filter((_, i) => i !== index));
      alert('삭제되었습니다.');
    } catch (err) {
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const saveAll = async () => {
    // 필수 입력 검증 [cite: 2026-01-29]
    for (let i = 0; i < customers.length; i++) {
      const row = customers[i];
      if (!row.cust_cd?.trim()) return alert(`${i + 1}행: 고객사 코드는 필수입니다.`);
      if (!row.cust_nm?.trim()) return alert(`${i + 1}행: 고객사 명칭은 필수입니다.`);
    }

    const validData = customers.map(item => ({
      ...item,
      created_by: item.isNew ? currentUserId : item.created_by,
      updated_by: currentUserId
    }));

    if (!window.confirm('변경 사항을 저장하시겠습니까?')) return;

    setLoading(true);
    try {
      await axiosInstance.post('/system/customer/save', validData);
      alert('성공적으로 저장되었습니다.');
      fetchCustomers();
    } catch (err) {
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* 상단 레이아웃: 제목 좌측, 버튼 우측 [cite: 2026-01-28] */}
      <div className="page-header-layout">
        <div className="header-left">
          <Briefcase size={20} color="var(--primary-color)" />
          <h2 className="header-title">고객사 정보 관리</h2>
        </div>
        <div className="header-right header-button-group">
          <button className="btn-action btn-blue" onClick={addRow}><Plus size={14} /> 행추가</button>
          <button className="btn-action btn-save" onClick={saveAll} disabled={loading}><Save size={14} /> 저장</button>
        </div>
      </div>

      {/* 검색영역: 조회 버튼 우측 배치 [cite: 2026-01-29] */}
      <div className="filter-bar">
        <div className="filter-item">
          <label>검색어</label>
          <input 
            type="text" 
            placeholder="고객사 코드 또는 명칭" 
            className="filter-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchCustomers()}
          />
        </div>
        <button className="btn-search" onClick={fetchCustomers}><Search size={14} /> 조회</button>
      </div>

      <div className="content-body section">
        <div className="table-wrapper overflow-x-auto">
          <table className="standard-table">
            <thead>
              <tr>
                <th style={{ width: '120px' }}>고객사 코드<span className="required-mark">*</span></th>
                <th style={{ width: '180px' }}>고객사 명칭<span className="required-mark">*</span></th>
                <th style={{ width: '120px' }}>사업자번호</th>
                <th style={{ width: '120px' }}>대표전화</th>
                <th>주소</th>
                <th style={{ width: '70px' }}>정렬<span className="required-mark">*</span></th>
                <th style={{ width: '90px' }}>사용여부</th>
                <th style={{ width: '60px' }}>삭제</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, idx) => (
                <tr key={idx}>
                  <td className="center">
                    {/* PK 수정 불가 로직 [cite: 2026-01-29] */}
                    {c.isNew ? (
                      <input type="text" value={c.cust_cd || ''} className="table-input center" 
                             onChange={(e) => handleValueChange(idx, 'cust_cd', e.target.value)} />
                    ) : (
                      <span className="readonly-text">{c.cust_cd}</span>
                    )}
                  </td>
                  <td><input type="text" value={c.cust_nm || ''} className="table-input" onChange={(e) => handleValueChange(idx, 'cust_nm', e.target.value)} /></td>
                  <td><input type="text" value={c.biz_no || ''} className="table-input center" onChange={(e) => handleValueChange(idx, 'biz_no', e.target.value)} /></td>
                  <td><input type="text" value={c.tel_no || ''} className="table-input center" onChange={(e) => handleValueChange(idx, 'tel_no', e.target.value)} /></td>
                  <td><input type="text" value={c.addr1 || ''} className="table-input" onChange={(e) => handleValueChange(idx, 'addr1', e.target.value)} /></td>
                  <td className="center"><input type="number" value={c.sort_no ?? ''} className="table-input center" onChange={(e) => handleValueChange(idx, 'sort_no', Number(e.target.value))} /></td>
                  <td className="center">
                    <select className={`table-select center ${c.use_yn === 'Y' ? 'status-y' : 'status-n'}`} 
                            value={c.use_yn} onChange={(e) => handleValueChange(idx, 'use_yn', e.target.value)}>
                      <option value="Y">사용</option><option value="N">미사용</option>
                    </select>
                  </td>
                  <td className="center">
                    <Trash2 size={14} color="#ef4444" className="cursor-pointer" onClick={() => deleteRow(idx)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;