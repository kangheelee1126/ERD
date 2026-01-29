using Newtonsoft.Json;

namespace ErdProject.Server.Models.Dtos
{
    public class CustomerDto
    {
        [JsonProperty("customer_id")]
        public long CustomerId { get; set; }

        [JsonProperty("cust_cd")]
        public string? CustCd { get; set; }

        [JsonProperty("cust_nm")]
        public string? CustNm { get; set; }

        [JsonProperty("cust_nm_en")]
        public string? CustNmEn { get; set; }

        [JsonProperty("cust_type_cd")]
        public string? CustTypeCd { get; set; }

        [JsonProperty("industry_cd")]
        public string? IndustryCd { get; set; }

        [JsonProperty("mfg_type_cd")]
        public string? MfgTypeCd { get; set; }

        [JsonProperty("dev_capability_cd")]
        public string? DevCapabilityCd { get; set; }

        [JsonProperty("source_mod_yn")]
        public string? SourceModYn { get; set; }

        [JsonProperty("biz_no")]
        public string? BizNo { get; set; }

        [JsonProperty("tel_no")]
        public string? TelNo { get; set; }

        [JsonProperty("zip_cd")]
        public string? ZipCd { get; set; }

        [JsonProperty("addr1")]
        public string? Addr1 { get; set; }

        [JsonProperty("addr2")]
        public string? Addr2 { get; set; }

        [JsonProperty("timezone_cd")]
        public string? TimezoneCd { get; set; }

        [JsonProperty("comments")]
        public string? Comments { get; set; }

        [JsonProperty("sort_no")]
        public int SortNo { get; set; }

        [JsonProperty("use_yn")]
        public string? UseYn { get; set; }

        [JsonProperty("created_by")]
        public string? CreatedBy { get; set; }

        [JsonProperty("updated_by")]
        public string? UpdatedBy { get; set; }
    }
}