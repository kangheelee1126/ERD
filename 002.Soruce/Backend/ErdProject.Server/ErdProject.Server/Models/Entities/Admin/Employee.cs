using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities.Admin
{
    /// <summary>
    /// 직원 마스터 엔티티 (Table: SYS_EMPLOYEE_MST)
    /// </summary>
    [Table("SYS_EMPLOYEE_MST")]
    public class Employee
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("EMP_ID", TypeName = "INT")] // 직원 내부 식별자
        public int EmpId { get; set; }

        [Required]
        [Column("EMP_NO", TypeName = "VARCHAR(40)")] // 사번/로그인ID (Unique)
        public string EmpNo { get; set; } = default!;

        [Required]
        [Column("EMP_NM", TypeName = "NVARCHAR(100)")] // 직원명
        public string EmpNm { get; set; } = default!;

        [Column("EMAIL", TypeName = "VARCHAR(200)")] // 이메일
        public string? Email { get; set; }

        [Column("PHONE", TypeName = "VARCHAR(40)")] // 전화번호
        public string? Phone { get; set; }

        [Required]
        [Column("DEPT_CD", TypeName = "VARCHAR(40)")] // 부서코드
        public string DeptCd { get; set; } = default!;

        [Column("POSITION_NM", TypeName = "NVARCHAR(100)")] // 직급명
        public string? PositionNm { get; set; }

        [Column("JOB_NM", TypeName = "NVARCHAR(100)")] // 직무명
        public string? JobNm { get; set; }

        /* ✨ 지침: 날짜는 반드시 DateTime? (널 허용) */
        [Column("HIRE_DT", TypeName = "DATE")] // 입사일
        public DateTime? HireDt { get; set; }

        [Column("RESIGN_DT", TypeName = "DATE")] // 퇴사일
        public DateTime? ResignDt { get; set; }

        [Required]
        [Column("ACTIVE_YN", TypeName = "CHAR(1)")] // 재직/사용여부 (Default 'Y')
        public string ActiveYn { get; set; } = "Y";

        [Required]
        [Column("SR_HANDLE_YN", TypeName = "CHAR(1)")] // SR 처리 담당 여부 (Default 'N')
        public string SrHandleYn { get; set; } = "N";

        [Column("NOTE", TypeName = "NVARCHAR(500)")] // 비고
        public string? Note { get; set; }

        /* ✨ 감사(Audit) 필드 지침 준수 */
        [Required]
        [Column("CRT_DT", TypeName = "DATETIME2(0)")] // 생성일시
        public DateTime? CrtDt { get; set; }

        [Column("CRT_BY", TypeName = "NVARCHAR(40)")] // 생성자
        public string? CrtBy { get; set; }

        [Column("UPD_DT", TypeName = "DATETIME2(0)")] // 수정일시
        public DateTime? UpdDt { get; set; }

        [Column("UPD_BY", TypeName = "NVARCHAR(40)")] // 수정자
        public string? UpdBy { get; set; }
    }
}