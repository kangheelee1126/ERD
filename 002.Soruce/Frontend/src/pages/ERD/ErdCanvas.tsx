import { useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap,
  ConnectionMode,
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

interface ErdCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  defaultEdgeOptions?: any;
  onNodeClick?: NodeMouseHandler;
  onEdgeClick?: EdgeMouseHandler;
  onPaneClick?: (event: React.MouseEvent) => void;
}

const ErdMarkers = () => (
  <svg style={{ position: 'absolute', top: 0, left: 0, width: 0, height: 0 }}>
    <defs>
      <marker id="erd-one" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto-start-reverse">
        <path d="M10,2 L10,10 M6,2 L6,10" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
      </marker>
      <marker id="erd-many" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto-start-reverse">
        <path d="M1,6 L10,1 M1,6 L10,11 M6,2 L6,10" stroke="#94a3b8" strokeWidth="1.5" fill="none"/>
      </marker>
    </defs>
  </svg>
);

const ErdCanvas = ({ 
  nodes, edges, onNodesChange, onEdgesChange, onConnect, 
  defaultEdgeOptions,
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
        defaultEdgeOptions={defaultEdgeOptions}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        fitView
        connectionMode={ConnectionMode.Loose}
      >
        <Background color="#333" gap={20} style={{ backgroundColor: '#0f172a' }} />
        
        {/* 👇 [수정] style 속성을 제거했습니다! (이제 CSS로 제어) */}
        <Controls />
        
        <MiniMap nodeColor={() => '#3b82f6'} style={{ backgroundColor: '#1e293b' }} />
        <ErdMarkers />
      </ReactFlow>
    </div>
  );
};

export default ErdCanvas;