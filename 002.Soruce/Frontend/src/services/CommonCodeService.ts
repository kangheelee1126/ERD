import api from '../api/http'; // 기존 http 설정을 그대로 사용

/**
 * 공통코드 상세 정보 인터페이스 [cite: 2026-02-02]
 */
export interface CommonCodeDetail {
    code_cd: string;     // 코드값 (예: R01)
    code_nm: string;     // 코드명 (예: 영업담당)
    code_grp_cd: string;    // 그룹코드
    sort_no: number;    // 정렬순서
    use_yn: string;      // 사용여부
}

export const CommonCodeService = {
    /**
     * ✨ 시스템 공통코드 상세 목록 조회 [cite: 2026-02-02]
     * @param groupCd 조회할 그룹 코드 (예: 'ROLE_CD')
     */
    getDetails: async (groupCd: string): Promise<CommonCodeDetail[]> => {
        // 지정된 공통 경로 사용 [cite: 2026-02-02]
        const response = await api.get(`/system/common-code/details/${groupCd}`);
        return response.data; 
    }
};