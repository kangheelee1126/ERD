using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErdProject.Server.Data;
using ErdProject.Server.Models.Entities; // ✨ 추가
using ErdProject.Server.Models.Dtos;     // ✨ 추가
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq; // ✨ 이 줄이 있어야 OrderBy를 사용할 수 있습니다.
using System;

[ApiController]
[Route("api/[controller]")]
public class MenusController : ControllerBase
{
    private readonly ErdDbContext _context;

    public MenusController(ErdDbContext context)
    {
        _context = context;
    }

    // 트리 구조로 변환하여 반환하는 로직 포함 가능
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MenuDto>>> GetMenus()
    {
        // 1. DB에서 전체 메뉴를 가져옵니다.
        var allMenus = await _context.SysMenus
            .OrderBy(m => m.SortNo)
            .ToListAsync();

        // 2. 엔티티를 DTO로 변환하면서 MenuIcon 필드를 추가 매핑합니다.
        var menuMap = allMenus.Select(m => new MenuDto
        {
            MenuId = m.MenuId,
            UpMenuId = m.UpMenuId,
            MenuName = m.MenuName,
            MenuUrl = m.MenuUrl,
            MenuIcon = m.MenuIcon, // ✨ 이 줄이 추가되어야 프론트에서 아이콘을 볼 수 있습니다.
            SortNo = m.SortNo,
            UseYn = m.UseYn
        }).ToDictionary(m => m.MenuId);

        var tree = new List<MenuDto>();

        // 3. 부모-자식 관계 조립
        foreach (var menu in menuMap.Values)
        {
            if (string.IsNullOrEmpty(menu.UpMenuId))
            {
                tree.Add(menu);
            }
            else if (menuMap.TryGetValue(menu.UpMenuId, out var parent))
            {
                parent.Children.Add(menu);
            }
        }

        return Ok(tree);
    }

    // 2. 메뉴 저장 (등록 및 수정 통합)
    [HttpPost("save")]
    public async Task<IActionResult> SaveMenu([FromBody] SysMenu menu)
    {
        try
        {
            // DB에 동일한 MenuId가 있는지 확인 (AsNoTracking으로 성능 최적화)
            var origin = await _context.SysMenus
                                       .AsNoTracking()
                                       .FirstOrDefaultAsync(m => m.MenuId == menu.MenuId);

            if (origin != null)
            {
                // 기존 데이터가 있으면 수정
                _context.SysMenus.Update(menu);
            }
            else
            {
                // 없으면 신규 등록
                _context.SysMenus.Add(menu);
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true, message = "저장되었습니다." });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    // 3. 메뉴 삭제
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenu(string id)
    {
        try
        {
            var menu = await _context.SysMenus.FindAsync(id);
            if (menu == null) return NotFound("삭제할 메뉴를 찾을 수 없습니다.");

            // ✨ 하위 메뉴가 있는지 체크 (데이터 무결성 보호)
            var hasChildren = await _context.SysMenus.AnyAsync(m => m.UpMenuId == id);
            if (hasChildren)
            {
                return BadRequest("하위 메뉴가 존재하는 메뉴는 삭제할 수 없습니다. 하위 메뉴를 먼저 삭제해 주세요.");
            }

            _context.SysMenus.Remove(menu);
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }

    //사용자 메뉴 조회
    [HttpGet("authorized/{userNo}")]
    public async Task<ActionResult<IEnumerable<MenuDto>>> GetAuthorizedMenus(int userNo)
    {
        // 1. 해당 사용자가 가진 모든 유효 권한 ID 조회 [cite: 2026-01-28]
        var roleIds = await _context.UserRoles
            .Where(ur => ur.UserNo == userNo)
            .Select(ur => ur.RoleId)
            .ToListAsync();

        // 2. 권한들에 매핑된 메뉴 ID들을 중복 없이 추출 [cite: 2026-01-28]
        var authorizedMenuIds = await _context.RoleMenus
            .Where(rm => roleIds.Contains(rm.RoleId))
            .Select(rm => rm.MenuId)
            .Distinct()
            .ToListAsync();

        // 3. 허용된 메뉴 정보만 조회 (사용여부 'Y'인 것만)
        var allMenus = await _context.SysMenus
            .Where(m => authorizedMenuIds.Contains(m.MenuId) && m.UseYn == "Y")
            .OrderBy(m => m.SortNo)
            .ToListAsync();

        // 4. 트리 구조 조립 (DTO 변환)
        var menuMap = allMenus.Select(m => new MenuDto
        {
            MenuId = m.MenuId,
            UpMenuId = m.UpMenuId,
            MenuName = m.MenuName,
            MenuUrl = m.MenuUrl,
            MenuIcon = m.MenuIcon
        }).ToDictionary(m => m.MenuId);

        var tree = new List<MenuDto>();
        foreach (var menu in menuMap.Values)
        {
            if (string.IsNullOrEmpty(menu.UpMenuId)) tree.Add(menu);
            else if (menuMap.TryGetValue(menu.UpMenuId, out var parent)) parent.Children.Add(menu);
        }

        return Ok(tree);
    }
}