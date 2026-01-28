// ../ 를 사용하여 services 폴더를 나간 후 api/http 경로를 찾습니다.
import api from '../api/http'; 

export const UserService = {
    // 사용자 목록 조회
    getUsers: async () => {
        // api 인스턴스에 /api 기본 경로가 설정되어 있으므로 /User만 작성합니다.
        const response = await api.get('/User');
        return response.data;
    },

    // 사용자 저장 (신규/수정 통합)
    saveUser: async (user: any) => {
        // /api/User/save 로 요청이 전송됩니다.
        const response = await api.post('/User/save', user);
        return response.data;
    },

    // 사용자 삭제
    deleteUser: async (userNo: number) => {
        // /api/User/{userNo} 로 요청이 전송됩니다.
        const response = await api.delete(`/User/${userNo}`);
        return response.data;
    }
};