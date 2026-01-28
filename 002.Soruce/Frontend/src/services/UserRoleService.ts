import api from '../api/http'; 

export const UserRoleService = {
    // ✨ 사용자가 보유한 권한 ID 목록 조회
    getUserRoles: async (userNo: number): Promise<string[]> => {
        const response = await api.get(`/UserRole/${userNo}`);
        return response.data;
    },

    // ✨ 사용자 권한 매핑 정보 저장 [cite: 2026-01-28]
    saveUserRoles: async (data: { userNo: number; roleIds: string[] }) => {
        const response = await api.post('/UserRole/save', data);
        return response.data;
    }
};