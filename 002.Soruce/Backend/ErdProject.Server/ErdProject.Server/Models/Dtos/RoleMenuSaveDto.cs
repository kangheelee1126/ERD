using System.Collections.Generic;

namespace ErdProject.Server.Models.Dto
{
    /// <summary>
    /// 권한-메뉴 매핑 저장용 DTO
    /// </summary>
    public class RoleMenuSaveDto
    {
        public string RoleId { get; set; } = null!; // 대상 권한 ID
        public List<string> MenuIds { get; set; } = new(); // 할당할 메뉴 ID 리스트
    }
}