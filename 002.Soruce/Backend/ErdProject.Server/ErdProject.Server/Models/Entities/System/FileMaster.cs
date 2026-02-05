using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities.System
{
    /// <summary>
    /// 파일 정보 마스터 엔티티 (Table: MST_FILE_INFO)
    /// </summary>
    [Table("MST_FILE_INFO")]
    public class FileMaster
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("FILE_NO", TypeName = "INT")]
        public int FileNo { get; set; }

        [Required]
        [Column("REF_TYPE", TypeName = "NVARCHAR(20)")] // 참조 구분 (예: EMPLOYEE, CUSTOMER)
        public string RefType { get; set; } = default!;

        [Required]
        [Column("REF_ID", TypeName = "NVARCHAR(50)")] // 참조 대상 ID (업무 키)
        public string RefId { get; set; } = default!;

        [Required]
        [Column("FILE_SEQ", TypeName = "INT")] // 파일 순번
        public int FileSeq { get; set; }

        [Required]
        [Column("FILE_ID", TypeName = "NVARCHAR(50)")] // 파일 식별 GUID
        public string FileId { get; set; } = default!;

        [Required]
        [Column("ORIGIN_NM", TypeName = "NVARCHAR(255)")] // 원본 파일명
        public string OriginNm { get; set; } = default!;

        [Required]
        [Column("SAVE_NM", TypeName = "NVARCHAR(255)")] // 저장 파일명 (암호화)
        public string SaveNm { get; set; } = default!;

        [Required]
        [Column("FILE_PATH", TypeName = "NVARCHAR(500)")] // 물리 저장 경로
        public string FilePath { get; set; } = default!;

        [Required]
        [Column("FILE_SIZE", TypeName = "BIGINT")] // 파일 크기
        public long FileSize { get; set; }

        [Required]
        [Column("FILE_EXT", TypeName = "NVARCHAR(10)")] // 파일 확장자
        public string FileExt { get; set; } = default!;

        [Column("ENC_KEY_ID", TypeName = "NVARCHAR(100)")] // 암호화 키 ID
        public string? EncKeyId { get; set; }

        [Required]
        [Column("USE_YN", TypeName = "CHAR(1)")] // 사용 여부
        public string UseYn { get; set; } = "Y";

        /* ✨ 지침: 날짜는 반드시 DateTime? (널 허용) */
        [Column("CRT_DT", TypeName = "DATETIME")] // 생성일시
        public DateTime? CrtDt { get; set; }

        [Column("CRT_BY", TypeName = "NVARCHAR(40)")] // 생성자
        public string? CrtBy { get; set; }

        [Column("UPD_DT", TypeName = "DATETIME")] // 수정일시
        public DateTime? UpdDt { get; set; }

        [Column("UPD_BY", TypeName = "NVARCHAR(40)")] // 수정자
        public string? UpdBy { get; set; }
    }
}