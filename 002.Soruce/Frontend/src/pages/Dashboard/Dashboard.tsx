import { Link } from 'react-router-dom'; // 👈 링크 기능 추가
import { LayoutGrid, AlertCircle, Users, Database, ArrowRight } from 'lucide-react'; // 아이콘 추가
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">대시보드</h2>
      
      <div className="stats-grid">
        {/* ✨ [New] ERD 캔버스 바로가기 카드 ✨ */}
        <Link to="/erd" style={{ textDecoration: 'none' }}>
          <div className="stat-card" style={{ border: '2px solid #3b82f6', cursor: 'pointer' }}>
            <div className="card-header text-blue">
              <Database size={18} /> 바로가기
            </div>
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                ERD 프로젝트 열기
              </span>
              <ArrowRight size={24} color="#3b82f6" />
            </div>
          </div>
        </Link>

        {/* 기존 카드 1 */}
        <div className="stat-card">
          <div className="card-header">
            <LayoutGrid size={18} /> 진행 중인 프로젝트
          </div>
          <p className="card-value">3<span className="unit">개</span></p>
        </div>

        {/* 기존 카드 2 */}
        <div className="stat-card">
          <div className="card-header text-red">
            <AlertCircle size={18} /> 신규 SR 요청
          </div>
          <p className="card-value text-red">12<span className="unit">건</span></p>
        </div>

        {/* 기존 카드 3 */}
        <div className="stat-card">
          <div className="card-header">
            <Users size={18} /> 전체 사용자
          </div>
          <p className="card-value">48<span className="unit">명</span></p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;