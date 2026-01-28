// ../ 를 사용하여 services 폴더를 나간 후 api/http 경로를 찾습니다.
import api from '../api/http'; 

export const RoleService = {
    // 권한 목록 조회
    getRoles: async () => {
        // api 인스턴스에 /api 기본 경로가 설정되어 있으므로 /Role만 작성합니다.
        const response = await api.get('/Role');
        return response.data;
    },

    // 권한 저장 (신규/수정 통합)
    saveRole: async (role: any) => {
        // /api/Role/save 로 요청이 전송됩니다.
        const response = await api.post('/Role/save', role);
        return response.data;
    },

    // 권한 삭제
    deleteRole: async (roleNo: number) => {
        // /api/Role/{roleNo} 로 요청이 전송됩니다.
        const response = await api.delete(`/Role/${roleNo}`);
        return response.data;
    }
};