import api from '../api/http';

export const BusinessSiteService = {
    /**
     * 1. 사업장 목록 조회 (페이징, 고객사 필터, 통합 키워드 검색)
     * @param page 현재 페이지 번호
     * @param size 페이지당 데이터 개수
     * @param keyword 사업장명 또는 ID 검색어 [cite: 2026-01-30]
     * @param customerId 고객사 ID 필터 [cite: 2026-01-30]
     */
    getSites: async (page: number, size: number, keyword?: string, customerId?: number) => {
        // 백엔드 컨트롤러의 GetList 매개변수와 일치하도록 파라미터 구성 [cite: 2026-01-30]
        const response = await api.get('/BusinessSite', {
            params: { 
                page, 
                size, 
                keyword,    // siteNm에서 keyword로 변경 [cite: 2026-01-30]
                customerId  // 고객사 필터 추가 [cite: 2026-01-30]
            }
        });
        return response.data; // { items: [], totalCount: 0, page: 1, size: 10 } 반환
    },

    /**
     * 2. 사업장 상세 조회
     * 수정 버튼 클릭 시 호출되어 최신 상세 정보를 가져옵니다. [cite: 2026-01-30]
     */
    getSiteById: async (id: number) => {
        const response = await api.get(`/BusinessSite/${id}`);
        return response.data;
    },

    /**
     * 3. 신규 사업장 등록
     * 입력 항목이 5개 이상이므로 전체 DTO 객체를 전송 [cite: 2026-01-29]
     * injectAuditFields를 통해 생성자 정보가 포함된 데이터를 보냅니다. [cite: 2026-01-30]
     */
    createSite: async (siteData: any) => {
        const response = await api.post('/BusinessSite', siteData);
        return response.data;
    },

    /**
     * 4. 사업장 정보 수정
     * injectAuditFields를 통해 수정자 정보가 포함된 데이터를 보냅니다. [cite: 2026-01-30]
     */
    updateSite: async (id: number, siteData: any) => {
        const response = await api.put(`/BusinessSite/${id}`, siteData);
        return response.data;
    },

    /**
     * 5. 사업장 삭제
     */
    deleteSite: async (id: number) => {
        // "삭제하시겠습니까?" 컨펌 후 호출되며, 성공 시 true를 반환하도록 구성 [cite: 2026-01-29]
        const response = await api.delete(`/BusinessSite/${id}`);
        return response.status === 200; 
    }
};