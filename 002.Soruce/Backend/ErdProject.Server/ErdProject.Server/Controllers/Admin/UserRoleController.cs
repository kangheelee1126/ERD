using ErdProject.Server.Data;
using ErdProject.Server.Models.Dto;
using ErdProject.Server.Models.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class UserRoleController : ControllerBase
{
    private readonly ErdDbContext _context;
    public UserRoleController(ErdDbContext context) => _context = context;

    [HttpGet("{userNo}")]
    public async Task<ActionResult<IEnumerable<string>>> GetUserRoles(int userNo)
    {
        return await _context.UserRoles
            .Where(ur => ur.UserNo == userNo)
            .Select(ur => ur.RoleId)
            .ToListAsync();
    }

    [HttpPost("save")]
    public async Task<IActionResult> SaveUserRoles([FromBody] UserRoleSaveDto dto)
    {
        try
        {
            // ✨ 1. 삭제 대상을 ToList()로 먼저 메모리에 로드하여 추적 가능하게 만듭니다. [cite: 2026-01-28]
            var existing = await _context.UserRoles
                                         .Where(ur => ur.UserNo == dto.UserNo)
                                         .ToListAsync(); // 중요: 여기서 데이터를 실제 리스트로 가져와야 함

            if (existing.Any())
            {
                _context.UserRoles.RemoveRange(existing);
            }

            // 2. 신규 권한 추가
            if (dto.RoleIds != null && dto.RoleIds.Any())
            {
                var newRoles = dto.RoleIds.Select(rid => new UserRole
                {
                    UserNo = dto.UserNo,
                    RoleId = rid
                });
                await _context.UserRoles.AddRangeAsync(newRoles);
            }

            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            return BadRequest(new { success = false, message = ex.Message });
        }
    }
}
