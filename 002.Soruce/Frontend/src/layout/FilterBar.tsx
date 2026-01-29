import React from 'react';
import '../style/common.css';

interface FilterBarProps {
  /** 검색 조건 입력 필드 (Input, Select 등) [cite: 2026-01-28] */
  children: React.ReactNode;
  /** 우측에 배치될 액션 버튼 (조회, 초기화 등) [cite: 2026-01-28] */
  actions: React.ReactNode;
}

/**
 * FilterBar: 검색 조건(좌)과 조회 버튼(우)을 배치하는 공통 검색 바 [cite: 2026-01-28]
 */
const FilterBar: React.FC<FilterBarProps> = ({ children, actions }) => {
  return (
    <div className="filter-bar">
      {/* 좌측 영역: 검색 조건 입력 그룹 [cite: 2026-01-28] */}
      <div className="filter-group">
        {children}
      </div>

      {/* 우측 영역: 조회 및 초기화 버튼 [cite: 2026-01-28] */}
      <div className="filter-actions">
        {actions}
      </div>
    </div>
  );
};

export default FilterBar;