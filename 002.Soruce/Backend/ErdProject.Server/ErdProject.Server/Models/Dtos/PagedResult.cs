using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ErdProject.Server.Models.Dtos
{
    public class PagedResult<T>
    {
        public List<T> Items { get; set; } = new List<T>(); // 현재 페이지 데이터
        public int TotalCount { get; set; }      // 전체 데이터 개수
        public int PageNumber { get; set; }      // 현재 페이지 번호
        public int PageSize { get; set; }        // 페이지당 개수
        public int TotalPages { get; set; }      // 전체 페이지 수
    }
}
