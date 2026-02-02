/**
 * 감사 필드 주입 함수 (직접 내보내기 - BusinessManage.tsx 용) [cite: 2026-01-30]
 */
export const injectAuditFields = (formData: any, pkField: string = 'siteId') => {
    const loginUserId = localStorage.getItem('userId') || 'system';

    // 배열 처리 로직 [cite: 2026-01-30]
    if (Array.isArray(formData)) {
        return formData.map(item => {
            const isNew = !item[pkField] || item[pkField] === 0;
            return {
                ...item,
                createdBy: isNew ? loginUserId : item.createdBy,
                updatedBy: loginUserId
            };
        });
    }

    // 단일 객체 처리 로직 [cite: 2026-01-30]
    const isNew = !formData[pkField] || formData[pkField] === 0;
    return {
        ...formData,
        createdBy: isNew ? loginUserId : formData.createdBy,
        updatedBy: loginUserId
    };
};

/**
 * 공통 유틸리티 객체 (객체 내보내기 - ContactRoleModal.tsx 용) [cite: 2026-01-30]
 */
export const dataUtils = {
    injectAuditFields: injectAuditFields
};