using ErdProject.Server.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ErdProject.Server.Services
{
    public interface ICustSiteService
    {
        // 페이징 처리된 목록 조회 (전체 건수와 목록을 함께 반환)
        Task<(IEnumerable<BusinessSiteDto> Items, int TotalCount)> GetSitesAsync(int page, int size, string? siteNm);

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