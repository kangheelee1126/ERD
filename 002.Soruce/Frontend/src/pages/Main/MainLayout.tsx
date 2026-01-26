import { useState, useCallback } from 'react';
import { Menu, LogOut, MousePointer2, PlusSquare, Link, Trash2, Upload } from 'lucide-react';
import { 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  type Connection, 
  type Node,
  type Edge
} from 'reactflow';
import ErdCanvas from './ErdCanvas';
import './MainLayout.css';

// 뷰 모드 타입 정의
type ViewMode = 'logical' | 'physical' | 'both';

// 초기 데이터
const initialNodes: Node[] = [
  { 
    id: 'table-1', 
    type: 'table', 
    position: { x: 100, y: 100 }, 
    data: { 
      label: 'Users',          // 물리명
      logicalLabel: '사용자',   // 논리명
      viewMode: 'both',        // 초기 모드
      columns: [
        { name: 'user_id', logicalName: '아이디', type: 'INT', isPk: true },
        { name: 'username', logicalName: '이름', type: 'VARCHAR(50)' },
      ]
    },
  },
];

const MainLayout = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeTool, setActiveTool] = useState('select');
  
  // ✨ 3단 뷰 모드 상태 관리
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  
  const [selectedTarget, setSelectedTarget] = useState<{ type: 'node' | 'edge', data: any } | null>(null);

  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerEnd: 'erd-many',
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // ✨ 뷰 모드 변경 핸들러
  const handleViewModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as ViewMode;
    setViewMode(mode);
    setNodes((nds) => 
      nds.map((node) => ({ ...node, data: { ...node.data, viewMode: mode } }))
    );
  };

  const onNodeClick = (_: any, node: Node) => {
    setSelectedTarget({ type: 'node', data: node });
  };
  const onEdgeClick = (_: any, edge: Edge) => {
    setSelectedTarget({ type: 'edge', data: edge });
  };
  const onPaneClick = () => {
    setSelectedTarget(null);
  };

  const handleAddTable = () => {
    const newId = `table-${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: 'table',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: 'New Table', 
        logicalLabel: '새 테이블',
        viewMode: viewMode, // 현재 뷰 모드 적용
        columns: [{ name: 'id', logicalName: '아이디', type: 'INT', isPk: true }] 
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setActiveTool('select');
  };

  const handleDelete = () => {
    if (!selectedTarget) return;
    if (selectedTarget.type === 'node') {
      const nodeId = selectedTarget.data.id;
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    } else if (selectedTarget.type === 'edge') {
      const edgeId = selectedTarget.data.id;
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    }
    setSelectedTarget(null);
  };

  // ✨ 테이블 이름 수정 (물리/논리 분리)
  const updateTableName = (field: 'label' | 'logicalLabel', value: string) => {
    if (selectedTarget?.type !== 'node') return;
    setNodes((nds) => nds.map((n) => 
      n.id === selectedTarget.data.id 
        ? { ...n, data: { ...n.data, [field]: value } } 
        : n
    ));
  };

  const addColumn = () => {
    if (selectedTarget?.type !== 'node') return;
    setNodes((nds) => nds.map((n) => {
      if (n.id === selectedTarget.data.id) {
        return { ...n, data: { ...n.data, columns: [...n.data.columns, { name: 'new_col', logicalName: '새컬럼', type: 'VARCHAR', isPk: false }] } };
      }
      return n;
    }));
  };

  const updateColumn = (idx: number, field: string, value: any) => {
    if (selectedTarget?.type !== 'node') return;
    setNodes((nds) => nds.map((n) => {
      if (n.id === selectedTarget.data.id) {
        const newCols = [...n.data.columns];
        newCols[idx] = { ...newCols[idx], [field]: value };
        return { ...n, data: { ...n.data, columns: newCols } };
      }
      return n;
    }));
  };

  const deleteColumn = (idx: number) => {
    if (selectedTarget?.type !== 'node') return;
    setNodes((nds) => nds.map((n) => {
      if (n.id === selectedTarget.data.id) {
        return { ...n, data: { ...n.data, columns: n.data.columns.filter((_: any, i: number) => i !== idx) } };
      }
      return n;
    }));
  };

  const updateEdgeType = (isIdentifying: boolean) => {
    if (selectedTarget?.type !== 'edge') return;
    setEdges((eds) => eds.map((e) => e.id === selectedTarget.data.id ? {
      ...e,
      animated: !isIdentifying,
      style: { ...e.style, strokeDasharray: isIdentifying ? '0' : '5,5' }
    } : e));
  };

  const updateCardinality = (type: '1' | 'N') => {
    if (selectedTarget?.type !== 'edge') return;
    setEdges((eds) => eds.map((e) => e.id === selectedTarget.data.id ? {
      ...e,
      markerEnd: `erd-${type === '1' ? 'one' : 'many'}`,
    } : e));
  };

  const currentNode = selectedTarget?.type === 'node' 
    ? nodes.find(n => n.id === selectedTarget.data.id) 
    : null;

  return (
    <div className="main-container">
      <header className="main-header">
        <div className="header-left">
          <Menu className="icon-btn" />
          <span className="project-title">001.ERD Project</span>
        </div>
        <div className="header-right">
          <button className="header-btn export-btn">
            <Upload size={16} />
            <span>SQL Export</span>
          </button>
          
          {/* ✨ 3단 뷰 모드 셀렉터 */}
          <div className="view-mode-control">
            <span className="toggle-label">View Mode:</span>
            <select className="ui-select view-select" value={viewMode} onChange={handleViewModeChange}>
              <option value="logical">논리 (Logical)</option>
              <option value="physical">물리 (Physical)</option>
              <option value="both">논리/물리 (Both)</option>
            </select>
          </div>
          
          <div className="divider-vertical"></div>
          <button className="save-btn">저장</button>
          <div className="user-profile">Admin</div>
          <LogOut className="icon-btn" />
        </div>
      </header>

      <div className="main-body">
        <aside className="sidebar-left">
          <div className="sidebar-section">
            <div className="section-title">도구 (Tools)</div>
            <div className="toolbar-grid">
              <button className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`} onClick={() => setActiveTool('select')}>
                <MousePointer2 size={20} /><span className="tool-label">선택</span>
              </button>
              <button className={`tool-btn ${activeTool === 'table' ? 'active' : ''}`} onClick={handleAddTable}>
                <PlusSquare size={20} /><span className="tool-label">테이블</span>
              </button>
              <button className={`tool-btn ${activeTool === 'relation' ? 'active' : ''}`} onClick={() => setActiveTool('relation')}>
                <Link size={20} /><span className="tool-label">관계선</span>
              </button>
            </div>
          </div>
          <div className="sidebar-divider"></div>
          <div className="sidebar-menu">
             <div className="section-title" style={{padding: '0 15px'}}>바로가기</div>
             <div className="sidebar-item active">프로젝트 관리</div>
             <div className="sidebar-item">내 드라이브</div>
             <div className="sidebar-item">공유 문서</div>
             <div className="sidebar-item">설정</div>
          </div>
        </aside>

        <main className={`canvas-area tool-${activeTool}`}>
          <ErdCanvas 
            nodes={nodes} edges={edges} 
            onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} 
            onConnect={onConnect} 
            defaultEdgeOptions={defaultEdgeOptions}
            onNodeClick={onNodeClick} onEdgeClick={onEdgeClick} onPaneClick={onPaneClick}
          />
        </main>

        <aside className="sidebar-right">
          <div className="panel-header">속성 (Properties)</div>
          <div className="panel-content">
            {!selectedTarget && <p className="empty-msg">요소를 선택하세요.</p>}

            {selectedTarget?.type === 'node' && currentNode && (
              <div className="property-group">
                {/* ✨ 테이블 이름 입력창 2개로 분리 */}
                <label className="prop-label">물리 테이블명 (Physical)</label>
                <input 
                  className="ui-input full-width" 
                  value={currentNode.data.label} 
                  onChange={(e) => updateTableName('label', e.target.value)} 
                  placeholder="ENG (ex: USERS)"
                />
                
                <label className="prop-label" style={{marginTop: '5px'}}>논리 테이블명 (Logical)</label>
                <input 
                  className="ui-input full-width" 
                  value={currentNode.data.logicalLabel || ''} 
                  onChange={(e) => updateTableName('logicalLabel', e.target.value)} 
                  placeholder="한글 (ex: 사용자)"
                />
                
                <div className="prop-divider"></div>

                <div className="columns-header">
                  <label className="prop-label">컬럼 목록</label>
                  <button className="add-col-btn" onClick={addColumn}>+ 추가</button>
                </div>
                <div className="column-list">
                  {currentNode.data.columns.map((col: any, idx: number) => (
                    <div key={idx} className="column-item">
                      <input type="checkbox" checked={col.isPk} onChange={(e) => updateColumn(idx, 'isPk', e.target.checked)} />
                      <input className="ui-input" value={col.name} onChange={(e) => updateColumn(idx, 'name', e.target.value)} placeholder="ENG" />
                      <input className="ui-input" value={col.logicalName || ''} onChange={(e) => updateColumn(idx, 'logicalName', e.target.value)} placeholder="한글" />
                      <input className="ui-input short" value={col.type} onChange={(e) => updateColumn(idx, 'type', e.target.value)} />
                      <button className="del-col-btn" onClick={() => deleteColumn(idx)}>×</button>
                    </div>
                  ))}
                </div>
                <div className="prop-divider"></div>
                <button className="delete-btn" onClick={handleDelete}><Trash2 size={16} /> 삭제</button>
              </div>
            )}

            {selectedTarget?.type === 'edge' && (
              <div className="property-group">
                <label className="prop-label">관계 스타일</label>
                <div className="radio-group">
                  <label><input type="radio" name="r" onChange={() => updateEdgeType(false)} defaultChecked /> 비식별 (점선)</label>
                  <label><input type="radio" name="r" onChange={() => updateEdgeType(true)} /> 식별 (실선)</label>
                </div>
                <div className="prop-divider"></div>
                <label className="prop-label">관계 차수</label>
                <div className="cardinality-controls">
                  <div className="control-row"><span>Source</span><select disabled className="ui-select"><option>1 (One)</option></select></div>
                  <div className="control-row">
                    <span>Target</span>
                    <select className="ui-select" onChange={(e) => updateCardinality(e.target.value as '1' | 'N')}>
                      <option value="N">N (Many)</option>
                      <option value="1">1 (One)</option>
                    </select>
                  </div>
                </div>
                <div className="prop-divider"></div>
                <button className="delete-btn" onClick={handleDelete}><Trash2 size={16} /> 관계선 삭제</button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MainLayout;