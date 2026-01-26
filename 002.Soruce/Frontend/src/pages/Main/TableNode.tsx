import { Handle, Position } from 'reactflow';
import { KeyRound, List } from 'lucide-react';
import './TableNode.css';

export interface ColumnData {
  name: string;        // 물리명
  logicalName?: string; // 논리명
  type: string;
  isPk?: boolean;
}

export interface TableNodeData {
  label: string;        // 물리 테이블명
  logicalLabel?: string; // ✨ 논리 테이블명 (추가됨)
  columns: ColumnData[]; 
  viewMode: 'logical' | 'physical' | 'both'; // ✨ 3단 뷰 모드
}

const TableNode = ({ data }: { data: TableNodeData }) => {
  const { viewMode, label, logicalLabel, columns } = data;

  // ✨ 텍스트 렌더링 도우미 함수 (모드에 따라 보여줄 텍스트 결정)
  const getText = (phy: string, log?: string) => {
    const logical = log || phy; // 논리명 없으면 물리명으로 대체
    if (viewMode === 'logical') return logical;
    if (viewMode === 'physical') return phy;
    return `${phy} (${logical})`; // both 모드: 물리 (논리)
  };

  return (
    <div className="table-node">
      {/* 연결점 (Handles) */}
      <Handle type="target" position={Position.Top} className="handle-dot top" />
      <Handle type="source" position={Position.Right} className="handle-dot right" />
      <Handle type="source" position={Position.Bottom} className="handle-dot bottom" />
      <Handle type="target" position={Position.Left} className="handle-dot left" />

      {/* 테이블 헤더 */}
      <div className="table-header">
        <List size={16} className="table-icon" />
        <span className="table-title">
            {/* ✨ 테이블 이름도 3단 모드 적용 */}
            {getText(label, logicalLabel)}
        </span>
      </div>

      {/* 컬럼 목록 */}
      <div className="table-body">
        {columns.map((col, index) => (
          <div key={index} className={`table-row ${col.isPk ? 'pk-row' : ''}`}>
            <div className="col-left">
              {col.isPk && <KeyRound size={12} className="pk-icon" />}
              
              {/* ✨ 컬럼 이름 3단 모드 적용 */}
              <span className="col-name">
                {getText(col.name, col.logicalName)}
              </span>
            </div>
            
            {/* 데이터 타입은 물리 또는 Both 모드일 때만 표시 */}
            {(viewMode !== 'logical') && (
               <span className="col-type">{col.type}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableNode;