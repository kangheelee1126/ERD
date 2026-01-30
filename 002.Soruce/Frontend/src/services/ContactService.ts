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
    }
};