import React, { useState, useCallback } from 'react';
import { 
  MousePointer2, PlusSquare, Link, Trash2, ArrowUp, ArrowDown,
  Save, FolderOpen, FileCode, Image as ImageIcon 
  /* Download 제거함 */
} from 'lucide-react';
import { 
  useNodesState, useEdgesState, addEdge, 
  type Connection, type Node, type Edge 
} from 'reactflow';
import ErdCanvas from './ErdCanvas';
import './ErdPage.css';

// 타입 정의
type ViewMode = 'logical' | 'physical' | 'both';

// 초기 데이터
const initialNodes: Node[] = [
  { 
    id: 'table-1', 
    type: 'table', 
    position: { x: 100, y: 100 }, 
    data: { 
      label: 'Users', 
      logicalLabel: '사용자', 
      viewMode: 'both',
      columns: [
        { name: 'user_id', logicalName: '아이디', type: 'INT', isPk: true },
        { name: 'username', logicalName: '이름', type: 'VARCHAR(50)' },
      ]
    },
  },
];

const ErdPage = () => {
  // === 상태 관리 ===
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [activeTool, setActiveTool] = useState('select');
  const [viewMode, setViewMode] = useState<ViewMode>('both');
  const [selectedTarget, setSelectedTarget] = useState<{ type: 'node' | 'edge', data: any } | null>(null);

  // === 이벤트 핸들러 ===
  const defaultEdgeOptions = {
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#64748b', strokeWidth: 2 },
    markerStart: 'erd-one', 
    markerEnd: 'erd-many',
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, ...defaultEdgeOptions }, eds)),
    [setEdges]
  );

  const handleViewModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mode = e.target.value as ViewMode;
    setViewMode(mode);
    setNodes((nds) => 
      nds.map((node) => ({ ...node, data: { ...node.data, viewMode: mode } }))
    );
  };

  const onNodeClick = (_: any, node: Node) => setSelectedTarget({ type: 'node', data: node });
  const onEdgeClick = (_: any, edge: Edge) => setSelectedTarget({ type: 'edge', data: edge });
  const onPaneClick = () => setSelectedTarget(null);

  const handleAddTable = () => {
    const newId = `table-${Date.now()}`;
    const newNode: Node = {
      id: newId,
      type: 'table',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: { 
        label: 'New Table', 
        logicalLabel: '새 테이블', 
        viewMode: viewMode,
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
      setEdges((eds) => eds.filter((e) => e.id !== selectedTarget.data.id));
    }
    setSelectedTarget(null);
  };

  const updateTableName = (field: 'label' | 'logicalLabel', value: string) => {
    if (selectedTarget?.type !== 'node') return;
    setNodes((nds) => nds.map((n) => 
      n.id === selectedTarget.data.id ? { ...n, data: { ...n.data, [field]: value } } : n
    ));
  };

  const addColumn = () => {
    if (selectedTarget?.type !== 'node') return;
    setNodes((nds) => nds.map((n) => n.id === selectedTarget.data.id ? { 
      ...n, data: { ...n.data, columns: [...n.data.columns, { name: 'new_col', logicalName: '새컬럼', type: 'VARCHAR', isPk: false }] } 
    } : n));
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

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    if (selectedTarget?.type !== 'node') return;
    setNodes((nds) => nds.map((n) => {
      if (n.id === selectedTarget.data.id) {
        const newCols = [...n.data.columns];
        if (direction === 'up' && index > 0) {
          [newCols[index], newCols[index - 1]] = [newCols[index - 1], newCols[index]];
        } else if (direction === 'down' && index < newCols.length - 1) {
          [newCols[index], newCols[index + 1]] = [newCols[index + 1], newCols[index]];
        }
        return { ...n, data: { ...n.data, columns: newCols } };
      }
      return n;
    }));
  };

  const deleteColumn = (idx: number) => {
    if (selectedTarget?.type !== 'node') return;
    setNodes((nds) => nds.map((n) => n.id === selectedTarget.data.id ? { 
      ...n, data: { ...n.data, columns: n.data.columns.filter((_: any, i: number) => i !== idx) } 
    } : n));
  };

  const updateEdgeType = (isIdentifying: boolean) => {
    if (selectedTarget?.type !== 'edge') return;
    setEdges((eds) => eds.map((e) => e.id === selectedTarget.data.id ? {
      ...e, animated: !isIdentifying, style: { ...e.style, strokeDasharray: isIdentifying ? '0' : '5,5' }
    } : e));
  };

  const updateMarker = (side: 'start' | 'end', type: '1' | 'N') => {
    if (selectedTarget?.type !== 'edge') return;
    
    const markerName = `erd-${type === '1' ? 'one' : 'many'}`;
    const propName = side === 'start' ? 'markerStart' : 'markerEnd';

    setEdges((eds) => eds.map((e) => e.id === selectedTarget.data.id ? {
      ...e, [propName]: markerName,
    } : e));
  };

  const currentNode = selectedTarget?.type === 'node' ? nodes.find(n => n.id === selectedTarget.data.id) : null;
  const currentEdge = selectedTarget?.type === 'edge' ? edges.find(e => e.id === selectedTarget.data.id) : null;

  const getMarkerValue = (markerId?: string | object) => {
     if (typeof markerId !== 'string') return '1';
     return markerId.includes('many') ? 'N' : '1';
  };

  // 임시 메뉴 클릭 핸들러
  const handleMenuClick = (action: string) => {
    alert(`[${action}] 기능은 준비 중입니다.`);
  };

  // === 화면 렌더링 ===
  return (
    <div className="erd-page-container" style={{ display: 'flex', width: '100%', height: '100%' }}>
      
      {/* 1. 왼쪽: 그리기 도구 툴바 */}
      <div className="erd-toolbar-vertical" style={{ width: '60px', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10px', gap: '10px', background: '#25262b' }}>
        <button className={`tool-btn ${activeTool === 'select' ? 'active' : ''}`} onClick={() => setActiveTool('select')} title="선택">
          <MousePointer2 size={24} />
        </button>
        <button className={`tool-btn ${activeTool === 'table' ? 'active' : ''}`} onClick={handleAddTable} title="테이블 추가">
          <PlusSquare size={24} />
        </button>
        <button className={`tool-btn ${activeTool === 'relation' ? 'active' : ''}`} onClick={() => setActiveTool('relation')} title="관계선 연결">
          <Link size={24} />
        </button>
      </div>

      {/* 2. 중앙: 상단 메뉴 + 캔버스 */}
      <div className="center-area" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* ✨ 상단 파일 메뉴바 */}
        <div className="erd-top-menu">
          <div className="menu-group">
            <button className="menu-btn" onClick={() => handleMenuClick('저장')}>
              <Save size={16} /> 저장
            </button>
            <button className="menu-btn" onClick={() => handleMenuClick('불러오기')}>
              <FolderOpen size={16} /> 불러오기
            </button>
          </div>
          
          <div className="menu-divider"></div>

          <div className="menu-group">
            <button className="menu-btn" onClick={() => handleMenuClick('SQL 내보내기')}>
              <FileCode size={16} /> SQL Export
            </button>
            <button className="menu-btn" onClick={() => handleMenuClick('이미지 저장')}>
              <ImageIcon size={16} /> 이미지 저장
            </button>
          </div>

          <div style={{ flex: 1 }}></div>
          
          {/* 뷰 모드 컨트롤 */}
          <div className="view-mode-group">
             <span className="view-label">View:</span>
             <select value={viewMode} onChange={handleViewModeChange} className="view-select">
                <option value="logical">논리</option>
                <option value="physical">물리</option>
                <option value="both">모두</option>
             </select>
          </div>
        </div>

        {/* 캔버스 영역 */}
        <div className={`canvas-wrapper tool-${activeTool}`} style={{ flex: 1, position: 'relative' }}>
           <ErdCanvas 
             nodes={nodes} edges={edges} 
             onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} 
             onConnect={onConnect} 
             defaultEdgeOptions={defaultEdgeOptions}
             onNodeClick={onNodeClick} onEdgeClick={onEdgeClick} onPaneClick={onPaneClick}
           />
        </div>
      </div>

      {/* 3. 우측 속성 패널 */}
      <aside className="properties-panel" style={{ width: '380px', background: '#25262b', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div className="panel-header" style={{ padding: '15px', borderBottom: '1px solid #333', fontWeight: 'bold' }}>속성 (Properties)</div>
        <div className="panel-content" style={{ padding: '15px', overflowY: 'auto', flex: 1 }}>
          {!selectedTarget && <p className="empty-msg" style={{ color: '#888', textAlign: 'center', marginTop: '20px' }}>요소를 선택하세요.</p>}

          {selectedTarget?.type === 'node' && currentNode && (
             <div className="property-group">
                <label className="prop-label">물리 테이블명 (Physical)</label>
                <input className="ui-input full-width" value={currentNode.data.label} onChange={(e) => updateTableName('label', e.target.value)} placeholder="ENG (ex: USERS)" />
                
                <label className="prop-label" style={{marginTop:'10px'}}>논리 테이블명 (Logical)</label>
                <input className="ui-input full-width" value={currentNode.data.logicalLabel || ''} onChange={(e) => updateTableName('logicalLabel', e.target.value)} placeholder="한글 (ex: 사용자)" />
                
                <div style={{margin: '15px 0', borderTop: '1px solid #444'}}></div>

                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'5px'}}>
                   <label>컬럼 목록</label>
                   <button onClick={addColumn} style={{fontSize:'12px', padding:'2px 5px'}}>+ 추가</button>
                </div>

                <div className="column-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentNode.data.columns.map((col: any, idx: number) => (
                    <div key={idx} className="column-item" style={{ display: 'flex', gap: '5px', padding: '8px', background: '#334155', borderRadius: '4px', alignItems: 'center' }}>
                      
                      {/* 이동 버튼 */}
                      <div className="col-move-btns" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px' }}>
                         <button onClick={() => moveColumn(idx, 'up')} disabled={idx===0} style={{background:'none', border:'none', cursor:'pointer', padding: 0, color: '#94a3b8'}}><ArrowUp size={12} /></button>
                         <button onClick={() => moveColumn(idx, 'down')} disabled={idx===currentNode.data.columns.length-1} style={{background:'none', border:'none', cursor:'pointer', padding: 0, color: '#94a3b8'}}><ArrowDown size={12} /></button>
                      </div>

                      {/* PK 체크 */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                         <input type="checkbox" checked={col.isPk} onChange={(e) => updateColumn(idx, 'isPk', e.target.checked)} title="PK 여부" style={{ cursor: 'pointer' }} />
                      </div>

                      {/* 입력 필드 (물리 | 논리 | 타입) */}
                      <div style={{ display: 'flex', flex: 1, gap: '4px' }}>
                         <input className="ui-input" value={col.name} onChange={(e) => updateColumn(idx, 'name', e.target.value)} placeholder="ENG" style={{ flex: 1, minWidth: '0' }} />
                         <input className="ui-input" value={col.logicalName || ''} onChange={(e) => updateColumn(idx, 'logicalName', e.target.value)} placeholder="한글" style={{ flex: 1, minWidth: '0' }} />
                         <input className="ui-input" value={col.type} onChange={(e) => updateColumn(idx, 'type', e.target.value)} placeholder="TYPE" style={{ width: '60px', textAlign: 'center' }} />
                      </div>

                      {/* 삭제 버튼 */}
                      <button onClick={() => deleteColumn(idx)} style={{background:'none', border:'none', color:'#ff6b6b', cursor:'pointer', display:'flex', alignItems:'center'}}>
                         <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button className="delete-btn" onClick={handleDelete} style={{width:'100%', marginTop:'20px', background:'#e03131', color:'white', border:'none', padding:'8px', borderRadius: '4px', cursor: 'pointer'}}>테이블 삭제</button>
             </div>
          )}

          {selectedTarget?.type === 'edge' && currentEdge && (
             <div className="property-group">
                <label className="prop-label">관계 스타일</label>
                <div>
                   <label style={{marginRight: '10px'}}><input type="radio" name="r" onChange={() => updateEdgeType(false)} checked={!currentEdge.style?.strokeDasharray || currentEdge.style.strokeDasharray === '0'} /> 실선 (식별)</label>
                   <label><input type="radio" name="r" onChange={() => updateEdgeType(true)} checked={currentEdge.style?.strokeDasharray === '5,5'} /> 점선 (비식별)</label>
                </div>
                <div style={{margin: '15px 0', borderTop: '1px solid #444'}}></div>
                <label className="prop-label">관계 차수</label>
                <div style={{display:'flex', gap:'10px', alignItems: 'center'}}>
                   <select value={getMarkerValue(currentEdge.markerStart as string)} onChange={(e) => updateMarker('start', e.target.value as any)} style={{padding: '4px', background: '#1a1b1e', color: 'white', border: '1px solid #444'}}>
                      <option value="1">1</option>
                      <option value="N">N</option>
                   </select>
                   <span>to</span>
                   <select value={getMarkerValue(currentEdge.markerEnd as string)} onChange={(e) => updateMarker('end', e.target.value as any)} style={{padding: '4px', background: '#1a1b1e', color: 'white', border: '1px solid #444'}}>
                      <option value="1">1</option>
                      <option value="N">N</option>
                   </select>
                </div>
                <button className="delete-btn" onClick={handleDelete} style={{width:'100%', marginTop:'20px', background:'#e03131', color:'white', border:'none', padding:'8px', borderRadius: '4px', cursor: 'pointer'}}>관계선 삭제</button>
             </div>
          )}
        </div>
      </aside>
    </div>
  );
};

export default ErdPage;