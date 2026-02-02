using Microsoft.AspNetCore.Mvc;
using ErdProject.Server.Models.Dtos;
using ErdProject.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace ErdProject.Server.Controllers
{
    [ApiController]
    [Route("api/business/contact")] // URL 경로 (Business 영역으로 분류)
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;

        public ContactController(IContactService contactService)
        {
            _contactService = contactService;
        }

        // 1. 목록 조회 (페이징 + 검색)
        [HttpGet]
        public async Task<ActionResult<PagedResult<ContactDto>>> GetContacts(
    [FromQuery] int page = 1,
    [FromQuery] int size = 10,
    [FromQuery] int? custId = null, // 프론트에서 넘어오는 파라미터명
    [FromQuery] string? keyword = null)
        {
            try
            {
                // [디버깅용] 요청 파라미터 확인 (서버 콘솔에 출력됨)
                Console.WriteLine($"[API Request] GetContacts -> Page: {page}, Size: {size}, CustId: {custId}, Keyword: {keyword}");

                // 서비스 호출 (파라미터 전달)
                // 서비스 쪽 파라미터 이름이 CustomerId라면: GetContactsAsync(page, size, custId, keyword)
                var result = await _contactService.GetContactsAsync(page, size, custId, keyword);

                return Ok(result);
            }
            catch (Exception ex)
            {
                // ✨ [오류 확인 1] 서버 콘솔(터미널)에 자세한 에러 로그 출력
                Console.WriteLine("==================================================");
                Console.WriteLine("🛑 [API Error] GetContacts 조회 중 오류 발생");
                Console.WriteLine($"❌ Message: {ex.Message}");
                Console.WriteLine($"📍 StackTrace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    Console.WriteLine($"🔍 Inner Exception: {ex.InnerException.Message}");
                }
                Console.WriteLine("==================================================");

                // ✨ [오류 확인 2] 프론트엔드로 500 에러와 함께 메시지 반환
                // 프론트엔드 개발자 도구(F12) -> Network 탭에서 빨간색 요청을 클릭하면 이 메시지가 보임
                return StatusCode(500, new
                {
                    message = "서버 내부 오류가 발생했습니다.",
                    error = ex.Message,
                    detail = ex.ToString() // 개발 단계에서만 포함 (보안상 운영에선 제외 권장)
                });
            }
        }

        // 2. 단건 상세 조회
        [HttpGet("{id}")]
        public async Task<ActionResult<ContactDto>> GetContact(int id)
        {
            var result = await _contactService.GetContactAsync(id);
            if (result == null) return NotFound();
            return Ok(result);
        }

        // 3. 저장 (신규/수정)
        [HttpPost("save")]
        public async Task<IActionResult> SaveContact([FromBody] ContactDto dto)
        {
            try
            {
                await _contactService.SaveContactAsync(dto);
                return Ok(new { message = "저장되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // 에러 메시지 반환
            }
        }

        // 4. 삭제
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteContact(int id)
        {
            try
            {
                await _contactService.DeleteContactAsync(id);
                return Ok(new { message = "삭제되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        // ✨ 5. 담당자별 역할 조회 [cite: 2026-01-30]
        [HttpGet("{id}/roles")]
        public async Task<ActionResult<List<ContactRoleSaveDto>>> GetContactRoles(long id)
        {
            try
            {
                var result = await _contactService.GetContactRolesAsync(id);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "역할 조회 중 오류 발생", error = ex.Message });
            }
        }

        // ✨ 6. 담당자 역할 일괄 저장 [cite: 2026-01-30]
        [HttpPost("{id}/roles")]
        public async Task<IActionResult> SaveContactRoles(int id, [FromBody] List<ContactRoleSaveDto> roles)
        {
            try
            {
                // 서비스에서 트랜잭션을 걸어 Delete-Insert 수행 [cite: 2026-01-29, 2026-01-30]
                await _contactService.SaveContactRolesAsync(id, roles);
                return Ok(new { message = "역할 설정이 저장되었습니다." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "역할 저장 중 오류 발생", error = ex.Message });
            }
        }
    }
}