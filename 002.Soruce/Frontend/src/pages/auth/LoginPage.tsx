import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

// ✨ [중요] 아까 만든 공통 API 모듈을 여기서 불러와야 합니다!
import api from '../../api/http'; 

import logoImg from '../../assets/logo.png';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  
  // 상태 관리
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 로그인 버튼 클릭 시 실행될 함수
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 유효성 검사
    if (!id || !password) {
      alert('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    try {
      // ✅ api.post 사용
      // http.ts에 설정된 baseURL 덕분에 뒷부분 주소만 적으면 됩니다.
      const response = await api.post('/auth/login', {
        userId: id,
        password: password
      });

      // 2. 성공 시 (HTTP 200)
      if (response.status === 200) {
        const { userName , userNo } = response.data;
        
        // ✨ [핵심 수정] localStorage에 사용자 정보를 저장하여 사이드바와 공유합니다. [cite: 2026-01-27]
        localStorage.setItem('userNo', userNo.toString());
        localStorage.setItem('userName', userName);
        
        alert(`${userName}님, 환영합니다!`);
        console.log('로그인 성공 데이터:', response.data);
        
        // 메인 화면으로 이동
        navigate('/main'); 
      }

    } catch (error: any) {
      // 3. 실패 시 에러 처리
      console.error("로그인 에러:", error);

      if (error.response) {
        // 서버가 응답을 줬지만 실패한 경우 (예: 401 Unauthorized)
        if (error.response.status === 401) {
          alert("아이디 또는 비밀번호가 일치하지 않습니다.");
        } else {
          alert(`오류 발생: ${error.response.data.message || "알 수 없는 오류"}`);
        }
      } else {
        // 서버 연결 실패
        alert("서버에 연결할 수 없습니다. (백엔드 실행 여부와 포트를 확인하세요)");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* 헤더 영역 */}
        <div className="login-header">
          <img src={logoImg} alt="Seungye Logo" className="login-logo" />
          <h1 className="brand-title">
            ERD <span className="brand-highlight">System</span>
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
              required 
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
              required 
            />
            <button 
              type="button" 
              className="toggle-pw"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
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