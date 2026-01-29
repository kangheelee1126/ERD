using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{
    [Table("COM_CODE_GRP_MST")]
    public class CodeGroup
    {
        [Key]
        [Column("code_grp_cd")]
        public string CodeGrpCd { get; set; } = null!;
        [Column("code_grp_nm")]
        public string CodeGrpNm { get; set; } = null!;
        [Column("code_grp_desc")]
        public string? CodeGrpDesc { get; set; }
        [Column("use_yn")]
        public string UseYn { get; set; } = "Y";
        [Column("sort_no")]
        public int SortNo { get; set; }
        [Column("created_dt")]
        public DateTime CreatedDt { get; set; } = DateTime.Now;
        [Column("created_by")] // 생성자 ID 필드 추가
        public string? CreatedBy { get; set; }
        [Column("updated_dt")]
        public DateTime? UpdatedDt { get; set; }
        [Column("updated_by")] // 수정자 ID 필드 추가
        public string? UpdatedBy { get; set; }
    }

    [Table("COM_CODE_DTL_MST")]
    public class CodeDetail
    {
        [Column("code_grp_cd")]
        public string CodeGrpCd { get; set; } = null!;
        [Column("code_cd")]
        public string CodeCd { get; set; } = null!;
        [Column("code_nm")]
        public string CodeNm { get; set; } = null!;
        [Column("code_desc")]
        public string? CodeDesc { get; set; }
        [Column("sort_no")]
        public int SortNo { get; set; }
        [Column("ext_val1")]
        public string? ExtVal1 { get; set; }
        [Column("ext_val2")]
        public string? ExtVal2 { get; set; }
        [Column("use_yn")]
        public string UseYn { get; set; } = "Y";
        [Column("created_dt")]
        public DateTime CreatedDt { get; set; } = DateTime.Now;
        [Column("created_by")] // 생성자 ID 필드 추가
        public string? CreatedBy { get; set; }
        [Column("updated_dt")]
        public DateTime? UpdatedDt { get; set; }
        [Column("updated_by")] // 수정자 ID 필드 추가
        public string? UpdatedBy { get; set; }
    }
}