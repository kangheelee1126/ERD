import api from '../api/http'; 

export const RoleService = {
    // 1. 전체 권한 목록 조회
    getRoles: async () => {
        const response = await api.get('/Role');
        return response.data;
    },

    // 2. 권한 정보 저장 (신규/수정) [cite: 2026-01-28]
    saveRole: async (role: any) => {
        const response = await api.post('/Role/save', role);
        return response.data;
    },

    // 3. 권한 삭제 (RoleId: string) [cite: 2026-01-28]
    deleteRole: async (roleId: string) => {
        const response = await api.delete(`/Role/${roleId}`);
        return response.data;
    },

    // ✨ 4. 특정 권한의 메뉴 ID 목록 조회 (추가) [cite: 2026-01-28]
    getRoleMenus: async (roleId: string): Promise<string[]> => {
        const response = await api.get(`/Role/${roleId}/menus`);
        return response.data;
    },

    // ✨ 5. 권한별 메뉴 접근 권한 저장 (추가) [cite: 2026-01-28]
    saveRoleMenus: async (data: { roleId: string; menuIds: string[] }) => {
        const response = await api.post('/Role/save-menus', data);
        return response.data;
    }
};