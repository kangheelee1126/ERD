using ErdProject.Server.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ErdProject.Server.Services
{
    /// <summary>
    /// 공통코드 관리를 위한 비즈니스 로직 인터페이스
    /// </summary>
    public interface ICommonCodeService
    {
        // 코드 그룹 관련
        Task<List<CodeGroupDto>> GetGroupsAsync();
        Task SaveGroupsAsync(List<CodeGroupDto> groups);

        // --- [추가된 삭제 인터페이스] ---
        Task DeleteGroupAsync(string groupCd);

        // 상세 코드 관련
        Task<List<CodeDetailDto>> GetDetailsAsync(string groupCd);
        Task SaveDetailsAsync(List<CodeDetailDto> details);
        Task DeleteDetailAsync(string groupCd, string codeCd);

        // [수정] 검색어 매개변수 추가 [cite: 2026-01-29]
        Task<List<CodeGroupDto>> GetGroupsAsync(string? keyword);
    }
}