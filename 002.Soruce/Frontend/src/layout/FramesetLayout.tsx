import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Layout/Sidebar'; // 기존 사이드바 컴포넌트 유지 [cite: 2026-01-27]
import '../style/layout.css';
import '../style/common.css';

/**
 * FramesetLayout: 시스템의 전체 뼈대를 잡는 프레임셋 [cite: 2026-01-28]
 * - Top: 고정 헤더 영역
 * - Left: 고정 사이드바 영역
 * - Content: 가변 페이지 컨텐츠 영역
 */
const FramesetLayout: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* 1. 최상단 영역 (Top Frame) [cite: 2026-01-28] */}
      <div style={{ height: 'var(--header-height)', flexShrink: 0, borderBottom: 'var(--border-style)', backgroundColor: 'var(--bg-header)' }}>
        {/* 나중에 작성할 PageHeader가 여기에 들어갑니다 */}
        <div id="top-portal-target"></div> 
      </div>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        
        {/* 2. 왼쪽 메뉴 영역 (Left Frame) [cite: 2026-01-28] */}
        <aside style={{ width: 'var(--sidebar-width)', flexShrink: 0, borderRight: 'var(--border-style)', backgroundColor: 'var(--bg-card)', overflowY: 'auto' }}>
          <Sidebar />
        </aside>

        {/* 3. 컨텐츠 영역 (Content Frame) [cite: 2026-01-28] */}
        <main style={{ flex: 1, overflowY: 'auto', backgroundColor: 'var(--bg-main)' }}>
          {/* 실제 각 페이지(sample 등)가 렌더링되는 구역 [cite: 2026-01-28] */}
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default FramesetLayout;