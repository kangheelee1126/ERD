using System;
using System.Collections.Generic;
using Newtonsoft.Json; // System.Text.Json 대신 Newtonsoft를 사용합니다.

namespace ErdProject.Server.Models.Dtos
{
    /// <summary>
    /// 공통코드 그룹 마스터(COM_CODE_GRP_MST) DTO
    /// </summary>
    public class CodeGroupDto
    {
        [JsonProperty("code_grp_cd")] // 테이블 PK: 코드그룹 코드
        public string CodeGrpCd { get; set; } = null!;

        [JsonProperty("code_grp_nm")] // 코드그룹 명
        public string CodeGrpNm { get; set; } = null!;

        [JsonProperty("code_grp_desc")] // 코드그룹 설명 (NULL 허용)
        public string? CodeGrpDesc { get; set; }

        [JsonProperty("use_yn")] // 사용여부 (Y/N), 초기값 'Y'
        public string UseYn { get; set; } = "Y";

        [JsonProperty("sort_no")] // 정렬순서, 초기값 0
        public int SortNo { get; set; }

        // --- [감사 항목 (Audit Fields)] ---
        [JsonProperty("created_dt")] // 생성일시
        public DateTime CreatedDt { get; set; }

        [JsonProperty("created_by")] // 생성자
        public string? CreatedBy { get; set; }

        [JsonProperty("updated_dt")] // 수정일시
        public DateTime? UpdatedDt { get; set; }

        [JsonProperty("updated_by")] // 수정자
        public string? UpdatedBy { get; set; }
    }

    /// <summary>
    /// 공통코드 상세 정보를 전달하기 위한 DTO 클래스
    /// </summary>
    public class CodeDetailDto
    {
        [JsonProperty("code_grp_cd")] // 코드그룹 코드 (PK, FK)
        public string CodeGrpCd { get; set; } = null!;

        [JsonProperty("code_cd")] // 코드값 (PK)
        public string CodeCd { get; set; } = null!;

        [JsonProperty("code_nm")] // 코드명
        public string CodeNm { get; set; } = null!;

        [JsonProperty("code_desc")] // 코드설명 (NULL 허용)
        public string? CodeDesc { get; set; }

        [JsonProperty("sort_no")] // 정렬순서
        public int SortNo { get; set; }

        [JsonProperty("ext_val1")] // 확장값1 (NULL 허용)
        public string? ExtVal1 { get; set; }

        [JsonProperty("ext_val2")] // 확장값2 (NULL 허용)
        public string? ExtVal2 { get; set; }

        [JsonProperty("use_yn")] // 사용여부(Y/N)
        public string UseYn { get; set; } = "Y";

        // --- [감사 항목 (Audit Fields)] ---
        [JsonProperty("created_dt")] // 생성일시
        public DateTime CreatedDt { get; set; }

        [JsonProperty("created_by")] // 생성자
        public string? CreatedBy { get; set; }

        [JsonProperty("updated_dt")] // 수정일시
        public DateTime? UpdatedDt { get; set; }

        [JsonProperty("updated_by")] // 수정자
        public string? UpdatedBy { get; set; }
    }
}