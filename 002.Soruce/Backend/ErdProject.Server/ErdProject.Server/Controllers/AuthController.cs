using Microsoft.AspNetCore.Mvc;
using System.Linq;
using ErdProject.Server.Data; // DB 접속 위함
using System.Threading.Tasks;
using ErdProject.Server.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace ErdProject.Server.Controllers
{
    // [로그인 요청 데이터 규격]
    // 프론트엔드에서 { "userId": "...", "password": "..." } 이렇게 보낼 겁니다.
    public class LoginRequest
    {
        public string UserId { get; set; } = string.Empty;   // ✨ 빈 문자열로 초기화
        public string Password { get; set; } = string.Empty; // ✨ 빈 문자열로 초기화
    }

    [Route("api/[controller]")] // 주소: http://localhost:포트/api/auth
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ErdDbContext _context;

        // 생성자: DB 문지기(Context) 주입 받기
        public AuthController(ErdDbContext context)
        {
            _context = context;
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // 1. DB에서 아이디와 비밀번호가 일치하는 사용자 찾기
            var user = _context.Users.FirstOrDefault(u =>
                u.UserId == request.UserId &&
                u.Password == request.Password
            );

            // 2. 없으면 실패 (401 Unauthorized)
            if (user == null)
            {
                return Unauthorized(new { message = "아이디 또는 비밀번호를 확인해주세요." });
            }

            // 3. 있으면 성공 (200 OK) + 사용자 정보 리턴
            // (주의: 비밀번호는 보안상 절대 리턴하면 안 됨!)
            return Ok(new
            {
                message = "로그인 성공",
                userNo = user.UserNo,
                userId = user.UserId,
                userName = user.UserName,
                email = user.Email
            });
        }

        // ErdProject.Server/Controllers/AuthController.cs

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserAccount request)
        {
            try
            {
                // 1. 아이디 중복 체크
                if (await _context.Users.AnyAsync(u => u.UserId == request.UserId))
                {
                    return BadRequest(new { success = false, message = "이미 사용 중인 아이디입니다." });
                }

                // 2. 기본값 설정 및 저장
                request.UseYn = "Y";
                request.RegDt = DateTime.Now;

                _context.Users.Add(request);
                await _context.SaveChangesAsync();

                return Ok(new { success = true, message = "회원가입이 완료되었습니다." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { success = false, message = ex.Message });
            }
        }
    }
}