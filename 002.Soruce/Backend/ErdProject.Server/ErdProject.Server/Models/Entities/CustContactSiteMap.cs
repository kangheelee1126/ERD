using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{
    [Table("CUST_CONTACT_SITE_MAP")]
    public class CustContactSiteMap
    {
        [Key]
        [Column("CONTACT_SITE_MAP_ID")]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ContactSiteMapId { get; set; }

        [Column("CONTACT_ID")]
        public int ContactId { get; set; }

        [Column("SITE_ID")]
        public long SiteId { get; set; }

        [Column("ROLE_CD")]
        [StringLength(40)]
        public string? RoleCd { get; set; }

        [Column("IS_PRIMARY")]
        [StringLength(1)]
        public string IsPrimary { get; set; } = "N";

        [Column("START_DT")]
        public DateTime? StartDt { get; set; }

        [Column("END_DT")]
        public DateTime? EndDt { get; set; }

        [Column("NOTE")]
        [StringLength(500)]
        public string? Note { get; set; }

        [Column("CRT_DT")]
        public DateTime CrtDt { get; set; } = DateTime.Now;

        [Column("CRT_BY")]
        [StringLength(40)]
        public string? CrtBy { get; set; }

        [Column("UPD_DT")]
        public DateTime? UpdDt { get; set; }

        [Column("UPD_BY")]
        [StringLength(40)]
        public string? UpdBy { get; set; }
    }
}