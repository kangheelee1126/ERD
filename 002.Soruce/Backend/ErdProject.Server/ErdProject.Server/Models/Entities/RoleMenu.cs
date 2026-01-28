using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ErdProject.Server.Models.Entities
{
    /// <summary>
    /// 권한별 메뉴 매핑 엔티티 (MAP_ROLE_MENU 테이블 매핑)
    /// </summary>
    [Table("MAP_ROLE_MENU")]
    public class RoleMenu
    {
        [Column("ROLE_ID")]
        public string RoleId { get; set; } = null!; // 권한 아이디

        [Column("MENU_ID")]
        public string MenuId { get; set; } = null!; // 메뉴 아이디

        [Column("REG_DT")]
        public DateTime RegDt { get; set; } = DateTime.Now; // 등록 일시
    }
}