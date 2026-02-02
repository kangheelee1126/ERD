using Newtonsoft.Json;
using System;

namespace ErdProject.Server.Models.Dtos
{
    public class ContactRoleSaveDto
    {
        [JsonProperty("roleCd")]
        // ✨ null! 연산자를 사용하여 프레임워크가 값을 채울 것임을 명시 [cite: 2026-01-30]
        public string RoleCd { get; set; } = null!;

        [JsonProperty("isPrimary")]
        public string IsPrimary { get; set; } = "N";

        // ✨ 추가 항목
        public DateTime? StartDt { get; set; } // 적용시작일
        public DateTime? EndDt { get; set; }   // 적용종료일
        public string? Note { get; set; }      // 비고


        [JsonProperty("createdBy")]
        public string CreatedBy { get; set; } = string.Empty;

        [JsonProperty("updatedBy")]
        public string UpdatedBy { get; set; } = string.Empty;
    }
}