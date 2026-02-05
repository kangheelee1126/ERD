using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models
{
    // DB의 MST_USR_ACCOUNT 테이블과 연결
    [Table("MST_USR_ACCOUNT")]
    public class UserAccount
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("USER_NO")] // ✨ DB 스키마: [USER_NO]
        public int UserNo { get; set; }

        [Column("USER_ID")] // ✨ DB 스키마: [USER_ID]
        public string UserId { get; set; } = null!;

        [Column("USER_PWD")] // ✨ 주의: DB 컬럼명이 PASSWORD가 아니라 USER_PWD입니다
        public string Password { get; set; } = null!;

        [Column("USER_NAME")] // ✨ DB 스키마: [USER_NAME]
        public string UserName { get; set; } = null!;

        [Column("EMAIL")] // ✨ DB 스키마: [EMAIL]
        public string Email { get; set; } = null!;

        [Column("USE_YN")] // ✨ DB 스키마: [USE_YN]
        public string UseYn { get; set; } = "Y";

        [Column("REG_DT")] // ✨ DB 스키마: [REG_DT]
        public DateTime? RegDt { get; set; } = DateTime.Now;

        /* ✨ [추가] 직원 매핑 ID (FK -> SYS_EMPLOYEE_MST.EMP_ID) */
        [Column("EMP_ID")]
        public int? EmpId { get; set; }

        /* [cite: 2026-02-03] ERD SYSTEM 표준 감사(Audit) 필드 추가 */

    }
}