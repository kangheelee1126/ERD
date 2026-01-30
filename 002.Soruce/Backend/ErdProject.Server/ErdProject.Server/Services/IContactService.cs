using ErdProject.Server.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ErdProject.Server.Services
{
    public interface IContactService
    {
        // 1. 목록 조회 (검색 조건: 고객사ID, 키워드, 페이지)
        Task<PagedResult<ContactDto>> GetContactsAsync(int page, int size, int? custId, string? keyword);

        // 2. 단건 상세 조회
        Task<ContactDto?> GetContactAsync(int id);

        // 3. 저장 (신규/수정 공통)
        Task SaveContactAsync(ContactDto dto);

        // 4. 삭제
        Task DeleteContactAsync(int id);
    }
}