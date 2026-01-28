// Models/Entities/Role.cs
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{
    /// <summary>
    /// 권한 마스터 엔티티 (MST_ROLE 테이블 매핑)
    /// </summary>
    [Table("MST_ROLE")]
    public class Role
    {
        [Key]
        [Column("ROLE_ID")]
        public string RoleId { get; set; } = null!; // 권한 아이디 (PK)

        [Column("ROLE_NAME")]
        public string RoleName { get; set; } = null!; // 권한 명칭

        [Column("USE_YN")]
        public string UseYn { get; set; } = "Y"; // 사용 여부

        [Column("REG_DT")]
        public DateTime RegDt { get; set; } = DateTime.Now; // 등록 일시
    }
}

