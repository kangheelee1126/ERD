using ErdProject.Server.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ErdProject.Server.Services
{
    public interface ICustSiteService
    {
        // 페이징 처리된 목록 조회 (고객사 필터 및 통합 키워드 검색 매개변수 추가) [cite: 2026-01-30]
        // siteNm 대신 통합 검색 용어인 keyword와 선택적 필터인 customerId를 정의합니다. [cite: 2026-01-30]
        Task<(IEnumerable<BusinessSiteDto> Items, int TotalCount)> GetSitesAsync(int page, int size, string? keyword, long? customerId = null);

        // 상세 조회
        Task<BusinessSiteDto?> GetSiteByIdAsync(long id);

        // 신규 등록
        Task<BusinessSiteDto> CreateSiteAsync(BusinessSiteDto dto);

        // 수정
        Task<bool> UpdateSiteAsync(BusinessSiteDto dto);

        // 삭제
        Task<bool> DeleteSiteAsync(long id);
    }
}