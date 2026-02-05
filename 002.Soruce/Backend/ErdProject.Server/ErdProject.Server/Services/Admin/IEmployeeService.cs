using ErdProject.Server.Models.Dtos.Admin;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ErdProject.Server.IServices.Admin
{
    public interface IEmployeeService
    {
        // 리스트 조회 시 페이징 포함 지침 준수 [cite: 2026-02-03]
        Task<(IEnumerable<EmployeeDto> Items, int TotalCount)> GetEmployeesAsync(int page, int size, string? search);

        Task<bool> SaveEmployeeAsync(EmployeeDto dto);

        Task<bool> DeleteEmployeeAsync(int id);
    }
}