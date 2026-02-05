using Newtonsoft.Json;
using System;

namespace ErdProject.Server.Models.Dtos
{
    public class UserDto
    {
        /* [cite: 2026-02-03] Newtonsoft.Json을 사용하여 프론트엔드용 camelCase 프로퍼티 명시 */

        [JsonProperty("userNo")]
        public int UserNo { get; set; }

        [JsonProperty("userId")]
        public string? UserId { get; set; }

        /* 스키마 물리명 USER_PWD 준수 */
        [JsonProperty("userPwd")]
        public string? UserPwd { get; set; }

        [JsonProperty("userName")]
        public string? UserName { get; set; }

        [JsonProperty("email")]
        public string? Email { get; set; }

        [JsonProperty("useYn")]
        public string? UseYn { get; set; } = "Y";

        /* [cite: 2026-02-05] DTO 날짜는 클라이언트 전달 용이성을 위해 String형으로 생성 */
        [JsonProperty("regDt")]
        public string? RegDt { get; set; }

        /* ✨ [추가] 직원 매핑용 ID (FK -> SYS_EMPLOYEE_MST) */
        [JsonProperty("empId")]
        public int? EmpId { get; set; }

        /* ✨ [추가] JOIN 조회 시 표시될 직원 정보 */
        [JsonProperty("empNm")]
        public string? EmpNm { get; set; }

        [JsonProperty("deptNm")]
        public string? DeptNm { get; set; }

        /* [cite: 2026-02-03] 표준 Audit(감사) 필드 추가 */
        [JsonProperty("crtBy")]
        public string? CrtBy { get; set; }

        [JsonProperty("crtDt")]
        public string? CrtDt { get; set; }

        [JsonProperty("updBy")]
        public string? UpdBy { get; set; }

        [JsonProperty("updDt")]
        public string? UpdDt { get; set; }
    }
}