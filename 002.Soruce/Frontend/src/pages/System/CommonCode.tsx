import React, { useState, useEffect } from 'react';
import { Database, Search, Plus, Save, Trash2, ListTree, Tag } from 'lucide-react';
import axiosInstance from '../../api/http.ts';
import './CommonCode.css';

const CommonCode: React.FC = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [details, setDetails] = useState<any[]>([]);
  const [selectedGrp, setSelectedGrp] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // [추가] 검색어 상태 관리
  const [searchKeyword, setSearchKeyword] = useState('');

  // 현재 로그인한 사용자 아이디 (감사 필드용)
  const currentUserId = 'admin'; 

  useEffect(() => { fetchGroups(); }, []);

  // [수정] 검색어(keyword)를 파라미터로 포함하여 조회
  const fetchGroups = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/system/common-code/groups', {
        params: { keyword: searchKeyword }
      });
      setGroups(res.data);
      
      // 조회 결과가 있으면 첫 번째 항목 선택, 없으면 초기화
      if (res.data.length > 0) {
        setSelectedGrp(res.data[0]);
      } else {
        setSelectedGrp(null);
        setDetails([]);
      }
    } catch (err) { 
      console.error('그룹 조회 실패:', err); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedGrp?.code_grp_cd) { fetchDetails(selectedGrp.code_grp_cd); } 
    else { setDetails([]); }
  }, [selectedGrp?.code_grp_cd]);

  const fetchDetails = async (groupCd: string) => {
    try {
      const res = await axiosInstance.get(`/system/common-code/details/${groupCd}`);
      setDetails(res.data);
    } catch (err) { console.error('상세 조회 실패:', err); }
  };

  const handleGroupChange = (index: number, field: string, value: any) => {
    const newGroups = [...groups];
    newGroups[index] = { ...newGroups[index], [field]: value };
    setGroups(newGroups);
    if (selectedGrp && selectedGrp.code_grp_cd === groups[index].code_grp_cd) {
      setSelectedGrp(newGroups[index]);
    }
  };

  const handleDetailChange = (index: number, field: string, value: any) => {
    const newDetails = [...details];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setDetails(newDetails);
  };

  const addGroupRow = () => {
    setGroups([...groups, { 
      code_grp_cd: '', 
      code_grp_nm: '', 
      code_grp_desc: '', 
      use_yn: 'Y', 
      sort_no: groups.length + 1, 
      isNew: true 
    }]);
  };

  const addDetailRow = () => {
    if (!selectedGrp) return alert('그룹을 먼저 선택하세요.');
    setDetails([...details, { 
      code_grp_cd: selectedGrp.code_grp_cd, 
      code_cd: '', 
      code_nm: '', 
      code_desc: '', 
      use_yn: 'Y', 
      sort_no: details.length + 1, 
      isNew: true 
    }]);
  };

  const deleteGroupRow = async (index: number) => {
    const target = groups[index];
    if (target.isNew) {
      setGroups(groups.filter((_, i) => i !== index));
      return;
    }
    if (details.length > 0 && selectedGrp?.code_grp_cd === target.code_grp_cd) {
      alert('상세 코드가 존재하는 그룹은 삭제할 수 없습니다.');
      return;
    }
    if (!window.confirm('정말로 삭제하시겠습니까? DB에서 즉시 삭제됩니다.')) return;
    try {
      await axiosInstance.delete(`/system/common-code/groups/${target.code_grp_cd}`);
      setGroups(groups.filter((_, i) => i !== index));
      if (selectedGrp?.code_grp_cd === target.code_grp_cd) setSelectedGrp(null);
      alert('삭제되었습니다.');
    } catch (err) { alert('삭제 중 오류가 발생했습니다.'); }
  };

  const deleteDetailRow = async (index: number) => {
    const target = details[index];
    if (target.isNew) {
      setDetails(details.filter((_, i) => i !== index));
      return;
    }
    if (!window.confirm('상세 코드를 즉시 삭제하시겠습니까?')) return;
    try {
      await axiosInstance.delete(`/system/common-code/details/${target.code_grp_cd}/${target.code_cd}`);
      setDetails(details.filter((_, i) => i !== index));
      alert('삭제되었습니다.');
    } catch (err) { alert('삭제 중 오류가 발생했습니다.'); }
  };

  const saveAll = async (type: 'GRP' | 'DTL') => {
    const targetData = type === 'GRP' ? groups : details;
    const apiUrl = type === 'GRP' ? '/system/common-code/groups/save' : '/system/common-code/details/save';
    
    // [검증] 필수 입력 체크 로직
    for (let i = 0; i < targetData.length; i++) {
        const row = targetData[i];
        if (type === 'GRP') {
            if (!row.code_grp_cd?.trim()) return alert(`${i+1}행: 그룹코드는 필수 입력 항목입니다.`);
            if (!row.code_grp_nm?.trim()) return alert(`${i+1}행: 그룹명은 필수 입력 항목입니다.`);
            if (row.sort_no === undefined || row.sort_no === null) return alert(`${i+1}행: 정렬 순서는 필수 입력 항목입니다.`);
        } else {
            if (!row.code_cd?.trim()) return alert(`${i+1}행: 코드값은 필수 입력 항목입니다.`);
            if (!row.code_nm?.trim()) return alert(`${i+1}행: 코드명칭은 필수 입력 항목입니다.`);
            if (row.sort_no === undefined || row.sort_no === null) return alert(`${i+1}행: 정렬 순서는 필수 입력 항목입니다.`);
        }
    }

    const validData = targetData.map(item => ({
        ...item,
        created_by: item.isNew ? currentUserId : item.created_by,
        updated_by: currentUserId
    }));
    
    if (!window.confirm('변경 사항을 저장하시겠습니까?')) return;

    setLoading(true);
    try {
      await axiosInstance.post(apiUrl, validData);
      alert('성공적으로 저장되었습니다.');
      type === 'GRP' ? fetchGroups() : fetchDetails(selectedGrp.code_grp_cd);
    } catch (err) { alert('저장 중 오류가 발생했습니다.'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="page-container">
      <div className="page-header-layout">
        <div className="header-left">
          <Database size={20} color="var(--primary-color)" />
          <h2 className="header-title">공통코드 관리</h2>
        </div>
      </div>

      {/* [지침] 조회 버튼은 검색영역 안 우측 배치 */}
      <div className="filter-bar">
        <div className="filter-item">
          <label>검색어</label>
          <input 
            type="text" 
            placeholder="그룹명 또는 코드 입력" 
            className="filter-input" 
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchGroups()} // 엔터키로 조회 실행
          />
        </div>
        <button className="btn-search" onClick={fetchGroups} disabled={loading}>
          <Search size={14} /> 조회
        </button>
      </div>

      <div className="content-grid layout-2">
        <section className="section">
          <div className="part-header">
            <div className="header-left">
              <ListTree size={16} />
              <span className="part-title">그룹 리스트</span>
            </div>
            <div className="header-right header-button-group">
              <button className="btn-action btn-blue" onClick={addGroupRow}><Plus size={14} /> 행추가</button>
              <button className="btn-action btn-save" onClick={() => saveAll('GRP')} disabled={loading}><Save size={14} /> 저장</button>
            </div>
          </div>
          <div className="part-body">
            <table className="standard-table">
              <thead>
                <tr>
                  <th style={{ width: '120px' }}>그룹코드<span className="required-mark">*</span></th>
                  <th style={{ width: '150px' }}>그룹명<span className="required-mark">*</span></th>
                  <th>그룹설명</th>
                  <th style={{ width: '70px' }}>정렬<span className="required-mark">*</span></th>
                  <th style={{ width: '90px' }}>사용여부</th>
                  <th style={{ width: '60px' }}>삭제</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((g, idx) => (
                  <tr key={idx} onClick={() => setSelectedGrp(g)} className={selectedGrp?.code_grp_cd === g.code_grp_cd ? 'active-row' : ''}>
                    <td className="center">
                      {/* PK 수정 불가 로직: 신규일 때만 input 노출 */}
                      {g.isNew ? (
                        <input type="text" value={g.code_grp_cd || ''} className="table-input center" 
                               onChange={(e) => handleGroupChange(idx, 'code_grp_cd', e.target.value)} />
                      ) : (
                        <span className="readonly-text">{g.code_grp_cd}</span>
                      )}
                    </td>
                    <td><input type="text" value={g.code_grp_nm || ''} className="table-input" onChange={(e) => handleGroupChange(idx, 'code_grp_nm', e.target.value)} /></td>
                    <td><input type="text" value={g.code_grp_desc || ''} className="table-input" onChange={(e) => handleGroupChange(idx, 'code_grp_desc', e.target.value)} /></td>
                    <td className="center"><input type="number" value={g.sort_no ?? ''} className="table-input center" onChange={(e) => handleGroupChange(idx, 'sort_no', e.target.value === '' ? null : Number(e.target.value))} /></td>
                    <td className="center">
                      <select className={`table-select center ${g.use_yn === 'Y' ? 'status-y' : 'status-n'}`} value={g.use_yn} onChange={(e) => handleGroupChange(idx, 'use_yn', e.target.value)}>
                        <option value="Y">사용</option><option value="N">미사용</option>
                      </select>
                    </td>
                    <td className="center">
                      <Trash2 size={14} color="#ef4444" className="cursor-pointer" onClick={(e) => { e.stopPropagation(); deleteGroupRow(idx); }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="section">
          <div className="part-header">
            <div className="header-left">
              <Tag size={16} />
              <span className="part-title">상세 리스트 ({selectedGrp?.code_grp_cd || '선택없음'})</span>
            </div>
            <div className="header-right header-button-group">
              <button className="btn-action btn-blue" onClick={addDetailRow}><Plus size={14} /> 행추가</button>
              <button className="btn-action btn-save" onClick={() => saveAll('DTL')} disabled={loading}><Save size={14} /> 저장</button>
            </div>
          </div>
          <div className="part-body">
            <table className="standard-table">
              <thead>
                <tr>
                  <th style={{ width: '100px' }}>코드값<span className="required-mark">*</span></th>
                  <th style={{ width: '150px' }}>코드명칭<span className="required-mark">*</span></th>
                  <th>상세설명</th>
                  <th style={{ width: '60px' }}>정렬<span className="required-mark">*</span></th>
                  <th style={{ width: '90px' }}>사용여부</th>
                  <th style={{ width: '60px' }}>삭제</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d, idx) => (
                  <tr key={idx}>
                    <td className="center">
                      {/* PK 수정 불가 로직: 신규일 때만 input 노출 */}
                      {d.isNew ? (
                        <input type="text" value={d.code_cd || ''} className="table-input center" 
                               onChange={(e) => handleDetailChange(idx, 'code_cd', e.target.value)} />
                      ) : (
                        <span className="readonly-text">{d.code_cd}</span>
                      )}
                    </td>
                    <td><input type="text" value={d.code_nm || ''} className="table-input" onChange={(e) => handleDetailChange(idx, 'code_nm', e.target.value)} /></td>
                    <td><input type="text" value={d.code_desc || ''} className="table-input" onChange={(e) => handleDetailChange(idx, 'code_desc', e.target.value)} /></td>
                    <td className="center"><input type="number" value={d.sort_no ?? ''} className="table-input center" onChange={(e) => handleDetailChange(idx, 'sort_no', e.target.value === '' ? null : Number(e.target.value))} /></td>
                    <td className="center">
                      <select className={`table-select center ${d.use_yn === 'Y' ? 'status-y' : 'status-n'}`} value={d.use_yn} onChange={(e) => handleDetailChange(idx, 'use_yn', e.target.value)}>
                        <option value="Y">사용</option><option value="N">미사용</option>
                      </select>
                    </td>
                    <td className="center">
                      <Trash2 size={14} color="#ef4444" className="cursor-pointer" onClick={() => deleteDetailRow(idx)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CommonCode;