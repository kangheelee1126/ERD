import api from '../api/http'; // 기존 http 설정을 그대로 사용
import type { PagedResult } from './CustomerService';

// 만약 CustomerService에서 PagedResult를 export 안 했다면 여기서 정의하세요:
// export interface PagedResult<T> {
//   items: T[];
//   totalCount: number;
//   pageNumber: number;
//   pageSize: number;
//   totalPages: number;
// }

export interface Contact {
    contactId: number;
    customerId: number;
    custNm?: string; // 화면 표시용 (Join 데이터)
    
    contactCd?: string;
    contactNm: string;
    deptNm?: string;
    dutyNm?: string;
    telNo?: string;
    mobileNo?: string;
    email?: string;
    
    isMain: string;   // 'Y' | 'N'
    isActive: string; // 'Y' | 'N'
    
    startDt?: string; // YYYY-MM-DD
    endDt?: string;   // YYYY-MM-DD
    note?: string;
    
    // 관리 정보
    crtDt?: string;
    crtBy?: string;
    updDt?: string;
    updBy?: string;
}

// 역할 정보 인터페이스 정의 [cite: 2026-01-30]
export interface ContactRole {
    roleCd: string;     // 역할 코드 (예: R01)
    roleNm: string;     // 역할 명칭 (예: 영업담당)
    isPrimary: string;  // 대표 여부 (Y/N)
    isSelected?: boolean; // UI용: 선택 여부
    // ✨ 설계서에 따른 새 필드 추가
    startDt?: string | null; // 적용시작일
    endDt?: string | null;   // 적용종료일
    note?: string | null;    // 비고
}

export const ContactService = {
    // 1. 목록 조회 (페이징 + 검색)
    getContacts: async (page: number, size: number, custId?: number, keyword?: string) => {
        const response = await api.get<PagedResult<Contact>>('/business/contact', {
            params: { 
                page, 
                size, 
                custId: custId || '', // 0이나 null이면 빈값 처리
                keyword 
            }
        });
        return response.data;
    },

    // 2. 단건 상세 조회
    getContact: async (id: number) => {
        const response = await api.get<Contact>(`/business/contact/${id}`);
        return response.data;
    },

    // 3. 저장 (신규/수정)
    saveContact: async (contact: Contact) => {
        const response = await api.post('/business/contact/save', contact);
        return response.data;
    },

    // 4. 삭제
    deleteContact: async (id: number) => {
        const response = await api.delete(`/business/contact/${id}`);
        return response.data;
    },

    /**
     * ✨ 모든 역할 코드 목록 조회 (공통코드 'ROLE_CD' 기준 가정)
     */
    getRoleCodes: async () => {
        // 실제로는 공통코드 API를 호출하게 됩니다.
        const response = await api.get('/CommonCode/ROLE_CD'); 
        return response.data; // [{ code: 'R01', name: '영업담당' }, ...]
    },

    /**
     * ✨ 특정 담당자의 할당된 역할 목록 조회
     */
    getContactRoles: async (contactId: number) => {
        const response = await api.get(`/business/contact/${contactId}/Roles`);
        return response.data; // [{ roleCd: 'R01', isPrimary: 'Y' }, ...]
    },

    /**
     * ✨ 담당자 역할 매핑 정보 최종 저장
     */
    saveContactRoles: async (contactId: number, roles: ContactRole[]) => {
        return await api.post(`/business/contact/${contactId}/Roles`, roles);
    }

};