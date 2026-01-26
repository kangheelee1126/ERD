import { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  type Node, 
  type Edge, 
  type OnNodesChange, 
  type OnEdgesChange, 
  type OnConnect,
  type EdgeMouseHandler, 
  type NodeMouseHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import TableNode from './TableNode';

// Props 타입 정의
interface ErdCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  defaultEdgeOptions?: any; // 👈 이 옵션을 받아야 직각 선이 적용됩니다!
  onNodeClick?: NodeMouseHandler;
  onEdgeClick?: EdgeMouseHandler;
  onPaneClick?: (event: React.MouseEvent) => void;
}

// ✨ [중요] 화살표 모양(Marker) 정의
// 이 부분이 없으면 선 끝에 아무것도 안 생깁니다.
const ErdMarkers = () => (
  <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
    <defs>
      {/* 1 (One): 수직선 */}
      <marker id="erd-one" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
        <path d="M10,2 L10,10 M6,2 L6,10" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
      </marker>
      
      {/* N (Many): 까마귀 발 */}
      <marker id="erd-many" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto">
        <path d="M1,6 L10,1 M1,6 L10,11 M6,2 L6,10" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
      </marker>
    </defs>
  </svg>
);

const ErdCanvas = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, 
  defaultEdgeOptions, // 👈 부모에서 받은 옵션
  onNodeClick, onEdgeClick, onPaneClick 
}: ErdCanvasProps) => {

  const nodeTypes = useMemo(() => ({ table: TableNode }), []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions} // 👈 ReactFlow에 전달 필수!
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        fitView
      >
        <Background color="#aaa" gap={16} style={{ backgroundColor: '#0f172a' }} />
        <Controls />
        <MiniMap nodeColor={() => '#3b82f6'} style={{ backgroundColor: '#1e293b' }} />
        
        {/* 마커 컴포넌트 렌더링 */}
        <ErdMarkers />
      </ReactFlow>
    </div>
  );
};

export default ErdCanvas;