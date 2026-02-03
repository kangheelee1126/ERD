using ErdProject.Server.Data;
using ErdProject.Server.IServices;
using ErdProject.Server.Models.Dtos;
using ErdProject.Server.Models.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq; // ✨ LINQ 확장 메서드(Where, Select 등) 사용을 위해 필수

namespace ErdProject.Server.Services
{
    public class ContactSiteService : IContactSiteService
    {
        private readonly ErdDbContext _context;

        public ContactSiteService(ErdDbContext context)
        {
            _context = context;
        }

        public async Task<List<ContactSiteMapDto>> GetContactSiteMapsAsync(int contactId)
        {
            return await _context.CustContactSiteMaps
                .Where(x => x.ContactId == contactId)
                .Join(_context.CustSites,
                    m => m.SiteId,
                    s => s.SITE_ID,
                    (m, s) => new ContactSiteMapDto
                    {
                        ContactSiteMapId = m.ContactSiteMapId,
                        ContactId = m.ContactId,
                        SiteId = m.SiteId,
                        SiteNm = s.SITE_NM,
                        RoleCd = m.RoleCd,
                        IsPrimary = m.IsPrimary,
                        StartDt = m.StartDt,
                        EndDt = m.EndDt,
                        Note = m.Note,
                        CrtDt = m.CrtDt,
                        CrtBy = m.CrtBy,
                        UpdDt = m.UpdDt,
                        UpdBy = m.UpdBy
                    })
                .ToListAsync();
        }

        public async Task SaveContactSiteMapsAsync(int contactId, List<ContactSiteMapDto> dtos)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. 기존 데이터 삭제
                var existing = await _context.CustContactSiteMaps
                    .Where(x => x.ContactId == contactId)
                    .ToListAsync();
                _context.CustContactSiteMaps.RemoveRange(existing);

                // 2. 신규 데이터 추가
                foreach (var dto in dtos)
                {
                    var entity = new CustContactSiteMap
                    {
                        ContactId = contactId,
                        SiteId = dto.SiteId,
                        RoleCd = dto.RoleCd,
                        IsPrimary = dto.IsPrimary,
                        StartDt = dto.StartDt,
                        EndDt = dto.EndDt,
                        Note = dto.Note,
                        // 프론트엔드 Audit 필드 매핑
                        CrtDt = dto.CrtDt ?? DateTime.Now,
                        CrtBy = dto.CrtBy,
                        UpdDt = DateTime.Now,
                        UpdBy = dto.UpdBy
                    };
                    _context.CustContactSiteMaps.Add(entity);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw;
            }
        }
    }
}