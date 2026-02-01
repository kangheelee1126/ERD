// src/utils/dataUtils.ts
export const injectAuditFields = (formData: any, pkField: string = 'siteId') => {
    // localStorage에서 로그인 시 저장한 userId를 가져옵니다. [cite: 2026-01-30]
    const loginUserId = localStorage.getItem('userId') || 'system';

    return {
        ...formData,
        // PK가 0이면 신규 등록이므로 생성자를 세팅하고, 아니면 기존 생성자를 유지합니다. [cite: 2026-01-30]
        createdBy: formData[pkField] === 0 ? loginUserId : formData.createdBy,
        // 수정자는 언제나 현재 로그인한 사용자로 업데이트합니다. [cite: 2026-01-30]
        updatedBy: loginUserId 
    };
};