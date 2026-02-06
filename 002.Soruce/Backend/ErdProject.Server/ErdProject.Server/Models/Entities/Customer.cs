using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{
    [Table("CUST_CUSTOMER_MST")]
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("customer_id")]
        public long CustomerId { get; set; }

        [Column("cust_cd")]
        public string CustCd { get; set; } = null!;

        [Column("cust_nm")]
        public string CustNm { get; set; } = null!;

        [Column("cust_nm_en")]
        public string? CustNmEn { get; set; }

        [Column("cust_type_cd")]
        public string? CustTypeCd { get; set; }

        [Column("industry_cd")]
        public string? IndustryCd { get; set; }

        [Column("mfg_type_cd")]
        public string? MfgTypeCd { get; set; }

        [Column("dev_capability_cd")]
        public string? DevCapabilityCd { get; set; }

        [Column("source_mod_yn")]
        public string SourceModYn { get; set; } = "N";

        [Column("biz_no")]
        public string? BizNo { get; set; }

        [Column("tel_no")]
        public string? TelNo { get; set; }

        [Column("zip_cd")]
        public string? ZipCd { get; set; }

        [Column("addr1")]
        public string? Addr1 { get; set; }

        [Column("addr2")]
        public string? Addr2 { get; set; }

        [Column("timezone_cd")]
        public string? TimezoneCd { get; set; }

        [Column("comments")]
        public string? Comments { get; set; }

        [Column("sort_no")]
        public int SortNo { get; set; }

        [Column("sales_emp_id")]
        public int? SalesEmpId { get; set; }

        [Column("use_yn")]
        public string UseYn { get; set; } = "Y";

        [Column("created_dt")]
        public DateTime CreatedDt { get; set; } = DateTime.Now;

        [Column("created_by")]
        public string? CreatedBy { get; set; }

        [Column("updated_dt")]
        public DateTime? UpdatedDt { get; set; }

        [Column("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}