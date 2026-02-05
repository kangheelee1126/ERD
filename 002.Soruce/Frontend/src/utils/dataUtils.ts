/**
 * 감사 필드 주입 함수 (기존 createdBy/updatedBy + 신규 crtBy/updBy 통합) [cite: 2026-02-03]
 * @param formData 주입할 데이터 객체 또는 배열
 * @param pkField 신규 등록 여부를 판단할 PK 필드명 (기본값: siteId)
 */
export const injectAuditFields = (formData: any, pkField: string = 'siteId') => {
    // LocalStorage에서 'userId' 키에 담긴 'admin' 값을 가져옵니다.
    const loginUserId = localStorage.getItem('userId') || 'system';

    const processItem = (item: any) => {
        // PK 필드 값이 없거나 0이면 신규(New)로 판단합니다. [cite: 2026-01-30]
        const isNew = !item[pkField] || item[pkField] === 0;

        return {
            ...item,
            /* ✨ [기존] 하위 호환성 유지용 필드 (Legacy) [cite: 2026-01-30] */
            createdBy: isNew ? loginUserId :(item.crtBy || loginUserId),
            updatedBy: loginUserId,

            /* ✨ [신규] 표준화된 감사 필드 (Employee 및 신규 화면용) [cite: 2026-02-03] */
            crtBy: isNew ? loginUserId : (item.createdBy || loginUserId),
            updBy: loginUserId
        };
    };

    // 배열 처리 로직 [cite: 2026-01-30]
    if (Array.isArray(formData)) {
        return formData.map(item => processItem(item));
    }

    // 단일 객체 처리 로직 [cite: 2026-01-30]
    return processItem(formData);
};

/**
 * 공통 유틸리티 객체 내보내기 [cite: 2026-01-30]
 */
export const dataUtils = {
    injectAuditFields: injectAuditFields
};