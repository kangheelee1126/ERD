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

        /// <summary> 사업장 목록 조회 (페이징 포함) </summary>
        [HttpGet]
        public async Task<IActionResult> GetList([FromQuery] int page = 1, [FromQuery] int size = 10, [FromQuery] string? siteNm = null)
        {
            // 초기화: 검색 시 현재 페이지는 1로 처리됨 (프론트엔드 로직 연동)
            var (items, totalCount) = await _siteService.GetSitesAsync(page, size, siteNm);

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
            var site = await _siteService.GetSiteByIdAsync(id);
            if (site == null) return NotFound();

            return Ok(site);
        }

        /// <summary> 신규 사업장 등록 </summary>
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] BusinessSiteDto dto)
        {
            // 입력 항목이 5개 이상이므로 모달을 통해 전달된 DTO를 처리함
            var result = await _siteService.CreateSiteAsync(dto);
            return CreatedAtAction(nameof(GetDetail), new { id = result.SiteId }, result);
        }

        /// <summary> 사업장 정보 수정 </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(long id, [FromBody] BusinessSiteDto dto)
        {
            if (id != dto.SiteId) return BadRequest("ID Mismatch");

            var success = await _siteService.UpdateSiteAsync(dto);
            if (!success) return NotFound();

            return NoContent();
        }

        /// <summary> 사업장 삭제 </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id)
        {
            // 삭제 시 메세지 출력 후 YES인 경우 호출됨
            var success = await _siteService.DeleteSiteAsync(id);
            if (!success) return NotFound();

            return Ok();
        }
    }
}