using ErdProject.Server.Models.Dtos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ErdProject.Server.IServices
{
    public interface IContactSiteService
    {
        /// <summary>
        /// 특정 담당자에게 연결된 사업장 매핑 리스트 조회
        /// </summary>
        Task<List<ContactSiteMapDto>> GetContactSiteMapsAsync(int contactId);

        /// <summary>
        /// 담당자별 사업장 연결 정보 일괄 저장
        /// </summary>
        Task SaveContactSiteMapsAsync(int contactId, List<ContactSiteMapDto> dtos);

    }
}