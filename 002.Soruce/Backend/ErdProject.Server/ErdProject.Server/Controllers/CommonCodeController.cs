using Microsoft.AspNetCore.Mvc;
using ErdProject.Server.Models.Dtos;
using ErdProject.Server.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace ErdProject.Server.Controllers
{
    [ApiController]
    [Route("api/system/common-code")]
    public class CommonCodeController : ControllerBase
    {
        private readonly ICommonCodeService _commonCodeService;

        public CommonCodeController(ICommonCodeService commonCodeService)
        {
            _commonCodeService = commonCodeService;
        }

        /// <summary>
        /// 코드 그룹 조회 (검색어 포함)
        /// GET /api/system/common-code/groups?keyword=...
        /// </summary>
        [HttpGet("groups")] // [수정] 중복되었던 GetGroups를 하나로 통합했습니다.
        public async Task<ActionResult<List<CodeGroupDto>>> GetGroups([FromQuery] string? keyword)
        {
            var groups = await _commonCodeService.GetGroupsAsync(keyword);
            return Ok(groups);
        }

        [HttpPost("groups/save")]
        public async Task<IActionResult> SaveGroups([FromBody] List<CodeGroupDto> groups)
        {
            try
            {
                if (groups == null || groups.Count == 0)
                {
                    return BadRequest(new { message = "전송된 데이터가 없거나 형식이 잘못되었습니다." });
                }
                await _commonCodeService.SaveGroupsAsync(groups);
                return Ok(new { message = "성공적으로 저장되었습니다." });
            }
            catch (Exception ex)
            {
                var detailedError = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, new { message = "데이터 저장 중 서버 오류가 발생했습니다.", error = detailedError });
            }
        }

        [HttpDelete("groups/{id}")]
        public async Task<IActionResult> DeleteGroup(string id)
        {
            try
            {
                await _commonCodeService.DeleteGroupAsync(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("details/{groupCd}")]
        public async Task<ActionResult<List<CodeDetailDto>>> GetDetails(string groupCd)
        {
            var details = await _commonCodeService.GetDetailsAsync(groupCd);
            return Ok(details);
        }

        [HttpPost("details/save")]
        public async Task<IActionResult> SaveDetails([FromBody] List<CodeDetailDto> details)
        {
            await _commonCodeService.SaveDetailsAsync(details);
            return Ok();
        }

        [HttpDelete("details/{groupCd}/{codeCd}")]
        public async Task<IActionResult> DeleteDetail(string groupCd, string codeCd)
        {
            try
            {
                await _commonCodeService.DeleteDetailAsync(groupCd, codeCd);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}