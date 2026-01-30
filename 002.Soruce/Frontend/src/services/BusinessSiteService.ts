import api from '../api/http';

export const BusinessSiteService = {
    /**
     * 1. 사업장 목록 조회 (페이징 및 검색)
     * @param page 현재 페이지 번호
     * @param size 페이지당 데이터 개수
     * @param siteNm 사업장명 검색어
     */
    getSites: async (page: number, size: number, siteNm?: string) => {
        // 백엔드 호출 시 page와 size 파라미터를 쿼리 스트링으로 전송 [cite: 2026-01-30]
        const response = await api.get('/BusinessSite', {
            params: { page, size, siteNm }
        });
        return response.data; // { items: [], totalCount: 0, page: 1, size: 10 } 반환
    },

    /**
     * 2. 사업장 상세 조회
     */
    getSiteById: async (id: number) => {
        const response = await api.get(`/BusinessSite/${id}`);
        return response.data;
    },

    /**
     * 3. 신규 사업장 등록
     * 입력 항목이 5개 이상이므로 전체 DTO 객체를 전송 [cite: 2026-01-29]
     */
    createSite: async (siteData: any) => {
        const response = await api.post('/BusinessSite', siteData);
        return response.data;
    },

    /**
     * 4. 사업장 정보 수정
     */
    updateSite: async (id: number, siteData: any) => {
        const response = await api.put(`/BusinessSite/${id}`, siteData);
        return response.data;
    },

    /**
     * 5. 사업장 삭제
     */
    deleteSite: async (id: number) => {
        // 삭제 성공 후 프론트엔드에서 즉시 재조회를 수행하도록 구성 [cite: 2026-01-29]
        const response = await api.delete(`/BusinessSite/${id}`);
        return response.data;
    }
};