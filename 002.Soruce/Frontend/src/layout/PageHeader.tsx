import React from 'react';
import '../style/common.css';

interface PageHeaderProps {
  /** 페이지 제목 [cite: 2026-01-28] */
  title: string;
  /** 제목 옆에 표시될 아이콘 컴포넌트 [cite: 2026-01-28] */
  icon: React.ReactNode;
  /** 우측 끝에 배치될 버튼이나 추가 요소 [cite: 2026-01-28] */
  actions?: React.ReactNode;
}

/**
 * PageHeader: 제목 아이콘/텍스트(좌)와 버튼(우)을 배치하는 공통 헤더 [cite: 2026-01-28]
 */
const PageHeader: React.FC<PageHeaderProps> = ({ title, icon, actions }) => {
  return (
    <header className="page-header">
      {/* 좌측 영역: 아이콘 + 제목 [cite: 2026-01-28] */}
      <div className="header-title">
        {icon}
        <h2>{title}</h2>
      </div>

      {/* 우측 영역: 액션 버튼군 [cite: 2026-01-28] */}
      {actions && (
        <div className="header-actions">
          {actions}
        </div>
      )}
    </header>
  );
};

export default PageHeader;