using Microsoft.AspNetCore.Mvc;
using ErdProject.Server.Services;
using ErdProject.Server.Models.Dtos;
using System.Threading.Tasks;

namespace ErdProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BusinessSiteController : ControllerBase
    {
        private readonly ICustSiteService _siteService;

        public BusinessSiteController(ICustSiteService siteService)
        {
            _siteService = siteService;
        }

        /// <summary> 사업장 목록 조회 (페이징, 고객사 필터, 통합 키워드 검색) </summary>
        [HttpGet]
        public async Task<IActionResult> GetList(
            [FromQuery] int page = 1,
            [FromQuery] int size = 10,
            [FromQuery] string? keyword = null,      // 사이트ID 또는 사이트명 통합 검색 [cite: 2026-01-30]
            [FromQuery] long? customerId = null      // 고객사 코드 필터 [cite: 2026-01-30]
        )
        {
            // 인터페이스 변경에 맞춰 keyword와 customerId를 서비스로 전달합니다. [cite: 2026-01-30]
            var (items, totalCount) = await _siteService.GetSitesAsync(page, size, keyword, customerId);

            return Ok(new
            {
                items,
                totalCount,
                page,
                size
            });
        }

        /// <summary> 사업장 상세 조회 </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetail(long id)
        {
            // 수정 버튼 클릭 시 호출되어 최신 상세 정보를 반환합니다. [cite: 2026-01-30]
            var site = await _siteService.GetSiteByIdAsync(id);
            if (site == null) return NotFound();

            return Ok(site);
        }

        /// <summary> 신규 사업장 등록 </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BusinessSiteDto dto)
        {
            // 프론트엔드의 injectAuditFields를 통해 전달된 CreatedBy 정보가 DTO에 포함됩니다. [cite: 2026-01-30]
            var result = await _siteService.CreateSiteAsync(dto);
            return CreatedAtAction(nameof(GetDetail), new { id = result.SiteId }, result);
        }

        /// <summary> 사업장 정보 수정 </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] BusinessSiteDto dto)
        {
            // PK 항목인 SiteId 일치 여부를 검증합니다. [cite: 2026-01-30]
            if (id != dto.SiteId) return BadRequest("ID Mismatch");

            // UpdatedBy 정보가 포함된 DTO를 서비스로 전달하여 저장합니다. [cite: 2026-01-30]
            var success = await _siteService.UpdateSiteAsync(dto);
            if (!success) return NotFound();

            return NoContent();
        }

        /// <summary> 사업장 삭제 </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            // 프론트엔드에서 "삭제하시겠습니까?" 컨펌 후 호출됩니다. [cite: 2026-01-29]
            var success = await _siteService.DeleteSiteAsync(id);
            if (!success) return NotFound();

            return Ok();
        }
    }
}