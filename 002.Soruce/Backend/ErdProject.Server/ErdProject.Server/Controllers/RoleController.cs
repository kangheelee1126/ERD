using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErdProject.Server.Models.Entities;
using ErdProject.Server.Models.Dto;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq; // ✨ 이 줄이 있어야 OrderBy를 사용할 수 있습니다.
using ErdProject.Server.Data; // ✨ 이 줄을 추가하여 ApplicationDbContext를 인식하게 합니다.

[ApiController]
[Route("api/[controller]")]
public class RoleController : ControllerBase
{
    private readonly ErdDbContext _context;

    public RoleController(ErdDbContext context) { _context = context; }

    /// <summary>
    /// 권한 그룹 리스트 조회 (DTO 변환 반환)
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<RoleResponseDto>>> GetRoles()
    {
        // Entity를 직접 반환하지 않고 Dto로 프로젝션하여 반환합니다.
        return await _context.Roles
            .Where(r => r.UseYn == "Y")
            .Select(r => new RoleResponseDto
            {
                RoleId = r.RoleId,
                RoleName = r.RoleName
            })
            .ToListAsync();
    }

    /// <summary>
    /// 특정 권한에 매핑된 메뉴 ID 목록 조회
    /// </summary>
    [HttpGet("{roleId}/menus")]
    public async Task<ActionResult<IEnumerable<string>>> GetRoleMenus(string roleId)
    {
        return await _context.RoleMenus
            .Where(rm => rm.RoleId == roleId)
            .Select(rm => rm.MenuId)
            .ToListAsync();
    }

    /// <summary>
    /// 권한별 메뉴 접근 권한 저장
    /// </summary>
    [HttpPost("save-menus")]
    public async Task<IActionResult> SaveRoleMenus([FromBody] RoleMenuSaveDto dto)
    {
        // 1. 기존 매핑 정보 삭제
        var existing = _context.RoleMenus.Where(rm => rm.RoleId == dto.RoleId);
        _context.RoleMenus.RemoveRange(existing);

        // 2. 새로운 매핑 정보 등록
        if (dto.MenuIds != null)
        {
            var newMappings = dto.MenuIds.Select(id => new RoleMenu
            {
                RoleId = dto.RoleId,
                MenuId = id
            });
            await _context.RoleMenus.AddRangeAsync(newMappings);
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "권한 정보가 갱신되었습니다." });
    }
}