using Newtonsoft.Json;
using System;

namespace ErdProject.Server.Models.Dtos
{
    public class ContactSiteMapDto
    {
        [JsonProperty("contactSiteMapId")]
        public int ContactSiteMapId { get; set; }

        [JsonProperty("contactId")]
        public int ContactId { get; set; }

        [JsonProperty("siteId")]
        public long SiteId { get; set; }

        [JsonProperty("siteNm")]
        public string? SiteNm { get; set; }

        [JsonProperty("roleCd")]
        public string? RoleCd { get; set; }

        [JsonProperty("isPrimary")]
        public string IsPrimary { get; set; } = "N";

        [JsonProperty("startDt")]
        public DateTime? StartDt { get; set; }

        [JsonProperty("endDt")]
        public DateTime? EndDt { get; set; }

        [JsonProperty("note")]
        public string? Note { get; set; }

        [JsonProperty("crtDt")]
        public DateTime? CrtDt { get; set; }

        [JsonProperty("crtBy")]
        public string? CrtBy { get; set; }

        [JsonProperty("updDt")]
        public DateTime? UpdDt { get; set; }

        [JsonProperty("updBy")]
        public string? UpdBy { get; set; }
    }
}