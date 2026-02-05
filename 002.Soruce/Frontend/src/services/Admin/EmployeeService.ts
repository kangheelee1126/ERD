import api from '../../api/http'; // 공통 axios 인스턴스 사용 [cite: 2026-01-30]

/**
 * 직원 마스터 데이터 인터페이스 (14개 입력 항목 기준)
 */
export interface Employee {
    empId?: number;        // 내부 식별자 (PK)
    empNo: string;         // 1. 사번/ID
    empNm: string;         // 2. 직원명
    email: string;         // 3. 이메일
    phone: string;         // 4. 전화번호
    deptCd: string;        // 5. 부서코드
    deptNm: string;        // 부서명 (추가)
    positionNm: string;    // 6. 직급명
    jobNm: string;         // 7. 직무명
    hireDt: string;        // 8. 입사일
    resignDt: string;      // 9. 퇴사일
    activeYn: 'Y' | 'N';   // 10. 재직여부
    srHandleYn: 'Y' | 'N'; // 11. SR 담당 여부
    note: string;          // 12. 비고
    crtBy: string;         // 13. 생성자
    updBy: string;         // 14. 수정자
}

/**
 * 페이징 결과 인터페이스 [cite: 2026-01-30]
 */
export interface EmployeePagedResult {
    items: Employee[];
    totalCount: number;
}

export const EmployeeService = {
    /**
     * ✨ 직원 목록 조회 (페이징 및 검색)
     * GET /api/business/Employee
     */
    getEmployees: async (page: number, size: number, search?: string): Promise<EmployeePagedResult> => {
        const response = await api.get('/Admin/Employee', {
            params: { page, size, search } // 표준 페이징 파라미터 [cite: 2026-01-30]
        });
        return response.data;
    },

    /**
     * ✨ 직원 정보 저장 (신규 등록 및 수정 통합)
     * POST /api/business/Employee
     */
    saveEmployee: async (data: Employee): Promise<any> => {
        // Newtonsoft.Json(camelCase) 형식으로 전송됨 [cite: 2026-02-03]
        const response = await api.post('/Admin/Employee', data);
        return response.data;
    },

    /**
     * ✨ 직원 정보 삭제
     * DELETE /api/business/Employee/{id}
     */
    deleteEmployee: async (id: number): Promise<any> => {
        const response = await api.delete(`/Admin/Employee/${id}`);
        return response.data;
    }
};