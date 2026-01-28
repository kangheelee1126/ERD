using System.ComponentModel.DataAnnotations.Schema;
using ErdProject.Server.Models;

namespace ErdProject.Server.Models.Entities
{
    // ✨ 실제 DB의 테이블 이름(예: MAP_USER_ROLE)을 지정해야 합니다. [cite: 2026-01-28]
    [Table("MAP_USER_ROLE")]
    public class UserRole
    {
        [Column("USER_NO")]
        public int UserNo { get; set; }

        [Column("ROLE_ID")]
        public string RoleId { get; set; } = null!;

        [ForeignKey("UserNo")]
        public virtual UserAccount? User { get; set; }
        public virtual Role? Role { get; set; }
    }
}