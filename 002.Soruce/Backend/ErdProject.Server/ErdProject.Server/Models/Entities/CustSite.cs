using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{
    [Table("CUST_SITE")]
    public class CustSite
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("SITE_ID")]
        public long SITE_ID { get; set; }

        [Required]
        [Column("CUSTOMER_ID")]
        public long CUSTOMER_ID { get; set; }

        [Required]
        [StringLength(40)]
        [Column("SITE_CD")]
        public string SITE_CD { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        [Column("SITE_NM")]
        public string SITE_NM { get; set; } = string.Empty;

        [StringLength(200)]
        [Column("SITE_NM_EN")]
        public string? SITE_NM_EN { get; set; }

        [StringLength(40)]
        [Column("SITE_TYPE_CD")]
        public string? SITE_TYPE_CD { get; set; }

        [StringLength(40)]
        [Column("TEL_NO")]
        public string? TEL_NO { get; set; }

        [StringLength(40)]
        [Column("FAX_NO")]
        public string? FAX_NO { get; set; }

        [StringLength(20)]
        [Column("ZIP_CD")]
        public string? ZIP_CD { get; set; }

        [StringLength(300)]
        [Column("ADDR1")]
        public string? ADDR1 { get; set; }

        [StringLength(300)]
        [Column("ADDR2")]
        public string? ADDR2 { get; set; }

        [StringLength(40)]
        [Column("TIMEZONE_CD")]
        public string? TIMEZONE_CD { get; set; }

        [Required]
        [StringLength(1)]
        [Column("IS_MAIN")]
        public string IS_MAIN { get; set; } = "N";

        [StringLength(2000)]
        [Column("COMMENTS")]
        public string? COMMENTS { get; set; }

        [Required]
        [Column("SORT_NO")]
        public int SORT_NO { get; set; } = 0;

        [Required]
        [StringLength(1)]
        [Column("USE_YN")]
        public string USE_YN { get; set; } = "Y";

        [Required]
        [Column("CREATED_DT")]
        public DateTime CREATED_DT { get; set; }

        [StringLength(40)]
        [Column("CREATED_BY")]
        public string? CREATED_BY { get; set; }

        [Column("UPDATED_DT")]
        public DateTime? UPDATED_DT { get; set; }

        [StringLength(40)]
        [Column("UPDATED_BY")]
        public string? UPDATED_BY { get; set; }

        [ForeignKey("CUSTOMER_ID")]
        public virtual Customer customer { get; set; } = default!;
    }
}