using System;

namespace ErdProject.Server.Models.Dtos
{
    public class ContactDto
    {
        public int ContactId { get; set; }

        public long CustomerId { get; set; }

        // ✨ 화면 표시용 (Entity에는 없지만 DTO에 추가)
        public string? CustNm { get; set; }

        public string? ContactCd { get; set; }

        public string? ContactNm { get; set; }

        public string? DeptNm { get; set; }

        public string? DutyNm { get; set; }

        public string? TelNo { get; set; }

        public string? MobileNo { get; set; }

        public string? Email { get; set; }

        public string? IsMain { get; set; } // Y or N

        public string? IsActive { get; set; } // Y or N

        public DateTime? StartDt { get; set; }

        public DateTime? EndDt { get; set; }

        public string? Note { get; set; }

        // 관리용 정보
        public DateTime? CrtDt { get; set; }
        public string? CrtBy { get; set; }
        public DateTime? UpdDt { get; set; }
        public string? UpdBy { get; set; }
    }
}