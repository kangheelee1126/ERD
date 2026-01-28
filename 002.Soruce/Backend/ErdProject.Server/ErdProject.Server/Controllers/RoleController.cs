using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErdProject.Server.Models.Entities;
using ErdProject.Server.Models.Dto;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq; // ✨ 이 줄이 있어야 OrderBy를 사용할 수 있습니다.
using ErdProject.Server.Data; // ✨ 이 줄을 추가하여 ApplicationDbContext를 인식하게 합니다.
using System;

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
            .OrderByDescending(r => r.RegDt)
            .Select(r => new RoleResponseDto
            {
                // ✨ r.RoleId가 null일 경우 빈 값을 할당하여 경고 해결
                RoleId = r.RoleId ?? string.Empty,
                RoleName = r.RoleName ?? string.Empty,
                RoleDesc = r.RoleDesc ?? string.Empty,
                UseYn = r.UseYn ?? "Y",
                RegDt = r.RegDt
            })
            .ToListAsync();
    }

    // 2. 권한 정보 자체 저장 (팝업의 저장 버튼용)
    [HttpPost("save")]
    public async Task<IActionResult> SaveRole([FromBody] RoleSaveDto dto)
    {
        var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleId == dto.RoleId);

        if (role == null)
        {
            role = new Role
            {
                RoleId = dto.RoleId,
                RegDt = DateTime.Now , 
            };
            _context.Roles.Add(role);
        }

        // ✨ 최적화: 공통 필드 할당을 한 곳으로 통합합니다.
        role.RoleName = dto.RoleName;
        role.RoleDesc = dto.RoleDesc;
        role.UseYn = dto.UseYn;

        await _context.SaveChangesAsync();
        return Ok(new { message = "권한 정보가 저장되었습니다." });
    }

    // ✨ 삭제 로직 추가 [cite: 2026-01-28]
    [HttpDelete("{roleId}")]
    public async Task<IActionResult> DeleteRole(string roleId)
    {
        var role = await _context.Roles.FindAsync(roleId);
        if (role == null) return NotFound();

        // 1. 연관된 메뉴 매핑 정보 선제 삭제 (참조 무결성)
        var relatedMenus = _context.RoleMenus.Where(rm => rm.RoleId == roleId);
        _context.RoleMenus.RemoveRange(relatedMenus);

        // 2. 권한 정보 삭제
        _context.Roles.Remove(role);

        await _context.SaveChangesAsync();
        return Ok(new { message = "권한이 삭제되었습니다." });
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