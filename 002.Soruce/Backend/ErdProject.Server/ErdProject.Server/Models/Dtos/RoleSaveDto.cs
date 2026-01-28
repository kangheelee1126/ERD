namespace ErdProject.Server.Models.Dto
{
    public class RoleSaveDto
    {
        public string RoleId { get; set; } = null!;
        public string RoleName { get; set; } = null!;

        public string? RoleDesc { get; set; } // ✨ 추가
        public string UseYn { get; set; } = "Y";
    }
}