import React, { useState } from 'react';
import { User, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom'; // 페이지 이동을 위해 추가
import logoImg from '../../assets/logo.png';
import './RegisterPage.css'; // 전용 스타일 파일

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    id: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  // 입력값 변경 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 회원가입 버튼 클릭 시
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 간단한 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setError('');
    console.log('회원가입 정보:', formData);
    alert(`${formData.name}님, 가입을 축하합니다! (테스트)`);
  };

  return (
    <div className="register-container">
      <div className="register-card">
        {/* 헤더 */}
        <div className="register-header">
          <img src={logoImg} alt="Logo" className="register-logo" />
          <h1 className="register-title">회원가입</h1>
          <p className="register-subtitle">001.ERD에 오신 것을 환영합니다</p>
        </div>

        {/* 폼 영역 */}
        <form onSubmit={handleRegister} className="register-form">
          
          {/* 이름 */}
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              name="name"
              placeholder="이름" 
              value={formData.name}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          {/* 이메일 */}
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" 
              name="email"
              placeholder="이메일 주소" 
              value={formData.email}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          {/* 아이디 */}
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" 
              name="id"
              placeholder="아이디" 
              value={formData.id}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          {/* 비밀번호 */}
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" 
              name="password"
              placeholder="비밀번호" 
              value={formData.password}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className={`input-group ${error ? 'error-border' : ''}`}>
            <CheckCircle className="input-icon" size={20} />
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="비밀번호 확인" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className="register-input"
              required
            />
          </div>

          {/* 에러 메시지 표시 */}
          {error && (
            <div className="error-message">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="checkbox-area">
            <input type="checkbox" id="terms" required className="custom-checkbox"/>
            <label htmlFor="terms">이용약관에 동의합니다</label>
          </div>

          <button type="submit" className="register-btn">
            가입하기
          </button>
        </form>

        {/* 로그인 페이지로 돌아가기 */}
        <div className="register-footer">
          이미 계정이 있으신가요? <Link to="/login" className="link-highlight">로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;