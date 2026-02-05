using ErdProject.Server.IServices.Admin;
using ErdProject.Server.Models.Dtos.Admin;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ErdProject.Server.Controllers.Admin
{
    /* ✨ 표준 라우팅 규칙 준수 [cite: 2026-02-03] */
    [Route("api/Admin/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IEmployeeService _employeeService;

        public EmployeeController(IEmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        /// <summary>
        /// 직원 목록 조회 (페이징 포함)
        /// GET: api/business/Employee?page=1&size=10
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetEmployees([FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string? search = null)
        {
            // 지침: 리스트 조회 시 페이징 처리를 기본 포함 [cite: 2026-02-03]
            var (items, totalCount) = await _employeeService.GetEmployeesAsync(page, size, search);

            return Ok(new
            {
                items,
                totalCount
            });
        }

        /// <summary>
        /// 직원 정보 저장 (신규/수정)
        /// POST: api/business/Employee
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> SaveEmployee([FromBody] EmployeeDto dto)
        {
            if (dto == null) return BadRequest("데이터가 유효하지 않습니다.");

            // 지침: 저장 로직 구현 시 감사 필드 매핑 확인 [cite: 2026-02-03]
            bool result = await _employeeService.SaveEmployeeAsync(dto);

            if (result) return Ok(new { message = "성공적으로 저장되었습니다." });
            return StatusCode(500, "저장 중 오류가 발생했습니다.");
        }

        /// <summary>
        /// 직원 정보 삭제
        /// DELETE: api/business/Employee/5
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee(int id)
        {
            bool result = await _employeeService.DeleteEmployeeAsync(id);

            if (result) return Ok(new { message = "삭제되었습니다." });
            return NotFound("삭제할 대상을 찾을 수 없습니다.");
        }
    }
}