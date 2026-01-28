namespace ErdProject.Server.Models.Dto
{
    /// <summary>
    /// 권한 정보 반환용 DTO
    /// </summary>
    public class RoleResponseDto
    {
        public string RoleId { get; set; } = null!;
        public string RoleName { get; set; } = null!;
    }
}