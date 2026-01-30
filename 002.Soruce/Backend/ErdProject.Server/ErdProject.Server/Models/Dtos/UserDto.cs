using System;

namespace ErdProject.Server.Models.Dtos
{
    public class UserDto
    {
        // Startup.cs의 CamelCase 설정 덕분에
        // C# (PascalCase) <-> React (camelCase) 자동 변환됨

        public int UserNo { get; set; }

        public string? UserId { get; set; }

        public string? Password { get; set; } // 저장 시에만 사용됨

        public string? UserName { get; set; }

        public string? Email { get; set; }

        public string? UseYn { get; set; }

        public DateTime? RegDt { get; set; }
    }
}