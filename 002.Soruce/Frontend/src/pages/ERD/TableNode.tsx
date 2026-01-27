import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import './TableNode.css';

const TableNode = ({ data, selected }: any) => {
  // 뷰 모드에 따라 보여줄 텍스트 결정
  const viewMode = data.viewMode || 'both'; // 기본값 both

  // 1. 테이블 제목 처리
  const getTableTitle = () => {
    if (viewMode === 'physical') return data.label; // Users
    if (viewMode === 'logical') return data.logicalLabel || data.label; // 사용자
    // both: Users (사용자)
    return `${data.label} ${data.logicalLabel ? `(${data.logicalLabel})` : ''}`;
  };

  // 2. 컬럼 이름 처리
  const getColName = (col: any) => {
    if (viewMode === 'physical') return col.name;
    if (viewMode === 'logical') return col.logicalName || col.name;
    // both일 때는 칸이 좁으니 물리명 위주로 보여주거나 둘 다 표시
    return `${col.name} ${col.logicalName ? `(${col.logicalName})` : ''}`;
  };

  return (
    <div className={`table-node ${selected ? 'selected' : ''}`}>
      {/* 테이블 헤더 */}
      <div className="table-header">
        <strong>{getTableTitle()}</strong>
      </div>

      {/* 컬럼 목록 */}
      <div className="table-body">
        {data.columns.map((col: any, idx: number) => (
          <div key={idx} className="table-row">
            {/* PK 아이콘 */}
            <span className={`pk-icon ${col.isPk ? 'active' : ''}`}>
              {col.isPk ? 'PK' : ''}
            </span>
            
            {/* 컬럼 이름 */}
            <span className="col-name" title={col.logicalName}>
              {getColName(col)}
            </span>
            
            {/* 컬럼 타입 (공간 좁으면 생략 가능) */}
            <span className="col-type">{col.type}</span>
          </div>
        ))}
      </div>

      {/* 연결 핸들 (선 잇는 점) */}
      <Handle type="target" position={Position.Top} className="handle-dot" />
      <Handle type="source" position={Position.Bottom} className="handle-dot" />
      <Handle type="target" position={Position.Left} className="handle-dot" />
      <Handle type="source" position={Position.Right} className="handle-dot" />
    </div>
  );
};

export default memo(TableNode);