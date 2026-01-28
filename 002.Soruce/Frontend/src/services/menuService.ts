// ../ 를 사용하여 services 폴더를 나간 후 api/http 경로를 찾습니다.
import api from '../api/http'; 

export const MenuService = {
  // 전체 메뉴 트리 가져오기
  getMenus: async () => {
    const response = await api.get('/menus');
    return response.data;
  },

  // ✨ 신규: 사용자의 권한에 따른 인가된 메뉴 목록 가져오기 [cite: 2026-01-28]
  getAuthorizedMenus: async (userNo: number) => {
    // 백엔드의 [HttpGet("authorized/{userNo}")] API와 연결됩니다. [cite: 2026-01-28]
    const response = await api.get(`/menus/authorized/${userNo}`);
    return response.data;
  },

  // 메뉴 저장 (신규/수정 통합)
  saveMenu: async (menuData: any) => {
    // /api/menus/save 로 요청이 날아갑니다.
    return await api.post('/menus/save', menuData);
  },

  // 메뉴 삭제
  deleteMenu: async (id: string) => {
    return await api.delete(`/menus/${id}`);
  }

  //주의 /api/는 제외 하고 나머지 경로로 해주세요.
};