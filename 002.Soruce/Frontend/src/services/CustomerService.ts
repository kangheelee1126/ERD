import api from '../api/http';

// ✨ [추가] 페이징 결과 공통 인터페이스 (백엔드 PagedResult와 매핑)
export interface PagedResult<T> {
    items: T[];          // 데이터 리스트
    totalCount: number;  // 전체 데이터 수
    pageNumber: number;  // 현재 페이지
    pageSize: number;    // 페이지당 개수
    totalPages: number;  // 전체 페이지 수
}

export interface CommonCode {
    code: string;
    name: string;
}

// 고객사 데이터 타입 정의
export interface Customer {
    customerId: number;
    custCd: string;
    custNm: string;
    custNmEn?: string;
    custTypeCd?: string;
    industryCd?: string;
    mfgTypeCd?: string;
    devCapabilityCd?: string;
    sourceModYn: string;
    bizNo?: string;
    telNo?: string;
    zipCd?: string;
    addr1?: string;
    addr2?: string;
    timezoneCd?: string;
    comments?: string;
    sortNo: number;
    useYn: string;
    
    regDt?: string;
    regId?: string;
    modDt?: string;
    modId?: string;
}

export const CustomerService = {
  // 1. 고객사 목록 조회 (페이징 적용)
  // ✨ [수정] page, size 파라미터 추가
  getCustomers: async (page: number, size: number, keyword: string = '') => {
    const response = await api.get<PagedResult<Customer>>('/system/customer', { 
      params: { 
          page, 
          size, 
          keyword 
      } 
    });
    return response.data; // 이제 items만 오는 게 아니라 PagedResult 객체가 반환됩니다.
  },

  // ✨ [추가] 단건 상세 조회
  getCustomer: async (id: number) => {
    const response = await api.get<Customer>(`/system/customer/${id}`);
    return response.data;
  },
  
  // 2. 고객사 저장
  saveCustomer: async (customer: Customer) => {
    const response = await api.post('/system/customer/save', [customer]);
    return response.data;
  },

  // 3. 고객사 삭제
  deleteCustomer: async (customerId: number) => {
    const response = await api.delete(`/system/customer/${customerId}`);
    return response.data;
  },

  // 4. 공통코드 조회
  getCommonCodes: async (groupCd: string) => {
    try {
      const response = await api.get(`/system/common-code/details/${groupCd}`);
      
      const serverData = Array.isArray(response.data) ? response.data : [];

      return serverData.map((item: any) => ({
        code: item.code_cd,  // 실제 서버 데이터 Key
        name: item.code_nm   // 실제 서버 데이터 Key
      }));

    } catch (error) {
      console.error(`공통코드 로드 실패 (${groupCd}):`, error);
      return [];
    }
  }
};