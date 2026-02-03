using ErdProject.Server.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ErdProject.Server.Services
{
    public interface ICustSiteService
    {
        /// <summary>
        /// 페이징 처리된 사업장 목록 조회
        /// </summary>
        /// <param name="page">현재 페이지 번호</param>
        /// <param name="size">페이지당 출력 건수</param>
        /// <param name="keyword">사업장명 또는 코드 검색어 (통합검색)</param>
        /// <param name="customerId">특정 고객사 소속 사업장만 필터링 (FK)</param>
        /// <returns>사업장 목록 및 전체 건수 튜플</returns>
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