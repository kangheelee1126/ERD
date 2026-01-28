using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ErdProject.Server.Data;
using ErdProject.Server.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ErdProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly ErdDbContext _context;

        public UserController(ErdDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserAccount>>> GetUsers()
        {
            return await _context.Users
                .AsNoTracking()
                .OrderByDescending(u => u.UserNo)
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserAccount>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveUser([FromBody] UserAccount user)
        {
            try
            {
                if (user.UserNo == 0)
                {
                    user.RegDt = DateTime.Now;
                    _context.Users.Add(user);
                }
                else
                {
                    var exists = await _context.Users.AnyAsync(u => u.UserNo == user.UserNo);
                    if (!exists) return NotFound();

                    _context.Users.Update(user);
                }

                await _context.SaveChangesAsync();
                return Ok(new { success = true, message = "Saved successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null) return NotFound();

                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
                return Ok(new { success = true });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}