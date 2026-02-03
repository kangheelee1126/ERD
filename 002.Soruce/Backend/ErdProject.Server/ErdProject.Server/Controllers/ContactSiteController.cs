using Microsoft.AspNetCore.Mvc;
using ErdProject.Server.IServices;
using ErdProject.Server.Models.Dtos;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ErdProject.Server.Controllers
{
    [Route("api/business/[controller]")]
    [ApiController]
    public class ContactSiteController : ControllerBase
    {
        private readonly IContactSiteService _contactSiteService;

        public ContactSiteController(IContactSiteService contactSiteService)
        {
            _contactSiteService = contactSiteService;
        }

        /// <summary>
        /// 담당자별 연결된 사업장 목록 조회
        /// GET: api/business/ContactSite/{contactId}
        /// </summary>
        [HttpGet("{contactId}")]
        public async Task<IActionResult> GetContactSiteMaps(int contactId)
        {
            var result = await _contactSiteService.GetContactSiteMapsAsync(contactId);
            return Ok(result);
        }

        /// <summary>
        /// 담당자별 사업장 연결 정보 일괄 저장
        /// POST: api/business/ContactSite/{contactId}
        /// </summary>
        [HttpPost("{contactId}")]
        public async Task<IActionResult> SaveContactSiteMaps(int contactId, [FromBody] List<ContactSiteMapDto> dtos)
        {
            if (dtos == null) return BadRequest("저장할 데이터가 없습니다.");

            await _contactSiteService.SaveContactSiteMapsAsync(contactId, dtos);
            return Ok();
        }

    }
}