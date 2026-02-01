using System;

namespace ErdProject.Server.Models.Dtos
{
    public class BusinessSiteDto
    {
        public long SiteId { get; set; }

        public long CustomerId { get; set; }

        public string? CustNm { get; set; }
        public string? SiteCd { get; set; }

        public string? SiteNm { get; set; }

        public string? SiteNmEn { get; set; }

        public string? SiteTypeCd { get; set; }

        public string? TelNo { get; set; }

        public string? FaxNo { get; set; }

        public string? ZipCd { get; set; }

        public string? Addr1 { get; set; }

        public string? Addr2 { get; set; }

        public string? TimezoneCd { get; set; }

        public string? IsMain { get; set; }

        public string? Comments { get; set; }

        public int SortNo { get; set; }

        public string? UseYn { get; set; }

        public DateTime? RegDt { get; set; }

        public string? CreatedBy { get; set; }

        public DateTime? ModDt { get; set; }

        public string? UpdatedBy { get; set; }
    }
}