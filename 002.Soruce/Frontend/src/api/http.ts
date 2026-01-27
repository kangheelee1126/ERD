import axios from 'axios';

// ✨ 백엔드 공통 주소 (여기만 수정하면 전체 적용!)
// 주의: 포트번호(44350)는 본인 Visual Studio 실행 포트로 꼭 맞춰주세요.
// 환경 변수에서 가져오되, 없을 경우를 대비한 Fallback 주소 설정
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://localhost:44353/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // (필요 시 나중에 토큰 설정 등도 여기서 함)
});

export default api;