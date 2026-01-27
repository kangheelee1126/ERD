import api from '../api/http'; // ✨ 방금 만드신 http.ts 임포트

export const AuthService = {
  // 1. 로그인 요청
  login: async (loginData: any) => {
    // baseURL이 /api까지 포함하므로 뒤의 경로만 적어줍니다.
    const response = await api.post('/auth/login', loginData);
    return response.data;
  },

  // 2. 회원가입 요청
  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  }
};