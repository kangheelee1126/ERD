using Newtonsoft.Json;
using System;

namespace ErdProject.Server.Models.Dtos.Admin
{
    public class EmployeeDto
    {
        [JsonProperty("empId")]
        public int EmpId { get; set; }

        [JsonProperty("empNo")]
        public string EmpNo { get; set; } = default!;

        [JsonProperty("empNm")]
        public string EmpNm { get; set; } = default!;

        [JsonProperty("email")]
        public string? Email { get; set; }

        [JsonProperty("phone")]
        public string? Phone { get; set; }

        [JsonProperty("deptCd")]
        public string DeptCd { get; set; } = default!;

        /* ✨ [추가] JOIN 조회를 통해 가져올 부서명 */
        [JsonProperty("deptNm")]
        public string? DeptNm { get; set; }

        [JsonProperty("positionNm")]
        public string? PositionNm { get; set; }

        [JsonProperty("jobNm")]
        public string? JobNm { get; set; }

        [JsonProperty("hireDt")]
        public String? HireDt { get; set; }

        [JsonProperty("resignDt")]
        public string? ResignDt { get; set; }

        [JsonProperty("activeYn")]
        public string ActiveYn { get; set; } = "Y";

        [JsonProperty("srHandleYn")]
        public string SrHandleYn { get; set; } = "N";

        [JsonProperty("note")]
        public string? Note { get; set; }

        [JsonProperty("crtDt")]
        public string? CrtDt { get; set; }

        /* ✨ [수정] CrtBy를 Nullable로 변경하여 수정 시 유효성 검사 통과 [cite: 2026-02-05] */
        [JsonProperty("crtBy")]
        public string? CrtBy { get; set; }

        [JsonProperty("updDt")]
        public string? UpdDt { get; set; }

        [JsonProperty("updBy")]
        public string? UpdBy { get; set; }
    }
}