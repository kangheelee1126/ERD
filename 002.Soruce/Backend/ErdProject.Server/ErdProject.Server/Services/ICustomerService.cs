using ErdProject.Server.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ErdProject.Server.Services
{
    public interface ICustomerService
    {
        // 고객사 목록 조회 (검색어 포함)
        Task<List<CustomerDto>> GetCustomersAsync(string? keyword);

        // 고객사 정보 일괄 저장 (등록/수정)
        Task SaveCustomersAsync(List<CustomerDto> dtos);

        // 고객사 즉시 삭제
        Task DeleteCustomerAsync(long customerId);
    }
}