using System;

namespace ErdProject.Server.Models.Dto
{
    /// <summary>
    /// 권한 정보 반환용 DTO
    /// </summary>
    public class RoleResponseDto
    {
        public string RoleId { get; set; } = null!;
        public string RoleName { get; set; } = null!;

        public string? RoleDesc { get; set; } // ✨ 추가

        // ✨ 상태 시각화(Blue/Red)를 위해 사용여부 필드 추가 [cite: 2026-01-28]
        public string UseYn { get; set; } = "Y";

        // ✨ 등록일 필드 추가
        public DateTime? RegDt { get; set; }
    }
}