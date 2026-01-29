import React from 'react';
import { Layout, Search, Plus, Save, Trash2, User, Mail, Shield } from 'lucide-react';
import PageHeader from '../../layout/PageHeader'; 
import './sample.css'; 

const SamplePage: React.FC = () => {
  return (
    <div className="page-container">
      {/* 1. 상단 레이아웃 [cite: 2026-01-28] */}
      <PageHeader 
        title="사용자 정보 관리 (Sample)" 
        icon={<Layout size={26} color="var(--primary-color)" />}
        actions={<button className="btn-primary"><Plus size={16} /> 신규 사용자 등록</button>}
      />

      {/* 2. 페이지 내부로 삽입된 검색 영역 (FilterBar 컴포넌트 대체) [cite: 2026-01-28] */}
      {/* common.css의 클래스를 활용하여 디자인 일관성은 유지하고, 구조는 자유롭게 짭니다. */}
      <div className="filter-bar">
        <div className="filter-group">
          <div className="filter-item">
            <label>사용자명</label>
            <input type="text" placeholder="이름을 입력하세요" />
          </div>
          {/* 페이지 특성에 맞춰 필드를 자유롭게 추가/제거 가능 [cite: 2026-01-28] */}
          <div className="filter-item">
            <label>권한그룹</label>
            <select>
              <option value="ALL">전체</option>
              <option value="ADMIN">관리자</option>
            </select>
          </div>
        </div>
        <div className="filter-actions">
          <button className="btn-search"><Search size={16} /> 조회</button>
        </div>
      </div>

      {/* 3. 컨텐츠 영역: 2분할 그리드 [cite: 2026-01-28] */}
      <div className="content-grid layout-2">
        {/* ... (이전과 동일한 목록 및 상세 정보 영역) ... */}
        <section className="section">
          <div className="part-header">사용자 목록</div>
          <div className="part-body">
            <table className="standard-table">
              <thead>
                <tr><th className="center">No</th><th>성명</th><th className="center">상태</th></tr>
              </thead>
              <tbody>
                <tr><td className="center">1</td><td>홍길동</td><td className="center"><span className="status-use">사용</span></td></tr>
              </tbody>
            </table>
          </div>
        </section>
        
        <section className="section">
          <div className="part-header">상세 정보</div>
          <div className="part-body">
            {/* ... 상세 폼 영역 ... */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default SamplePage;