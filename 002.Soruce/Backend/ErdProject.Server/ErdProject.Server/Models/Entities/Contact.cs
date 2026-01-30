using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{
    [Table("CUST_CONTACT")]
    public class Contact
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("CONTACT_ID")]
        public int ContactId { get; set; }

        [Column("CUSTOMER_ID")]
        public long CustomerId { get; set; } // FK

        [Column("CONTACT_CD")]
        [StringLength(40)]
        public string? ContactCd { get; set; }

        [Required]
        [Column("CONTACT_NM")]
        [StringLength(100)]
        public string ContactNm { get; set; } = string.Empty;

        [Column("DEPT_NM")]
        [StringLength(100)]
        public string? DeptNm { get; set; }

        [Column("DUTY_NM")]
        [StringLength(100)]
        public string? DutyNm { get; set; }

        [Column("TEL_NO")]
        [StringLength(40)]
        public string? TelNo { get; set; }

        [Column("MOBILE_NO")]
        [StringLength(40)]
        public string? MobileNo { get; set; }

        [Column("EMAIL")]
        [StringLength(200)]
        public string? Email { get; set; }

        [Column("IS_MAIN")]
        [StringLength(1)]
        public string IsMain { get; set; } = "N"; // 기본값 N

        [Column("IS_ACTIVE")]
        [StringLength(1)]
        public string IsActive { get; set; } = "Y"; // 기본값 Y

        [Column("START_DT")]
        public DateTime? StartDt { get; set; }

        [Column("END_DT")]
        public DateTime? EndDt { get; set; }

        [Column("NOTE")]
        [StringLength(500)]
        public string? Note { get; set; }

        // --- 시스템 컬럼 ---
        [Column("CRT_DT")]
        public DateTime CrtDt { get; set; } = DateTime.Now;

        [Column("CRT_BY")]
        [StringLength(40)]
        public string? CrtBy { get; set; }

        [Column("UPD_DT")]
        public DateTime? UpdDt { get; set; }

        [Column("UPD_BY")]
        [StringLength(40)]
        public string? UpdBy { get; set; }
    }
}