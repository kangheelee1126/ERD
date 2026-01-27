using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{

    [Table("SYS_MENU")]
    public class SysMenu
    {
        [Key, Column("MENU_ID")]
        public string MenuId { get; set; } = null!;

        [Column("UP_MENU_ID")]
        public string? UpMenuId { get; set; }

        [Column("MENU_NAME")]
        public string MenuName { get; set; } = null!;

        [Column("MENU_URL")]
        public string? MenuUrl { get; set; }

        // ✨ 아이콘 컬럼 추가 매핑
        [Column("MENU_ICON")]
        public string? MenuIcon { get; set; }

        [Column("SORT_NO")]
        public int SortNo { get; set; }

        [Column("USE_YN")]
        public string UseYn { get; set; } = "Y";

        [Column("REG_DT")]
        public DateTime RegDt { get; set; } = DateTime.Now;
    }
}