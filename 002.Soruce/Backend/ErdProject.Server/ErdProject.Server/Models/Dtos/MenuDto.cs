using System.Collections.Generic;

namespace ErdProject.Server.Models.Dtos
{
    public class MenuDto
    {
        public string MenuId { get; set; } = string.Empty;
        public string? UpMenuId { get; set; }
        public string MenuName { get; set; } = string.Empty;
        public string? MenuUrl { get; set; }
        public string? MenuIcon { get; set; } // ✨ 추가
        public int SortNo { get; set; }
        public string UseYn { get; set; } = "Y";

        // ✨ 계층형 구조를 위한 자식 노드 리스트
        public List<MenuDto> Children { get; set; } = new();
    }
}