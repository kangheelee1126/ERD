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
        var existing = _context.UserRoles.Where(ur => ur.UserNo == dto.UserNo);
        _context.UserRoles.RemoveRange(existing);

        if (dto.RoleIds?.Any() == true)
        {
            var newRoles = dto.RoleIds.Select(rid => new UserRole { UserNo = dto.UserNo, RoleId = rid });
            await _context.UserRoles.AddRangeAsync(newRoles);
        }
        await _context.SaveChangesAsync();
        return Ok(new { success = true });
    }
}
