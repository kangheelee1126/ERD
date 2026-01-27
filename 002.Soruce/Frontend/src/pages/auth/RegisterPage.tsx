import React, { useState } from 'react';
import { User, Lock, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';
import { AuthService } from '../../services/authService'; // ✨ 추가
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate(); // 페이지 이동을 위해 추가
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    id: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. 비밀번호 일치 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    
    setError('');

    try {
      // 2. 백엔드 엔티티 구조에 맞춰 데이터 매핑
      // C#의 UserAccount.cs 속성명과 일치해야 합니다.
      const registerData = {
        UserId: formData.id,
        Password: formData.password,
        UserName: formData.name,
        Email: formData.email
      };

      const result = await AuthService.register(registerData);

      if (result.success) {
        alert(`${formData.name}님, 가입을 축하합니다! 로그인 페이지로 이동합니다.`);
        navigate('/login');
      }
    } catch (err: any) {
      // 서버에서 보낸 에러 메시지 처리 (예: 아이디 중복 등)
      setError(err.response?.data?.message || '회원가입 처리 중 에러가 발생했습니다.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <img src={logoImg} alt="Logo" className="register-logo" />
          <h1 className="register-title">회원가입</h1>
          <p className="register-subtitle">001.ERD에 오신 것을 환영합니다</p>
        </div>

        <form onSubmit={handleRegister} className="register-form">
          {/* 이름 */}
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" name="name" placeholder="이름" 
              value={formData.name} onChange={handleChange}
              className="register-input" required
            />
          </div>

          {/* 이메일 */}
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input 
              type="email" name="email" placeholder="이메일 주소" 
              value={formData.email} onChange={handleChange}
              className="register-input" required
            />
          </div>

          {/* 아이디 */}
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input 
              type="text" name="id" placeholder="아이디" 
              value={formData.id} onChange={handleChange}
              className="register-input" required
            />
          </div>

          {/* 비밀번호 */}
          <div className="input-group">
            <Lock className="input-icon" size={20} />
            <input 
              type="password" name="password" placeholder="비밀번호" 
              value={formData.password} onChange={handleChange}
              className="register-input" required
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className={`input-group ${error ? 'error-border' : ''}`}>
            <CheckCircle className="input-icon" size={20} />
            <input 
              type="password" name="confirmPassword" placeholder="비밀번호 확인" 
              value={formData.confirmPassword} onChange={handleChange}
              className="register-input" required
            />
          </div>

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

          <button type="submit" className="register-btn">가입하기</button>
        </form>

        <div className="register-footer">
          이미 계정이 있으신가요? <Link to="/login" className="link-highlight">로그인</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;