namespace ErdProject.Server.Models.Entities
{
    public class UserRole
    {
        public int UserNo { get; set; }
        public string RoleId { get; set; } = null!;

        // 탐색 속성 (필요 시 추가)
        public virtual UserAccount? User { get; set; }
        public virtual Role? Role { get; set; }
    }
}