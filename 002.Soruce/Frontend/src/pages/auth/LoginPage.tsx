import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 추가 1
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import logoImg from '../../assets/logo.png'; // 저장한 승예 캐릭터 로고 불러오기
import './LoginPage.css'; // 스타일 파일 불러오기
import { Link } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate(); // 👈 추가 2
  // 상태 관리 (아이디, 비밀번호, 비밀번호 보이기 여부)
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 로그인 버튼 클릭 시 실행될 함수
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault(); // 페이지 새로고침 방지
    
    // TODO: 나중에 여기에 백엔드 API 연동 코드를 넣을 예정입니다.
    console.log('로그인 시도:', { id, password });
    
    if (id && password) {
      alert(`${id}님, 환영합니다! (로그인 테스트 성공)`);
      navigate('/main'); // 👈 메인 화면으로 납치!
    } else {
      alert('아이디와 비밀번호를 입력해주세요.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* 헤더 영역: 로고와 타이틀 */}
        <div className="login-header">
          {/* 승예 캐릭터 로고 이미지 */}
          <img src={logoImg} alt="Seungye Logo" className="login-logo" />
          
          <h1 className="brand-title">
            ERD <span className="brand-highlight">Sytem</span>
          </h1>
          <p className="welcome-text">환영합니다!</p>
        </div>

        {/* 로그인 폼 영역 */}
        <form onSubmit={handleLogin} className="login-form">
          {/* 아이디 입력칸 */}
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              placeholder="아이디" 
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="login-input"
              required // 필수 입력 설정
            />
          </div>

          {/* 비밀번호 입력칸 */}
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="비밀번호" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required // 필수 입력 설정
            />
            {/* 눈 모양 아이콘 (비밀번호 보이기/숨기기) */}
            <button 
              type="button" 
              className="toggle-pw"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1} // 탭 키로 포커스 가지 않도록 설정
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* 로그인 상태 유지 체크박스 */}
          <div className="checkbox-area">
            <input type="checkbox" id="keepLogin" className="custom-checkbox" />
            <label htmlFor="keepLogin">로그인 상태 유지</label>
          </div>

          {/* 로그인 버튼 */}
          <button type="submit" className="login-btn">
            로그인
          </button>
        </form>

        {/* 하단 링크 영역 */}
        <div className="login-footer">
          <a href="#" className="footer-link">비밀번호 찾기</a>
          <span className="divider">|</span>
          <Link to="/register" className="footer-link">회원가입</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;