using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{
    [Table("MST_ROLE")]
    public class Role
    {
        [Key]
        [Column("ROLE_ID")]
        [StringLength(20)]
        public string RoleId { get; set; } = null!;

        [Column("ROLE_NAME")]
        [StringLength(50)]
        public string RoleName { get; set; } = null!;

        // ✨ 설명 컬럼 추가
        [Column("ROLE_DESC")]
        [StringLength(200)]
        public string? RoleDesc { get; set; }

        [Column("USE_YN")]
        [StringLength(1)]
        public string? UseYn { get; set; }

        [Column("REG_DT")]
        public DateTime? RegDt { get; set; }
    }
}