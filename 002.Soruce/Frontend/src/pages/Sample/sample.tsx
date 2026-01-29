import React from 'react';
import { Layout, Search, Plus, Save, Trash2, User, Mail, Shield } from 'lucide-react';
import PageHeader from '../../layout/PageHeader'; // [cite: 2026-01-28]
import FilterBar from '../../layout/FilterBar';   // [cite: 2026-01-28]
import './sample.css';                          // ✨ 동일 경로 CSS 참조 [cite: 2026-01-28]

/**
 * SamplePage: 페이지 전용 스타일과 공통 레이아웃이 결합된 표준 모델 [cite: 2026-01-28]
 */
const SamplePage: React.FC = () => {
  return (
    <div className="page-container">
      {/* 1. 상단 레이아웃 (제목 좌측, 버튼 우측 끝) [cite: 2026-01-28] */}
      <PageHeader 
        title="사용자 정보 관리 (Sample)" 
        icon={<Layout size={26} color="var(--primary-color)" />}
        actions={
          <button className="btn-primary">
            <Plus size={16} /> 신규 사용자 등록
          </button>
        }
      />

      {/* 2. 공통 검색 영역 [cite: 2026-01-28] */}
      <FilterBar 
        actions={
          <button className="btn-search"><Search size={16} /> 조회</button>
        }
      >
        <div className="filter-item">
          <label>사용자명</label>
          <input type="text" placeholder="이름을 입력하세요" />
        </div>
      </FilterBar>

      {/* 3. 컨텐츠 영역: 2분할 가변 그리드 [cite: 2026-01-28] */}
      <div className="content-grid layout-2">
        
        {/* 좌측: 마스터 목록 (실선 테이블) [cite: 2026-01-28] */}
        <section className="section">
          <div className="part-header">사용자 목록</div>
          <div className="part-body">
            <table className="standard-table">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>No</th>
                  <th>아이디</th>
                  <th>성명</th>
                  <th style={{ width: '100px' }}>상태</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="center">1</td>
                  <td className="center">user_01</td>
                  <td>홍길동</td>
                  <td className="center"><span className="status-use">사용</span></td>
                </tr>
                <tr>
                  <td className="center">2</td>
                  <td className="center">user_02</td>
                  <td>임꺽정</td>
                  <td className="center"><span className="status-stop">미사용</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 우측: 상세 정보 (좌라벨-우입력 폼) [cite: 2026-01-27, 2026-01-28] */}
        <section className="section">
          <div className="part-header">상세 정보 설정</div>
          <div className="part-body">
            <div className="form-container">
              <table className="form-table">
                <tbody>
                  <tr>
                    <th><User size={14} style={{marginRight: '6px'}}/> 성명</th>
                    <td><input type="text" placeholder="성명을 입력하세요" /></td>
                  </tr>
                  <tr>
                    <th><Mail size={14} style={{marginRight: '6px'}}/> 이메일</th>
                    <td><input type="text" placeholder="example@domain.com" /></td>
                  </tr>
                  <tr>
                    <th><Shield size={14} style={{marginRight: '6px'}}/> 권한그룹</th>
                    <td>
                      <select>
                        <option value="ADMIN">시스템 관리자</option>
                        <option value="USER">일반 사용자</option>
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button className="btn-danger"><Trash2 size={14} /> 삭제</button>
                <button className="btn-primary"><Save size={14} /> 변경사항 저장</button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default SamplePage;