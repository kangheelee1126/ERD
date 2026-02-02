using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{
    [Table("CUST_CONTACT_ROLE_MAP")] // ✨ 설계서의 물리명 적용
    public class CustContactRoleMap
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("CONTACT_ROLE_MAP_ID")] // ✨ 설계서 컬럼명
        public int ContactRoleMapId { get; set; }

        [Column("CONTACT_ID")]
        public int ContactId { get; set; }

        [Column("ROLE_CD")]
        [MaxLength(40)]
        public string RoleCd { get; set; } = string.Empty;

        [Column("IS_PRIMARY")]
        public string IsPrimary { get; set; } = "N";

        [Column("START_DT")]
        public DateTime? StartDt { get; set; } // 적용시작일

        [Column("END_DT")]
        public DateTime? EndDt { get; set; } // 적용종료일

        [Column("NOTE")]
        [MaxLength(500)]
        public string? Note { get; set; } // 비고

        [Column("CRT_DT")]
        public DateTime CreatedDt { get; set; }

        [Column("CRT_BY")]
        [MaxLength(40)]
        public string? CreatedBy { get; set; }

        [Column("UPD_DT")]
        public DateTime? UpdatedDt { get; set; }

        [Column("UPD_BY")]
        [MaxLength(40)]
        public string? UpdatedBy { get; set; }
    }
}