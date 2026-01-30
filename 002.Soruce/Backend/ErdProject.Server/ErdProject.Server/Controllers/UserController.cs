using Microsoft.AspNetCore.Mvc;
using ErdProject.Server.Services;
using ErdProject.Server.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ErdProject.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        // ✨ 생성자 주입: DbContext 대신 Service를 받습니다.
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _userService.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _userService.GetUserAsync(id);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost("save")]
        public async Task<IActionResult> SaveUser([FromBody] UserDto userDto)
        {
            // DTO를 통해 받으므로 불필요한 필드 노출을 막습니다.
            var result = await _userService.SaveUserAsync(userDto);

            if (result)
                return Ok(new { success = true, message = "Saved successfully." });
            else
                return BadRequest(new { success = false, message = "Failed to save user." });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var result = await _userService.DeleteUserAsync(id);

            if (result)
                return Ok(new { success = true });
            else
                return NotFound(new { success = false, message = "User not found or failed to delete." });
        }
    }
}