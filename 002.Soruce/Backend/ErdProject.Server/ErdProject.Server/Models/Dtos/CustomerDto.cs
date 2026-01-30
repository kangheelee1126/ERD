using System;
using Newtonsoft.Json; // ✨ 이제 이거 필요 없습니다!

namespace ErdProject.Server.Models.Dtos
{
    public class CustomerDto
    {
        // [JsonProperty] 제거 -> C# 표준인 PascalCase로 작성하면 
        // Startup설정에 의해 JSON의 camelCase(customerId)와 자동 연결됩니다.

        public long CustomerId { get; set; }

        public string? CustCd { get; set; }

        public string? CustNm { get; set; }

        public string? CustNmEn { get; set; }

        public string? CustTypeCd { get; set; }

        public string? IndustryCd { get; set; }

        public string? MfgTypeCd { get; set; }

        public string? DevCapabilityCd { get; set; }

        public string? SourceModYn { get; set; }

        public string? BizNo { get; set; }

        public string? TelNo { get; set; }

        public string? ZipCd { get; set; }

        public string? Addr1 { get; set; }

        public string? Addr2 { get; set; }

        public string? TimezoneCd { get; set; }

        public string? Comments { get; set; }

        public int SortNo { get; set; }

        public string? UseYn { get; set; }

        // ✨ [중요] 프론트엔드가 'regDt', 'modDt'로 보내므로 
        // DTO 이름도 발음을 맞춰줘야 자동 매핑됩니다. (CreatedDt -> RegDt)
        public DateTime? RegDt { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? ModDt { get; set; }

        public string? UpdatedBy { get; set; }
    }
}